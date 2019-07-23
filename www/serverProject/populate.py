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
  from newick.models import FacilityType
  from newick.models import Facility
  from newick.models import MPC
  from newick.models import PCA
  from newick.models import County
  from newick.models import CountyPCA
  from newick.models import Region

  for model in ["Bacteria", "Drug", "Region", "County", "MPC", "PCA", "CountyPCA", "FacilityType", "Facility", "DemoAMR"]:
    if model + ".csv" not in fileList:
      continue

    csv = read("CSV/" + model + ".csv").strip().split("\n")[1:]
    print(model)

    # Bacteria

    # Drug

    # Region
    if model == "Region":
      #for x in Region.objects.all():
      #  print("\tremoving ", x)
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        Region.objects.get_or_create(id=line[0], lat=line[1], lon=line[2])

    # County
    if model == "County":
      #for x in County.objects.all():
      #  print("\tremoving ", x)
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        County.objects.get_or_create(id=line[0], lat=line[1], lon=line[2], region=Region.objects.filter(id=line[3])[0])

    # MPC
    if model == "MPC":
      #for x in MPC.objects.all():
      #  print("\tremoving ", x)
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        MPC.objects.get_or_create(id=line[0], lat=line[1], lon=line[2])

    # PCA
    elif model == "PCA":
      #for x in PCA.objects.all():
      #  print("\tremoving ", x)
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        PCA.objects.get_or_create(id=line[0], lat=line[1], lon=line[2], number=line[3], score=line[4], rural=line[5], tax=line[6], azmua=line[7], pchpsa=line[8], fedmuap=line[9], mpc1=MPC.objects.filter(id=line[10])[0], mpc2=MPC.objects.filter(id=line[11])[0], mpc3=MPC.objects.filter(id=line[12])[0], travel2=line[13], travel3=line[14])

    # CountyPCA
    elif model == "CountyPCA":
      #for x in CountyPCA.objects.all():
      #  print("\tremoving ", x)
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        CountyPCA.objects.get_or_create(county=County.objects.filter(id=line[0])[0], pca=PCA.objects.filter(id=line[1])[0])

    # FacilityType
    elif model == "FacilityType":
      #for x in FacilityType.objects.all():
      #  print("\tremoving ", x)
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        FacilityType.objects.get_or_create(type1=line[1], type2=line[2])

    # Facility
    elif model == "Facility":
      for x in Facility.objects.all():
        print("\tremoving ", x)
        x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        facility = Facility.objects.get_or_create(id=line[0], type=FacilityType.objects.filter(type1=line[1].split("::")[0], type2=line[1].split("::")[-1])[0], capacity=line[2], certification=line[3], mpc=MPC.objects.filter(id=line[4])[0], address=line[5], zip=line[6], phone=line[7], fax=line[8], lat=line[9], lon=line[10])

'''
    # DemoAMR
    elif model == "DemoAMR":
      #for x in DemoAMR.objects.all():
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        amr = DemoAMR.objects.get_or_create(facility=Facility.objects.filter(id=line[0])[0], bacteria=Bacteria.objects.filter(id=line[1])[0], drug=Drug.objects.filter(id=line[2])[0], date=line[3], tested=line[4], suseptable=line[5])
'''

if __name__ == "__main__":
  main()
