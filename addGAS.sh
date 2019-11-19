#!/usr/bin/env bash
#
#SBATCH --job-name=GAS-nasp
#SBATCH --time=5:00
#SBATCH --mem="100m"

#====================================================================================================( functions )
function printHelp {
  printf "\nadds all sample reads to GAS database"
  printf "\nusage: GAS.sh [-h] [-f] FASTQ [FASTQ ...]"
  printf "\n\t-h\tfastq read file (can be symlink, relative path of read, or directory containing reads)"
  printf "\n\t-f\t"
  printf "\n\tFASTQ\tfastq read file (can be symlink, relative path of read, or directory containing reads)"
  printf "\n\t[FASTQ ...]\taccepts any amount of reads, symlinks, and/or directories containing reads"
  printf "\nexample:\n\t./GAS.sh example_R1_001.fastq.gz\n\n"
  exit 0
}

#====================================================================================================( main )
# This script is made to input new gas reads, log read metadata, and output a full neighbor joining
# tree with all GAS samples run against M1 reference > 80% quality breadth.

#----- check ARGS for help
if [[ $# < 1 ]] || [[ $(echo $@ | grep "\-h") ]] ; then
  printHelp
fi

#----- from args, add FASTQ to "/scratch/GAS/GAS.tsv"
# for each arg, if exists, append `realpath` to $ARRAY
ARRAY=()
for arg in $(echo $@); do
  if [[ -e ${arg} ]]; then
    if [[ -f ${arg} ]]; then
      ARRAY+=" $(realpath ${arg})"
    elif [[ -d ${arg} ]]; then
      ARRAY+=" $(for line in $(ls ${arg}); do echo $(realpath ${arg}/${line}); done)"
    fi
  fi
done

# pass $ARRAY to "getPath.py", appends all reads in $ARRAY to "GAS.tsv"
/scratch/GAS/bin/getPath.py $ARRAY

#----- resolve all M1% in "GAS.tsv"
# run nasp against each ALL reference; exit is no change
ls /scratch/GAS/reference/ALL\:\:* | while read ref; do

  # get reference sample name
  refSample=${ref##*/ALL\:\:}
  refSample=${refSample%*.fasta}
  #echo ${ref}
  #echo ${refSample}
  #exit 0

  all=$(/scratch/GAS/bin/mkConfig.py ${ref} ${refSample} -m _)
  echo ${all}

  # get jobID for nasp run (only if "_" QUALITY BREADTH)
  JOBID=0
  if [[ -z ${all} ]]; then
    echo no new reads found
  elif [[ -e /scratch/GAS/.temp/${all} ]]; then
    module load nasp
    nasp --config /scratch/GAS/.temp/${all}
    for id in $(squeue -h -u $(whoami) -n "nasp_matrix" -o "%i"); do
      if (( ${id} > ${JOBID} )); then
        JOBID=${id}
      fi
    done

    # create mType directory in /scratch/GAS/nasp
    if [[ ! -d /scratch/GAS/nasp/ALL\:\:${refSample} ]]; then
      mkdir /scratch/GAS/nasp/ALL\:\:${refSample}
    fi  
    if [[ ! -d /scratch/GAS/nasp/ALL\:\:${refSample}/gatk ]]; then
      mkdir /scratch/GAS/nasp/ALL\:\:${refSample}/gatk
    fi  
    if [[ ! -d /scratch/GAS/nasp/ALL\:\:${refSample}/reference ]]; then
      mkdir /scratch/GAS/nasp/ALL\:\:${refSample}/reference
    fi  
    if [[ ! -f /scratch/GAS/nasp/ALL\:\:${refSample}/reference/reference.fasta ]]; then
      cp ${ref} /scratch/GAS/nasp/ALL\:\:${refSample}/reference/reference.fasta
    fi  


    # update GAS.tsv and copy all gatk files > 80% M1 QUALITY BREADTH
    JOBID=$(sbatch --job-name="GAS-getStats" --output="/dev/null" --time="5:00" --mem="100m" --dependency=afterany:"${JOBID##* }" --wrap="/scratch/GAS/bin/getStats.py ${all%*-config.xml} ${refSample}; rm -r /scratch/GAS/.temp/${all} /scratch/GAS/.temp/${all%*-config.xml}")
  fi

  #----- create bestsnp.fasta for /scratch/GAS/nasp/ALL (only if new GATK, no FASTA, or FASTA/GATK mismatch, or if -f force is in arguments)
  if (( ${JOBID##* } != 0 )); then
    JOBID=$(sbatch --job-name="GAS-dto" --output="/dev/null" --time="1:00" --mem="100m" --dependency=afterany:"${JOBID##* }" --wrap="/scratch/GAS/bin/mkMatrix.py /scratch/GAS/nasp/ALL\:\:${refSample}/")
  elif [[ ! -f /scratch/GAS/nasp/ALL\:\:${refSample}/matrix_dto.xml || ! -f /scratch/GAS/nasp/ALL\:\:${refSample}/matrices/bestsnp.fasta || ! -f /scratch/GAS/nasp/ALL\:\:${refSample}/matrices/tree.nwk ]] || (( $(( $(cat /scratch/GAS/nasp/ALL\:\:${refSample}/matrices/bestsnp.fasta | grep ">" | wc -l) - 1 )) != $(cat /scratch/GAS/nasp/ALL\:\:${refSample}/matrix_dto.xml | grep "gatk" | wc -l ) )) || [[ $(echo $@ | grep "\-f") ]]; then
    JOBID=$(sbatch --job-name="GAS-dto" --output="/dev/null" --time="1:00" --mem="100m" --wrap="/scratch/GAS/bin/mkMatrix.py /scratch/GAS/nasp/ALL\:\:${refSample}/")
  fi

  #----- create tree.nwk for /scratch/GASnasp/ALL (only if new MATRIX_DTO.XML created)
  if (( ${JOBID##* } != 0 )); then
    JOBID=$(sbatch --job-name="GAS-matrix" --output="/dev/null" --time="1:00:00" --mem="1g" --dependency=afterok:"${JOBID##* }" --wrap="module load nasp; nasp matrix --dto-file /scratch/GAS/nasp/ALL\:\:${refSample}/matrix_dto.xml;")
    JOBID=$(sbatch --job-name="GAS-fasta" --output="/dev/null" --time="1:00" --mem="100m"  --dependency=afterok:"${JOBID##* }" --wrap="/scratch/GAS/bin/mkFasta.py /scratch/GAS/nasp/ALL\:\:${refSample}/")
    JOBID=$(sbatch --job-name="GAS-tree" --output="/dev/null" --time="2:00" --mem="32g" --partition="hmem" --dependency=afterok:"${JOBID##* }" --wrap="/scratch/GAS/bin/NJ /scratch/GAS/nasp/ALL\:\:${refSample}/matrices/bestsnp.fasta")
  fi

  #----- recursively build nasp run per clade
  if (( ${JOBID##* } != 0 )); then
    JOBID=$(sbatch --job-name="GAS-clades" --output="/dev/null" --time="1:00" --mem="100m" --dependency=afterok:"${JOBID##* }" --wrap="/scratch/GAS/bin/getClades.py ${refSample} | while read line; do /scratch/GAS/bin/cladeGAS.sh ${refSample} \${line}; done")
  fi

  #----- TODO find best reference per clade
done
