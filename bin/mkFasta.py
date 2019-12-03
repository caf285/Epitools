#!/usr/bin/env python3

import sys 
import os
import subprocess
import re
import json

#====================================================================================================( functions )
def printHelp():
  print("\nconvert bestsnp.tsv into neighbor join tree")
  print("usage: mkTree.py [-h] DIR")
  print("\tDIR\tNasp run directory")
  print("example:\n\t./mkTree.py /scratch/GAS/nasp/All\n")
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
    DIR = sys.argv[1]
    months = sys.argv[2:]
    ref = sys.argv[3:]

  if not os.path.exists(DIR):
    printHelp()
  else:
    DIR = os.path.abspath(DIR)
    if months:
      months = months[0]
      best = DIR + "/matrices/" + months + "/bestsnp.tsv"
      bestFasta = DIR + "/matrices/" + months + "/bestsnp.fasta"
      missing = DIR + "/matrices/" + months + "/missingdata.tsv"
      missingFasta = DIR + "/matrices/" + months + "/missingdata.fasta"
    else:
      best = DIR + "/matrices/bestsnp.tsv"
      bestFasta = DIR + "/matrices/bestsnp.fasta"
      missing = DIR + "/matrices/missingdata.tsv"
      missingFasta = DIR + "/matrices/missingdata.fasta"

  #----- convert TSV to FASTA
  print("fasta")
  subprocess.call("module load nasp; nasp export --type fasta " + best + " > " + bestFasta, universal_newlines=True, shell=True)
  subprocess.call("module load nasp; nasp export --type fasta " + missing + " > " + missingFasta, universal_newlines=True, shell=True)

  #----- fix fasta for AUGUR naming convention
  # pull out all python escape characters
  if ref:
    ref = ref[0]
  for fasta in [bestFasta, missingFasta]:
    seq = "\n".join(list(map(lambda x: re.sub(r'(\x9B|\x1B\[)[0-?]*[ -\/]*[@-~]', '', x), read(fasta).split("\n"))))
    seq = seq.split(">")[1:]
    if ref:
      seq = list(filter(lambda x: "reference" not in x.lower(), seq))

    # remove ':' and all characters following from all headers
    for i in range(len(seq)):
      seq[i] = seq[i].split("\n")
      seq[i][0] = seq[i][0].split("::")[0]
      if ref and ref in seq[i][0]:
        seq[i][0] = seq[i][0] + "-reference"
      seq[i] = "\n".join(seq[i])
    seq = ">" + ">".join(seq)
    write(fasta, seq)

if __name__ == "__main__":
  main()





