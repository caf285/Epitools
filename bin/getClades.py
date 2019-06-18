#!/usr/bin/env python3
###### import

import sys
import subprocess
import os

#====================================================================================================( functions )
def usage():
  print("return list of clades from NWK tree file")
  print("usage: getClades.py [-h] NWK SNP")
  print("NWK\tneighbor joining or max parsimony SNP distance tree file")
  print("SNP\tSNP distance threshold for clade seperation (DEFAULT = 100)")
  print("example:\n\t./getClades.py /scratch/GAS/nasp/ALL/matrices/tree.nwk\n")
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

#====================================================================================================( main )
def main():
  #----- check ARGV
  if "-h" in sys.argv or len(sys.argv) <= 1:
    printHelp()
  else:
    nwkPath = sys.argv[1]

  if not os.path.exists(nwkPath):
    printHelp()
  else:
    nwkPath = os.path.abspath(nwkPath)

  try:
    SNP = float(sys.argv[2])
  except:
    SNP = float(100)

  #----- parse NWK
  NWK = read(nwkPath)
  NWK = "_".join(NWK.split(' '))

  clades = [[]]
  depth = 0
  fltTrigger = False
  snps = []
  sample = []

  for char in NWK:
    if fltTrigger == True:
      try:
        float(''.join(snps + [char]))
        snps.append(char)
        continue
      except:
        print(float(''.join(snps)), depth)
        if float(''.join(snps)) > SNP:
          clades.append([])
        fltTrigger = False

    if char in ['(', ')', ':', ',', ';']:
      # ( open/ ) close
      if char == '(':
        depth += 1

      elif char == ')':
        depth -= 1

      # : length
      elif char == ":":
        fltTrigger = True
        snps = []

      # ; end read
      elif char == ";":
        break

      if sample:
        while "\'" in sample:
          sample.remove("\'")
        while "\"" in sample:
          sample.remove("\"")
        clades[-1].append("".join(sample))
        sample = []

    else:
      sample.append(char)

  while [] in clades:
    clades.remove([])
  for i in range(len(clades)):
    clades[i].sort()
  clades.sort()
  for index in clades:
    print(index,"\n")

if __name__ == "__main__":
  main()
