#!/usr/bin/env bash
#
#SBATCH --job-name=GAS-nasp
#SBATCH --time=5:00
#SBATCH --mem="100m"

#====================================================================================================( functions )
function printHelp {
  printf "\nadds all sample reads to GAS database"
  printf "\nusage: GAS.sh FASTQ [FASTQ ...]"
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
# run nasp against M1 reference; exit is no change
M1=$(/scratch/GAS/bin/mkConfig.py /scratch/GAS/reference/M1-TG92300.fasta -m _)

if [[ -z ${M1} ]]; then
  echo no new reads found
  exit 0
fi

# get jobID for nasp run
JOBID=0
if [[ -e /scratch/GAS/.temp/${M1} ]]; then
  module load nasp
  nasp --config /scratch/GAS/.temp/${M1}
  for id in $(squeue -h -u $(whoami) -n "nasp_matrix" -o "%i"); do
    if (( ${id} > ${JOBID} )); then
      JOBID=${id}
    fi
  done

  # update GAS.tsv and copy all gatk files > 80% M1 QUALITY BREADTH
  JOBID=$(sbatch --job-name="GAS-getStats" --output="/dev/null" --time="5:00" --mem="100m" --dependency=afterok:"${JOBID##* }" --wrap="/scratch/GAS/bin/getStats.py ${M1%*-config.xml}; rm -r /scratch/GAS/.temp/${M1} /scratch/GAS/.temp/${M1%*-config.xml}")
fi

#----- create bestsnp.tsv for /scratch/GAS/nasp/ALL
JOBID=${JOBID##* }
if (( JOBID != 0 )); then
  JOBID=$(sbatch --job-name="GAS-dto" --output="/dev/null" --time="5:00" --mem="100m" --dependency=afterok:"${JOBID##* }" --wrap="/scratch/GAS/bin/mkMatrix.py /scratch/GAS/nasp/ALL")
  JOBID=$(sbatch --job-name="GAS-matrix" --output="/dev/null" --time="1:00:00" --mem="1g" --dependency=afterok:"${JOBID##* }" --wrap="module load nasp; nasp matrix --dto-file /scratch/GAS/nasp/ALL/matrix_dto.xml;")
fi

#----- create a neighbor joining tree from bestsnp.tsv
JOBID=${JOBID##* }
if (( JOBID != 0 )); then
  JOBID=$(sbatch --job-name="GAS-fasta" --output="/dev/null" --time="5:00" --mem="100m"  --dependency=afterok:"${JOBID##* }" --wrap="/scratch/GAS/bin/mkFasta.py /scratch/GAS/nasp/ALL/")
  JOBID=$(sbatch --job-name="GAS-tree" --output="/dev/null" --time="10:00" --mem="32g" --dependency=afterok:"${JOBID##* }" --wrap="/scratch/GAS/bin/NJ /scratch/GAS/nasp/ALL/matrices/bestsnp.fasta")
fi

#----- TODO recursively build nasp run per clade

#----- TODO find best reference per clade











