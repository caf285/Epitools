#!/usr/bin/python3

from os.path import exists
import mysql.connector
import json
from datetime import datetime
import sys

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
  print("reading sequence file")
  if list(filter(lambda x: x.lower() in ["--stdin", "-s"], sys.argv)):
    uploadHash = []
    for line in sys.stdin:
      uploadHash.append(line)
    uploadHash = json.loads("\n".join(uploadHash))
  else:
    uploadHash = json.loads(read("epitools_sequences.json"))

  # open cursor
  db = openDB()
  cursor = openCursor(db)

  sql = "UPDATE epitools.pathogen SET sequence = %s WHERE sample = %s"
  count = 1
  total = len(uploadHash.keys())
  for sample in uploadHash:
    print("updating", count, "of", total, sample)
    cursor.execute(sql, (uploadHash[sample], sample))
    count += 1

    db.commit()

if __name__ == "__main__":
  main()
