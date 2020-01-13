#!/usr/bin/env bash
#
#SBATCH --job-name=GAS-nasp
#SBATCH --time=5:00
#SBATCH --mem="100m"

#====================================================================================================( functions )
function printHelp {
  printf "\nruns nasp on all clades in M1 tree"
  printf "\nusage: cladeGAS.sh REFERENCE SAMPLE [SAMPLE ...]"
  printf "\n\tREFERENCE\tfasta reference file"
  printf "\n\tSAMPLE\treads for each sample will be found for each sample name"
  printf "\n\t[SAMPLE ...]\taccepts many samples"
  printf "\nexample:\n\t./cladeGAS.sh example_R1_001.fastq.gz\n\n"
  exit 0
}

#====================================================================================================( main )
# This script is made to input new gas reads, log read metadata, and output a full neighbor joining
# tree with all GAS samples run against M1 reference > 80% quality breadth.

#----- check ARGS for help
if [[ $# < 1 ]] || [[ $(echo $@ | grep "\-h") ]] ; then
  printHelp
fi

#----- resolve reference::sampleList pairs
# build reference nasp config
allRef=$1
months=$2
mType=$3
referenceSample=$4
sampleArray=${@:5}

#echo ${allRef} ${months} ${mType} ${referenceSample} ${sampleArray}
#exit 0

#if [[ ! ${sampleArray} ]]; then
#  echo no new samples for ${mType}
#  exit 0
#fi

# create mType directory in /scratch/GAS/nasp
if [[ ! -d /scratch/GAS/nasp/${mType}::${referenceSample} ]]; then
  mkdir /scratch/GAS/nasp/${mType}::${referenceSample}
fi
if [[ ! -d /scratch/GAS/nasp/${mType}::${referenceSample}/gatk ]]; then
  mkdir /scratch/GAS/nasp/${mType}::${referenceSample}/gatk
fi

M=$(/scratch/GAS/bin/mkConfig.py /scratch/GAS/reference/${mType}\:\:${referenceSample}.fasta ${allRef} /scratch/GAS/tsv/${months}.tsv $(echo `/scratch/GAS/bin/queryGAS.py -s -exact ${sampleArray}`))
echo ${M}

JOBID=0
if [[ -z ${M} ]]; then
  echo no samples for ${mType}
elif [[ -e /scratch/GAS/.temp/${M} ]]; then
  module load nasp
  nasp --config /scratch/GAS/.temp/${M}
  for id in $(squeue -h -u $(whoami) -n "nasp_matrix" -o "%i"); do
    if (( ${id} > ${JOBID} )); then
      JOBID=${id}
    fi
  done

  if [[ ! -d /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef} ]]; then
    mkdir /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef}
  fi
  if [[ ! -d /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef}/reference ]]; then
    mkdir /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef}/reference
  fi
  if [[ ! -f /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef}/reference/reference.fasta ]]; then
    cp /scratch/GAS/reference/${mType}::${referenceSample}.fasta /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef}/reference/reference.fasta
  fi

  JOBID=$(sbatch --job-name="${allRef}-${mType}::${referenceSample}-${months}-gatk" --output="/dev/null" --time="10:00" --mem="1g" --dependency=afterany:"${JOBID##* }" --wrap="cp /scratch/GAS/.temp/${M%*-config.xml}/gatk/*gatk.vcf /scratch/GAS/nasp/${mType}::${referenceSample}/gatk/; cp /scratch/GAS/.temp/${M%*-config.xml}/reference/duplicates.txt /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef}/reference/duplicates.txt; rm -r /scratch/GAS/.temp/${M} /scratch/GAS/.temp/${M%*-config.xml}")

#echo ${allRef} ${months} ${mType} ${referenceSample} ${sampleArray}
#exit 0

fi

#----- create bestsnp.fasta for /scratch/GAS/nasp/${mType} (only if new GATK, no FASTA, or FASTA/GATK mismatch)
if (( ${JOBID##* } != 0 )); then
  JOBID=$(sbatch --job-name="${allRef}-${mType}::${referenceSample}-${months}-dto" --output="/dev/null" --time="10:00" --mem="1g" --dependency=afterany:"${JOBID##* }" --wrap="/scratch/GAS/bin/mkMatrix.py /scratch/GAS/nasp/${mType}::${referenceSample}/ /scratch/GAS/tsv/${months}.tsv ${allRef}")
#elif [[ ! -f /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef}::${months}_dto.xml || ! -f /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef}/matrices/${months}/bestsnp.fasta || ! -f /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef}/matrices/${months}/bestsnp.nwk ]]; then
else
  JOBID=$(sbatch --job-name="${allRef}-${mType}::${referenceSample}-${months}-dto" --output="/dev/null" --time="10:00" --mem="1g" --wrap="/scratch/GAS/bin/mkMatrix.py /scratch/GAS/nasp/${mType}::${referenceSample}/ /scratch/GAS/tsv/${months}.tsv ${allRef}")
fi

#----- create tree.nwk for /scratch/GASnasp/${mType} (only if new MATRIX_DTO.XML created)
if (( ${JOBID##* } != 0 )); then
  JOBID=$(sbatch --job-name="${allRef}-${mType}::${referenceSample}-${months}-matrix" --output="/dev/null" --time="1:00:00" --mem="1g" --dependency=afterok:"${JOBID##* }" --wrap="module load nasp; nasp matrix --dto-file /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef}::${months}_dto.xml;")
  JOBID=$(sbatch --job-name="${allRef}-${mType}::${referenceSample}-${months}-fasta" --output="/dev/null" --time="10:00" --mem="1g"  --dependency=afterok:"${JOBID##* }" --wrap="/scratch/GAS/bin/mkFasta.py /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef} ${months} ${referenceSample}")
  JOBID=$(sbatch --job-name="${allRef}-${mType}::${referenceSample}-${months}-tree" --output="/dev/null" --time="10:00" --mem="25g" --partition="hmem" --dependency=afterok:"${JOBID##* }" --wrap="/scratch/GAS/bin/NJ /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef}/matrices/${months}/bestsnp.fasta")
  #JOBID=$(sbatch --job-name="${allRef}-${mType}::${referenceSample}-${months}-tree" --output="/dev/null" --time="10:00" --mem="25g" --partition="hmem" --dependency=afterok:"${JOBID##* }" --wrap="/scratch/GAS/bin/NJ /scratch/GAS/nasp/${mType}::${referenceSample}/${allRef}/matrices/${months}/missingdata.fasta")
fi
