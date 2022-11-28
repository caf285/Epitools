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

  ### open and hash google sheet
  google = json.load(open(wd + "googleSheets_allGas_Master.json"))
  googleHeader = google.pop(0)
  googleHash = {}
  for line in google:
    if re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper()):
      googleHash[re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper())[0]] = line

  ### open readPairs
  rpHash = json.load(open(wd + "readPairs_locations.json"))

  #==================================================( New Assemblies )
  ### get samples per emm-type
  emmHash = {}
  for sample in list(filter(lambda x: re.findall("emm\d+", googleHash[x][googleHeader.index("emm-type")]) and x in rpHash, googleHash)):
    if googleHash[sample][googleHeader.index("emm-type")] not in emmHash:
      emmHash[googleHash[sample][googleHeader.index("emm-type")]] = []
    emmHash[googleHash[sample][googleHeader.index("emm-type")]].append(sample)

  ### symlink all samples
  emmCheck = False
  for emm in emmHash:
    if not list(filter(lambda x: emm + "_" in x, os.listdir(pd + "/templates/assemblies/"))):
      emmCheck = True
      if not os.path.isdir(pd + "analysis/" + str(datetime.date.today())):
        os.mkdir(pd + "analysis/" + str(datetime.date.today()))
      if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/assemblies"):
        os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/assemblies")
      if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/assemblies/" + emm):
        os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/assemblies/" + emm)
      for sample in emmHash[emm]:
        subprocess.Popen("ln -sf " + rpHash[sample][0] + " " + pd + "analysis/" + str(datetime.date.today()) + "/assemblies/" + emm + "/" + sample + "_R1.fastq.gz", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
        subprocess.Popen("ln -sf " + rpHash[sample][1] + " " + pd + "analysis/" + str(datetime.date.today()) + "/assemblies/" + emm + "/" + sample + "_R2.fastq.gz", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
      print("... " + str(len(emmHash[emm])) + " files written to " + pd + "analysis/" + str(datetime.date.today()) + "/assemblies/" + emm)

  if emmCheck:
    print("\nBASH script to run uGAP in " + pd + "analysis/" + str(datetime.date.today()) + "/assemblies/ ...\n") 
    print("/labs/PublicHealth/Scripts_repos/jmonroy-nieto/00028_SPADES_all.sbatch")
    print("\nBASH script to get assemblies in " + pd + "analysis/" + str(datetime.date.today()) + "/assemblies/\n") 
    print("find ./ -maxdepth 3 -iname scaffolds.fasta | while read line; do newline=${line%/sc*}; newline=${newline#*emm}; cp ${line} emm${newline/\//_}.fasta; done")
    print()
  else:
    print("no emm types")

if __name__ == '__main__':
    main()
