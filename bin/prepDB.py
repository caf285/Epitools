#!/usr/bin/env python

### IMPORTS
import json
import re

### HELPER SCRIPTS
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

def main():
  #==================================================( Read Sheet )
  # read sheets
  master = json.loads(read("/scratch/GAS/googleMaster.json"))[1:]
  historic = json.loads(read("/scratch/GAS/googleHistoric.json"))[1:]

  # prep hash table
  header = master.pop(0)
  tgGas = {}
  azGas = {}

  # extract historic data from workbook
  for row in list(filter(lambda x: re.findall(r"TG\d+", str(x[1])), historic)):
    az = row[header.index("External ID")]
    isolate = row[header.index("Isolate \nBarcode")]
    dna = row[header.index("DNA \nBarcode")]
    collectionDate = row[header.index("Date collected\nfrom patient")]
    try:
      collectionDate = str(datetime.datetime.fromordinal(datetime.datetime(1900, 1, 1).toordinal() + int(collectionDate) - 2)).split(" ")[0]
    except:
      collectionDate = str(collectionDate).split(" ")[0]
    emmType = row[header.index("emm-type")]
    facility = row[header.index("Original\nfacility source")]
    tgGas[isolate] = [isolate, az, collectionDate, emmType, facility]
    tgGas[dna] = [dna, az, collectionDate, emmType, facility]
    azGas[az] = [isolate, az, collectionDate, emmType, facility]

  # extract all data from workbook
  for row in list(filter(lambda x: re.findall(r"TG\d+", str(x[1])), master)):
    az = row[header.index("External ID")]
    isolate = row[header.index("Isolate \nBarcode")]
    dna = row[header.index("DNA \nBarcode")]
    collectionDate = row[header.index("Date collected\nfrom patient")]
    try:
      collectionDate = str(datetime.datetime.fromordinal(datetime.datetime(1900, 1, 1).toordinal() + int(collectionDate) - 2)).split(" ")[0]
    except:
      collectionDate = str(collectionDate).split(" ")[0]
    emmType = row[header.index("emm-type")]
    facility = row[header.index("Original\nfacility source")]
    tgGas[isolate] = [isolate, az, collectionDate, emmType, facility]
    tgGas[dna] = [dna, az, collectionDate, emmType, facility]
    azGas[az] = [isolate, az, collectionDate, emmType, facility]

  # get all TG
  tgList = list(map(lambda x: x[header.index("Isolate \nBarcode")], master)) + list(map(lambda x: x[header.index("Isolate \nBarcode")], historic))
  tgList = set(filter(lambda x: x and "TG" in x, tgList))
  tgList = list(map(lambda x: x.split("TG")[-1], tgList))

  # read GAS.tsv
  gasTsv = list(map(lambda x: x.split("\t"), read("/scratch/GAS/GAS.tsv").split("\n")[1:]))
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

if __name__ == '__main__':
    main()
