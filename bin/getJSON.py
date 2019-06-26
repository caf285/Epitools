#!/usr/bin/env python3
###### import

import sys
import subprocess
import os
import json

#====================================================================================================( functions )
def printHelp():
  print("\nreturn list of clades from NWK tree file")
  print("usage: getClades.py [-h] NWK SNP")
  print("NWK\tneighbor joining or max parsimony SNP distance tree file")
  print("SNP\tSNP distance threshold for clade seperation (DEFAULT = 200)")
  print("example:\n\t./getClades.py /scratch/GAS/nasp/ALL/matrices/tree.nwk\n")
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

def parseClades(NWK, SNP):
  # set up variables
  clades = [[]]
  depth = 0
  fltTrigger = False
  snps = []
  sample = []

  # place sample names in an array, delimit arrays by SNP distance > SNP
  for char in NWK:
    if fltTrigger == True:
      try:
        float(''.join(snps + [char]))
        snps.append(char)
        continue
      except:
        if float(''.join(snps)) > SNP:
          clades.append([])
        fltTrigger = False

    if char in ['(', ')', ':', ',', ';']:
      # ( open/ ) close
      if char == '(':
        depth += 1
      elif char == ')':
        depth -= 1

      # : length
      elif char == ":":
        fltTrigger = True
        snps = []

      # ; end read
      elif char == ";":
        break

      # remove quotes
      if sample:
        while "\'" in sample:
          sample.remove("\'")
        while "\"" in sample:
          sample.remove("\"")
        clades[-1].append("".join(sample))
        sample = []
    else:
      sample.append(char)

  # clean clades
  while [] in clades:
    clades.remove([])
  for i in range(len(clades)):
    clades[i].sort()
  clades.sort()
  return clades

#====================================================================================================( main )
def main():
  #----- check ARGV
  if "-h" in sys.argv or len(sys.argv) <= 1:
    printHelp()
  else:
    nwkPath = sys.argv[1]
  if not os.path.exists(nwkPath):
    printHelp()
  else:
    nwkPath = os.path.abspath(nwkPath)
  try:
    SNP = float(sys.argv[2])
  except:
    SNP = float(200)

  #----- parse NWK into an embedded array
  NWK = read(nwkPath)
  NWK = "_".join(NWK.split(' '))
  clades = parseClades(NWK, SNP)

  #----- build output JSON by known M-types in /scratch/GAS/reference
  # extract sample names and mTypes in reference fasta files
  references = list(map(lambda x: x.split(".fasta")[0].split("::") if x.split(".fasta")[-1] == "" else "", os.listdir("/scratch/GAS/reference")))
  while '' in references:
    references.remove('')

  # match references with clades
  mTypes = {}
  typeless = list(map(lambda x: x if len(x) >= 4 else [],clades))
  for ref in list(map(lambda x: x if len(x) == 2 else ["", x[0]], references)):
    for clade in list(map(lambda x: x if len(x) >= 4 else [],clades)):
      if ref[-1] in clade:
        typeless.remove(clade)
        mTypes[ref[-1]] = "\n\t\t\t\"M\":\"" + ref[0] + "\",\n\t\t\t\"clade\":" + str(clade).replace("'", "\"") + ",\n\t\t\t\"tree\":\"\""
        break
  while [] in typeless:
    typeless.remove([])

  outClades = []
  for index in sorted(mTypes.keys()):
    outClades.append("\n\t\t\"" + index + "\":{" + mTypes[index] + "\n\t\t}")
  outClades = "\n\t\"clades\":{" + ",".join(outClades) + "\n\t}"
  output = "{\n\t\"noref\":" + str(typeless).replace("'", "\"") + ",\n\t\"tree\":\"" + NWK + "\"," +outClades + "\n}"

  #print(output)
  print(json.dumps(json.loads(output)['clades']['B']['clade']))

if __name__ == "__main__":
  main()









