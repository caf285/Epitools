#!/usr/bin/env python3
###### import

import sys
import subprocess
import os
import json

def usage():
  print("return various aspects of a nwk file")
  print("usage: getClades.py [-h] [-s | -c] NWK")
  print("\t-s\treturn space delimited sample names (default)")
  print("\t-c\treturn clades")
  print("\tNWK\tnwk format tree file")
  print("example:\n    ./parseNWK.py -s /scratch/GAS/nasp/ALL/matrices/tree.nwk\n")
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
  ##### check ARGV
  if "-h" in sys.argv or not os.path.exists(sys.argv[-1]):
    usage()
  elif "-c" in sys.argv:
    outFormat = "clade"
  else:
    outFormat = "samples"

  ##### parse tree and build all clades
  nwk = read(sys.argv[-1])
  nwk = "_".join(nwk.split(' '))
  nwk = "".join(nwk.split('-reference'))
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
        if float(''.join(snps)) > 100:
          clades.append([])
        fltTrigger = False
    if char in ['(', ')', ':', ',', ';']:
      if char == '(':
        depth += 1
      elif char == ')':
        depth -= 1
      elif char == ":":
        fltTrigger = True
        snps = []
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

  if outFormat == "clade":
    print(json.dumps(clades))
  elif outFormat == "samples":
    print(json.dumps([x for arr in clades for x in arr]))

  

if __name__ == "__main__":
  main()
