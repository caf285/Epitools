#!/usr/bin/env python3
###### import

import sys
import subprocess
import os

def usage():
  print("return list of clased from M1 '*.nwk' tree file")
  print("usage: getClades.py [-h]")
  print("example:\n    ./getClades.py\n")
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

def main():
  ### check ARGV
  if "-h" in sys.argv:
    usage()

  # parse NWK
  nwk = read("/scratch/GAS/nasp/M1/M1-newick.nwk")
  nwk = "_".join(nwk.split(' '))

  clades = [[]]
  depth = 0
  fltTrigger = False
  snps = []
  sample = []

  for char in nwk:
    if fltTrigger == True:
      try:
        float(''.join(snps + [char]))
        snps.append(char)
        continue
      except:
        print(float(''.join(snps)), depth)
        if float(''.join(snps)) > 100:
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
  for index in clades:
    print(index,"\n")

if __name__ == "__main__":
  main()
