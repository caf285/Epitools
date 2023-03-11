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
  uploadHash = json.loads(read("epitools_pathogen_upload.json"))

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
      for line in list(map(lambda x: tuple(x), uploadHash["new"])):
        print(line)
      print(sql)
      cursor.executemany(sql, list(map(lambda x: tuple(x + [""]), uploadHash["new"])))
      #cursor.executemany(sql, list(map(lambda x: tuple(x), uploadHash["new"])))
      db.commit()

      sql = "UPDATE " + table + " SET " + ", ".join(list(map(lambda x: x + " = %s", columns[1:]))) + " WHERE sample = %s"
      for line in list(map(lambda x: tuple(x[1:] + [x[0]]), uploadHash["update"])):
        print(line)
      print(sql)
      cursor.executemany(sql, list(map(lambda x: tuple(x[1:] + [x[0]] + [""]), uploadHash["update"])))
      #cursor.executemany(sql, list(map(lambda x: tuple(x[1:] + [x[0]]), uploadHash["update"])))
      db.commit()
      '''
      sql = "DELETE FROM " + table + " WHERE subsample = %s"
      cursor.executemany(sql, list(map(lambda x: tuple([x[0]]), uploadHash["update"])))
      i#db.commit()
      '''

if __name__ == "__main__":
  main()
