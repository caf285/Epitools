#!/usr/bin/env python

#==================================================( Imports and Functions )
### i/o
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

  ### get gisaid metadata and sequences
  gisaidSequences = read("/scratch/bvan-tassel/gisaid_api_downloads/gisaid.fasta").split(">")[1:]
  gisaidHash = {}
  for seq in list(map(lambda x: x.split("\n"), gisaidSequences)):
    seqName = "-".join(seq[0].split("hCoV-19/USA/")[-1].split("-")[1:]).split("/")[0]
    if not seqName:
      seqName = "-".join(seq[0].split("hCoV-19/USA/")[-1].split("_")[1:]).split("/")[0]
    if not seqName:
      continue
    if seqName not in gisaidHash:
      gisaidHash[seqName] = {}
    gisaidHash[seqName]["sequence"] = seq[1:]
    gisaidHash[seqName]["meta"] = []

  gisaidMeta = list(map(lambda x: x.split("\t"), read("/scratch/bvan-tassel/gisaid_api_downloads/gisaid_meta.tsv").split("\n")))
  gisaidHeader = gisaidMeta.pop(0)
  print("gisaidHeader:", gisaidHeader)
  # ['Virus name', 'Type', 'Accession ID', 'Collection date', 'Location', 'Additional location information', 'Sequence length', 'Host', 'Patient age', 'Gender', 'Clade', 'Pango lineage', 'Pangolin version', 'Variant', 'AA Substitutions', 'Submission date', 'Is reference?', 'Is complete?', 'Is high coverage?', 'Is low coverage?', 'N-Content', 'GC-Content']
  # ['hCoV-19/USA/AZ-TG816851/2021', 'betacoronavirus', 'EPI_ISL_8333473', '2021-03-27', 'North America / USA / Arizona / Maricopa County', '', '29865', 'Human', '', '', 'GR', 'B.1.1.519', 'PLEARN-v1.18', '', '(NSP4_T492I,NSP3_P141S,Spike_D614G,NSP12_P323L,NSP12_A526V,NSP6_I49V,Spike_P681H,NS8_A51V,Spike_T478K,NSP9_T35I,N_G204R,N_R203K,Spike_T732A)', '2022-01-04', 'FALSE', 'TRUE', 'False', '', '0.14796584630838774', '0.3816316906390002']
  misMatchWarning = False
  for seq in gisaidMeta:
    seqName = "-".join(seq[gisaidHeader.index("Virus name")].split("hCoV-19/USA/")[-1].split("-")[1:]).split("/")[0]
    if not seqName: # possible "AZ_" rather than "AZ-"
      seqName = "-".join(seq[gisaidHeader.index("Virus name")].split("hCoV-19/USA/")[-1].split("_")[1:]).split("/")[0]
    if not seqName:
      print("seqName error:", seq)
      continue
    if seqName not in gisaidHash:
      if misMatchWarning == False:
        misMatchWarning = True
        print("... Printing metadata names with no sequences")
      print("metadata name:", seqName, seq)
      continue
    gisaidHash[seqName]["meta"] = seq

  ### remove sequences with no metadata
  misMatchWarning = False
  err = []
  for seq in gisaidHash:
    if gisaidHash[seqName]["meta"] == []:
      if misMatchWarning == False:
        misMatchWarning = True
        print("... Printing sequence names with no metadata")
      print("sequence name:", seq)
      err.append(seq)
  for seq in err:
    gisaidHash.pop(seq)

  locationHash = {"apache": "apache", "coshice": "cochise", "coconino": "coconino", "gila": "gila", "graham": "graham", "greenlee": "greenlee", "la paz": "la paz", "maricopa": "maricopa", "mohave": "mohave", "navajo": "navajo", "pima": "pima", "pinal": "pinal", "santa cruz": "santa cruz", "yavapai": "yavapai", "yuma": "yuma", "phoenix": "maricopa", "san luis": "yuma", "tuscon": "pima"}

  ### get new/updated metadata
  uploadHash = {"new": [], "update": []}
  count = 0
  for sample in gisaidHash:
    uploadSample = sample
    uploadSubsample = gisaidHash[sample]["meta"][gisaidHeader.index("Virus name")]
    uploadExternal = gisaidHash[sample]["meta"][gisaidHeader.index("Accession ID")]
    uploadPathogen = "SARS-CoV-2"
    uploadType = "virus"
    uploadLineage = gisaidHash[sample]["meta"][gisaidHeader.index("Pango lineage")]
    uploadFacility = gisaidHash[sample]["meta"][gisaidHeader.index("Additional location information")]
    uploadLocation = gisaidHash[sample]["meta"][gisaidHeader.index("Location")].split("/")[-1].strip().lower()
    uploadLocationBool = False
    for location in locationHash.keys():
      if location in uploadLocation:
        uploadLocationBool = True
        uploadLocation = locationHash[location].title()
    if uploadLocationBool == False:
      uploadLocation = ""
    try:
      uploadCollectionDate = datetime.strptime(gisaidHash[sample]["meta"][gisaidHeader.index("Collection date")], "%Y-%m-%d")
    except:
      try:
        uploadCollectionDate = datetime.strptime(gisaidHash[sample]["meta"][gisaidHeader.index("Collection date")], "%Y-%m")
      except:
        uploadCollectionDate = datetime.strptime(gisaidHash[sample]["meta"][gisaidHeader.index("Collection date")], "%Y")
        #print(gisaidHash[sample]["meta"][gisaidHeader.index("Collection date")], datetime.strptime(gisaidHash[sample]["meta"][gisaidHeader.index("Collection date")], "%Y"))
    uploadSequenceDate = ""
    uploadAdditionalMetadata = {}
    for head in gisaidHeader:
      if gisaidHash[sample]["meta"][gisaidHeader.index(head)]:
        uploadAdditionalMetadata[head] = gisaidHash[sample]["meta"][gisaidHeader.index(head)]
    uploadObj = list(map(lambda x: x if x else None, [uploadSample, uploadSubsample, uploadExternal, uploadPathogen, uploadType, uploadLineage, uploadFacility, uploadLocation, str(uploadCollectionDate), str(uploadSequenceDate), json.dumps(uploadAdditionalMetadata)]))
    if sample not in dbHash:
      pass
      #print(uploadObj)
      #uploadHash["new"].append(uploadObj)
    else:
      #print(uploadObj)
      uploadHash["update"].append(uploadObj)
  print("... file written to " + wd + "gisaid_upload.json")
  write(wd + "gisaid_upload.json", json.dumps(uploadHash))

if __name__ == '__main__':
    main()
