#!/usr/bin/env python3

import sys
import os
import subprocess
import string
import random

# ==================================================( functions )
def printHelp():
  print("\ncreates a NASP config file in /scratch/GAS/.temp/<ref>-<rand>-config.xml")
  print("<rand>:\t10 digit alpha numeric string")
  print("<ref>:\treference file name")
  print("usage: mkConfig.py [-h] REFERENCE GAS")
  print("\tREFERENCE\tNasp run reference file")
  print("\tGAS\tqueryGAS.py arguments")
  print("example:\n\t./mkConfig.py /scratch/GAS/reference/M1::TG92300.fasta -m 80\n")
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
  if "-h" in sys.argv or len(sys.argv) < 2:
    printHelp()
  else:
    ref = sys.argv[1]
    gas = " ".join(sys.argv[2:])

  if not os.path.exists(ref):
    printHelp()
  else:
    ref = ref.split("/")[-1].split(".fasta")[0]

  # get all samples with no M1 data
  gas = subprocess.Popen("/scratch/GAS/bin/queryGAS.py " + gas, universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  gas = gas.stdout.read().split("\n")[:-1]

  header = gas.pop(0).split("\t")

  cols = {}
  for i in range(len(header)):
    cols[header[i]] = i

  # create temporary M1 directory and run nasp for vcf files
  randStr = "".join(random.choice(string.ascii_lowercase) for i in range(10))
  DIR = "/scratch/GAS/.temp/"
  template = read("/scratch/GAS/.templates/TEMPLATE-config.xml").split("=====")

  # get file list for config template
  files = []
  for line in gas:
    line = line.split("\t")
    files.append("        <ReadFolder path=\"" + line[cols["Path"]] + "\">")
    files.append("            <ReadPair sample=\"" + line[cols["SampleName"]] + "\">")
    files.append("                <Read1Filename>" + line[cols["R1"]] + "</Read1Filename>")
    files.append("                <Read2Filename>" + line[cols["R2"]] + "</Read2Filename>")
    files.append("            </ReadPair>")
    files.append("        </ReadFolder>")

  # write M1 config file
  if files:
    config = [ref + "-" + randStr, ref + "-" + randStr, ref, ref, "\n".join(files)]
    print(ref + "-" + randStr + "-config.xml")

    write(DIR + ref + "-" + randStr + "-config.xml", "".join(list(map(lambda x: "".join(list(x)), list(zip(template, config)))) + [template[-1]]))
    #subprocess.call("module load nasp; nasp --config " + DIR + ref + "-" + randStr + "-config.xml", universal_newlines=True, shell=True)

if __name__ == "__main__":
  main()
