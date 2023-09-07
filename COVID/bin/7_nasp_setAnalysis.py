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
  #==================================================( Arguments )
  for arg in sys.argv:
    if arg.lower() in ["-h", "--help"]:
      print("help")
      quit()

  # set flag for processing all samples or just samples with missing seqence data ( defaults to just missing data )
  allSamples = False
  for arg in sys.argv:
    if arg.lower() in ["-a", "--all"]:
      allSamples = True

  #==================================================( Open Files )
  ### set directories
  wd = "/".join(sys.argv[0].split("/")[:-1]) + "/" # working directory
  pd = os.path.abspath(os.path.join(wd, os.pardir)) + "/" # parent directory
  #print(wd, pd)

  ### open and hash google sheet
  google = json.load(open(wd + "googleSheets_covidSeq_Master.json"))
  googleHeader = google.pop(0)
  # ['rna_id(tg#)', 'run_id', 'sequencing_file_name(fastq)', 'sequencing_date', 'genome_file_name(fasta)', 'pangolin_lineage', 'gisaid_epi_isl', 'sample_name', 'original_id', 'sample_id(tg#)', 'genbank_accession', 'collection_date', 'county', 'sample_source', 'institution', 'total_reads', 'aligned_reads', 'percent_aligned', 'coverage_breadth', 'average_depth', '# SNPs + INDELs (10-80%)', '# SNPs + INDELs (>=80%)', 'num_mutations', 'SNP profile', 'gisaid_variants', 'gisaid_aa_sub', 'cell_location', 'plate_name', 'precheck_plate_name', 'precheck_cell_location', 'Control Check', 'Month Invoiced']
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

  ### open readPairs
  rpHash = json.load(open(wd + "readPairs_locations.json"))

  ### open template
  config = read(pd + "templates/NASP/readConfig.xml").split("=====")

  reference = "COV_WIV04.fasta"

  #==================================================( NASP )
  ### get samples per lineage
  lineageHash = {}

  for sample in list(filter(lambda x: googleHash[x][googleHeader.index("pangolin_lineage")] and x in rpHash, googleHash)):
    if allSamples or sample not in dbHash or dbHash[sample][dbHeader.index("Sequence")] == "0":
      if googleHash[sample][googleHeader.index("pangolin_lineage")] not in lineageHash:
        lineageHash[googleHash[sample][googleHeader.index("pangolin_lineage")]] = []
      lineageHash[googleHash[sample][googleHeader.index("pangolin_lineage")]].append(sample)

  # TODO: only run samples with no sequences in the DB || allow user to force lineage-types
  ### symlink all samples and fill template
  lineage = False
  for lineage in lineageHash:
    configRunName = lineage
    configOutputFolder = pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage + "/output"
    configReferenceName = reference.split(".fasta")[0]
    configReferencePath = pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage + "/reference/" + reference
    configFiles = ["\t\t\t\t<ReadFolder path='" + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage + "/samples'>"]
    if not os.path.isdir(pd + "analysis/" + str(datetime.date.today())):
      os.mkdir(pd + "analysis/" + str(datetime.date.today()))
    if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP"):
      os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP")
    if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage):
      os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage)
    if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage + "/reference"):
      os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage + "/reference")
    subprocess.Popen("ln -sf " + pd + "templates/assemblies/" + reference + " " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage + "/reference/" + reference, universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
    for sample in lineageHash[lineage]:
      configFiles.append("\t\t\t\t\t\t<ReadPair sample='" + sample + "'>")
      configFiles.append("\t\t\t\t\t\t\t\t<Read1Filename>" + sample + "_R1.fastq.gz</Read1Filename>")
      configFiles.append("\t\t\t\t\t\t\t\t<Read2Filename>" + sample + "_R2.fastq.gz</Read2Filename>")
      configFiles.append("\t\t\t\t\t\t</ReadPair>")
      if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage + "/samples"):
        os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage + "/samples")
      subprocess.Popen("ln -sf " + rpHash[sample][0] + " " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage + "/samples/" + sample + "_R1.fastq.gz", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
      subprocess.Popen("ln -sf " + rpHash[sample][1] + " " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage + "/samples/" + sample + "_R2.fastq.gz", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
    configFiles.append("\t\t\t\t</ReadFolder>")
    configFiles = "\n".join(configFiles)
    configOut = "\n".join([config[0] + configRunName + config[1] + configOutputFolder + config[2] + configReferenceName + config[3] + configReferencePath + config[4], configFiles, config[5]])
    write(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage + "/" + lineage + "-config.xml", configOut)
    print("... NASP files for " + str(len(lineageHash[lineage])) + " samples written to " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage)

  if lineage:
    print("\nBASH script to run NASP in " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/ ...\n") 
    print("module purge; module load nasp slurm; nasp --config <config file>.xml")
    print()

  ### submit all NASP runs
  userInput = ""                                                                                                                                                                                      
  while userInput.lower() not in ["y", "yes"]:
    userInput = input("submit NASP run for all lineages [y/n]? ")
    if userInput.lower() in ["n", "no"]:
      print("... quitting")
      quit()

  if lineage:
    for lineage in lineageHash:
      print("... submitting slurm run for " + lineage + " in " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage)
      subprocess.Popen("module purge; module load nasp slurm; nasp --config " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + lineage + "/" + lineage + "-config.xml", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()

if __name__ == '__main__':
    main()
