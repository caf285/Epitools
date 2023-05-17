#!/usr/bin/env python

#==================================================( Imports and Functions )
### import
import sys
import json
import re
import subprocess

### i/o functions
def read(fileName):
  f = open(fileName, 'r')
  file = f.read().strip()
  f.close
  return file

def write(fileName, output):
  f = open(fileName, 'w')
  f.write(output)
  f.close()

def append(fileName, output):
  f = open(fileName, 'a')
  f.write(output + "\n")
  f.close()

def main():
  #==================================================( Open Files )
  ### set environment
  wd = "/".join(sys.argv[0].split("/")[:-1]) + "/" # working directory

  ### open and hash google sheet
  google = json.load(open(wd + "googleSheets_covidSeq_Master.json"))
  googleHeader = google.pop(0)
  # ['rna_id(tg#)', 'run_id', 'sequencing_file_name(fastq)', 'sequencing_date', 'genome_file_name(fasta)', 'pangolin_lineage', 'gisaid_epi_isl', 'sample_name', 'original_id', 'sample_id(tg#)', 'genbank_accession', 'collection_date', 'county', 'sample_source', 'institution', 'total_reads', 'aligned_reads', 'percent_aligned', 'coverage_breadth', 'average_depth', '# SNPs + INDELs (10-80%)', '# SNPs + INDELs (>=80%)', 'num_mutations', 'SNP profile', 'gisaid_variants', 'gisaid_aa_sub', 'cell_location', 'plate_name', 'precheck_plate_name', 'precheck_cell_location', 'Control Check', 'Month Invoiced']
  googleHash = {}
  for line in google:
    # ['TG1253830', 'TGN-NextSeq0428', 'TGen-CoV-AZ-Tiled-TG1253830', '2022-03-07', '/labs/COVIDseq/TGenAssemblies_gapfilled/TGen-CoV-AZ-Tiled-TG1253830_gapfilled.fasta', 'BA.1.1', 'EPI_ISL_10827371', '65973691', '119952255231', 'TG1219666', '', '2022-02-04', 'Coconino', '', 'Tuba City Regional Healthcare Corporation - Sonora Quest Laboratories', '1,233,969', '1,201,129.00', '97.34', '99.76', '5074.52', '4', '95', '', '', '', '', 'A1', 'p618', 'loc@1102480', 'B8', 'PASS', 'March 2022']
    if re.findall("TG\d+", line[googleHeader.index("rna_id(tg#)")].upper()):
      googleHash[re.findall("TG\d+", line[googleHeader.index("rna_id(tg#)")].upper())[0]] = line

  ### find all read pairs and write locations in file
  print("\nfinding all read pairs ...")
  readsHash = {}
  err = []
  for key in googleHash.keys():
    run = ""
    reads = []
    if googleHash[key][googleHeader.index("run_id")].strip():
      run = googleHash[key][googleHeader.index("run_id")].strip()
    if run:
      run = subprocess.Popen("find /TGenNextGen/ -maxdepth 1 -type d -iname *" + run + "* 2>/dev/null", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
      run = run.stdout.read()
      if run:
        run = sorted(run.strip().split("\n"))[0]
        if key:
          reads = subprocess.Popen("find " + run + "* -type f -iname *" + key + "*.fastq.gz 2>/dev/null", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
          reads = reads.stdout.read()
        if reads and "_R1_" in reads and "_R2_" in reads:
          reads = sorted(reads.strip().split("\n"))[:2]
        elif re.findall("TG\d+", googleHash[key][googleHeader.index("sample_id(tg#)")].strip().upper()):
          reads = subprocess.Popen("find " + run + " -type f -iname *" + re.findall("TG\d+", googleHash[key][googleHeader.index("sample_id(tg#)")].upper())[0] + "*.fastq.gz 2>/dev/null", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
          reads = reads.stdout.read()
          if reads and "_R1_" in reads and "_R2_" in reads:
            reads = sorted(reads.strip().split("\n"))[:2]
        if reads:
          readsHash[key] = reads
        else:
          print("sample not found: (", "'" + key + "', ", "'" + googleHash[key][googleHeader.index("sample_id(tg#)")] + "'", "); for run: (", "'" + run + "'", ")")
      if not reads and not run:
        print("run not found: (", "'" + googleHash[key][googleHeader.index("run_id")] + "'", "); for sample: (", "'" + key + "', ", "'" + googleHash[key][googleHeader.index("sample_id(tg#)")] + "'", ")")
      if not reads:
        err.append(key)
        err.append(googleHash[key][googleHeader.index("sample_id(tg#)")])

  ### write reads pairs to file
  write(wd + "readPairs_locations.json", json.dumps(readsHash))
  print("... file written to " + wd + "readPairs_locations.json\n")
  print("BASH script to find missing TG#s in /TGenNextgen/:\n")
  print("ls /TGenNextGen/*/ -1td | while read line; do echo ... searching ${line} ...; find ${line} -iname \"*" + "*.fastq.gz\" -o -iname \"*".join(re.findall("TG\d+", "".join(err))) + "*.fastq.gz\" 2>/dev/null; done")
  print()

if __name__ == '__main__':
    main()
