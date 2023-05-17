#!/usr/bin/env python3

import sys 
import os
import subprocess
import re
import json

#====================================================================================================( functions )
def printHelp():
  print("\nconvert NASP output duplicates.txt format into BED tsv format")
  print("usage: dups2bed.py [ -h ] DUP")
  print("\tDUP\tduplicates file")
  print("example:\n\t./dups2bed.py ./reference/duplicates.txt")
  print()
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
  #----- check args
  if "-h" in sys.argv or len(sys.argv) <= 1:
    printHelp()
  else:
    txt = read(sys.argv[1]).split(">")[1:]

  #----- read dups file and parse contigs
  contigs = {k[0]: k[1] for k in list(map(lambda x: [x.split("\n")[0], "".join(x.split("\n")[1:])], txt))}

  #----- fill duplicate regions
  for contig in sorted(contigs):
    dup = contigs[contig]
    bed = []
    for i in range(len(dup)):
      if dup[i] == '1':
        bed.append(i)
      elif bed:
        print("\t".join([contig, str(bed[0] + 1), str(bed[-1] + 1)]))
        bed = []

if __name__ == "__main__":
  main()
