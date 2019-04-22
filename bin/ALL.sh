#!/usr/bin/env bash

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
if [[ $(ls /scratch/GAS/.temp) != "" ]]; then
  rm -r /scratch/GAS/.temp/*
fi

# run nasp against M1 reference for all new samples
/scratch/GAS/bin/resolveM1.py
if [[ -e /scratch/GAS/.temp/M1-config.xml ]]; then
  module load nasp
  nasp --config /scratch/GAS/.temp/M1-config.xml
  JOBID=0
  for id in $(squeue -h -u $(whoami) -n "nasp_matrix" -o "%i"); do
    if (( ${id} > ${JOBID} )); then
      JOBID=${id}
    fi
  done
  JOBID=$(sbatch --job-name="M1-nasp" --output="/dev/null" --dependency=afterany:"${JOBID##* }" --wrap="/scratch/GAS/bin/statsM1.py")
fi

sbatch --job-name="GAS2" --output="/dev/null" --dependency=afterany:"${JOBID##* }" --wrap="/scratch/GAS/bin/GAS2.sh"
