#!/usr/bin/env python3

import sys
import os
import subprocess

# ==================================================( functions )
def printHelp():
  print("\nget all M1 vcf files and make nasp matrix file")
  print("usage: matrixM1.py [-h]")
  print("example:\n\t./matrixM1.py\n")
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
  if "-h" in sys.argv:
    printHelp()

  # get template, reference, and vcf file names
  template = read("/scratch/GAS/.templates/TEMPLATE_M1_dto.xml").split("=====")
  ref = subprocess.Popen("ls /scratch/GAS/reference/M1-*", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  ref = ref.stdout.read().split("\n")[0].split("/")[-1].split(".fasta")[0]
  vcf = subprocess.Popen("ls /scratch/GAS/nasp/M1/gatk/", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  vcf = vcf.stdout.read().split("\n")[:-1]
  M1 = {}
  for sample in vcf:
    M1[sample.split("-bwamem-gatk.vcf")[0]] = "".join(["/scratch/GAS/nasp/M1/gatk/", sample])

  # get file list for config template
  files = []
  for sample in M1:
    files.append("          <vcf aligner=\"BWA-mem\" name=\"" + sample + "\" snpcaller=\"GATK\">" + M1[sample] + "</vcf>")

  # write M1 config file
  if files:
    config = [ref, "\n".join(files)]
    write("/scratch/GAS/nasp/M1/ALL_dto.xml", "".join(list(map(lambda x: "".join(list(x)), list(zip(template, config)))) + [template[-1]]))

if __name__ == "__main__":
  main()
