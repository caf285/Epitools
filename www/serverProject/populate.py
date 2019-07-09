#!/usr/bin/env python3.4

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "serverProject.settings")

import sys
sys.path.append('/home/cfrench/serverEnv/lib/python3.4/site-packages/')

import django
django.setup()

def read(file):
  f = open(file)
  out = f.read()
  f.close()
  return out

def main():

  fileList = os.listdir("CSV")
  model = ""

  from newick.models import DemoAMR
  from newick.models import Bacteria
  from newick.models import Drug
  from newick.models import Facility
  from newick.models import MPC
  from newick.models import PCA
  from newick.models import County
  from newick.models import CountyPCA
  from newick.models import Region

  for model in ["Bacteria", "Drug", "MPC", "Facility", "PCA", "County", "CountyPCA", "Region", "DemoAMR"]:
    if model + ".csv" not in fileList:
      continue

    csv = read("CSV/" + model + ".csv").strip().split("\n")[1:]
    print(model)

    # Bacteria

    # Drug

    # MPC
    if model == "MPC":
      #for x in MPC.objects.all():
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        mpc = MPC.objects.get_or_create(id=line[0], coordinate=line[1])

    # Facility
    elif model == "Facility":
      #for x in Facility.objects.all():
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        facility = Facility.objects.get_or_create(id=line[0], type=line[1], coordinate=line[2], mpc=MPC.objects.filter(id=line[3])[0])

    # PCA
    elif model == "PCA":
      for x in PCA.objects.all():
        x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        pca = PCA.objects.get_or_create(id=line[0], coordinate="".join(str(line[1]+","+line[2]).split("\"")), mpc1=MPC.objects.filter(id=line[3])[0], mpc2=MPC.objects.filter(id=line[4])[0], mpc3=MPC.objects.filter(id=line[5])[0])

    # County

    # CountyPCA
    elif model == "CountyPCA":
      #for x in CountyPCA.objects.all():
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        countypca = CountyPCA.objects.get_or_create(county=County.objects.filter(id=line[0])[0], pca=PCA.objects.filter(id=line[1])[0])

    # Region

    # DemoAMR
    elif model == "DemoAMR":
      #for x in DemoAMR.objects.all():
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        amr = DemoAMR.objects.get_or_create(facility=Facility.objects.filter(id=line[0])[0], bacteria=Bacteria.objects.filter(id=line[1])[0], drug=Drug.objects.filter(id=line[2])[0], date=line[3], tested=line[4], suseptable=line[5])


if __name__ == "__main__":
  main()
