#!/usr/bin/env python

#==================================================( Imports and Functions )
### import
import sys
import os
import datetime
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
  ### set directories
  wd = "/".join(sys.argv[0].split("/")[:-1]) + "/" # working directory
  pd = os.path.abspath(os.path.join(wd, os.pardir)) + "/" # parent directory
  #print(wd, pd)

  ### open and hash google sheet
  google = json.load(open(wd + "googleSheets_allGas_Master.json"))
  googleHeader = google.pop(0)
  googleHash = {}
  for line in google:
    if re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper()):
      googleHash[re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper())[0]] = line

  ### open readPairs
  rpHash = json.load(open(wd + "readPairs_locations.json"))

  #==================================================( New File Analysis )
  ### get emmType (set up srst2 with spyogenes for ST and additional stats)
  samples = False
  for sample in googleHash:
    if sample in rpHash and "" in googleHash[sample][googleHeader.index("ST"):googleHeader.index("maxMAF") + 1]:
      samples = True
      if not os.path.isdir(pd + "analysis/" + str(datetime.date.today())):
        os.mkdir(pd + "analysis/" + str(datetime.date.today()))
      if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/MLST_AMR"):
        subprocess.Popen("cp -r " + pd + "templates/MLST_AMR " + pd + "analysis/" + str(datetime.date.today()) + "/MLST_AMR", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
      subprocess.Popen("ln -sf " + rpHash[sample][0] + " " + pd + "analysis/" + str(datetime.date.today()) + "/MLST_AMR/" + sample + "_R1.fastq.gz", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
      subprocess.Popen("ln -sf " + rpHash[sample][1] + " " + pd + "analysis/" + str(datetime.date.today()) + "/MLST_AMR/" + sample + "_R2.fastq.gz", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
  if samples:
    print("... files written to " + pd + "analysis/" + str(datetime.date.today()) + "/MLST_AMR/\n")
    print("BASH script to run srst2 in " + pd + "analysis/" + str(datetime.date.today()) + "/MLST_AMR/\n")
    print("conda activate srst2; srst2 --input_pe *.fastq.gz --forward _R1 --reverse _R2 --output emmtypes --mlst_db Streptococcus_pyogenes.fasta --mlst_definitions spyogenes.txt --mlst_delimiter _\n")
  else:
    print("no new samples for MLST_AMR\n")

  ### get resistances (also srst2, but with gannot)
  samples = False
  for sample in googleHash:
    if sample in rpHash and "" in googleHash[sample][googleHeader.index("Ant6-Ia_AGly"):googleHeader.index("TetM_Tet") + 1]:
      samples = True
      if not os.path.isdir(pd + "analysis/" + str(datetime.date.today())):
        os.mkdir(pd + "analysis/" + str(datetime.date.today()))
      if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/RESgannot"):
        subprocess.Popen("cp -r " + pd + "templates/MLST_AMR " + pd + "analysis/" + str(datetime.date.today()) + "/RESgannot", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
      subprocess.Popen("ln -sf " + rpHash[sample][0] + " " + pd + "analysis/" + str(datetime.date.today()) + "/RESgannot/" + sample + "_R1.fastq.gz", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
      subprocess.Popen("ln -sf " + rpHash[sample][1] + " " + pd + "analysis/" + str(datetime.date.today()) + "/RESgannot/" + sample + "_R2.fastq.gz", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
  if samples:
    print("... files written to " + pd + "analysis/" + str(datetime.date.today()) + "/RESgannot/\n")
    print("BASH script to run srst2 in " + pd + "analysis/" + str(datetime.date.today()) + "/RESgannot/\n") 
    print("conda activate srst2; srst2  --input_pe *.fastq.gz --forward _R1 --reverse _R2 --output amr_results --gene_db ARGannot.fasta\n")
  else:
    print("no new samples for RESgannot\n")

if __name__ == '__main__':
    main()
