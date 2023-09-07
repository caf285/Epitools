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
  googleHash = {}
  for line in google:
    if re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper()):
      googleHash[re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper())[0]] = line
    if re.findall("TG\d+", line[googleHeader.index("subsample_ID")].upper()):
      googleHash[re.findall("TG\d+", line[googleHeader.index("subsample_ID")].upper())[0]] = line

  ### open and hash db
  db = json.load(open(wd + "epitools_pathogen.json"))
  dbHeader = list(db[0].keys())
  dbHash = {}
  for line in db:
    if line["Sample"]:
      dbHash[line["Sample"]] = list(line.values())
  #for sample in list(filter(lambda x: dbHash[x][dbHeader.index("Pathogen")] == "Group A Strep" and x not in googleHash.keys(), dbHash.keys())):
  #  print(sample, dbHash[sample])
  #print(len(list(filter(lambda x: dbHash[x][dbHeader.index("Pathogen")] == "Group A Strep" and x not in googleHash.keys(), dbHash.keys()))))

  ### open readPairs
  rpHash = json.load(open(wd + "readPairs_locations.json"))

  ### get all reference files
  references = os.listdir(pd + "templates/assemblies")

  ### open template
  config = read(pd + "templates/NASP/config.xml").split("=====")

  #==================================================( NASP )
  ### get samples per emm-type
  emmHash = {}
  for sample in list(filter(lambda x: re.findall("emm\d+", googleHash[x][googleHeader.index("emm-type")]) and x in rpHash, googleHash)):
    if "-a" in sys.argv or "--all" in sys.argv or dbHash[sample][dbHeader.index("Sequence")] == "0":
      if googleHash[sample][googleHeader.index("emm-type")] not in emmHash:
        emmHash[googleHash[sample][googleHeader.index("emm-type")]] = []
      emmHash[googleHash[sample][googleHeader.index("emm-type")]].append(sample)

  # TODO: only run samples with no sequences in the DB || allow user to force emm-types
  ### symlink all samples and fill template
  emm = False
  for emm in emmHash:
    if list(filter(lambda x: emm + "_" in x, references)):
      reference = list(filter(lambda x: emm + "_" in x, references))[0]
      configRunName = emm
      configOutputFolder = pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/output"
      configReferenceName = reference.split(".fasta")[0]
      configReferencePath = pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/reference/" + reference
      configFiles = ["\t\t\t\t<ReadFolder path='" + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/samples'>"]
      if not os.path.isdir(pd + "analysis/" + str(datetime.date.today())):
        os.mkdir(pd + "analysis/" + str(datetime.date.today()))
      if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP"):
        os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP")
      if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm):
        os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm)
      if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/reference"):
        os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/reference")
      subprocess.Popen("ln -sf " + pd + "templates/assemblies/" + reference + " " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/reference/" + reference, universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
      for sample in emmHash[emm]:
        configFiles.append("\t\t\t\t\t\t<ReadPair sample='" + sample + "'>")
        configFiles.append("\t\t\t\t\t\t\t\t<Read1Filename>" + sample + "_R1.fastq.gz</Read1Filename>")
        configFiles.append("\t\t\t\t\t\t\t\t<Read2Filename>" + sample + "_R2.fastq.gz</Read2Filename>")
        configFiles.append("\t\t\t\t\t\t</ReadPair>")
        if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/samples"):
          os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/samples")
        subprocess.Popen("ln -sf " + rpHash[sample][0] + " " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/samples/" + sample + "_R1.fastq.gz", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
        subprocess.Popen("ln -sf " + rpHash[sample][1] + " " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/samples/" + sample + "_R2.fastq.gz", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
      configFiles.append("\t\t\t\t</ReadFolder>")
      configFiles = "\n".join(configFiles)
      configOut = "\n".join([config[0] + configRunName + config[1] + configOutputFolder + config[2] + configReferenceName + config[3] + configReferencePath + config[4], configFiles, config[5]])
      write(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/" + emm + "-config.xml", configOut)
      print("... NASP files for " + str(len(emmHash[emm])) + " samples written to " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm)
    else:
      print("... no reference for " + emm + " in " + pd + "templates/assemblies/")

  if emm:
    print("\nBASH script to run NASp in " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/ ...\n") 
    print("module purge; module load nasp slurm; nasp --config <config file>.xml")
    print()

  ### submit all NASP runs
  userInput = ""                                                                                                                                                                                      
  while userInput.lower() not in ["y", "yes"]:
    userInput = input("submit NASP run for all emm-types [y/n]? ")
    if userInput.lower() in ["n", "no"]:
      print("... quitting")
      quit()

  if emm:
    for emm in emmHash:
      print("... submitting slurm run for " + emm + " in " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm)
      subprocess.Popen("module purge; module load nasp slurm; nasp --config " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/" + emm + "-config.xml", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()

if __name__ == '__main__':
    main()
