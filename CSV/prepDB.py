#!/home/cfrench/env/TacoTime/bin/python
#============================================================( import )
import sys
import os
import subprocess
import re
import datetime
import dateutil.parser

# reading and writing excel xlsx
import openpyxl
#from openpyxl.utils import _get_column_letter as getCol
#from openpyxl.utils import column_index_from_string

#============================================================( functions )
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
    allGasBook = openpyxl.load_workbook(filename="/home/cfrench/GAS/dev/CSV/All GAS.xlsx", data_only=True)
    tgGas = {}
    azGas = {}

    # extract header
    header = list(filter(lambda x: re.findall(r"Isolate \nBarcode", str(x[1].value)), allGasBook['MASTER GAS'].rows))[0]
    header = list(map(lambda x: x.value, header))

    # extract data from workbook
    for row in list(filter(lambda x: re.findall(r"TG\d+", str(x[1].value)), allGasBook['Historic GAS'].rows)):
      az = row[header.index("External ID")].value
      tg = row[header.index("Isolate \nBarcode")].value
      collectionDate = row[header.index("Date collected\nfrom patient")].value
      try:
        collectionDate = str(datetime.datetime.fromordinal(datetime.datetime(1900, 1, 1).toordinal() + int(collectionDate) - 2)).split(" ")[0]
        print("asd")
      except:
        collectionDate = str(collectionDate).split(" ")[0]
      emmType = row[header.index("emm-type")].value
      facility = row[header.index("Original\nfacility source")].value
      tgGas[tg] = [tg, az, collectionDate, emmType, facility]
      azGas[az] = [tg, az, collectionDate, emmType, facility]

    # extract data from workbook
    for row in list(filter(lambda x: re.findall(r"TG\d+", str(x[1].value)), allGasBook['MASTER GAS'].rows)):
      az = row[header.index("External ID")].value
      tg = row[header.index("Isolate \nBarcode")].value
      collectionDate = row[header.index("Date collected\nfrom patient")].value
      try:
        collectionDate = str(datetime.datetime.fromordinal(datetime.datetime(1900, 1, 1).toordinal() + int(collectionDate) - 2)).split(" ")[0]
      except:
        collectionDate = str(collectionDate).split(" ")[0]
      emmType = row[header.index("emm-type")].value
      facility = row[header.index("Original\nfacility source")].value
      tgGas[tg] = [tg, az, collectionDate, emmType, facility]
      azGas[az] = [tg, az, collectionDate, emmType, facility]

    # get all TG
    tgList = list(filter(lambda x: re.findall(r"Isolate \nBarcode", str(x[1].value)), allGasBook['MASTER GAS'].columns))[0] + list(filter(lambda x: re.findall(r"Isolate \nBarcode", str(x[1].value)), allGasBook['Historic GAS'].columns))[0]
    tgList = list(map(lambda x: x.value, tgList))
    tgList = set(filter(lambda x: x and "TG" in x, tgList))
    tgList = list(map(lambda x: x.split("TG")[-1], tgList))

    # read GAS.tsv
    gasTsv = list(map(lambda x: x.split("\t"), read("/home/cfrench/GAS/dev/CSV/GAS.tsv").split("\n")[1:]))
    gas = []
    for row in gasTsv:
      tg = re.findall(r"TG\d+", row[0])
      if tg and tg[0] in tgGas:
        gas.append([row[0]] + tgGas[tg[0]] + row[1:])
      elif row[0] in azGas:
        gas.append([row[0]] + azGas[row[0]] + row[1:])
      else:
        gas.append([row[0], tg[0] if tg else None, None, None, None, None] + row[1:])
    gas = "\n".join(list(map(lambda x: ",".join(list(map(lambda y: str(y).split(",")[0], x))), gas)))
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
