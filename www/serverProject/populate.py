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

  from newick.models import Region
  from newick.models import County
  from newick.models import MPC
  from newick.models import PCA
  from newick.models import CountyPCA

  from newick.models import FacilityType
  from newick.models import Facility

  from newick.models import GAS

  from newick.models import Bacteria
  from newick.models import Antibiotic
  from newick.models import CollectionMethod
  from newick.models import AMR
  from newick.models import Resistance

  for model in ["Region", "County", "MPC", "PCA", "CountyPCA", "FacilityType", "Facility", "GAS", "Bacteria", "Antibiotic", "CollectionMethod", "AMR", "Resistance"]:
    if model + ".csv" not in fileList:
      continue

    csv = read("CSV/" + model + ".csv").strip().split("\n")[1:]
    print(model)
    '''
    ##### Arizona Map
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
    if model == "PCA":
      #for x in PCA.objects.all():
      #  print("\tremoving ", x)
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        PCA.objects.get_or_create(id=line[0], lat=line[1], lon=line[2], number=line[3], score=line[4], rural=line[5], tax=line[6], azmua=line[7], pchpsa=line[8], fedmuap=line[9], mpc1=MPC.objects.filter(id=line[10])[0], mpc2=MPC.objects.filter(id=line[11])[0], mpc3=MPC.objects.filter(id=line[12])[0], travel2=line[13], travel3=line[14])

    # CountyPCA
    if model == "CountyPCA":
      #for x in CountyPCA.objects.all():
      #  print("\tremoving ", x)
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        CountyPCA.objects.get_or_create(county=County.objects.filter(id=line[0])[0], pca=PCA.objects.filter(id=line[1])[0])

    ##### Facilities
    # FacilityType
    if model == "FacilityType":
      #for x in FacilityType.objects.all():
      #  print("\tremoving ", x)
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        FacilityType.objects.get_or_create(type1=line[1], type2=line[2])
    '''

    # Facility
    #if model == "Facility":
      #for x in Facility.objects.all():
      #  print("\tremoving ", x)
      #  x.delete()
      #for line in csv:
      #  line = line.split(",")
      #  print(line)
      #  Facility.objects.get_or_create(id=line[0], type=FacilityType.objects.filter(type1=line[1].split("::")[0], type2=line[1].split("::")[-1])[0], capacity=line[2], certification=line[3], mpc=MPC.objects.filter(id=line[4])[0], address=line[5], zip=line[6], phone=line[7], fax=line[8], lat=line[9], lon=line[10])

    ##### Group A Strep
    # GAS
    if model == "GAS":
      #for x in GAS.objects.all():
      #  print("\tremoving ", x)
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        try:
          GAS.objects.get_or_create(id=line[0], tg=line[1], az=line[2], collectionDate=line[3] if line[3].lower() not in ['none', 'unknown'] else line[6], facilityStr=line[5], facility=Facility.objects.filter(id=line[5])[0] if Facility.objects.filter(id=line[5]) else Facility.objects.filter(id="_")[0], r1=line[7], r2=line[8], sequenceDate=line[6], m1=line[9], mType=line[4])
        except:
          continue
    '''
    ##### Prevent HAARM
    # Bacteria
    if model == "Bacteria":
      #for x in Bacteria.objects.all():
      #  print("\tremoving ", x)
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        Bacteria.objects.get_or_create(id=line[0], gram=line[1])

    # Antibiotic
    if model == "Antibiotic":
      for x in Antibiotic.objects.all():
        print("\tremoving ", x)
        x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        Antibiotic.objects.get_or_create(id=line[0], alias=line[1], type=line[2])

    # Collection Method
    if model == "CollectionMethod":
      #for x in CollectionMethod.objects.all():
      #  print("\tremoving ", x)
      #  x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        CollectionMethod.objects.get_or_create(id=line[0], sterile=line[1])
    # AMR
    if model == "AMR":
      for x in AMR.objects.all():
        print("\tremoving ", x)
        x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        AMR.objects.get_or_create(facility=Facility.objects.filter(id=line[1])[0], bacteria=Bacteria.objects.filter(id=line[2])[0], site=CollectionMethod.objects.filter(id=line[3])[0], year=line[4], month=line[5], range=line[6], collected=line[7])

    # Resistance
    if model == "Resistance":
      for x in Resistance.objects.all():
        print("\tremoving ", x)
        x.delete()
      for line in csv:
        line = line.split(",")
        print(line)
        tempAMR = line[1].split("::")
        Resistance.objects.get_or_create(amr=AMR.objects.filter(facility=tempAMR[0], bacteria=tempAMR[1], site=tempAMR[2], year=tempAMR[3], month=tempAMR[4])[0], antibiotic=Antibiotic.objects.filter(id=line[2])[0], pTested=line[3].split("%")[0], nTested=line[4], pSusceptible=line[5].split("%")[0], nSusceptible=line[6])
    '''
if __name__ == "__main__":
  main()
