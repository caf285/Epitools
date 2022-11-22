#!/usr/bin/python3
import os
from os.path import exists
import mysql.connector
import json
from datetime import datetime

def read(file):
  f = open(file, encoding='utf-8-sig')
  out = f.read()
  f.close()
  return out

def openDB():
  db = mysql.connector.connect(
    host="localhost",
    user="epitools",
    password="epiTools1-2-3-4-5",
    database="epitools"
  )
  return db

def openCursor(db):
  return db.cursor()

def main():
  ### open json
  for uploadFile in list(filter(lambda x: "emm" in x, os.listdir("/var/www/pathogen-intelligence.tgen.org/epitools/http_server/py_populate"))):
    uploadHash = json.loads(read(uploadFile))

    ### open cursor
    db = openDB()
    cursor = openCursor(db)

    ### get sequences list
    cursor.execute("DESCRIBE sequence")
    sequenceHeader = list(map(lambda x: x[0], cursor.fetchall()))[1:]
    cursor.execute("SELECT sequence.sample, sequence.reference, pathogen.id, pathogen.sample FROM epitools.sequence RIGHT JOIN epitools.pathogen ON sequence.sample = pathogen.id")
    sequenceList = cursor.fetchall()
    sequenceHash = {}
    for line in sequenceList:
      sequenceHash[line[-1]] = line

    for line in uploadHash:
      data = []
      #print(line, uploadHash[line])
      if not sequenceHash[line][0]:
        print(len(uploadHash[line]["sequence"]))
        data.append((sequenceHash[line][2], uploadHash[line]["reference"], uploadHash[line]["sequence"]))

      sql = "INSERT INTO epitools.sequence (sample, reference, sequence) VALUES (%s, %s, %s)"
      cursor.executemany(sql, data)
      db.commit()



'''
      sql = "INSERT INTO " + table + " (" + ", ".join(columns) + ") VALUES" + "".join(str(tuple(["%s"] * len(columns))).split("'"))
      for line in list(map(lambda x: tuple(x), uploadHash["new"])):
        print(line)
      print(sql)
      cursor.executemany(sql, list(map(lambda x: tuple(x), uploadHash["new"])))
      #db.commit()
'''

if __name__ == "__main__":
  main()
