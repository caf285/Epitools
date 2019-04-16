#!/usr/bin/env bash
#
#SBATCH --job-name=GAS
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=1
#SBATCH --ntasks-per-node=1
#SBATCH --time=4:00
#SBATCH --mem-per-cpu=100

# ==================================================( functions )
function printHelp {
  printf "\nadds all sample reads to GAS database\nusage: GAS.sh FASTQ"
  printf "\nexample:\n    ./GAS.sh example_R1_001.fastq.gz\n\n"
  exit 0
}

# ==================================================( main )

# check ARGS for help
if [[ $# < 1 ]] || [[ $(echo $@ | grep "\-h") ]] ; then
  printHelp
fi

# from args, add FASTQ to "/scratch/GAS/GAS.tsv"
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
/scratch/GAS/bin/getPath.py $ARRAY

# if exists, flush TEMP and create config files
DIR="/scratch/GAS/.temp"
if [[ $(ls ${DIR}) != "" ]]; then
  rm -r ${DIR}/*
fi

# run nasp against M1 reference for all new samples
/scratch/GAS/bin/resolveM1.py
if [[ -e ${DIR}/M1-config.xml ]]; then
  module load nasp
  nasp --config ${DIR}/M1-config.xml
  JOBID=0
  for id in $(squeue -h -u $(whoami) -n "nasp_matrix" -o "%i"); do
    if (( ${id} > ${JOBID} )); then
      JOBID=${id}
    fi
  done
  sbatch --job-name="M1-nasp" --output="/dev/null" --dependency=afterany:"${JOBID##* }" --wrap="/scratch/GAS/bin/statsM1.py"
fi


