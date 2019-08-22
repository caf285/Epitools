#!/usr/bin/env python3

import sys
import datetime
import json

# ==================================================( functions )
def printHelp():
  print("\nreturns all lines of GAS.tsv that follow arguments given")
  print("usage: queryGAS.py [-h] [-j | -exact | -n | -e | -d | -l | -m ]")
  print("\t-exact\tExact Sample Name")
  print("\t-n\tSample Name")
  print("\t-e\tExclude Name")
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

  #TODO: support for TYPE

  # check args
  # fill dictionary for all accepted args
  args = {"-j":[], "-exact":[], "-n":[], "-e":[], "-d":[], "-l":[], "-m":[]}
  flag = ""
  for arg in sys.argv:
    if arg[0] == "-":
      if arg in list(args.keys()):
        flag = arg
      else:
        printHelp()
    elif flag:
      args[flag].append(arg)

  # convert json arg to json format
  # handles single list in json format
  try:
    args["-j"] = json.loads("".join(args["-j"]))
  except:
    args["-j"] = []

  # correct date args
  # if a single date is given, only get that date
  # if a single year is given, get all for that entire year
  # if multiple dates ate given, get all between lowest and highest date range
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
  # expected input is a number between 0 and 100, or _ which signifies empty M1 data
  # the % symbol is also pruned away if it exists
  # if multiple values are passed, take the lowest, _ is prioritized before all else
  best = 100
  if not args["-m"]:
    args["-m"] = 0
  elif "_" in "".join(args["-m"]):
    args["-m"] = "_"
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

  # build dictionary of columns
  # this allows for dynamic column checks by name so GAS.tsv is free for expansion
  gas = read("/scratch/GAS/GAS.tsv").strip().split("\n")
  header = gas.pop(0).split("\t")
  cols = {}
  for i in range(len(header)):
    cols[header[i]] = i

  # check query args
  # if the line servives to the end, it added to the output
  # GOOD LUCK DATA!! may the odds be ever in your favor!
  query = ["\t".join(header)]
  for sample in gas:
    sample = sample.split("\t")

    # check for JSON list
    #if len(args["-j"]) > 0 and sample[0] not in args["-j"]:
    #  continue

    # check exact sampleName
    if len(args["-exact"]) > 0 and sample[0] not in args["-exact"]:
      continue

    # check sampleName
    # trigger used to include all names for -n flag, but exclude all names for -e flag
    nameTrigger = True
    for i in range(len(args["-n"])):
      if args["-n"][i].lower() in sample[cols["SampleName"]].lower():
        nameTrigger = False
    if len(args["-n"]) and nameTrigger == True:
      continue
    else:
      nameTrigger = False
    for i in range(len(args["-e"])):
      if args["-e"][i].lower() in sample[cols["SampleName"]].lower():
        nameTrigger = True
    if len(args["-e"]) and nameTrigger == True:
      continue

    # check date
    date = sample[cols["Date"]].split("-")
    date = datetime.datetime(int(date[0]), int(date[1]), int(date[2]))
    if date < args["-d"][0] or date > args["-d"][1]:
      continue

    # check location
    if len(args["-l"]):
      if args["-l"][0] == "ALL":
        if "".join([sample[cols["Facility"]], sample[cols["City"]], sample[cols["County"]], sample[cols["State"]]]).lower() == "____":
          continue
      elif args["-l"][0].lower() not in "".join([sample[cols["Facility"]], sample[cols["City"]], sample[cols["County"]], sample[cols["State"]]]).lower():
        continue

    # check mType
    if args["-m"] != []:
      if args["-m"] == "_":
        if sample[cols["M1"]] != "_":
          continue
      elif sample[cols["M1"]] == "_" or args["-m"] > float(sample[cols["M1"]][:-1]):
        continue

    # CONGRATULATIONS!!! you have fought bravely and now receive the grand honor of being printed to the screen!
    # Will you be destined to waste away in the endess walls of text, or will your journey continue after piping into another script?
    query.append("\t".join(sample))
  print("\n".join(query))

if __name__ == "__main__":
  main()






