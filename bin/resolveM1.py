#!/usr/bin/env python3

import sys
import os
import subprocess

# ==================================================( functions )
def printHelp():
  print("\nreturn all samples names from GAS.tsv that have no M1%")
  print("usage: resolveM1.py [-h]")
  print("example:\n\t./resolveM1.py\n")
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

  # get all samples with no M1 data
  gas = read("/scratch/GAS/GAS.tsv").split("\n")
  header = gas.pop(0).split("\t")
  cols = {}
  for i in range(len(header)):
    cols[header[i]] = i
  M1 = {}
  for sample in gas:
    sample = sample.split("\t")
    if sample[cols["M1"]] == "-":
      if sample[cols["Path"]] not in M1:
        M1[sample[cols["Path"]]] = []
      M1[sample[cols["Path"]]].append(sample)

  # create temporary M1 directory and run nasp for vcf files
  DIR = "/scratch/GAS/.temp/"
  template = read("/scratch/GAS/.templates/TEMPLATE-M1-config.xml").split("=====")
  ref = subprocess.Popen("ls /scratch/GAS/reference/M1-*", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  ref = ref.stdout.read().split("\n")[0].split("/")[-1].split(".fasta")[0]

  # get file list for config template
  files = []
  for path in M1:
    files.append("        <ReadFolder path=\"" + path + "\">")
    for sample in M1[path]:
      files.append("            <ReadPair sample=\"" + sample[cols["SampleName"]] + "\">")
      files.append("                <Read1Filename>" + sample[cols["R1"]] + "</Read1Filename>")
      files.append("                <Read2Filename>" + sample[cols["R2"]] + "</Read2Filename>")
      files.append("            </ReadPair>")
    files.append("        </ReadFolder>")

  # write M1 config file
  config = ["M1", "M1", ref, ref, "\n".join(files)]
  write(DIR + "M1-config.xml", "".join(list(map(lambda x: "".join(list(x)), list(zip(template, config)))) + [template[-1]]))

if __name__ == "__main__":
  main()
