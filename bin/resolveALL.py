#!/usr/bin/env python3

import sys
import os
import subprocess

# ==================================================( functions )
def printHelp():
  print("\nrun nasp on all samples from GAS.tsv that have M1% > 80% AND no other data")
  print("usage: resolveALL.py [-h]")
  print("example:\n\t./resolveALL.py\n")
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

  # get all samples with > 80% M1 and no other Mtype data
  gas = read("/scratch/GAS/GAS.tsv").split("\n")
  header = gas.pop(0).split("\t")
  cols = {}
  for i in range(len(header)):
    cols[header[i]] = i
  samples = {}
  Mtypes = subprocess.Popen("ls /scratch/GAS/nasp", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  Mtypes = Mtypes.stdout.read().split("\n")[:-1]
  while "M1" in Mtypes:
    Mtypes.remove("M1")

  for line in gas:
    line = line.split("\t")
    if float(line[cols["M1"]][:-1]) > 80:
      if "-" in line[cols["M1"]+1:]:
        samples[line[0]] = line

  # create temporary M1 directory and run nasp for vcf files
  DIR = "/scratch/GAS/.temp/"
  template = read("/scratch/GAS/.templates/TEMPLATE-config.xml").split("=====")

  # make nasp config file per emm type
  for sampleName in samples:
    #print(sampleName, samples[sampleName][cols["M1"]])
    os.mkdir(DIR + "/" + sampleName)
    for index in Mtypes:
      if samples[sampleName][cols[index]] == "-":
        os.mkdir(DIR + "/" + sampleName + "/" + index)
        ref = subprocess.Popen("ls /scratch/GAS/reference/" + index + "-*", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
        ref = ref.stdout.read().split("\n")[0].split("/")[-1].split(".fasta")[0]
        config = [index, sampleName + "/" + index + "/nasp", ref, ref, samples[sampleName][cols["Path"]], samples[sampleName][cols["R1"]], samples[sampleName][cols["R2"]]]
        write(DIR + "/" + sampleName + "/" + index + "/" + index + "-config.xml", "".join(list(map(lambda x: "".join(list(x)), list(zip(template, config)))) + [template[-1]]))

if __name__ == "__main__":
  main()
