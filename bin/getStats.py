#!/usr/bin/env python3

import sys
import os
import subprocess

# ==================================================( functions )
def printHelp():
  print("\nreturn all samples names from GAS.tsv that have no M1%")
  print("usage: statsM1.py [-h]")
  print("example:\n\t./statsM1.py\n")
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

  # update all samples with M1 QUALITY_BREADTH data
  gas = read("/scratch/GAS/GAS.tsv").split("\n")
  header = gas.pop(0).split("\t")
  cols = {}
  for i in range(len(header)):
    cols[header[i]] = i

  print(list(filter(None, map(lambda x: x if x.split("ALL")[0] == "" else "", os.listdir("/scratch/GAS/nasp")))))
  quit()
 
  M1 = {}
  for line in gas:
    M1[line.split("\t")[0]] = line

  # get sample list of all samples > M1 80% QUALITY_BREADTH
  cutoff = 80
  DIR = "/scratch/GAS/.temp/" + sys.argv[1]
  stats = read(DIR + "/statistics/sample_stats.tsv").split("\n")[5::4]
  for line in stats:
    line = line.split("\t")
    M1[line[0]] = "\t".join(M1[line[0]].split("\t")[:cols["M1"]] + [line[-7]] + M1[line[0]].split("\t")[min(cols["M1"]+1, len(cols)):])
    if float(line[-7][:-1]) >= cutoff:
      subprocess.call("cp " + DIR + "/gatk/" + line[0] + "-bwamem-gatk.vcf /scratch/GAS/nasp/ALL/gatk/" + line[0] + "-bwamem-gatk.vcf", universal_newlines=True, shell=True, stdout=subprocess.PIPE)

  output = ["\t".join(header)]
  for index in sorted(M1.keys()):
    output.append(M1[index])
  print("\n".join(output))
  #write("/scratch/GAS/GAS.tsv", "\n".join(output) + "\n")

if __name__ == "__main__":
  main()
