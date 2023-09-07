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
  googleHash = {}
  for line in google:
    if re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper()):
      googleHash[re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper())[0]] = line

  ### open and hash db
  db = json.load(open(wd + "epitools_pathogen.json"))
  dbHeader = list(db[0].keys())
  print(dbHeader)
  dbHash = {}
  for line in db:
    if line["Sample"]:
      dbHash[line["Sample"]] = list(line.values())

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
    if googleHash[sample][googleHeader.index("emm-type")] not in emmHash:
      emmHash[googleHash[sample][googleHeader.index("emm-type")]] = []
    emmHash[googleHash[sample][googleHeader.index("emm-type")]].append(sample)

  # TODO: only run samples with no sequences in the DB || allow user to force emm-types
  ### symlink all samples and fill template
  emm = "emm49"
  emm_3month = []
  emm_6month = []
  emm_dec2019 = []
  emm_dec2020 = []
  emm_june2019 = []
  delta_3month = datetime.datetime.today() - datetime.timedelta(days=90)
  print("3month", delta_3month)
  delta_6month = datetime.datetime.today() - datetime.timedelta(days=250)
  print("6month", delta_6month)
  delta_dec2020 = datetime.datetime.today() - datetime.timedelta(days=707)
  print("dec2020", delta_dec2020)
  delta_dec2019 = datetime.datetime.today() - datetime.timedelta(days=1073)
  print("dec2019", delta_dec2019)
  delta_june2019 = datetime.datetime.today() - datetime.timedelta(days=1256)
  print("june2019", delta_june2019)
  delta_aug2019 = datetime.datetime.today() - datetime.timedelta(days=1195)
  print("aug2019", delta_aug2019)

  for sample in emmHash[emm]:
    date = datetime.datetime.strptime(dbHash[sample][dbHeader.index("Collection_date")], "%Y-%m-%d %H:%M:%S")
    if date > delta_3month:
      emm_3month.append(sample)
    if date > delta_6month:
      emm_6month.append(sample)
    if date > delta_dec2020:
      emm_dec2020.append(sample)
    if date > delta_dec2019:
      emm_dec2019.append(sample)
    if delta_aug2019 > date > delta_june2019:
      emm_june2019.append(sample)
    

  print("3month", str(len(emm_3month)))
  print("6month", str(len(emm_6month)))
  print("dec2020", str(len(emm_dec2020)))
  print("dec2019", str(len(emm_dec2019)))
  print("june2019", str(len(emm_june2019)))
  emmSetHash = {"emm_3month": emm_3month, "emm_6month": emm_6month, "emm_dec2020": emm_dec2020, "emm_dec2019": emm_dec2019, "emm_june2019": emm_june2019, }

  for emmSet in emmSetHash:
    if list(filter(lambda x: emm + "_" in x, references)):
      reference = list(filter(lambda x: emm + "_" in x, references))[0]
      configRunName = emm
      configOutputFolder = pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/" + emmSet
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
      for sample in emmSetHash[emmSet]:
        newSample = "-".join("__".join([sample, dbHash[sample][dbHeader.index("Location")], dbHash[sample][dbHeader.index("Collection_date")], dbHash[sample][dbHeader.index("External")]]).split(" "))
        for st in ["(", ")", "'", "`"]:
          newSample = "".join(newSample.split(st))
        configFiles.append("\t\t\t\t\t\t<ReadPair sample='" + newSample + "'>")
        configFiles.append("\t\t\t\t\t\t\t\t<Read1Filename>" + newSample + "_R1.fastq.gz</Read1Filename>")
        configFiles.append("\t\t\t\t\t\t\t\t<Read2Filename>" + newSample + "_R2.fastq.gz</Read2Filename>")
        configFiles.append("\t\t\t\t\t\t</ReadPair>")
        if not os.path.isdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/samples"):
          os.mkdir(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/samples")
        subprocess.Popen("ln -sf " + rpHash[sample][0] + " " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/samples/" + newSample + "_R1.fastq.gz", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
        subprocess.Popen("ln -sf " + rpHash[sample][1] + " " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/samples/" + newSample + "_R2.fastq.gz", universal_newlines=True, shell=True, stdout=subprocess.PIPE).stdout.read()
      configFiles.append("\t\t\t\t</ReadFolder>")
      configFiles = "\n".join(configFiles)
      configOut = "\n".join([config[0] + configRunName + config[1] + configOutputFolder + config[2] + configReferenceName + config[3] + configReferencePath + config[4], configFiles, config[5]])
      write(pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm + "/" + emmSet + "-config.xml", configOut)
      print("... NASP files for " + str(len(emmHash[emm])) + " samples written to " + pd + "analysis/" + str(datetime.date.today()) + "/NASP/" + emm)
    else:
      print("... no reference for " + emm + " in " + pd + "templates/assemblies/")


if __name__ == '__main__':
    main()
