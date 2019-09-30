#!/usr/bin/env python3

import sys
import os
import subprocess

# ==================================================( functions )
def printHelp():
  print("\nverify that FASTQ file exists and logs to tsv")
  print("usage: getPath.py [-h] FASTQ")
  print("example:\n\t./getPath.py example_R1_001.fastq.gz\n")
  exit(0)

def read(fileName):
  f = open(fileName, 'r')
  file = f.read().strip()
  f.close
  return file

def write(fileName, output):
  f = open(fileName, 'w')
  f.write(output + "\n")
  f.close()

def append(fileName, output):
  f = open(fileName, 'a')
  f.write(output + "\n")
  f.close()

# ==================================================( main )
def main():

  # check args
  if "-h" in sys.argv:
    printHelp()
  
  gas = list(map(lambda x: x.split("\t"), read("/scratch/GAS/GAS.tsv").strip().split("\n")))
  header = gas.pop(0)

  # get ALL references, strip out the sample names, filter from GAS headers, get new and old ref lists
  allRef = list(filter(lambda x: ".fasta" in x and "ALL::" in x and x.index("ALL") == 0, os.listdir("/scratch/GAS/reference")))
  allRef = list(map(lambda x: x.split("ALL::")[-1].split(".fasta")[0], allRef))
  newRef = list(filter(lambda x: x not in header, allRef))
  noRef = list(filter(lambda x: x not in allRef, header[4:]))

  # remove all old reference runs ... these are old news!!
  for ref in noRef:
    if os.path.exists("/scratch/GAS/nasp/ALL::" + ref):
      subprocess.call("rm -r /scratch/GAS/nasp/ALL::" + ref, universal_newlines=True, shell=True)
    refIndex = header.index(ref)
    header = header[:refIndex] + header[refIndex+1:]
    for i in range(len(gas)):
      gas[i] = gas[i][:refIndex] + gas[i][refIndex+1:]

  # add new references to GAS.tsv
  for ref in list(filter(lambda x: os.path.exists("/scratch/GAS/reference/ALL::" + x + ".fasta"), newRef)):
    header.append(ref)
    gas = list(map(lambda x: x + ["_"], gas))

  tempGas = []

  for index in sys.argv:
    # get root fastq location
    fastq = subprocess.Popen("FASTQ=" + index + "; while [[ -L $FASTQ ]]; do FASTQ=$(readlink $FASTQ); done; if [[ -f $FASTQ ]]; then echo $(realpath ${FASTQ}); fi", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
    fastq = fastq.stdout.read().split("\n")[0]

    # get sampleName, time, path, and reads
    if len(fastq.split("/")[-1].split("_R1_")) == 2 and "unpaired" not in fastq:
      sample = fastq.split("/")[-1].split("_R1_")
    elif len(fastq.split("/")[-1].split("_R2_")) == 2 and "unpaired" not in fastq:
      sample = fastq.split("/")[-1].split("_R2_")
    else:
      continue
    sampleName = sample[0]
    try:
      int(sampleName.split("_L")[-1])
      sampleName = "_L".join(sampleName.split("_L")[:-1])
    except:
      pass
    try:
      int(sampleName.split("_S")[-1])
      sampleName = "_S".join(sampleName.split("_S")[:-1])
    except:
      pass
    path = "/".join(fastq.split("/")[:-1]) + "/"
    r1 = path + sample[0] + "_R1_" + sample[1]
    r2 = path + sample[0] + "_R2_" + sample[1]
    time = subprocess.Popen("stat -c '%y' " + r1 + " | cut -d' ' -f 1", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
    time = time.stdout.read().split("\n")[0]

    # add sample to GAS.tsv
    if sampleName not in list(map(lambda x: x[0], gas)) and sampleName not in tempGas:
      tempGas.append(sampleName)
      gas.append([sampleName, time, r1, r2] + list("_"*(len(header[4:]))))

  write("/scratch/GAS/GAS.tsv", "\n".join(["\t".join(header)] + list(map(lambda x: "\t".join(x), gas))))


if __name__ == "__main__":
  main()
