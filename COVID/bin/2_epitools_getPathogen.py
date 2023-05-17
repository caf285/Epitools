#!/usr/bin/env python

#==================================================( Imports and Functions )
### i/o
import sys
import json

### authentification
import requests

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

  ### authentication
  url = 'https://pathogen-intelligence.tgen.org/go_epitools/pathogen'

  ### get pathogen names
  requests.packages.urllib3.disable_warnings()
  myObj = {"key": "value"}
  pathogen = requests.post(url, json=myObj, verify=False)

  ### write pathogen
  write(wd + "epitools_pathogen.json", pathogen.text)
  print("... file written to " + wd + "epitools_pathogen.json")
  
if __name__ == '__main__':
    main()
