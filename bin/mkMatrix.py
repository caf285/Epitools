#!/usr/bin/env python3

import sys
import os
import subprocess
import json

# ==================================================( functions )
def printHelp():
  print("\ncreates a nasp matrix dto-file in DIR argument")
  print("usage: mkMatrix.py [-h] DIR [tsv] [allRef]")
  print("\tDIR\tlocation of nasp run")
  print("\t[allRef]\toptional queryGAS.py arguments")
  print("\t[tsv]\toptional reduced GAS.tsv file")
  print("example:\n\t./mkMatrix.py /scratch/GAS/nasp/All/")
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

def append(fileName, output):
  f = open(fileName, 'a')
  f.write(output + "\n")
  f.close()

# ==================================================( main )
def main():

  ##### check args
  if "-h" in sys.argv or len(sys.argv) < 2:
    printHelp()
  else:
    DIR = sys.argv[1]
    tsv = sys.argv[2:]
    allRef = sys.argv[3:]

  if not os.path.exists(DIR):
    printHelp()
  else:
    DIR = os.path.abspath(DIR)

  ##### get VCF and reduce by GAS.tsv and ALL NWK
  # get template and vcf file names
  template = read("/scratch/GAS/.templates/TEMPLATE_dto.xml").split("=====")
  vcf = list(map(lambda x: x.split("-bwamem-gatk.vcf")[0], filter(lambda x: x.split("-bwamem-gatk")[-1] == ".vcf", os.listdir(DIR + "/gatk/"))))

  # reduce VCF by GAS.tsv
  # tsv used for pointer to reduced GAS.tsv file
  if tsv:
    tsv = tsv[0]
    gas = list(map(lambda x: x.split("\t")[0], read(tsv).strip().split("\n")[1:]))
    print(gas)
    vcf = list(filter(lambda x: x in gas, vcf))
  else:
    gas = list(map(lambda x: x.split("\t")[0], read("/scratch/GAS/GAS.tsv").strip().split("\n")[1:]))
    print(gas)
    vcf = list(filter(lambda x: x in gas, vcf))

  # reduce by VCF files in gatk
  # this is used after the initial ALL tree has completed
  # assume if allRef; then tsv
  # TODO: these samples should really be passed in rather than retrieved by existing VCF files
  if allRef:
    tsv = tsv.split("/")[-1].split(".tsv")[0]
    allRef = allRef[0]
    clade = subprocess.Popen("/scratch/GAS/bin/parseNWK.py -c /scratch/GAS/nasp/ALL::" + allRef + "/matrices/" + tsv + "/bestsnp.nwk", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
    clade = json.loads(clade.stdout.read())
    clade = list(filter(lambda x: DIR.split("::")[-1] in x, clade))[0]
    vcf = list(filter(lambda x: x in clade, vcf))

  # add mType reference name if vcf is empty
  if vcf == []:
    vcf = [DIR.split("::")[-1]]

  # get file list for config template
  files = []
  for sample in vcf:
    files.append("          <vcf aligner=\"BWA-mem\" name=\"" + sample + "\" snpcaller=\"GATK\">" + DIR + "/gatk/" + sample + "-bwamem-gatk.vcf</vcf>")

  ##### write mType specific matrix
  # assume if allRef; then tsv
  if allRef:
    tsv = tsv.split("/")[-1].split(".tsv")[0]
    config = [DIR + "/" + allRef + "/reference/reference.fasta", DIR + "/" + allRef + "/matrices/" + tsv, DIR + "/" + allRef + "/statistics/" + tsv, DIR + "/" + allRef + "/reference/duplicates.txt", "\n".join(files)]
    write(DIR + "/" + allRef + "::" + tsv + "_dto.xml", "".join(list(map(lambda x: "".join(list(x)), list(zip(template, config)))) + [template[-1]]))

  # else write reduced ALL matrix
  elif tsv:
    tsv = tsv.split("/")[-1].split(".tsv")[0]
    config = [DIR + "/reference/reference.fasta", DIR + "/matrices/" + tsv, DIR + "/statistics/" + tsv, DIR + "/reference/duplicates.txt", "\n".join(files)]
    write(DIR + "/" + tsv + "_dto.xml", "".join(list(map(lambda x: "".join(list(x)), list(zip(template, config)))) + [template[-1]]))

  # else write full ALL matrix
  else:
    config = [DIR + "/reference/reference.fasta", DIR + "/matrices", DIR + "/statistics", DIR + "/reference/duplicates.txt", "\n".join(files)]
    write(DIR + "/matrix_dto.xml", "".join(list(map(lambda x: "".join(list(x)), list(zip(template, config)))) + [template[-1]]))

# ==================================================( main )
if __name__ == "__main__":
  main()
