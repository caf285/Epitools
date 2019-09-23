#!/usr/bin/env python3

import sys
import os
import re

# ==================================================( functions )
def printHelp():
  print("\nreplaces all sample names in tree.nwk with <sampleName>::<mType>")
  print("usage: fixAll.py [-h]")
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
  if "-h" in sys.argv:
    printHelp()

  mTypes = {}
  for mType in [i.split("::")[0] for i in os.listdir('/scratch/GAS/reference/')]:
    for sample in [i.split("-bwamem-gatk.vcf")[0] for i in os.listdir("/scratch/GAS/nasp/" + mType + "/gatk")]:
      mTypes[sample] = "[" + mType + "]"
  ALL = read('/scratch/GAS/nasp/ALL/matrices/tree.nwk')
  i = 0
  while i < len(ALL):
    j = i
    while ALL[j] not in ['(', ')', ':', ',', ';']:
      j += 1
    if ALL[i:j] in mTypes:
      ALL = ALL[:i] + ALL[i:j] + mTypes[ALL[i:j]] + ALL[j:]
      i = j + len(mTypes[ALL[i:j]]) + 1
    else:
      i = j + 1
  print(ALL)





if __name__ == "__main__":
  main()
