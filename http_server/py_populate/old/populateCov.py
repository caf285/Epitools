#!/usr/bin/python3

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
    print("\npopulating '" + table + "' ...")
    if table in tableList and exists("./tables/" + table + ".csv"):
      print("yes")
##### pathogen
      if table == "pathogen":
        # DB
        cursor.execute("SELECT * FROM " + table)
        dbEntries = []
        for x in cursor.fetchall():
          dbEntries.append(x[1])
          dbEntries.append(x[2])

        # CSV
        csv = list(map(lambda x: x.split(","), read("./tables/" + table + ".csv").strip().split("\n")))
        csvHeader = csv.pop(0)
        csvEntries = list(filter(lambda x: x[0] not in dbEntries and x[1] not in dbEntries, csv))
        csvEntries = list(map(lambda x: list(map(lambda y: y if y else None, x)), csvEntries))
        print(len(csvEntries), "new entries for table", table, "...")

        # foreign keys
        #cursor.execute("SELECT * FROM facility")
        #dbFacility = cursor.fetchall()
        #dbFacilityHash = {}
        #for entry in dbFacility:
        #  dbFacilityHash[entry[1]] = entry[0]
        #for entry in csvEntries:
        #  if entry[5] not in dbFacilityHash:
        #    print("\t", entry[5], entry)
        #quit()
        #csvEntries = list(map(lambda x: [x[:5]] +  [dbFacilityHash[x[5]] if x[5] not in ["Abrazo", "", "None"] else dbFacilityHash["_"]] + [x[6:]], csvEntries))
        #csvEntries = list(map(lambda x: [x[:5]] +  [dbFacilityHash[x[5]] if x[5] not in ["Abrazo", "", "None"] else dbFacilityHash["_"]] + [x[6:]], csvEntries))

        # EXECUTE
        if csvEntries:
          sql = "UPDATE " + table + " SET (" + ", ".join(csvHeader) + ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
          #sql = "INSERT INTO " + table + " (" + ", ".join(csvHeader) + ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
          print(sql)
          for entry in csvEntries:
            print("\t",entry)
          cursor.executemany(sql, csvEntries)
          #db.commit()




if __name__ == "__main__":
  main()
