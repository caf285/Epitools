#!/usr/bin/python3

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
  uploadHash = json.loads(read("gisaid_upload.json"))

  # open cursor
  db = openDB()
  cursor = openCursor(db)

  # process each table CSV
  cursor.execute("SHOW TABLES")
  tableList = list(map(lambda x: x[0], cursor.fetchall()))
  for table in ["pathogen"]:
    print("\npopulating '" + table + "' ...")
    cursor.execute("DESCRIBE " + table)
    columns = list(map(lambda x: x[0], cursor.fetchall()))[1:]
    print(columns)
    print("".join(str(tuple(["%s"] * len(columns))).split("'")))
    if table == "pathogen":
      # EXECUTE
      
      sql = "INSERT INTO " + table + " (" + ", ".join(columns) + ") VALUES" + "".join(str(tuple(["%s"] * len(columns))).split("'"))
      uploadList = []
      for i in range(len(uploadHash["new"])):
        uploadList.append(tuple(uploadHash["new"][i]))
        print(uploadList[-1], "\n")
        if i % 10 == 0 or i >= len(uploadHash["new"]) - 1:
          cursor.executemany(sql, uploadList)
          uploadList = []

      sql = "UPDATE " + table + " SET " + ", ".join(list(map(lambda x: x + " = %s", columns[1:]))) + " WHERE sample = %s"
      uploadList = []
      for i in range(len(uploadHash["update"])):
        uploadList.append(tuple(uploadHash["update"][i]))
        print(uploadList[-1], "\n")
        if i % 10 == 0 or i >= len(uploadHash["new"]) - 1:
          cursor.executemany(sql, uploadList)
          uploadList = []

      db.commit()

if __name__ == "__main__":
  main()
