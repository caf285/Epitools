#!/usr/bin/env python3

import sys
import os
import subprocess
import string
import random

# ==================================================( functions )
def printHelp():
  print("create symlinks for all GAS files not in reference")
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
  # fill dictionary for all accepted args
  if "-h" in sys.argv:
    printHelp()
  else:
    query = " ".join(sys.argv[1:])


  # get all samples with no M1 data
  references = list(map(lambda x: x.split("::")[-1].split(".fasta")[0], list(filter(lambda x: len(x.split(".fasta")) == 2, os.listdir("/scratch/EPITOOLS/GAS/reference")))))
  gas = subprocess.Popen("/scratch/EPITOOLS/GAS/bin/queryGAS.py " + query, universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  gas = list(filter(lambda x: x[0] not in references, list(map(lambda x: x.split("\t"), gas.stdout.read().strip().split("\n")))))
  #gas = list(map(lambda x: x.split("\t"), gas.stdout.read().strip().split("\n")))
  header = gas.pop(0)

  # create temporary M1 directory and run nasp for vcf files
  #randStr = "".join(random.choice(string.ascii_lowercase) for i in range(10))
  DIR = "/scratch/EPITOOLS/GAS/.temp/"

  if gas:
    for sample in gas:
      r1 = sample[2]
      l1 = os.getcwd() + "/" + sample[0] + r1.split(sample[0])[-1]
      r2 = sample[3]
      l2 = os.getcwd() + "/" + sample[0] + r2.split(sample[0])[-1]
      subprocess.call("ln -s " + r1 + " " + l1, universal_newlines=True, shell=True)
      subprocess.call("ln -s " + r2 + " " + l2, universal_newlines=True, shell=True)
    #config = [ref + "-" + randStr, ref + "-" + randStr, ref, ref, "\n".join(files)]
    #print(ref + "-" + randStr + "-config.xml")
    #write(DIR + ref + "-" + randStr + "-config.xml", "".join(list(map(lambda x: "".join(list(x)), list(zip(template, config)))) + [template[-1]]))
    #subprocess.call("module load nasp; nasp --config " + DIR + ref + "-" + randStr + "-config.xml", universal_newlines=True, shell=True)

if __name__ == "__main__":
  main()
