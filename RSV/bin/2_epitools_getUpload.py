#!/usr/bin/env python

#==================================================( Imports and Functions )
### i/o
import re
import os
import sys
import json
from datetime import datetime

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
  #==================================================( Save Sheets )
  ### set environment
  wd = "/".join(sys.argv[0].split("/")[:-1]) + "/" # working directory

  ### open and hash db
  db = json.load(open(wd + "epitools_pathogen.json"))
  dbHeader = list(db[0].keys())
  dbHash = {}
  for line in db: 
    if line["Sample"]:
      dbHash[line["Sample"]] = list(line.values())

  ### open and hash fasta
  fastaFiles = list(filter(lambda fasta: ".fasta" in fasta, os.listdir(wd)))
  fastaHash = {}
  for fileName in fastaFiles:
    fasta = read(wd + fileName)
    fasta = fasta.split(">")[1:]
    for i in range(len(fasta)):
      fasta[i] = fasta[i].split("\n")
      name = fasta[i][0] + "/" + fileName
      sequence = "".join(fasta[i][1:]).upper()
      fastaHash[name] = {"name": name, "sequence": sequence}

  ### get new/updated metadata
  uploadHash = {"new": [], "update": []}
  uploadSequences = {}
  count = 0
  uploadSampleNames = []

  for sample in fastaHash:
    meta = sample.split("/")
    uploadSample = "/".join(meta[:-1]).split("|")[0][:45]
    if uploadSample in uploadSampleNames:
      continue
    else:
      uploadSampleNames.append(uploadSample)
    if uploadSample in dbHash:
      uploadSequences[uploadSample] = fastaHash[sample]["sequence"]
    uploadSubsample = ""
    uploadExternal = ""
    uploadPathogen = "Respiratory Syncytial Virus"
    uploadType = "virus"
    uploadLineage = ""
    uploadFacility = ""
    uploadLocation = ""
    uploadCollectionDate = ""
    uploadSequenceDate= ""
    uploadAdditionalMetadata = {}

    # collect non-AZ
    if meta[0].lower() == "hrsv":
      if len(meta) <= 5:
        continue
      #print(meta)
      uploadSubsample = meta[3].upper()
      uploadExternal = meta[4].split("|")[1].upper()
      uploadLineage = meta[1].upper()
      uploadLocation = meta[2]
      try:
        uploadCollectionDate = datetime.strptime(meta[4].split("|")[-1], "%Y-%m-%d")
      except:
        try:
          uploadCollectionDate = datetime.strptime(meta[4].split("|")[-1], "%Y-%m")
        except:
          uploadCollectionDate = datetime.strptime(meta[4].split("|")[-1], "%Y")
          print(uploadCollectionDate)

    # collect AZ
    else:
      uploadSubsample = re.findall("TG\d+", sample)[0]
      uploadExternal = uploadSubsample
      uploadLineage = meta[-1].split("_")[1].upper()
      uploadLocation = "Arizona"
      try:
        uploadCollectionDate = datetime.strptime(meta[0].split("|")[-1], "%Y-%m-%d")
      except:
        try:
          uploadCollectionDate = datetime.strptime(meta[0].split("|")[-1], "%Y-%m")
        except:
          uploadCollectionDate = datetime.strptime(meta[0].split("|")[-1], "%Y")

    uploadObj = list(map(lambda x: x if x else None, [uploadSample, uploadSubsample, uploadExternal, uploadPathogen, uploadType, uploadLineage, uploadFacility, uploadLocation, str(uploadCollectionDate), str(uploadSequenceDate), json.dumps(uploadAdditionalMetadata)]))
    if sample not in dbHash:
      uploadHash["new"].append(uploadObj)
    else:
      uploadHash["update"].append(uploadObj)

  print("... file written to " + wd + "epitools_pathogen_upload.json")
  write(wd + "epitools_pathogen_upload.json", json.dumps(uploadHash))

  print("... file written to " + wd + "epitools_sequences.json")
  write(wd + "epitools_sequences.json", json.dumps(uploadSequences))

if __name__ == '__main__':
    main()
