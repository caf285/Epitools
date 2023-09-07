#!/usr/bin/env python

#==================================================( Imports and Functions )
### import
import sys
import os
import re
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

def main():
  #==================================================( Open Files )
  ### set directories
  wd = "/".join(sys.argv[0].split("/")[:-1]) + "/" # working directory
  pd = os.path.abspath(os.path.join(wd, os.pardir)) + "/" # parent directory

  ### open and hash google sheet
  google = json.load(open(wd + "googleSheets_allGas_Historic.json"))
  googleHeader = google.pop(0)
  googleHeader = google.pop(0)
  googleHash = {}
  for line in google:
    if re.findall("TG\d+", line[googleHeader.index("Isolate Barcode")].upper()):
      googleHash[re.findall("TG\d+", line[googleHeader.index("Isolate Barcode")].upper())[0]] = line

  ### open and hash db
  db = json.load(open(wd + "epitools_pathogen.json"))
  dbHeader = list(db[0].keys())
  dbHash = {}
  for line in db:
    if line["Sample"]:
      dbHash[line["Sample"]] = list(line.values())

  ### open and hash read pairs
  rpHash = json.load(open(wd + "readPairs_historic_locations.json"))

  #==================================================( Upload Missing Data to DB )
  ### get ['Sample', 'Subsample', 'External', 'Pathogen', 'Lineage', 'Facility', 'Location', 'Collection_date', 'Sequence_date', 'Reference', 'Additional_metadata'] from google sheet
  uploadHash = {"new": [], "update": []}
  for sample in list(filter(lambda x: x in rpHash, googleHash)):
    uploadSample = googleHash[sample][googleHeader.index("Isolate Barcode")]
    uploadSubsample = googleHash[sample][googleHeader.index("DNA \nBarcode")]
    uploadExternal = googleHash[sample][googleHeader.index("DNA \nBarcode")]
    uploadPathogen = "Group A Strep"
    uploadType = "bacteria"
    uploadLineage = googleHash[sample][googleHeader.index("emm-type")]
    uploadFacility = googleHash[sample][googleHeader.index("Original\nfacility source")]
    uploadLocation = googleHash[sample][googleHeader.index("City")]
    try:
      uploadCollectionDate = datetime.strptime(googleHash[sample][googleHeader.index("Date collected from patient")].split(" ")[0].split(",")[0].strip(), "%m/%d/%Y")
    except:
      try:
        uploadCollectionDate = datetime.strptime(googleHash[sample][googleHeader.index("Date collected from patient")].split(" ")[0].split(",")[0].strip(), "%m/%d/%y")
      except:
        uploadCollectionDate = ""
        print("wrong date format", sample, googleHash[sample][googleHeader.index("Date collected from patient")])
    try:
      uploadSequenceDate = datetime.strptime(googleHash[sample][googleHeader.index("Sequence date")].split(" ")[0].split(",")[0].strip(), "%m/%d/%Y")
    except:
      try:
        uploadSequenceDate = datetime.strptime(googleHash[sample][googleHeader.index("Sequence date")].split(" ")[0].split(",")[0].strip(), "%m/%d/%y")
      except:
        uploadSequenceDate = ""
        print("wrong date format", sample, googleHash[sample][googleHeader.index("Sequence date")])
    uploadAdditionalMetadata = {}
    for head in googleHeader:
      if googleHash[sample][googleHeader.index(head)]:
        uploadAdditionalMetadata[head] = googleHash[sample][googleHeader.index(head)]
    uploadObj = list(map(lambda x: x if x else None, [uploadSample, uploadSubsample, uploadExternal, uploadPathogen, uploadType, uploadLineage, uploadFacility, uploadLocation, str(uploadCollectionDate), str(uploadSequenceDate), json.dumps(uploadAdditionalMetadata)]))
    if sample not in dbHash:
      uploadHash["new"].append(uploadObj)
    else:
      uploadHash["update"].append(uploadObj)

  write(wd + "epitools_pathogen_upload.json", json.dumps(uploadHash))
  print("... DB upload JSON package written to " + wd + "epitools_pathogen_upload.json")

if __name__ == '__main__':
    main()
