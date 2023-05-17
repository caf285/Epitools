#!/usr/bin/env python

#==================================================( Imports and Functions )
### i/o
import sys

### Getting and Reading Google Sheets
import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials

### File IO
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
  allGAS = client.open('COVIDseq Master Spreadsheet')
  masterSheet = allGAS.worksheet("Master")

  ### Save All Sheets
  master = masterSheet.get_all_values()

  ### Write All Sheets
  write(wd + "googleSheets_covidSeq_Master.json", json.dumps(master))
  print("... file written to " + wd + "googleSheets_covidSeq_Master.json")

if __name__ == '__main__':
    main()
