#!/usr/bin/env python3

import sys
import os
import subprocess
# ==================================================( functions )

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

  # get additional Mtypes
  gas = read("/scratch/GAS/GAS.tsv").split("\n")
  header = gas.pop(0).split("\t")

  temp = ['TG92982','TG92990','TG93050','TG93206','TG93218','TG93453','TG93461','TG93641','TG93685','TG93689','TG93697']

  # append additional columns to GAS.tsv
  for i in range(len(gas)):
    gas[i] = gas[i].split("\t")
    #for index in temp:
    #  if index in gas[i][0]:
    #    gas[i][3] = "YumaReg"
    #    gas[i][4] = "Yuma"
    #    gas[i][5] = "Yuma"

    #    print(gas[i][0], gas[i][3], gas[i][4], gas[i][5])

    if float(gas[i][-1][:-1]) > 80 and gas[i][3] == "-":
      print(gas[i][0], ",  ", gas[i][2])

    gas[i] = "\t".join(gas[i][:len(header)])

  quit()

  header = "\t".join(header)
  output = [header] + gas
  write("/scratch/GAS/GAS.tsv", "\n".join(output) + "\n")

if __name__ == "__main__":
  main()
