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
#module load nasp
#JOBID=$(sbatch --job-name="M1-nasp" --output="/dev/null" --wrap="nasp --config ${DIR}/M1-config.xml")
JOBID=$(sbatch --job-name="test" --output="/dev/null" --wrap="echo hello")
echo ${JOBID##* }
sbatch  --job-name="test" --dependency=afterany:"${JOBID##* }" --output="/dev/null" --wrap="echo hello"
# get QUALITY_BREADTH from /scratch/GAS/.temp/M1/statistics/sample_stats.tsv
#sbatch --job-name="M1-nasp" --dependency=afterany:"${JOBID##* }" --wrap="for sample in $(/scratch/GAS/bin/statsM1.py); do echo ${DIR}/M1/gatk/${sample}-bwamem-gatk.vcf /scratch/GAS/nasp/M1/gatk/${sample}-bwamem-gatk.vcf; done"




# check if file or directory
#if [[ -f $1 ]]

# if exists, flush temp and create config files
#DIR="/scratch/GAS/.temp"
#rm -r ${DIR}/*
#/scratch/GAS/bin/mkConfig.py ${FASTQ}

# run nasp on samples per emm type
#module load nasp
#for sample in $(ls ${DIR}); do
#  for Mtype in $(ls ${DIR}/${sample}); do
#    echo ${sample} ${Mtype}

    # save job id array for dependancy
    #JOBID=$(sbatch --job-name="${Mtype}-nasp" --output="/dev/null" --wrap="nasp --config ${DIR}/${sample}/${Mtype}/${Mtype}-config.xml")
#    ARRAY+=:${JOBID##* }
#  done
#done

#sbatch --job-name="ALL-nasp" --dependency=afterany"${ARRAY[@]}" --wrap="echo done"
