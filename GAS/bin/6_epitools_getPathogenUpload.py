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
  google = json.load(open(wd + "googleSheets_allGas_Master.json"))
  googleHeader = google.pop(0)
  googleHash = {}
  for line in google:
    if re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper()):
      googleHash[re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper())[0]] = line

  ### open and hash db
  db = json.load(open(wd + "epitools_pathogen.json"))
  dbHeader = list(db[0].keys())
  dbHash = {}
  for line in db:
    if line["Sample"]:
      dbHash[line["Sample"]] = list(line.values())

  #==================================================( Upload Missing Data to DB )
  ### get ['Sample', 'Subsample', 'External', 'Pathogen', 'Lineage', 'Location', 'Collection_date', 'Sequence_date', 'Reference', 'Additional_metadata'] from google sheet
  uploadHash = {"new": [], "update": []}
  for sample in googleHash:
    uploadSample = googleHash[sample][googleHeader.index("original_sample_id")]
    uploadSubsample = googleHash[sample][googleHeader.index("subsample_ID")]
    uploadExternal = googleHash[sample][googleHeader.index("external_id")]
    uploadPathogen = "Group A Strep"
    uploadLineage = googleHash[sample][googleHeader.index("emm-type")]
    uploadLocation = googleHash[sample][googleHeader.index("Original facility source")]
    try:
      uploadCollectionDate = datetime.strptime(googleHash[sample][googleHeader.index("Date Extracted")].split(" ")[0].split(",")[0].strip(), "%m/%d/%Y")
    except:
      try:
        uploadCollectionDate = datetime.strptime(googleHash[sample][googleHeader.index("Date Extracted")].split(" ")[0].split(",")[0].strip(), "%m/%d/%y")
      except:
        uploadCollectionDate = ""
        print("wrong date format", sample, googleHash[sample][googleHeader.index("Date Extracted")])
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
    uploadObj = list(map(lambda x: x if x else None, [uploadSample, uploadSubsample, uploadExternal, uploadPathogen, uploadLineage, uploadLocation, str(uploadCollectionDate), str(uploadSequenceDate), json.dumps(uploadAdditionalMetadata)]))
    if sample not in dbHash:
      uploadHash["new"].append(uploadObj)
    else:
      uploadHash["update"].append(uploadObj)

  write(wd + "epitools_pathogen_upload.json", json.dumps(uploadHash))
  print("... DB upload JSON package written to " + wd + "epitools_pathogen_upload.json")

if __name__ == '__main__':
    main()
