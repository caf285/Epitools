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
mType=$1
referenceSample="${2}.fasta"
sampleArray=${@:3}

if [[ ! ${sampleArray} ]]; then
  echo no new samples for ${mType}
  exit 0
  echo $referenceSample
  echo $sampleArray
fi

M=$(/scratch/GAS/bin/mkConfig.py /scratch/GAS/reference/${mType}::${referenceSample} -exact ${sampleArray})
echo running nasp for ${M}

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

  # create mType directory in /scratch/GAS/nasp
  if [[ ! -d /scratch/GAS/nasp/${mType} ]]; then
    mkdir /scratch/GAS/nasp/${mType}
  fi
  if [[ ! -d /scratch/GAS/nasp/${mType}/gatk ]]; then
    mkdir /scratch/GAS/nasp/${mType}/gatk
  fi
  if [[ ! -d /scratch/GAS/nasp/${mType}/reference ]]; then
    mkdir /scratch/GAS/nasp/${mType}/reference
  fi
  if [[ ! -f /scratch/GAS/nasp/${mType}/reference/reference.fasta ]]; then
    cp /scratch/GAS/reference/${mType}::${referenceSample} /scratch/GAS/nasp/${mType}/reference/reference.fasta
  fi

  JOBID=$(sbatch --job-name="${mType}-gatk" --output="/dev/null" --time="5:00" --mem="100m" --dependency=afterok:"${JOBID##* }" --wrap="cp /scratch/GAS/.temp/${M%*-config.xml}/gatk/*gatk.vcf /scratch/GAS/nasp/${mType}/gatk/; cp /scratch/GAS/.temp/${M%*-config.xml}/reference/duplicates.txt /scratch/GAS/nasp/${mType}/reference/duplicates.txt; rm -r /scratch/GAS/.temp/${M} /scratch/GAS/.temp/${M%*-config.xml}")
fi

#----- create bestsnp.fasta for /scratch/GAS/nasp/${mType} (only if new GATK, no FASTA, or FASTA/GATK mismatch)
if (( ${JOBID##* } != 0 )); then
  JOBID=$(sbatch --job-name="${mType}-dto" --output="/dev/null" --time="5:00" --mem="100m" --dependency=afterok:"${JOBID##* }" --wrap="/scratch/GAS/bin/mkMatrix.py /scratch/GAS/nasp/${mType}")
elif [[ ! -f /scratch/GAS/nasp/${mType}/matrix_dto.xml || ! -f /scratch/GAS/nasp/${mType}/matrices/bestsnp.fasta || ! -f /scratch/GAS/nasp/${mType}/matrices/tree.nwk ]] || (( $(( $(cat /scratch/GAS/nasp/${mType}/matrices/bestsnp.fasta | grep ">" | wc -l) - 1 )) != $(cat /scratch/GAS/nasp/${mType}/matrix_dto.xml | grep "gatk" | wc -l ) )); then
  JOBID=$(sbatch --job-name="${mType}-dto" --output="/dev/null" --time="5:00" --mem="100m" --wrap="/scratch/GAS/bin/mkMatrix.py /scratch/GAS/nasp/${mType}/")
fi

#----- create tree.nwk for /scratch/GASnasp/${mType} (only if new MATRIX_DTO.XML created)
if (( ${JOBID##* } != 0 )); then
  JOBID=$(sbatch --job-name="${mType}-matrix" --output="/dev/null" --time="1:00:00" --mem="1g" --dependency=afterok:"${JOBID##* }" --wrap="module load nasp; nasp matrix --dto-file /scratch/GAS/nasp/${mType}/matrix_dto.xml;")
  JOBID=$(sbatch --job-name="${mType}-fasta" --output="/dev/null" --time="5:00" --mem="100m"  --dependency=afterok:"${JOBID##* }" --wrap="/scratch/GAS/bin/mkFasta.py /scratch/GAS/nasp/${mType}/")
  JOBID=$(sbatch --job-name="${mType}-tree" --output="/dev/null" --time="10:00" --mem="32g" --dependency=afterok:"${JOBID##* }" --wrap="/scratch/GAS/bin/NJ /scratch/GAS/nasp/${mType}/matrices/bestsnp.fasta")
fi
