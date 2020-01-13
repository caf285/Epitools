#!/usr/bin/env python3

import sys
import os
import subprocess

# ==================================================( functions )
def printHelp():
  print("\nreports the quality breadth for each readpair against a reference")
  print("usage: getStats.py [-h] NASP REF")
  print("\tNASP\tdirectory of nasp run in /scratch/GAS/.temp/")
  print("\tREF\tname of the reference sample")
  print("example:\n\t./getStats.py TG92300-f93hhs773e TG92300\n")
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
  else:
    tempDir = "/scratch/GAS/.temp/" + sys.argv[1] + "/"
    naspDir = "/scratch/GAS/nasp/ALL\:\:" + sys.argv[2] + "/"

  # read GAS.tsv and prep headers and lines for QUALITY BREADTH update
  gas = list(map(lambda x: x.split("\t"), read("/scratch/GAS/GAS.tsv").strip().split("\n")))
  header = gas.pop(0)
  refIndex = header.index(sys.argv[2])
  gasHash = {}
  for line in gas:
    gasHash[line[0]] = line

  # get sample list of all samples > M1 80% QUALITY_BREADTH
  cutoff = 70
  stats = read(tempDir + "statistics/sample_stats.tsv").split("\n")[5::4]
  for line in stats:
    line = line.split("\t")
    gasHash[line[0]] = gasHash[line[0]][:refIndex] + [line[-7]] + gasHash[line[0]][refIndex+1:]
    if float(line[-7][:-1]) >= cutoff:
      subprocess.call("cp " + tempDir + "gatk/" + line[0] + "-bwamem-gatk.vcf " + naspDir + "/gatk/" + line[0] + "-bwamem-gatk.vcf", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  subprocess.call("cp " + tempDir + "reference/duplicates.txt " + naspDir + "reference/duplicates.txt", universal_newlines=True, shell=True, stdout=subprocess.PIPE)

  write("/scratch/GAS/GAS.tsv", "\n".join(["\t".join(header)] + sorted(map(lambda x: "\t".join(x), gasHash.values()))))

if __name__ == "__main__":
  main()
