#!/usr/bin/env python

### IMPORTS
import json
import re
import datetime
import sys

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

### reformat m/d/y and m/d/Y to Y-M-D
# 12/1/19 ==> 2019-12-01
def fixDate(dateStr):
  # check if a date is entered in the first place, then year length
  if dateStr:
    if "/" in dateStr:
      if len(dateStr.split("/")[-1]) == 2:
        dateStr = str(datetime.datetime.strptime(dateStr, "%m/%d/%y")).split(" ")[0]
      elif len(dateStr.split("/")[-1]) == 4:
        dateStr = str(datetime.datetime.strptime(dateStr, "%m/%d/%Y")).split(" ")[0]
    # check for correct date format for database, else return blank
    try:
      datetime.datetime.strptime(dateStr, "%Y-%m-%d")
      return dateStr
    except:
      #print("newFormat!!!", dateStr)
      return ""
  return dateStr

def main():
  #==================================================( Read Sheet )
  # read sheets
  master = json.loads(read("/scratch/EPITOOLS/GAS/googleMaster.json"))
  historic = json.loads(read("/scratch/EPITOOLS/GAS/googleHistoric.json"))[1:]

  # prep hash table
  masterHeader = master.pop(0)
  historicHeader = historic.pop(0)
  tgGas = {}
  azGas = {}

  #print("\nmaster:", masterHeader)
  #print("\nhistoric:", historicHeader)

  # extract historic data from workbook
  for row in list(filter(lambda x: re.findall(r"TG\d+", str(x[1])), historic)):
    az = row[historicHeader.index("External ID")]
    isolate = row[historicHeader.index("Isolate \nBarcode")]
    dna = row[historicHeader.index("DNA \nBarcode")]
    collectionDate = fixDate(row[historicHeader.index("Date collected\nfrom patient")])
    emmType = row[historicHeader.index("emm-type")]
    if emmType.lower() == "none":
      emmType = ""
    facility = row[historicHeader.index("Original\nfacility source")]
    tgGas[isolate] = [isolate, dna, az, collectionDate, emmType, facility]
    tgGas[dna] = [dna, isolate, az, collectionDate, emmType, facility]
    azGas[az] = [isolate, dna, az, collectionDate, emmType, facility]

  # extract all data from workbook
  for row in list(filter(lambda x: re.findall(r"TG\d+", str(x[1])), master)):
    az = row[masterHeader.index("external_id")]
    isolate = row[masterHeader.index("original_sample_id")]
    dna = row[masterHeader.index("subsample_ID")]
    collectionDate = row[masterHeader.index("Date collected\nfrom patient")]
    collectionDate = fixDate(row[masterHeader.index("Date collected\nfrom patient")])
    emmType = row[masterHeader.index("emm-type")]
    if emmType.lower() == "none":
      emmType = ""
    facility = row[masterHeader.index("Original\nfacility source")]
    tgGas[isolate] = [isolate, dna, az, collectionDate, emmType, facility]
    tgGas[dna] = [dna, isolate, az, collectionDate, emmType, facility]
    azGas[az] = [isolate, dna, az, collectionDate, emmType, facility]

  # get all TG
  tgList = list(map(lambda x: x[masterHeader.index("original_sample_id")], master)) + list(map(lambda x: x[historicHeader.index("Isolate \nBarcode")], historic))
  tgList = set(filter(lambda x: x and "TG" in x, tgList))
  tgList = list(map(lambda x: x.split("TG")[-1], tgList))

  # read GAS.tsv
  gasTsv = list(map(lambda x: x.split("\t"), read("/scratch/EPITOOLS/GAS/GAS.tsv").split("\n")))
  gasTsvHeader = gasTsv.pop(0)
  gas = [["external", "sample", "subsample", "collection_date", "emm_type", "facility", "sequence_date", "r1", "r2", "tg92300"]]

  for row in gasTsv:
    tg = re.findall(r"tg\d+", row[0].lower())
    az = re.findall(r"az\d+", row[0].lower())
    if tg and tg[0].upper() in tgGas:
      gas.append([row[0]] + tgGas[tg[0].upper()] + row[1:])
    elif row[0] in tgGas:
      gas.append([row[0]] + tgGas[row[0]] + row[1:])
    elif az and az[0].upper() in azGas:
      gas.append([az[0].upper()] + azGas[az[0].upper()] + row[1:])
    elif row[0] in azGas:
      gas.append([row[0]] + azGas[row[0]] + row[1:])
    elif tg and az:
      gas.append([row[0]] + [tg[0].upper(), az[0].upper(), "", "", "", ""] + row[1:])
    elif tg:
      gas.append([row[0]] + [tg[0].upper(), "", "", "", "", ""] + row[1:])
    elif az:
      gas.append([row[0]] + [az[0].upper(), "", "", "", "", ""] + row[1:])
    else:
      gas.append([row[0]] + ["", "", "", "", "", ""] + row[1:])
  gas = "\n".join(list(map(lambda x: ",".join(list(map(lambda y: str(y).split(",")[0], x))), gas)))

  # print or write to /scratch/EPITOOLS/GAS/GAS.csv
  if "-c" in sys.argv:
    write("/scratch/EPITOOLS/GAS/GAS.csv", gas)
  else:
    print(gas)



if __name__ == '__main__':
    main()
