#!/usr/bin/env python

#==================================================( Imports and Functions )
### import
import sys
import os
import re
import json
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

def main():
  #==================================================( Open Files )
  ### set directories
  wd = "/".join(sys.argv[0].split("/")[:-1]) + "/" # working directory
  pd = os.path.abspath(os.path.join(wd, os.pardir)) + "/" # parent directory

  ### open and hash db
  db = json.load(open(wd + "epitools_pathogen.json"))
  dbHeader = list(db[0].keys())
  dbHash = {}
  for line in db:
    if line["Sample"]:
      dbHash[line["Sample"]] = list(line.values())

  ### get all references from templates/assemblies
  references = os.listdir(pd + "templates/assemblies")
  referencesHash = {}
  for line in references:
    referencesHash[line.split("_")[-1].split(".fasta")[0]] = line.split("_")[0]

  ### open masters and get alignments
  masterFiles = []
  for line in sys.argv[1:]:
    masterFiles += subprocess.Popen("find " + line + " -iname master.tsv", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read().split("\n")
  for masterFile in masterFiles:
    if os.path.exists(masterFile):
      master = read(masterFile).split("\n")
      masterHeader = list(map(lambda x: x.split("::BWA-mem,GATK")[0], master.pop(0).split("#SNPcall")[0].strip().split("\t")))
      master = list(map(lambda x: x.split("\t"), master))
      reference = list(filter(lambda x: x in masterHeader, referencesHash))
      emm = ""
      if reference:
        sequencesHash = {}
        print("... reading " + masterFile)
        masterHeader[1] = reference[0]  # reassign "reference" with sample name
        emm = referencesHash[reference[0]]
        for i in range(2,len(masterHeader)):
          if masterHeader[i] not in sequencesHash:
            sequencesHash[masterHeader[i]] = {"reference": dbHash[reference[0]][dbHeader.index("Id")], "sequence": []}
          for line in master:
            sequencesHash[masterHeader[i]]["sequence"].append(line[i])
          sequencesHash[masterHeader[i]]["sequence"] = "".join(sequencesHash[masterHeader[i]]["sequence"])
        write(wd + emm + "_epitools_sequences_upload.json", json.dumps(sequencesHash))
        print("... epitools.sequences upload JSON package written to " + wd + emm + "_epitools_sequences_upload.json")

      else:
        print("no reference", reference, line)
        continue

  #==================================================( Upload Missing Data to DB )
  ### get ['Sample', 'Reference', 'Sequence'] from NASP output
  #if sequencesHash:
  #  write(wd + "epitools_sequences_upload.json", json.dumps(sequencesHash))
  #  print("... epitools.sequences upload JSON package written to " + wd + "epitools_sequences_upload.json")
  #else:
  #  print("... no sequences")

if __name__ == '__main__':
    main()
