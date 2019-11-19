#!/usr/bin/env python3

import sys
import os
import subprocess
import json

# ==================================================( functions )
def printHelp():
  print("\ncreates a nasp matrix dto-file in DIR argument")
  print("usage: mkMatrix.py [-h] DIR [allRef]")
  print("\tDIR\tlocation of nasp run")
  print("\t[allRef]\toptional queryGAS.py arguments")
  print("example:\n\t./mkMatrix.py /scratch/GAS/nasp/All/")
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

def append(fileName, output):
  f = open(fileName, 'a')
  f.write(output + "\n")
  f.close()

# ==================================================( main )
def main():

  # check args
  if "-h" in sys.argv or len(sys.argv) < 2:
    printHelp()
  else:
    DIR = sys.argv[1]
    allRef = sys.argv[2:]

  if not os.path.exists(DIR):
    printHelp()
  else:
    DIR = os.path.abspath(DIR)

  # get template and vcf file names
  template = read("/scratch/GAS/.templates/TEMPLATE_dto.xml").split("=====")
  vcf = list(map(lambda x: x.split("-bwamem-gatk.vcf")[0], filter(lambda x: x.split("-bwamem-gatk")[-1] == ".vcf", os.listdir(DIR + "/gatk/"))))
  print(vcf)

  # reduce by VCF files in gatk
  sample = DIR.split("::")[-1]
  if allRef:
    allRef = allRef[0]
    clade = subprocess.Popen("/scratch/GAS/bin/parseNWK.py -c /scratch/GAS/nasp/ALL::" + allRef + "/matrices/tree.nwk", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
    clade = json.loads(clade.stdout.read())
    clade = list(filter(lambda x: sample in x, clade))[0]
    vcf = list(filter(lambda x: x in clade, vcf))
    print(vcf)
  # reduce VCF by GAS.tsv
  # TODO: change gas read file to temp created by query
  gas = list(map(lambda x: x.split("\t")[0], read("/scratch/GAS/GAS.tsv").strip().split("\n")[1:]))
  print(gas)
  vcf = list(filter(lambda x: x in gas, vcf))
  print()
  print(vcf)
  if vcf == []:
    vcf = [sample]

  # get file list for config template
  files = []
  for sample in vcf:
    files.append("          <vcf aligner=\"BWA-mem\" name=\"" + sample + "\" snpcaller=\"GATK\">" + DIR + "/gatk/" + sample + "-bwamem-gatk.vcf</vcf>")

  # write M1 config file
  if allRef:
    config = [DIR + "/" + allRef + "/reference/reference.fasta", DIR + "/" + allRef + "/matrices", DIR + "/" + allRef + "/statistics", DIR + "/" + allRef + "/reference/duplicates.txt", "\n".join(files)]
    write(DIR + "/" + allRef + "_dto.xml", "".join(list(map(lambda x: "".join(list(x)), list(zip(template, config)))) + [template[-1]]))
  else:
    config = [DIR + "/reference/reference.fasta", DIR + "/matrices", DIR + "/statistics", DIR + "/reference/duplicates.txt", "\n".join(files)]
    write(DIR + "/matrix_dto.xml", "".join(list(map(lambda x: "".join(list(x)), list(zip(template, config)))) + [template[-1]]))

if __name__ == "__main__":
  main()
