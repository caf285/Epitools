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

def sortNwk(nwk):
  depth = 0
  newNwk = [[]]
  innerNwk = []
  for char in nwk:
    if char == "," and depth == 0:
      newNwk.append([])
    else:
      if depth == 0:
        newNwk[-1].append(char)
      else:
        innerNwk.append(char)
      if char in ['(', ')']:
        if char == '(':
          depth += 1
        elif char == ')':
          depth -= 1
          if depth == 0:
            newNwk[-1].append(",".join(sortNwk("".join(innerNwk[:-1]))) + ")")
            innerNwk = []
  
  newNwk = list(map(lambda x: "".join(x), newNwk))
  newNwk = sorted(newNwk, key=lambda x: float(x.split(":")[-1]))
  return newNwk

def main():
  ##### check ARGV
  if "-h" in sys.argv or not os.path.exists(sys.argv[-1]):
    usage()

  ##### parse tree and build all clades
  nwk = read(sys.argv[-1]).split(";")[0]

  print("".join(sortNwk(nwk)))

  quit()

  while [] in clades:
    clades.remove([])

  if outFormat == "clade":
    print(json.dumps(clades))
  elif outFormat == "samples":
    print(json.dumps([x for arr in clades for x in arr]))

  

if __name__ == "__main__":
  main()
