#!/usr/bin/env python

#==================================================( Imports and Functions )
### import
import sys
import json
import re
import subprocess
import gspread
from oauth2client.service_account import ServiceAccountCredentials

### i/o functions
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
  #==================================================( Save Sheets )
  ### set environment
  wd = "/".join(sys.argv[0].split("/")[:-1]) + "/" # working directory

  ### Authentication
  scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
  creds = ServiceAccountCredentials.from_json_keyfile_name(wd + 'googleSheets_cred.json', scope)
  client = gspread.authorize(creds)

  ### Get and Read All Sheets
  allGAS = client.open('All GAS')
  historicSheet = allGAS.worksheet("Historic GAS")

  ### Save All Sheets
  historic = historicSheet.get_all_values()

  ### Write All Sheets
  write(wd + "googleSheets_allGas_Historic.json", json.dumps(historic))
  print("... file written to " + wd + "googleSheets_allGas_Historic.json")

  #==================================================( Open Files )
  ### set environment
  wd = "/".join(sys.argv[0].split("/")[:-1]) + "/" # working directory

  ### open and hash google sheet
  google = json.load(open(wd + "googleSheets_allGas_Historic.json"))
  google.pop(0) # remove initial line
  googleHeader = google.pop(0)
  googleHash = {}

  for line in google:
    if re.findall("TG\d+", line[googleHeader.index("Isolate Barcode")].upper()):
      googleHash[re.findall("TG\d+", line[googleHeader.index("Isolate Barcode")].upper())[0]] = line

  ### find all read pairs and write locations in file
  print("\nfinding all read pairs ...")
  readsHash = {}
  err = []
  for key in googleHash.keys():
    run = ""
    reads = []
    if googleHash[key][googleHeader.index("Run # if\nre-sequenced")].strip():
      run = googleHash[key][googleHeader.index("Run # if\nre-sequenced")].strip()
    elif googleHash[key][googleHeader.index("Seq run #")].strip():
      run = googleHash[key][googleHeader.index("Seq run #")].strip()
    if run: # first search for non-trailing character in run names (avoides dirs like 'TGN-NextSeq0472-old')
      run = subprocess.Popen("find /TGenNextGen/ -maxdepth 1 -type d -iname *" + run + " 2>/dev/null", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
      run = run.stdout.read()
      if not run: # search for trailing characters after run name
        run = subprocess.Popen("find /TGenNextGen/ -maxdepth 1 -type d -iname *" + run + "* 2>/dev/null", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
        run = run.stdout.read()
      if run:
        run = sorted(run.strip().split("\n"))[0]
        if key:
          reads = subprocess.Popen("find " + run + "* -type f -iname *" + key + "*.fastq.gz 2>/dev/null", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
          reads = reads.stdout.read()
        if reads and "_R1_" in reads and "_R2_" in reads:
          reads = sorted(reads.strip().split("\n"))[:2]
        elif re.findall("TG\d+", googleHash[key][googleHeader.index("DNA \nBarcode")].strip().upper()):
          reads = subprocess.Popen("find " + run + " -type f -iname *" + re.findall("TG\d+", googleHash[key][googleHeader.index("DNA \nBarcode")].upper())[0] + "*.fastq.gz 2>/dev/null", universal_newlines=True, shell=True, stdout=subprocess.PIPE)
          reads = reads.stdout.read()
          if reads and "_R1_" in reads and "_R2_" in reads:
            reads = sorted(reads.strip().split("\n"))[:2]
        if reads:
          readsHash[key] = reads
        else:
          print("sample not found: (", "'" + key + "', ", "'" + googleHash[key][googleHeader.index("DNA \nBarcode")] + "'", "); for run: (", "'" + run + "'", ")")
      if not reads and not run:
        print("run not found: (", "'" + googleHash[key][googleHeader.index("Run # if\nre-sequenced")] + "', ", "'" + googleHash[key][googleHeader.index("Seq run #")] + "'", "); for sample: (", "'" + key + "', ", "'" + googleHash[key][googleHeader.index("DNA \nBarcode")] + "'", ")")
      if not reads:
        err.append(key)
        err.append(googleHash[key][googleHeader.index("DNA \nBarcode")])

  ### write reads pairs to file
  write(wd + "readPairs_historic_locations.json", json.dumps(readsHash))
  print("... file written to " + wd + "readPairs_historic_locations.json\n")
  print("BASH script to find missing TG#s in /TGenNextgen/:\n")
  print("ls /TGenNextGen/*/ -1td | while read line; do echo ... searching ${line} ...; find ${line} -iname \"*" + "*.fastq.gz\" -o -iname \"*".join(re.findall("TG\d+", "".join(err))) + "*.fastq.gz\" 2>/dev/null; done")
  print()

if __name__ == '__main__':
    main()
