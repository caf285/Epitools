#!/bin/bash
#
# Create an assembly from a pair of read files:
#   ugap R1_FASTQ R2_FASTQ

[[ "${DEBUG-}" = true ]] && set -x
set -euo pipefail
shopt -s nullglob

if [[ "${1-}" == -h ]] || [[ "${1-}" == --help ]]; then
    # TODO: extract usage message as print_usage function
    cat <<EOF

BASH_VERSINFO: ${BASH_VERSINFO[*]}"

*** DEVELOPMENT RELEASE ***
author: Jason Travis <jtravis@tgen.org>
url: https://github.com/TGenNorth/UGAP (restricted access)
version: v0.1.1

Pipeline Synopsis:
  ugap will create an assembly fasta from a set of paired end fastq.

  (deplete reads) - discard reads that do not align to a reference fasta
  ▼
  subsample reads to <= 20,000,000
  ▼
  trimmomatic - trim adapter sequences
  ▼
  spades      - assemble reads
  ▼
  pilon       - improve assembly

Each read pair creates the following output file structure:

    \${sample_name}.ugap
    ├── \${sample_name}_coverage.txt
    ├── \$blast_report
    ├── \$blast_query
    ├── \${sample_name}.R1.subsample.fq.gz
    ├── \${sample_name}.R2.subsample.fq.gz
    ├── \${sample_name}.trimmomatic
    │   ├── \${sample_name}.F.paired.fq.gz
    │   └── \${sample_name}.R.paired.fq.gz
    ├── \${sample_name}.spades
    │   ├── The structure of the spades output is copied for reference from the spades v3.10.1 manual
    |   |   See http://cab.spbu.ru/software/spades/
    │   ├── scaffolds.fasta      – resulting scaffolds (recommended for use as resulting sequences)
    │   ├── contigs.fasta        – resulting contigs
    │   ├── assembly_graph.fastg – assembly graph
    │   ├── contigs.paths        – contigs paths in the assembly graph
    │   ├── scaffolds.paths      – scaffolds paths in the assembly graph
    │   ├── before_rr.fasta      – contigs before repeat resolution
    │   ├── corrected/           – files from read error correction
    │   |   ├── configs/         – configuration files for read error correction
    │   |   ├── corrected.yaml   – internal configuration file
    │   |   └── Output files with corrected reads
    │   ├── params.txt           – information about SPAdes parameters in this run
    │   ├── spades.log           – SPAdes log
    │   ├── dataset.info         – internal configuration file
    │   ├── input_dataset.yaml   – internal YAML data set file
    │   └── K<##>/               – directory containing intermediate files from the run with K=<##>.
    |                              These files should not be used as assembly results; use resulting contigs/scaffolds
    └── \${sample_name}.pilon
        ├── \${sample_name}.pilon.bam
        ├── \${sample_name}.pilon.bam.bai
        ├── \${sample_name}.pilon.fasta
        ├── \${sample_name}.pilon.fasta.amb
        ├── \${sample_name}.pilon.fasta.ann
        ├── \${sample_name}.pilon.fasta.bwt
        ├── \${sample_name}.pilon.fasta.pac
        └── \${sample_name}.pilon.fasta.sa

Single Usage:

  When run with positional arguments, the script runs the pipeline to build an
  assembly from the given pair of fastq files.

  ugap R1_FASTQ R2_FASTQ [REFERENCE_FASTA]

Batch Usage:

  When run without positional arguments, the script prints a batch script that
  will run the pipeline on each pair of fastq files in the current directory.

  The batch script can be executed immediately:

      SLURM:  sbatch <( /path/to/ugap )
      TORQUE: /path/to/ugap | qsub
      Bash:   bash <( /path/to/ugap )
  
  Alternatively, the script can be saved before submitting which could be
  useful if you need to match the log ouput back to the input files:

      /path/to/ugap > ugap.batch

      SLURM:  sbatch ugap.batch
      TORQUE: qsub   ugap.batch
      Bash:   bash   ugap.batch

  The script assumes the directory contains .fastq.gz or fq.gz files that:
    - are all paired reads
    - follow the SRA or Illumina naming conventions
    - can be grouped alphanumerically by filename
      (The forward read always preceeds the reverse read when the files are listed)

EOF
    exit 0
fi


