#!/usr/bin/python3

import json

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

  # get master
  master = read("./master.json")
  master = json.loads(master)

  # open cursor
  db = openDB()
  cursor = openCursor(db)

  for i in range(len(master)):
    sample = sorted(master.keys())[i]
    print(i, "of", len(master), sample)
    cursor.execute("UPDATE pathogen SET sequence='" + master[sample] + "' WHERE name='" + sample + "'")
    cursor.fetchall()

  db.commit()
  #cursor.execute("SELECT * FROM pathogen WHERE id=21244")
  #tableList = cursor.fetchall()
  #print(tableList)

  quit()

# process each table CSV
  cursor.execute("SHOW TABLES")
  tableList = list(map(lambda x: x[0], cursor.fetchall()))
  for table in ["region", "county", "mpc", "pca", "county_pca", "facility_type", "facility", "gas"]:
    print("\npopulating '" + table + "' ...")
    if table in tableList and exists("./tables/" + table + ".csv"):

##### region
      if table == "region":
        # DB  
        cursor.execute("SELECT * FROM " + table)
        dbEntries = list(map(lambda x: x[1], cursor.fetchall()))

        # CSV
        csv = list(map(lambda x: x.split(","), read("./tables/" + table + ".csv").strip().split("\n")))
        csvHeader = csv.pop(0)
        csvEntries = list(map(lambda x: tuple(x), filter(lambda x: x[0] not in dbEntries, csv)))
        print(len(csvEntries), "new entries for table", table, "...")

        # EXECUTE
        if csvEntries:
          sql = "INSERT INTO " + table + " (" + ", ".join(csvHeader) + ") VALUES (%s, %s, %s)"
          print(sql)
          for entry in csvEntries:
            print("\t", entry)
          cursor.executemany(sql, csvEntries)
          #db.commit()

##### county
      if table == "county":
        # DB
        cursor.execute("SELECT * FROM " + table)
        dbEntries = list(map(lambda x: x[1], cursor.fetchall()))

        # CSV
        csv = list(map(lambda x: x.split(","), read("./tables/" + table + ".csv").strip().split("\n")))
        csvHeader = csv.pop(0)
        csvEntries = list(map(lambda x: tuple(x), filter(lambda x: x[0] not in dbEntries, csv)))
        print(len(csvEntries), "new entries for table", table, "...")

        # foreign keys
        cursor.execute("SELECT * FROM region")
        dbRegion = cursor.fetchall()
        dbHash = {}
        for entry in dbRegion:
          dbHash[entry[1]] = entry[0]
        csvEntries = list(map(lambda x: list(x[:-1]) + [dbHash[x[-1]]], csvEntries))

        # EXECUTE
        if csvEntries:
          sql = "INSERT INTO " + table + " (" + ", ".join(csvHeader) + ") VALUES (%s, %s, %s, %s)"
          print(sql)
          for entry in csvEntries:
            print("\t",entry)
          cursor.executemany(sql, csvEntries)
          #db.commit()

##### mpc
      if table == "mpc":
        # DB  
        cursor.execute("SELECT * FROM " + table)
        dbEntries = list(map(lambda x: x[1], cursor.fetchall()))

        # CSV
        csv = list(map(lambda x: x.split(","), read("./tables/" + table + ".csv").strip().split("\n")))
        csvHeader = csv.pop(0)
        csvEntries = list(map(lambda x: tuple(x), filter(lambda x: x[0] not in dbEntries, csv)))
        print(len(csvEntries), "new entries for table", table, "...")

        # foreign keys
        cursor.execute("SELECT * FROM county")
        dbCounty = cursor.fetchall()
        dbHash = {}
        for entry in dbCounty:
          dbHash[entry[1]] = entry[0]
        csvEntries = list(map(lambda x: [x[0]] + [dbHash[x[1]]] + list(x[2:]), csvEntries))

        # EXECUTE
        if csvEntries:
          sql = "INSERT INTO " + table + " (" + ", ".join(csvHeader) + ") VALUES (%s, %s, %s, %s)"
          print(sql)
          for entry in csvEntries:
            print("\t", entry)
          cursor.executemany(sql, csvEntries)
          #db.commit()

##### pca
      if table == "pca":
        # DB
        cursor.execute("SELECT * FROM " + table)
        dbEntries = list(map(lambda x: x[1], cursor.fetchall()))

        # CSV
        csv = list(map(lambda x: x.split(","), read("./tables/" + table + ".csv").strip().split("\n")))
        csvHeader = csv.pop(0)
        csvEntries = list(map(lambda x: tuple(x), filter(lambda x: x[0] not in dbEntries, csv)))
        print(len(csvEntries), "new entries for table", table, "...")

        # foreign keys
        cursor.execute("SELECT * FROM mpc")
        dbMpc = cursor.fetchall()
        dbHash = {}
        for entry in dbMpc:
          dbHash[entry[1]] = entry[0]
        csvEntries = list(map(lambda x: list(x[:-5]) + [dbHash[x[-5]], dbHash[x[-4]], dbHash[x[-3]]] + list(x[-2:]), csvEntries))

        # EXECUTE
        if csvEntries:
          sql = "INSERT INTO " + table + " (" + ", ".join(csvHeader) + ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
          print(sql)
          for entry in csvEntries:
            print("\t",entry)
          cursor.executemany(sql, csvEntries)
          #db.commit()

