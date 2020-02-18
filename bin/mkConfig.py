#!/usr/bin/env python3

import sys
import os
import subprocess
import string
import random

# ==================================================( functions )
def printHelp():
  print("\ncreates a NASP config file in /scratch/GAS/.temp/<ref>-<rand>-config.xml")
  print("<rand>:\t10 digit alpha numeric string")
  print("<ref>:\treference file name")
  print("usage: mkConfig.py [-h] REFERENCE SAMPLE GAS")
  print("\tREFERENCE\tNasp run reference file")
  print("\tSAMPLE\tname of the reference sample")
  print("\tGAS\tqueryGAS.py arguments")
  print("example:\n\t./mkConfig.py /scratch/GAS/reference/M1::TG92300.fasta TG92300 -m 80\n")
  exit(0)

def read(fileName):
  f = open(fileName, 'r')
  file = f.read().strip()
  f.close
  return file

def write(fileName, output):
  f = open(fileName, 'w')
  f.write(output)
  f.close()

# ==================================================( main )
def main():

  # check args
  # fill dictionary for all accepted args
  if "-h" in sys.argv or len(sys.argv) < 2:
    printHelp()
  else:
    ref = sys.argv[1]
    refSample = sys.argv[2]
    tsv = sys.argv[3]
    samples = sys.argv[4:]

  if not os.path.exists(ref):
    printHelp()
  else:
    ref = ref.split("/")[-1].split(".fasta")[0]
    gatk = list(map(lambda x: x.split("-bwamem-gatk")[0], list(filter(lambda x: len(x.split(".vcf")) == 2 and x.split(".vcf")[-1] == "", os.listdir("/scratch/GAS/nasp/" + ref + "/gatk/")))))

  # get all samples
  gas = list(map(lambda x: x.split("\t"), read(tsv).strip().split("\n")))
  header = gas.pop(0)
  refIndex = header.index(refSample)

  # create temporary M1 directory and run nasp for vcf files
  randStr = "".join(random.choice(string.ascii_lowercase) for i in range(10))
  DIR = "/scratch/GAS/.temp/"
  template = read("/scratch/GAS/.templates/TEMPLATE-config.xml").split("=====")

  # get file list for config template
  files = []

  for line in list(filter(lambda x: x[0] not in gatk and x[0] in samples, gas)):
    files.append("        <ReadFolder path=\"" + "/".join(line[3].split("/")[:-1]) + "/\">")
    files.append("            <ReadPair sample=\"" + line[0] + "\">")
    files.append("                <Read1Filename>" + line[2] + "</Read1Filename>")
    files.append("                <Read2Filename>" + line[3] + "</Read2Filename>")
    files.append("            </ReadPair>")
    files.append("        </ReadFolder>")

  # write M1 config file
  if files:
    config = [ref + "-" + randStr, ref + "-" + randStr, ref, ref, "\n".join(files)]
    print(ref + "-" + randStr + "-config.xml")

    write(DIR + ref + "-" + randStr + "-config.xml", "".join(list(map(lambda x: "".join(list(x)), list(zip(template, config)))) + [template[-1]]))
    #subprocess.call("module load nasp; nasp --config " + DIR + ref + "-" + randStr + "-config.xml", universal_newlines=True, shell=True)

if __name__ == "__main__":
  main()