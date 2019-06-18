#!/usr/bin/env python3

import sys
import os
import subprocess

# ==================================================( functions )
def printHelp():
  print("\ncreates a nasp matrix dto-file in DIR argument")
  print("usage: mkMatrix.py [-h] DIR")
  print("\tDIR\tlocation of nasp run")
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
    gas = " ".join(sys.argv[2:])

  if not os.path.exists(DIR):
    printHelp()
  else:
    DIR = os.path.abspath(DIR)

  # get all samples with no M1 data
  gas = subprocess.Popen("/scratch/GAS/bin/queryGAS.py " + gas, universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  gas = list(map(lambda x: x.split("\t")[0], gas.stdout.read().split("\n")[1:-1]))

  # get template, reference, and vcf file names
  template = read("/scratch/GAS/.templates/TEMPLATE_dto.xml").split("=====")
  vcf = subprocess.Popen("ls " + DIR + "/gatk/*-bwamem-gatk.vcf", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  vcf = vcf.stdout.read().split("\n")[:-1]

  print(vcf)
  print(gas)

  # get file list for config template
  files = []
  for sample in vcf:
    if sample.split("/")[-1].split("-bwamem-gatk.vcf")[0] in gas:
      files.append("          <vcf aligner=\"BWA-mem\" name=\"" + sample.split("/")[-1].split("-bwamem-gatk.vcf")[0] + "\" snpcaller=\"GATK\">" + os.path.abspath(sample) + "</vcf>")

  # write M1 config file
  if files:
    config = [DIR, DIR, DIR, DIR, "\n".join(files)]
    write(DIR + "/matrix_dto.xml", "".join(list(map(lambda x: "".join(list(x)), list(zip(template, config)))) + [template[-1]]))

if __name__ == "__main__":
  main()
