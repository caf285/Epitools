#!/usr/bin/env python3
###### import

import sys
import subprocess
import os

def usage():
  print("fills per sample per reference nasp config files ")
  print("usage: mkConfig.py READ")
  print("example:\n    ./mkConfig.py /path/to/read sampleName_R1_001.fastq.gz\n")
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
  # get all emm types from /scratch/GAS/nasp/
  Mtypes = subprocess.Popen("ls /scratch/GAS/nasp", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  Mtypes = Mtypes.stdout.read().split("\n")[:-1]

  PATH = "/".join(sys.argv[1].split("/")[:-1])

  if len(sys.argv[1].split("/")[-1].split("_R1_")) > 1:
    sample = sys.argv[1].split("/")[-1].split("_R1_")
  else:
    sample = sys.argv[1].split("/")[-1].split("_R2_")


  # make temporary sample directory, and all reference directories for nasp runs
  DIR = "/scratch/GAS/.temp/" + sample[0]
  os.mkdir(DIR)

  # make nasp config file per emm type
  for index in Mtypes:
    os.mkdir(DIR + "/" + index)
    template = read("/scratch/GAS/.templates/TEMPLATE-config.xml").split("=====")
    ref = subprocess.Popen("ls /scratch/GAS/reference/" + index + "-*", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
    ref = ref.stdout.read().split("\n")[0].split("/")[-1].split(".fasta")[0]
    config = [index, sample[0] + "/" + index + "/nasp", ref, ref, PATH + "/", sample[0], "_R1_".join(sample), "_R2_".join(sample)]
    write(DIR + "/" + index + "/" + index + "-config.xml", "".join(list(map(lambda x: "".join(list(x)), list(zip(template, config)))) + [template[-1]]))

if __name__ == "__main__":
  main()
