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
  print(googleHeader)
  print(google[0])
  googleHash = {}
  for line in google:
    if re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper()):
      googleHash[re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper())[0]] = line

  #==================================================( Fill Metadata )
  ### open fasta files
  fastaHash = {}
  for fasta in list(filter(lambda x: os.path.exists(x) and re.findall(".fasta", x), sys.argv)):
    fastaFile = list(map(lambda x: x.split("\n"), read(fasta).split(">")[1:]))
    for i in range(len(fastaFile)):
      if re.findall("TG\d+", fastaFile[i][0].upper()) and re.findall("TG\d+", fastaFile[i][0].upper())[0] in googleHash:
        fastaSample = re.findall("TG\d+", fastaFile[i][0].upper())[0]
        fastaExternal = googleHash[fastaSample][googleHeader.index("external_id")]
        fastaFacility = googleHash[fastaSample][googleHeader.index("Original facility source")]
        fastaDate = googleHash[fastaSample][googleHeader.index("Date collected from patient")]
        fastaEmm = googleHash[fastaSample][googleHeader.index("emm-type")]
        fastaFile[i][0] = ">" + "_".join([fastaSample, fastaExternal, fastaEmm, fastaDate])
    fastaFile = "\n".join(list(map(lambda x: "\n".join(x), fastaFile)))
    newFasta = "_metadata.fasta".join(fasta.split(".fasta"))
    write(newFasta, fastaFile)
    



if __name__ == '__main__':
    main()
