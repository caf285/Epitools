#!/usr/bin/python3

# replace all single quotes with double quotes in all blobs in epitools.pathogen

from os.path import exists
import mysql.connector

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

  # open cursor
  db = openDB()
  cursor = openCursor(db)

  # process each table CSV
  cursor.execute("SHOW TABLES")
  tableList = list(map(lambda x: x[0], cursor.fetchall()))
  for table in ["pathogen"]:
    ##### pathogen
    if table == "pathogen":
      # DB
      cursor.execute("SELECT * FROM " + table + " WHERE additional_metadata IS NOT NULL")
      for x in cursor.fetchall():
        print(x[1])
        #print(x[-1].decode('ascii'))
        print(x[-1].decode('ascii').replace("\'", "\""))
        print("UPDATE " + table + " SET additional_metadata = \'" + x[-1].decode('ascii').replace("\'", "\"") + "\' WHERE id = \"" + str(x[0]) + "\"")
        print()
        cursor.execute("UPDATE " + table + " SET additional_metadata = \'" + x[-1].decode('ascii').replace("\'", "\"") + "\' WHERE id = \"" + str(x[0]) + "\"")
      #db.commit()

if __name__ == "__main__":
  main()
