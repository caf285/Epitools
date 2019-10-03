from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from django.utils import timezone
from django.core import serializers
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Region, County, MPC, PCA, CountyPCA
from .models import FacilityType, Facility
from .models import GAS 
from .models import Bacteria, Antibiotic, CollectionMethod, AMR, Resistance

import datetime
import json

def getMap():
  mapAZ = {}
  mapAZ["state::all"] = list(map(lambda x: x['pk'], json.loads(serializers.serialize('json', Region.objects.all()))))
  for region in mapAZ["state::all"]:
    mapAZ["region::" + region] = list(map(lambda x: x['pk'], json.loads(serializers.serialize('json', County.objects.filter(region=region)))))
    for county in mapAZ["region::" + region]:
      mapAZ["county::" + county] = list(map(lambda x: x['fields']['pca'], json.loads(serializers.serialize('json', CountyPCA.objects.filter(county=county)))))
  return mapAZ

def getPCA():
  pca = {}
  query = json.loads(serializers.serialize('json', PCA.objects.all()))
  for line in query:
    pca[line['pk']] = line['fields']
  return pca

def getCoordinates():
  query = {}
  for i in Region.objects.all():
    query['region::' + i.id] = "[" + i.lat + "," + i.lon + "]"
  for i in County.objects.all():
    query['county::' + i.id] = "[" + i.lat + "," + i.lon + "]"
  for i in PCA.objects.all():
    query['pca::' + i.id] = "[" + i.lat + "," + i.lon + "]"
  query['state::all'] = '[35.452, -111.795]'
  return query

class InitView(generic.ListView):
  template_name = 'newick/init.html'
  def get_queryset(self):
    return ""

class IndexView(LoginRequiredMixin, generic.ListView):
#class IndexView(generic.ListView):
  template_name = 'newick/index.html'
  context_object_name = 'indexList'
  def get_queryset(self):
    return ""

class DemoEmmtypeView(LoginRequiredMixin, generic.ListView):
  template_name = 'demo/demoEmmtype.html'
  context_object_name = 'demoEmmtype'
  def get_queryset(self):
    return ""

class DemoGASView(LoginRequiredMixin, generic.ListView):
  template_name = 'demo/demoGAS.html'
  context_object_name = 'demoGAS'
  def get_queryset(self):
    query = {}
    query["map"] = getMap()
    query["pca"] = getPCA()
    query["coordinates"] = getCoordinates()
    query["gas"] = {}
    samples = json.loads(serializers.serialize('json', GAS.objects.all()))
    for line in samples:
      query["gas"][line["pk"]] = line["fields"]
    return query

class DemoPrevHarmView(LoginRequiredMixin, generic.ListView):
  template_name = 'demo/demoPrevHarm.html'
  context_object_name = 'demoPrevHarm'
  def get_queryset(self):
    query = {}
    query["amr"] = self.getAMR()
    query["map"] = getMap()
    query["pca"] = getPCA()
    query["coordinates"] = getCoordinates()
    return query

  def getAMR(self):
    return {}
'''
    amr = {'region':{}, 'county':{}, 'pca':{}, 'dates':[], 'bugDrugs':[]}
    query = list(map(lambda x: x['fields'], json.loads(serializers.serialize('json', AMR.objects.all()))))
    for line in query:
      if str(line['year']) + "::" + str(line['month'] + "::" + str(line['range'])) not in amr['dates']:
        amr['dates'].append(str(line['year']) + "::" + str(line['month']) + "::" + str(line['range']))
      if line['bacteria'] + "::" + line['drug'] not in amr['bugDrugs']:
        amr['bugDrugs'].append(line['bacteria'] + "::" + line['drug'])
      mpc = json.loads(serializers.serialize('json', Facility.objects.filter(id=line['facility'])))[0]['fields']['mpc']
      pcas = list(map(lambda x: x['pk'], json.loads(serializers.serialize('json', PCA.objects.filter(mpc1=mpc)))))
      pcas = list(dict.fromkeys(pcas))
      counties = []
      for pca in pcas:
        if pca not in amr['pca']:
          amr['pca'][pca] = {}
        if line['bacteria'] + "::" + line['drug'] not in amr['pca'][pca]:
          amr['pca'][pca][line['bacteria'] + "::" + line['drug']] = {}
        if line['date'] not in amr['pca'][pca][line['bacteria'] + "::" + line['drug']]:
          amr['pca'][pca][line['bacteria'] + "::" + line['drug']][line['date']] = []
        amr['pca'][pca][line['bacteria'] + "::" + line['drug']][line['date']].append([line['tested'], line['susceptible']])
        counties += list(map(lambda x: x['fields']['county'], json.loads(serializers.serialize('json', CountyPCA.objects.filter(pca=pca)))))
      counties = list(dict.fromkeys(counties))
      regions = []
      for county in counties:
        if county not in amr['county']:
          amr['county'][county] = {}
        if line['bacteria'] + "::" + line['drug'] not in amr['county'][county]:
          amr['county'][county][line['bacteria'] + "::" + line['drug']] = {}
        if line['date'] not in amr['county'][county][line['bacteria'] + "::" + line['drug']]:
          amr['county'][county][line['bacteria'] + "::" + line['drug']][line['date']] = []
        amr['county'][county][line['bacteria'] + "::" + line['drug']][line['date']].append([line['tested'], line['susceptible']])
        regions += list(map(lambda x: x['fields']['region'], json.loads(serializers.serialize('json', County.objects.filter(id=county)))))
      regions = list(dict.fromkeys(regions))
      for region in regions:
        if region not in amr['region']:
          amr['region'][region] = {}
        if line['bacteria'] + "::" + line['drug'] not in amr['region'][region]:
          amr['region'][region][line['bacteria'] + "::" + line['drug']] = {}
        if line['date'] not in amr['region'][region][line['bacteria'] + "::" + line['drug']]:
          amr['region'][region][line['bacteria'] + "::" + line['drug']][line['date']] = []
        amr['region'][region][line['bacteria'] + "::" + line['drug']][line['date']].append([line['tested'], line['susceptible']])
    return amr
'''
class TestView(LoginRequiredMixin, generic.ListView):
#class IndexView(generic.ListView):
  template_name = 'newick/test.html'
  def get_queryset(self):
    return ""
