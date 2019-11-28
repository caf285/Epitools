#!/usr/bin/env python3
###### import

import sys
import subprocess
import os
import json

def usage():
  print("return list of clades from ALL '*.nwk' tree file")
  print("usage: getClades.py [-h] ALL")
  print("\tALL\treference file sample name for all tree")
  print("example:\n    ./getClades.py TG92300\n")
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
  if "-h" in sys.argv or len(sys.argv) < 2:
    usage()
  else:
    ALL = sys.argv[1]
    months = sys.argv[2:]

  ##### build reference::sample pairs
  refSamples = list(map(lambda x: x.split(".fasta")[0].split("::"), filter(lambda x: x.split("ALL::")[0] != "" and "::" in x, os.listdir('/scratch/GAS/reference'))))
  refSamples = list(filter(lambda x: len(x) == 2 and x[0] != "ALL", map(lambda x: x.split(".fasta")[0].split("::"), os.listdir('/scratch/GAS/reference'))))
  reference = {}
  for index in refSamples:
    reference[index[1]] = index[0]

  ##### get clades
  if months:
    months = months[0]
    clades = subprocess.Popen("/scratch/GAS/bin/parseNWK.py -c /scratch/GAS/nasp/ALL\:\:" + ALL + "/matrices/" + months + "/bestsnp.nwk", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  else:
    clades = subprocess.Popen("/scratch/GAS/bin/parseNWK.py -c /scratch/GAS/nasp/ALL\:\:" + ALL + "/matrices/tree.nwk", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  clades = json.loads(clades.stdout.read())

  ##### build mType::clade pairs
  for clade in clades:
    for sample in clade:
      if sample in reference and len(clade) > 4:
        gatk = []
        if os.path.exists("/scratch/GAS/nasp/" + reference[sample] + "::" + sample + "/gatk"):
          gatk = ["Reference"] + list(map(lambda x: x.split("-bwamem-gatk.vcf")[0], os.listdir("/scratch/GAS/nasp/" + reference[sample] + "::" + sample + "/gatk/")))
        #print(reference[sample] + " " + sample + " " + " ".join(list(filter(lambda x: x not in gatk, clade))))
        print(reference[sample] + " " + sample + " " + " ".join(clade))
        #break
if __name__ == "__main__":
  main()