################################################################################
# Print a job scheduler array batch script to run the pipeline on each pair of
# fastq files in the current directory.
# Globals:
#   BASH_SOURCE
#   PWD
# Arguments:
#   None
# Returns:
#   A job scheduler batch script if a sbatch or qsub command are found on the PATH
#   fallingback to a for-loop shell script.
################################################################################
print_batch_script () {
    # reference is the first fasta found in the directory
    local reference=""
    local -a fastas=( *.fasta )

    local -a fastqs=( *.fastq.gz *.fq.gz )
    local -i n_reads="${#fastqs[@]}"

    local script=$(readlink -e ${BASH_SOURCE[0]})
    local script_dir="${script%/*}"

    [[ "$n_reads" -eq 0 ]] && {
        printf "no fastq files found in $PWD\n"
        exit 1
    } >&2

    [[ $(( n_reads % 2 )) -ne 0 ]] && {
        printf "expected paired reads, found an odd number of fastq files: %d\n" "$n_reads"
        exit 1
    } >&2

    cat <<EOF
#!/bin/bash
#SBATCH --job-name ugap
#SBATCH --array=0-$(( n_reads/2 - 1 ))%5
#SBATCH --workdir=$PWD
#SBATCH --cpus-per-task=16
#SBATCH --time=2:00:00
#SBATCH --mem=10gb

set -euo pipefail

module load BEDtools blast+ bwa pigz samtools spades

reads=(
$( awk '{print "\t" $0 "\t# " NR-1 }' <(printf "\"%s\"\t\"%s\"\n" ${fastqs[@]}) | column -s$'\t' -t | sed  's/^/\t/' )
)

SLURM_ARRAY_TASK_ID=\${SLURM_ARRAY_TASK_ID?undefined}
r1=\$(( SLURM_ARRAY_TASK_ID*2 ))
r2=\$(( SLURM_ARRAY_TASK_ID*2 + 1))

DEBUG=true NCPU=\$SLURM_CPUS_ON_NODE $script $PWD/\${reads[\$r1]} $PWD/\${reads[\$r2]} $reference
EOF

}

[[ "$#" -eq 0 ]] && print_batch_script && exit 0

declare -i keep_n_bases=200 # TODO: parameterize keep_n_bases
declare -i NCPU=${NCPU:-$(nproc || 1)}

# Input filenames
declare R1="${1?missing forward read parameter}"
declare R2="${2?missing reverse read parameter}"
declare reference="${3-}"

# Guess the sample name from the R1 filename.
declare sample_name="${R1##*/}"
sample_name="${sample_name%%_S[0-9]*_L[0-9]*_R[12]*.fastq.gz}"

# Output directories
declare ugap_workdir="${sample_name}.ugap"
declare trimmomatic_workdir="$ugap_workdir/${sample_name}.trimmomatic"
declare spades_workdir="$ugap_workdir/${sample_name}.spades"
declare pilon_workdir="$ugap_workdir/${sample_name}.pilon"

# Output files
declare r1_subsample_fastq="$ugap_workdir/${sample_name}.R1.subsample.fq.gz"
declare r2_subsample_fastq="$ugap_workdir/${sample_name}.R2.subsample.fq.gz"
declare f_deplete_fq="$ugap_workdir/${sample_name}.F.deplete.fq.gz"
declare r_deplete_fq="$ugap_workdir/${sample_name}.R.deplete.fq.gz"
declare f_paired_fq="$trimmomatic_workdir/${sample_name}.F.paired.fq.gz"
declare r_paired_fq="$trimmomatic_workdir/${sample_name}.R.paired.fq.gz"
declare spades_assembly="$spades_workdir/contigs.fasta"
declare spades_bam="$spades_workdir/${sample_name}.bam"
declare pilon_assembly="$pilon_workdir/${sample_name}.fasta"
declare pilon_bam="$pilon_workdir/${sample_name}.bam"