##### county_pca
      if table == "county_pca":
        # DB
        cursor.execute("SELECT * FROM " + table)
        dbEntries = list(map(lambda x: "::".join([str(x[1]), str(x[2])]), cursor.fetchall()))

        # CSV
        csv = list(map(lambda x: x.split(","), read("./tables/" + table + ".csv").strip().split("\n")))
        csvHeader = csv.pop(0)
        csvEntries = list(map(lambda x: tuple(x), csv))

        # foreign keys
        cursor.execute("SELECT * FROM county")
        dbCounty = cursor.fetchall()
        cursor.execute("SELECT * FROM pca")
        dbPca = cursor.fetchall()
        dbCountyHash = {}
        for entry in dbCounty:
          dbCountyHash[entry[1]] = entry[0]
        dbPcaHash = {}
        for entry in dbPca:
          dbPcaHash[entry[1]] = entry[0]
        csvEntries = list(map(lambda x: [dbCountyHash[x[0]]] + [dbPcaHash[x[1]]], csvEntries))
        csvEntries = list(filter(lambda x: "::".join([str(x[0]), str(x[1])]) not in dbEntries, csvEntries))
        print(len(csvEntries), "new entries for table", table, "...")

        # EXECUTE
        if csvEntries:
          sql = "INSERT INTO " + table + " (" + ", ".join(csvHeader) + ") VALUES (%s, %s)"
          print(sql)
          for entry in csvEntries:
            print("\t",entry)
          cursor.executemany(sql, csvEntries)
          #db.commit()

##### facility_type
      if table == "facility_type":
        # DB  
        cursor.execute("SELECT * FROM " + table)
        dbEntries = list(map(lambda x: x[1], cursor.fetchall()))

        # CSV
        csv = list(map(lambda x: x.split(","), read("./tables/" + table + ".csv").strip().split("\n")))
        csvHeader = csv.pop(0)
        csvEntries = list(map(lambda x: tuple(x[1:]), filter(lambda x: x[1] not in dbEntries, csv)))
        print(len(csvEntries), "new entries for table", table, "...")

        # EXECUTE
        if csvEntries:
          sql = "INSERT INTO " + table + " (" + ", ".join(csvHeader[1:]) + ") VALUES (%s, %s)"
          print(sql)
          for entry in csvEntries:
            print("\t",entry)
          cursor.executemany(sql, csvEntries)
        #db.commit()

##### facility
      if table == "facility":
        # DB
        cursor.execute("SELECT * FROM " + table)
        dbEntries = list(map(lambda x: x[1], cursor.fetchall()))

        # CSV
        csv = list(map(lambda x: x.split(","), read("./tables/" + table + ".csv").strip().split("\n")))
        csvHeader = csv.pop(0)
        csvEntries = list(filter(lambda x: x[0] not in dbEntries, csv))
        print(len(csvEntries), "new entries for table", table, "...")

        # foreign keys
        cursor.execute("SELECT * FROM facility_type")
        dbFacilityType = cursor.fetchall()
        cursor.execute("SELECT * FROM mpc")
        dbMpc = cursor.fetchall()
        dbFacilityTypeHash = {}
        for entry in dbFacilityType:
          dbFacilityTypeHash["::".join([entry[1], entry[2]])] = entry[0]
        dbMpcHash = {}
        for entry in dbMpc:
          dbMpcHash[entry[1]] = entry[0]
        csvEntries = list(map(lambda x: [x[0]] +  [dbFacilityTypeHash[x[1]]] + [x[2]] + [dbMpcHash[x[3]]] + x[4:], csvEntries))

        # EXECUTE
        if csvEntries:
          sql = "INSERT INTO " + table + " (" + ", ".join(csvHeader) + ") VALUES (%s, %s, %s, %s, %s, %s)"
          print(sql)
          for entry in csvEntries:
            print("\t",entry)
          cursor.executemany(sql, csvEntries)
          #db.commit()

##### gas
      if table == "gas":
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
          sql = "INSERT INTO " + table + " (" + ", ".join(csvHeader) + ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
          print(sql)
          for entry in csvEntries:
            print("\t",entry)
          cursor.executemany(sql, csvEntries)
          #db.commit()




if __name__ == "__main__":
  main()
