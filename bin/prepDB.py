#!/usr/bin/env python3.4
#============================================================( import )
import sys
import os
import subprocess
import re
import datetime
import dateutil.parser

# reading and writing excel xlsx
import openpyxl
from openpyxl.utils import _get_column_letter as getCol
from openpyxl.utils import column_index_from_string

# ==================================================( functions )
def printHelp():
  print("reads in ALLGAS and GAS.tsv and writes combined data")
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

#============================================================( main )
### parse arguments and run program

def main():


    # load workbook
    allGasBook = openpyxl.load_workbook("/scratch/GAS/All GAS.xlsx").worksheets[0]
    print(allGasBook.columns[1][0].value)
    allGas = {}
    for row in list(filter(lambda x: x[1].value, allGasBook.rows)):
      az = re.findall(r"AZ\d+", str(row[0].value))
      if az:
        az = az[0]
      else:
        az = None
      tg = row[1].value
      try:
        collectionDate = str(row[6].value.date())
      except:
        collectionDate = row[6].value
      emmType = row[14].value
      facility = row[16].value
      allGas[tg] = [tg, az, collectionDate, emmType, facility]
      
    gasTsv = list(map(lambda x: x.split("\t"), read("/scratch/GAS/GAS.tsv").split("\n")[1:]))
    gas = []
    for row in gasTsv:
      tg = re.findall(r"TG\d+", row[0])
      if tg and tg[0] in allGas:
        gas.append([row[0]] + allGas[tg[0]] + row[1:])
      else:
        gas.append([row[0], tg[0] if tg else None, None, None, None, None] + row[1:])
    gas = "\n".join(list(map(lambda x: "\t".join(list(map(lambda y: str(y), x))), gas)))
    print(gas)



    '''
    gas = list(filter(lambda x: re.findall(r"TG\d+", x[0]) and re.findall(r"TG\d+", x[0])[0] in allGas, gas))
    sh = wb[args.sheet]
    sh = wb.worksheets[0]
    if len(sh.rows) < 1:
    if sh.rows[0][i].value in args.old:
    keyColumns.append(sh.columns[i])
    if args.new == sh.rows[0][i].value:
    valueColumn = sh.columns[i]
    value = valueColumn[i].value
    '''

#============================================================( run main )
###### runMain
if __name__ == "__main__":
  main()
