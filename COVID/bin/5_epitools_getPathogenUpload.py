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
  google = json.load(open(wd + "googleSheets_covidSeq_Master.json"))
  googleHeader = google.pop(0)
  # ['rna_id(tg#)', 'run_id', 'sequencing_file_name(fastq)', 'sequencing_date', 'genome_file_name(fasta)', 'pangolin_lineage', 'gisaid_epi_isl', 'sample_name', 'original_id', 'sample_id(tg#)', 'genbank_accession', 'collection_date', 'county', 'sample_source', 'institution', 'total_reads', 'aligned_reads', 'percent_aligned', 'coverage_breadth', 'average_depth', '# SNPs + INDELs (10-80%)', '# SNPs + INDELs (>=80%)', 'num_mutations', 'SNP profile', 'gisaid_variants', 'gisaid_aa_sub', 'cell_location', 'plate_name', 'precheck_plate_name', 'precheck_cell_location', 'Control Check', 'Month Invoiced'
  googleHash = {}
  for line in google:
    # ['TG1253830', 'TGN-NextSeq0428', 'TGen-CoV-AZ-Tiled-TG1253830', '2022-03-07', '/labs/COVIDseq/TGenAssemblies_gapfilled/TGen-CoV-AZ-Tiled-TG1253830_gapfilled.fasta', 'BA.1.1', 'EPI_ISL_10827371', '65973691', '119952255231', 'TG1219666', '', '2022-02-04', 'Coconino', '', 'Tuba City Regional Healthcare Corporation - Sonora Quest Laboratories', '1,233,969', '1,201,129.00', '97.34', '99.76', '5074.52', '4', '95', '', '', '', '', 'A1', 'p618', 'loc@1102480', 'B8', 'PASS', 'March 2022']
    if re.findall("TG\d+", line[googleHeader.index("rna_id(tg#)")].upper()):
      googleHash[re.findall("TG\d+", line[googleHeader.index("rna_id(tg#)")].upper())[0]] = line

  ### open and hash db
  db = json.load(open(wd + "epitools_pathogen.json"))
  dbHeader = list(db[0].keys())
  dbHash = {}
  for line in db:
    if line["Sample"]:
      dbHash[line["Sample"]] = list(line.values())

  #==================================================( Upload Missing Data to DB )
  ### get ['Sample', 'Subsample', 'External', 'Pathogen', 'Lineage', 'Facility', 'Location', 'Collection_date', 'Sequence_date', 'Reference', 'Additional_metadata'] from google sheet
  uploadHash = {"new": [], "update": []}
  for sample in googleHash:
    uploadSample = googleHash[sample][googleHeader.index("rna_id(tg#)")]
    uploadSubsample = googleHash[sample][googleHeader.index("sample_id(tg#)")]
    uploadExternal = googleHash[sample][googleHeader.index("gisaid_epi_isl")]
    uploadPathogen = "SARS-CoV-2"
    uploadLineage = googleHash[sample][googleHeader.index("pangolin_lineage")]
    uploadFacility = googleHash[sample][googleHeader.index("institution")]
    uploadLocation = googleHash[sample][googleHeader.index("county")]
    try:
      uploadCollectionDate = datetime.strptime(googleHash[sample][googleHeader.index("collection_date")].split(" ")[0].split(",")[0].strip(), "%Y-%m-%d")
    except:
      try:
        uploadCollectionDate = datetime.strptime(googleHash[sample][googleHeader.index("collection_date")].split(" ")[0].split(",")[0].strip(), "%Y-%m-%d")
      except:
        uploadCollectionDate = ""
        print("wrong date format", sample, googleHash[sample][googleHeader.index("collection_date")])
    try:
      uploadSequenceDate = datetime.strptime(googleHash[sample][googleHeader.index("sequencing_date")].split(" ")[0].split(",")[0].strip(), "%Y-%m-%d")
    except:
      try:
        uploadSequenceDate = datetime.strptime(googleHash[sample][googleHeader.index("sequencing_date")].split(" ")[0].split(",")[0].strip(), "%Y-%m-%d")
      except:
        uploadSequenceDate = ""
        print("wrong date format", sample, googleHash[sample][googleHeader.index("sequencing_date")])
    uploadAdditionalMetadata = {}
    for head in googleHeader:
      if googleHash[sample][googleHeader.index(head)]:
        uploadAdditionalMetadata[head] = googleHash[sample][googleHeader.index(head)]
    uploadObj = list(map(lambda x: x if x else None, [uploadSample, uploadSubsample, uploadExternal, uploadPathogen, uploadLineage, uploadFacility, uploadLocation, str(uploadCollectionDate), str(uploadSequenceDate), json.dumps(uploadAdditionalMetadata)]))
    if sample not in dbHash:
      uploadHash["new"].append(uploadObj)
    else:
      uploadHash["update"].append(uploadObj)

  write(wd + "epitools_pathogen_upload.json", json.dumps(uploadHash))
  print("... DB upload JSON package written to " + wd + "epitools_pathogen_upload.json")

if __name__ == '__main__':
    main()
