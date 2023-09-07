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

  ### open and hash gisaid metadata and sequences
  print("Hashing gisaid metadata and sequences. This might take a while. ...")
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

  ### open and hash db
  db = json.load(open(wd + "epitools_pathogen.json"))
  dbHeader = list(db[0].keys())
  dbHash = {}
  for line in db:
    if line["Sample"]:
      dbHash[line["Sample"]] = list(line.values())

  ### open template
  config = read(pd + "templates/NASP/fastaConfig.xml").split("=====")

  reference = "COV_WIV04.fasta"

  #==================================================( NASP )
  ### get samples per lineage
  lineageHash = {}

  # TODO: build lineageHash
  for sample in list(filter(lambda x: gisaidHash[x]["meta"][gisaidHeader.index("Pango lineage")], gisaidHash)):
    if allSamples or sample not in dbHash or dbHash[sample][dbHeader.index("Sequence")] == "0":
      if gisaidHash[sample]["meta"][gisaidHeader.index("Pango lineage")] not in lineageHash:
        lineageHash[gisaidHash[sample]["meta"][gisaidHeader.index("Pango lineage")]] = []
      lineageHash[gisaidHash[sample]["meta"][gisaidHeader.index("Pango lineage")]].append(sample)

  ### copy all samples and fill template
  lineage = False
  for lineage in lineageHash:
    configRunName = lineage
    configOutputFolder = pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage + "/output"
    configReferenceName = reference.split(".fasta")[0]
    configReferencePath = pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage + "/reference/" + reference
    configFiles = ["\t\t\t\t<AssemblyFolder path='" + pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage + "/samples'>"]
    if not os.path.isdir(pd + "analysis/" + str(datetime.date.today())):
      os.mkdir(pd + "analysis/" + str(datetime.date.today()))
    if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid"):
      os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid")
    if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage):
      os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage)
    if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage + "/reference"):
      os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage + "/reference")
    subprocess.Popen("ln -sf " + pd + "templates/assemblies/" + reference + " " + pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage + "/reference/" + reference, universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
    for sample in lineageHash[lineage]:
      configFiles.append("\t\t\t\t\t\t<Assembly sample='" + sample + "'>" + sample + ".fasta</Assembly>")
      if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage + "/samples"):
        os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage + "/samples")
      write(pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage + "/samples/" + sample + ".fasta", "\n".join([">" + sample] + gisaidHash[sample]["sequence"]))
    configFiles.append("\t\t\t\t</AssemblyFolder>")
    configFiles = "\n".join(configFiles)
    configOut = "\n".join([config[0] + configRunName + config[1] + configOutputFolder + config[2] + configReferenceName + config[3] + configReferencePath + config[4], configFiles, config[5]])
    write(pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage + "/" + lineage + "-config.xml", configOut)
    print("... NASP files for " + str(len(lineageHash[lineage])) + " samples written to " + pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage)

  if lineage:
    print("\nBASH script to run NASP in " + pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/ ...\n") 
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
      print("... submitting slurm run for " + lineage + " in " + pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage)
      subprocess.Popen("module purge; module load nasp slurm; nasp --config " + pd + "analysis/" + str(datetime.date.today()) + "/NASP_gisaid/" + lineage + "/" + lineage + "-config.xml", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()

if __name__ == '__main__':
    main()