# Dependencies
# TODO: extract dependency paths as config
declare script_dir="$(readlink -e "${BASH_SOURCE[0]%/*}")"
declare trimmomatic="/packages/trimmomatic/0.36/trimmomatic-0.36.jar"
declare trimmomatic_adapters="${trimmomatic%/*}"/adapters/TruSeq3-PE.fa
declare pilon="$script_dir/pilon-1.22.jar"
declare picard="$script_dir/picard.jar"
command -v bwa >/dev/null || { echo >&2 "command not found: bwa"; exit 1; }
samtools --version >/dev/null 2>&1 || { echo >&2 "samtools >= v1.0 is required"; exit 1; }
command -v spades.py >/dev/null || { echo >&2 "command not found: spades.py"; exit 1; }

# Check arguments
[[ -n "$reference" ]] && [[ ! -f "$reference" ]] && >&2 echo "file not found: $reference" && exit 1
[[ -n "$R1" ]] && [[ ! -f "$R1" ]] && >&2 echo "file not found: $R1" && exit 1
[[ -n "$R2" ]] && [[ ! -f "$R2" ]] && >&2 echo "file not found: $R2" && exit 1

# Canonicalize/dereference paths.
# This is primarily important if using pigz because it will not work with symbolic links.
reference=$(readlink -e "$reference" || true)
R1=$(readlink -e "$R1")
R2=$(readlink -e "$R2")

# Create directory structure.
mkdir -pv "$trimmomatic_workdir" "$pilon_workdir"

echo "reference: $reference"
echo "R1: $R1"
echo "R2: $R2"
echo "sample_name: $sample_name"

# TODO: document this program and/or move it into the subsample function.
# EOF is quoted to prevent parameter expansion of the awk variables.
read -r -d '' awk_subsample_fastq << 'EOF' || true # Note that read will have an exit code of 1 in this situation; the '|| true' ignores this error for 'set -e'
# Read the first read_number from STDIN and convert it to a line_number.
# The line_number equation assumes each read is composed of 4 lines.
BEGIN {
  # FIXME: The program will hang if nothing is piped to stdin.
  # Is it possible to raise an error if nothing is piped to stdin?
  # The following test did not work because the program hung waiting for input: if (getline read_number < "-" == 0) exit
  getline read_number < "-"
  if (read_number !~ /^[[:digit:]]/) print "value read from STDIN is not a positive integer: '" read_number "'"> "/dev/stderr"
  line_number = (read_number*4) - 3
}

# line_number should be the first line of a read.
# For each matching line_number, print the 4 consecutive lines representing a read.
# The program should exit when there are no more reads numbers in STDIN.
# The program should never exit because it ran out of reads in the fastq.
# TODO: should there be a check for early termination? Can this be done in the END clause?
# TODO: FNR vs NR, does it matter which is used? Probably not. NR should always equal FNR.
NR == line_number {
  print $0
  for(i=0; i<3; i++) { getline; print $0 }
  if (getline read_number < "-" == 0) exit
  line_number = (read_number*4) - 3
}
EOF


subsample() {
	local r1 r2
	r1=$(readlink -e "${1?missing parameter}")
	r2=$(readlink -e "${2?missing parameter}")
	local -i max_reads="20000000"
	local -i n_reads=$(( $(gzip -cd < "$r1" | wc -l) / 4 ))
	if [[ "$n_reads" -gt "$max_reads" ]]; then
		shuf -i 1-$n_reads -n "$max_reads" | sort -n \
			| tee >(awk "$awk_subsample_fastq" <(gzip -cd < "$r1") | gzip > "$r1_subsample_fastq") \
			| awk "$awk_subsample_fastq" <(gzip -cd < "$r2") | gzip > "$r2_subsample_fastq"
	else
		r1_subsample_fastq="$r1"
		r2_subsample_fastq="$r2"
	fi
}


filter_assembly() {
	local assembly=${1?missing parameter}
	local min_sequence_length=${2?missing parameter}
	# mktemp: too few X's in template
	tmpfile=$(mktemp -q -t "$PWD/tmp.XXXXXX" 2>/dev/null || mktemp -q --tmpdir="$PWD")
	samtools faidx "$assembly"
	fastaFromBed \
		-fi "$assembly" \
		-bed <(awk -v min_sequence_length="$min_sequence_length" '$2 >= min_sequence_length { print $1 "\t0\t" $2 "\t" $1 }' "$assembly.fai") \
		-name \
		-fo "$tmpfile"
	mv "$tmpfile" "$assembly"
	rm "$assembly.fai"
}


align_reads() {
	local bam="${1?missing parameter}"
	local assembly="${2?missing parameter}"
	local R1="${3?missing parameter}"
	local R2="${4?missing parameter}"
	local NCPU=$NCPU
	bwa index "$assembly"
	bwa mem -R "@RG\tID:${sample_name}\tSM:vac6wt\tPL:ILLUMINA\tPU:vac6wt" -M -t "$NCPU" "$assembly" "$R1" "${R2:-}" \
	  | samtools sort -l 0 -@ $NCPU - \
	  | samtools view -Su -o $bam -
	samtools index "$bam"
}


subsample "$R1" "$R2"


java -jar "$trimmomatic" \
	PE "$r1_subsample_fastq" "$r2_subsample_fastq" \
	-threads "$NCPU" \
	"$f_paired_fq" \
	/dev/null \
	"$r_paired_fq" \
	/dev/null \
	ILLUMINACLIP:"$trimmomatic_adapters":2:30:10 \
	LEADING:3 TRAILING:3 SLIDINGWINDOW:4:15 MINLEN:36


spades.py \
  -1 "$f_paired_fq" \
  -2 "$r_paired_fq" \
  --careful \
  -o "$spades_workdir" \
  -t "$NCPU"
filter_assembly "$spades_assembly" "$keep_n_bases"
align_reads "$spades_bam" "$spades_assembly" "$R1" "$R2"


java -jar "$pilon" \
  --threads "$NCPU" \
  --fix all,amb \
  --genome "$spades_assembly" \
  --bam "$spades_bam" \
  --output "${pilon_assembly%.fasta}"
filter_assembly "$spades_assembly" "$keep_n_bases"
align_reads "$pilon_bam" "$pilon_assembly" "$R1" "$R2"

cp ${pilon_assembly} ${sample_name}.fasta
rm -r ${ugap_workdir} 
