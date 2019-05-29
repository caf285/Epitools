#!/usr/bin/env bash
#
#SBATCH --job-name=GAS
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=1
#SBATCH --ntasks-per-node=1
#SBATCH --time=4:00
#SBATCH --mem-per-cpu=100

#====================================================================================================( functions )
function printHelp {
  printf "\nadds all sample reads to GAS database\nusage: GAS.sh FASTQ"
  printf "\nexample:\n    ./GAS.sh example_R1_001.fastq.gz\n\n"
  exit 0
}

#====================================================================================================( main )

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
# run nasp against M1 reference
M1=$(/scratch/GAS/bin/mkConfig.py /scratch/GAS/reference/M1-TG92300.fasta -m _)
echo ${M1}
echo ${M1%*-config.xml}

# get jobID for nasp run
if [[ -e /scratch/GAS/.temp/${M1} ]]; then
  module load nasp
  nasp --config /scratch/GAS/.temp/${M1}
  JOBID=0
  for id in $(squeue -h -u $(whoami) -n "nasp_matrix" -o "%i"); do
    if (( ${id} > ${JOBID} )); then
      JOBID=${id}
    fi
  done
  #JOBID=$(sbatch --job-name="M1-nasp" --output="/dev/null" --dependency=afterany:"${JOBID##* }" --wrap="/scratch/GAS/bin/getStats.py ${M1%*-config.xml}")
  JOBID=$(sbatch --job-name="M1-nasp" --dependency=afterany:"${JOBID##* }" --wrap="/scratch/GAS/bin/getStats.py ${M1%*-config.xml}; rm -r /scratch/GAS/.temp/${M1} /scratch/GAS/.temp/${M1%*-config.xml}")
fi
