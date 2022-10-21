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
      cursor.execute("SHOW COLUMNS FROM pathogen")
      col = list(map(lambda x: x[0], cursor.fetchall()))[:-2]
      print(col)

      cursor.execute("SELECT * FROM " + table + " WHERE additional_metadata2 IS NULL")
      for x in cursor.fetchall():
        print(x)
        ad = []
        for i in range(2, len(col)-1):
          print(col[i], x[i])
          ad.append("\"" + col[i] + "\": \"" + str("".join(str(x[i]).split("'")) if x[i] else "") + "\"")

        #print(x[-1])
        #print(x[-2].decode('ascii'))
        #print(x[-2].decode('ascii').replace("\'", "\""))
        print("UPDATE " + table + " SET additional_metadata2 = \'{" + ", ".join(ad) + "}\' WHERE id = \"" + str(x[0]) + "\"")
        #print("UPDATE " + table + " SET additional_metadata = \'" + x[-1].decode('ascii').replace("\'", "\"") + "\' WHERE id = \"" + str(x[0]) + "\"")
        #print()
        cursor.execute("UPDATE " + table + " SET additional_metadata2 = \'{" + ", ".join(ad) + "}\' WHERE id = \"" + str(x[0]) + "\"")
        #cursor.execute("UPDATE " + table + " SET additional_metadata = \'" + x[-1].decode('ascii').replace("\'", "\"") + "\' WHERE id = \"" + str(x[0]) + "\"")
      #db.commit()

if __name__ == "__main__":
  main()
