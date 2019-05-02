#!/usr/bin/env python3

import sys
import datetime

# ==================================================( functions )
def printHelp():
  print("\nreturns all lines of GAS.tsv that follow arguments given")
  print("usage: queryGAS.py [-h] [-n | -d | -l | -m ]")
  print("\t-n\tSample Name")
  print("\t-t\tType")
  print("\t-d\tDate")
  print("\t-l\tLocation")
  print("\t-m\t>M1 Quality Breadth %")
  print("example:\n\t./queryGAS.py -l FMC -m 80\n")
  exit(0)

def read(fileName):
  f = open(fileName, 'r')
  file = f.read().strip()
  f.close
  return file

# ==================================================( main )
def main():

  # check args
  args = {"-n":[], "-d":[], "-l":[], "-m":[]}
  flag = ""
  for arg in sys.argv:
    if arg[0] == "-":
      if arg in list(args.keys()):
        flag = arg
      else:
        printHelp()
    elif flag:
      args[flag].append(arg)

  # correct date args
  best = [datetime.datetime.now(), datetime.datetime(1,1,1)]
  if not args["-d"]:
    args["-d"] = [[best[1], best[0]]]
  else:
    for i in range(len(args["-d"])):
      try:
        date = args["-d"][i].split("-")[:3]
        count = 3 - len(date)
        while len(date) < 3:
          date.append(1)
        lowDate = datetime.datetime(int(date[0]), int(date[1]), int(date[2]))
        if count == 2:
          highDate = lowDate + datetime.timedelta(364)
        elif count == 1:
          highDate = lowDate + datetime.timedelta(364//12)
        else:
          highDate = lowDate
        if lowDate < best[0]:
          best[0] = lowDate
        if highDate > best[1]:
          best[1] = highDate
        args["-d"][0] = best
      except:
        pass
  args["-d"] = args["-d"][0]
  if args["-d"][0] >= args["-d"][1]:
    args["-d"][1] = datetime.datetime.now()

  # correct M1
  best = 100
  if not args["-m"]:
    args["-m"] = 0
  else:
    for i in range(len(args["-m"])):
      try:
        temp = args["-m"][i]
        if temp[-1] == "%":
          temp = float(temp[:-1])
        else:
          temp = float(temp)
        if temp < best:
          best = temp
      except:
        pass
    args["-m"] = best

  # get all samples within passed arguments
  gas = read("/scratch/GAS/GAS.tsv").split("\n")[:-1]
  header = gas.pop(0).split("\t")
  cols = {}
  for i in range(len(header)):
    cols[header[i]] = i

  query = []
  for sample in gas:
    sample = sample.split("\t")
    # check sampleName
    if len(args["-n"]) and args["-n"][0] not in sample[cols["SampleName"]]:
      continue
    # check date
    date = sample[cols["Date"]].split("-")
    date = datetime.datetime(int(date[0]), int(date[1]), int(date[2]))
    if date < args["-d"][0] or date > args["-d"][1]:
      continue
    # check location
    if len(args["-l"]) and args["-l"][0].lower() not in "".join([sample[cols["Facility"]], sample[cols["City"]], sample[cols["County"]], sample[cols["State"]]]).lower():
      continue
    # check mType
    if args["-m"] > float(sample[cols["M1"]][:-1]):
      continue
    query.append("\t".join(sample))
  print("\n".join(query))

if __name__ == "__main__":
  main()






