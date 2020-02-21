#!/usr/bin/env python

#==================================================( Imports and Functions )
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
  ### Authentication
  scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
  creds = ServiceAccountCredentials.from_json_keyfile_name('/scratch/GAS/bin/Quickstart-e56f1e5b2848.json', scope)
  client = gspread.authorize(creds)

  ### Get and Read All Sheets
  allGAS = client.open('All GAS')
  masterSheet = allGAS.worksheet("MASTER GAS")
  historicSheet = allGAS.worksheet("Historic GAS")
  facilitySheet = allGAS.worksheet("Facility")
  metaSheet = allGAS.worksheet("MetaData")

  ### Save All Sheets
  master = masterSheet.get_all_values()
  historic = historicSheet.get_all_values()
  facility = facilitySheet.get_all_values()
  meta = metaSheet.get_all_values()

  ### Write All Sheets
  write("/scratch/GAS/googleMaster.json", json.dumps(master))
  write("/scratch/GAS/googleHistoric.json", json.dumps(historic))
  write("/scratch/GAS/googleFacility.json", json.dumps(facility))
  write("/scratch/GAS/googleMeta.json", json.dumps(meta))

if __name__ == '__main__':
    main()
