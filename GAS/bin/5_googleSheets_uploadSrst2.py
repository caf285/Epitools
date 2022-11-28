#!/usr/bin/env python

#==================================================( Imports and Functions )
### import
import sys
import os
import json
import re
from oauth2client.service_account import ServiceAccountCredentials
from googleapiclient import discovery

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

def a1(x):
  if x >= 26: 
    return a1((x//26)-1) + chr((x%26) + 65) 
  else:
    return chr(x + 65)

def main():
  #==================================================( authentication )
  ### set directories
  wd = "/".join(sys.argv[0].split("/")[:-1]) + "/" # working directory
  pd = os.path.abspath(os.path.join(wd, os.pardir)) + "/" # parent directory

  ### authentification
  scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
  creds = ServiceAccountCredentials.from_json_keyfile_name(wd + 'googleSheets_cred.json', scope)
  service = discovery.build('sheets', 'v4', credentials=creds)

  #==================================================( Open Files )
  ### open and hash google sheet
  google = json.load(open(wd + "googleSheets_allGas_Master.json"))
  googleHeader = google.pop(0)
  googleHash = {}
  for line in google:
    if re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper()):
      googleHash[re.findall("TG\d+", line[googleHeader.index("original_sample_id")].upper())[0]] = line

  ### open and hash stEm (for emm-typing)
  emmTypes = list(map(lambda x: x.split("\t"), read(wd + "googleSheets_stEm.txt").split("\n")))
  emmHash = {}
  for line in emmTypes:
    emmHash[line[0]] = line[1]

  ### open and hash srst2 files
  srst2Header = []
  srst2Hash = {}
  for line in sys.argv[1:]:
    if os.path.exists(line):
      srst2 = list(map(lambda x: x.split("\t"), read(line).split("\n")))
      header = srst2.pop(0)
      srst2Header += header
      if "ST" in header and "emm-type" not in srst2Header:
        srst2Header.append("emm-type")
      for sample in list(filter(lambda x: "Sample" in header and x[header.index("Sample")] in googleHash, srst2)):
        if sample[header.index("Sample")] not in srst2Hash:
          srst2Hash[sample[header.index("Sample")]] = {}
        for head in header:
          srst2Hash[sample[header.index("Sample")]][head] = sample[header.index(head)]
        if "ST" in header:
          if re.findall("\d+", sample[header.index("ST")]) and "ST" + re.findall("\d+", sample[header.index("ST")])[0] in emmHash:
            srst2Hash[sample[header.index("Sample")]]["emm-type"] = emmHash["ST" + re.findall("\d+", sample[header.index("ST")])[0]]
          else:
            srst2Hash[sample[header.index("Sample")]]["emm-type"] = "-"
        

  ### exit if empty header
  if len(list(filter(lambda x: x in srst2Header, googleHeader))) <= 0:
    print("... no upload headers, quitting")
    quit()

  ### build upload hash
  uploadHeader = googleHeader[googleHeader.index(list(filter(lambda x: x in srst2Header, googleHeader))[0]):googleHeader.index(list(filter(lambda x: x in srst2Header, googleHeader))[-1]) + 1]
  uploadHash = {}
  for sample in srst2Hash:
    sampleObj = []
    for head in uploadHeader:
      if head not in srst2Hash[sample]:
        sampleObj.append(googleHash[sample][googleHeader.index(head)])
      else:
        sampleObj.append(srst2Hash[sample][head])
    uploadHash[sample] = list(map(lambda x: x if x else "-", sampleObj))
    #print(sample, sampleObj)
  print("upload header: ", uploadHeader)
  print()

  ### exit if empty upload hash
  if not uploadHash:
    print("... no samples to upload, quitting")
    quit()

  #==================================================( Get Master iGAS Sheet )
  ### get sheet information
  # ID from url; https://docs.google.com/spreadsheets/d/19KP_S1Jy8nAkJ6hwtvuDvosa3rvlG1VfPOq6mYJPclw/edit#gid=1346679936
  masterId = "19KP_S1Jy8nAkJ6hwtvuDvosa3rvlG1VfPOq6mYJPclw"
  # sheet name in A1 notation
  masterRange = "MASTERGAS" # Sheet Name
  # 'SERIAL_NUMBER', 'FORMATTED_STRING'
  masterDateTimeRenderOption = "FORMATTED_STRING"
  # 'DIMENSION_UNSPECIFIED', 'ROWS', 'COLUMNS'
  masterMajorDimension = "ROWS"
  # 'FORMATTED_VALUE' (default), 'UNFORMATTED_VALUE', 'FORMULA'
  masterValueRenderOption = "UNFORMATTED_VALUE"

  ### get sheet
  masterRequest = service.spreadsheets().values().get(spreadsheetId=masterId, range=masterRange, valueRenderOption=masterValueRenderOption, majorDimension=masterMajorDimension, dateTimeRenderOption=masterDateTimeRenderOption)
  masterResponse = dict(masterRequest.execute())["values"]
  masterHeader = masterResponse.pop(0)
  #print(masterHeader)
  # masterHeader <- ['external_id', 'original_sample_id', 'subsample_ID', 'City', 'Original facility source', 'Date collected from patient', 'Date TGen Received', 'Glycerol Stock Date', 'Date Extracted', 'HIVE prep date', 'Sequence date', 'Seq run #', 'Run # if re-sequenced', 'Additional Notes', 'emm-type', 'Scaffold \nN/L50', 'ST', 'gki', 'gtr', 'murI', 'mutS', 'recP', 'xpt', 'yqiL', 'mismatches', 'uncertainty', 'depth', 'maxMAF', 'Ant6-Ia_AGly', 'Aph3-III_AGly', 'ErmB_MLS', 'ErmC_MLS', 'Sat4A_AGly', 'TetM_Tet']

  #==================================================( Upload Missing Data to GoogleSheets )
  ### get [..., 'City', ... 'emm-type', ... 'ST', 'gki', 'gtr', 'murI', 'mutS', 'recP', 'xpt', 'yqiL', 'mismatches', 'uncertainty', 'depth', 'maxMAF', 'Ant6-Ia_AGly', 'Aph3-III_AGly', 'ErmB_MLS', 'ErmC_MLS', 'Sat4A_AGly', 'TetM_Tet'] from analysis
  # google sheet update documentation -> https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate
  # 'INPUT_VALUE_OPTION_UNSPECIFIED', 'RAW', 'USER_ENTERED'
  valueInputOption = "USER_ENTERED"
  # [{'range': 'A1:A1', 'majorDimension':'ROWS', 'values':'1'}, ...]
  data = []
  for i in range(len(masterResponse)):
    if masterResponse[i]:
      sample = masterResponse[i][googleHeader.index("original_sample_id")]
      if sample in uploadHash and str(list(map(lambda x: str(x), masterResponse[i][masterHeader.index(uploadHeader[0]):masterHeader.index(uploadHeader[-1]) + 1]))) != str(list(map(lambda x: str(x), uploadHash[sample]))):
        data.append({"range": "MASTERGAS!" + str(a1(masterHeader.index(uploadHeader[0])) + str(i + 2)), "majorDimension": "ROWS", "values": [list(map(lambda x: str(x), uploadHash[sample]))]})
        print(a1(masterHeader.index(uploadHeader[0])) + str(i + 2), sample, uploadHash[sample])
        print("old data (currently in sheet): ", str(list(map(lambda x: str(x), masterResponse[i][masterHeader.index(uploadHeader[0]):masterHeader.index(uploadHeader[-1]) + 1]))))
        print("new data (to be uploaded):     ", str(list(map(lambda x: str(x), uploadHash[sample]))))
        print()

  ### double check with user before upload
  if not data:
    print("... no samples to upload, quitting")
    quit()

  userInput = ""
  while userInput.lower() not in ["y", "yes"]:
    userInput = input("upload data for " + str(len(data)) + " samples [y/n]? ")
    if userInput.lower() in ["n", "no"]:
      print("... quitting")
      quit()

  batch_update_values_request_body = {
    'value_input_option': valueInputOption,
    'data': data
  }

  request = service.spreadsheets().values().batchUpdate(spreadsheetId=masterId, body=batch_update_values_request_body)
  response = request.execute()

if __name__ == '__main__':
    main()
