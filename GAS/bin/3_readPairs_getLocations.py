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
  google = json.load(open(wd + "googleSheets_allGas_Master.json"))
  googleHeader = google.pop(0)
  googleHash = {}
  for line in google:
    if re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper()):
      googleHash[re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper())[0]] = line

  ### find all read pairs and write locations in file
  print("\nfinding all read pairs ...")
  readsHash = {}
  err = []
  for key in googleHash.keys():
    run = ""
    reads = []
    if googleHash[key][googleHeader.index("Run # if re-sequenced")].strip():
      run = googleHash[key][googleHeader.index("Run # if re-sequenced")].strip()
    elif googleHash[key][googleHeader.index("Seq run #")].strip():
      run = googleHash[key][googleHeader.index("Seq run #")].strip()
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
        elif re.findall("TG\d+", googleHash[key][googleHeader.index("subsample_ID")].strip().upper()):
          reads = subprocess.Popen("find " + run + " -type f -iname *" + re.findall("TG\d+", googleHash[key][googleHeader.index("subsample_ID")].upper())[0] + "*.fastq.gz 2>/dev/null", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
          reads = reads.stdout.read()
          if reads and "_R1_" in reads and "_R2_" in reads:
            reads = sorted(reads.strip().split("\n"))[:2]
        if reads:
          readsHash[key] = reads
        else:
          print("sample not found: (", "'" + key + "', ", "'" + googleHash[key][googleHeader.index("subsample_ID")] + "'", "); for run: (", "'" + run + "'", ")")
      if not reads and not run:
        print("run not found: (", "'" + googleHash[key][googleHeader.index("Run # if re-sequenced")] + "', ", "'" + googleHash[key][googleHeader.index("Seq run #")] + "'", "); for sample: (", "'" + key + "', ", "'" + googleHash[key][googleHeader.index("subsample_ID")] + "'", ")")
      if not reads:
        err.append(key)
        err.append(googleHash[key][googleHeader.index("subsample_ID")])

  ### write reads pairs to file
  write(wd + "readPairs_locations.json", json.dumps(readsHash))
  print("... file written to " + wd + "readPairs_locations.json\n")
  print("BASH script to find missing TG#s in /TGenNextgen/:\n")
  print("ls /TGenNextGen/*/ -1td | while read line; do echo ... searching ${line} ...; find ${line} -iname \"*" + "*.fastq.gz\" -o -iname \"*".join(re.findall("TG\d+", "".join(err))) + "*.fastq.gz\" 2>/dev/null; done")
  print()

if __name__ == '__main__':
    main()
