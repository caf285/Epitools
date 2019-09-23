#!/usr/bin/env python3
###### import

import sys
import subprocess
import os
import json

def usage():
  print("return list of clades from ALL '*.nwk' tree file")
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
  ##### check ARGV
  if "-h" in sys.argv:
    usage()

  ##### build reference::sample pairse
  refSamples = list(map(lambda x: x.split(".fasta")[0].split("::"), os.listdir('/scratch/GAS/reference')))
  reference = {}
  for index in refSamples:
    reference[index[1]] = index[0]

  ##### get clades
  clades = subprocess.Popen("/scratch/GAS/bin/parseNWK.py -c /scratch/GAS/nasp/ALL/matrices/tree.nwk", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  clades = json.loads(clades.stdout.read())

  ##### build mType::clade pairs
  for clade in clades:
    for sample in clade:
      if sample in reference and len(clade) > 4:
        gatk = []
        if os.path.exists("/scratch/GAS/nasp/" + reference[sample] + "/gatk"):
          gatk = ["Reference"] + list(map(lambda x: x.split("-bwamem-gatk.vcf")[0], os.listdir("/scratch/GAS/nasp/" + reference[sample] + "/gatk")))
        print(reference[sample] + " " + sample + " " + " ".join(list(map(lambda x: "" if x in gatk else x, clade))))
        break

if __name__ == "__main__":
  main()
