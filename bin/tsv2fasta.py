#!/usr/bin/env python3
###### import

import sys
import subprocess
import os
import time
import multiprocessing

def usage():
  print("\nusage: tsv2fasta.py [-h] TSV")
  print("example:\n    ./tsv2fasta.py example.fasta\n")
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
  if "-h" in sys.argv or len(sys.argv) < 2:
    usage()
  if not os.path.exists(sys.argv[1]):
    print(sys.argv[1], "does not exist")
    exit(-1)

  # parse TSV and HEADER
  tsv = read(sys.argv[1]).split("\n")
  header = list(map(lambda x: ">" + x, tsv.pop(0).split("LocusID\t")[-1].split("\t#SNPcall")[0].split("\t")))
  tsv = "".join(list(map(lambda x: "".join(x.split("\t")[1:len(header)+1]),tsv)))

  # write FASTA
  fileName = ".".join(sys.argv[1].split(".")[:-1]) + ".fasta"
  fasta = []
  for i in range(len(header)):
    fasta.append(''.join(header[i].split("::")[0]))
    string = tsv[i::len(header)]
    while string != "":
      fasta.append(string[:80])
      string = string[80:]
  write(fileName, "\n".join(fasta))

if __name__ == "__main__":
  main()
