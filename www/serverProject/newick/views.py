from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from django.utils import timezone

from django.core import serializers
from django.http import JsonResponse

from .models import Region, County, PCA, CountyPCA, MPC, Facility, Bacteria, Drug, AMR, DemoAMR 
#from .models import Pathogen

from django.contrib.auth.mixins import LoginRequiredMixin

import datetime
import json

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

class DemoAntibiogramView(LoginRequiredMixin, generic.ListView):
  template_name = 'demo/demoAntibiogram.html'
  context_object_name = 'demoAntibiogram'
  def get_queryset(self):
    return ""

'''
class DemoQueryView(LoginRequiredMixin, generic.ListView):
  template_name = 'demo/demoQuery.html'
  context_object_name = 'demoQueryList'
  def get_queryset(self):
    query = {}
    query["sample"] = Sample.objects.all()
    query["year"] = self.getYear()
    queryList = [query]
    return queryList
  def getYear(self):
    return str(datetime.datetime.now().year)
'''

class DemoEmmtypeView(LoginRequiredMixin, generic.ListView):
  template_name = 'demo/demoEmmtype.html'
  context_object_name = 'demoEmmtype'
  def get_queryset(self):
    return ""

class DemoPCAView(LoginRequiredMixin, generic.ListView):
  template_name = 'demo/demoPCA.html'
  context_object_name = 'demoPCA'
  def get_queryset(self):
    query = {}
    query["amr"] = self.getAMR()
    query["tree"] = self.getTree()
    query["region"] = self.getList(Region.objects.all())
    query["county"] = self.getList(County.objects.all())
    query["pca"] = self.getList(PCA.objects.all())
    query["coordinates"] = self.getCoordinates()

    return query

  def getTree(self):
    tree = {}
    regions = list(map(lambda x: x['pk'], json.loads(serializers.serialize('json', Region.objects.all()))))
    for region in regions:
      tree[region] = {}
      counties = list(map(lambda x: x['pk'], json.loads(serializers.serialize('json', County.objects.filter(region=region)))))
      for county in counties:
        tree[region][county] = {}
        pcas = list(map(lambda x: x['fields']['pca'], json.loads(serializers.serialize('json', CountyPCA.objects.filter(county=county)))))
        for pca in pcas:
          tree[region][county][pca] = list(map(lambda x: x['fields'], json.loads(serializers.serialize('json', PCA.objects.filter(id=pca)))))
    return tree

  def getList(self, query):
    out = []
    for i in query:
      out.append(i.id)
    return out

  def getCoordinates(self):
    query = {}
    for i in Region.objects.all():
      query['region::' + i.id] = "[" + i.lat + "," + i.lon + "]"
    for i in County.objects.all():
      query['county::' + i.id] = "[" + i.lat + "," + i.lon + "]"
    for i in PCA.objects.all():
      query['pca::' + i.id] = "[" + i.lat + "," + i.lon + "]"
    query['state::all'] = '[35.452, -111.795]'
    return query

  def getAMR(self):
    amr = {}
    query = list(map(lambda x: x['fields'], json.loads(serializers.serialize('json', DemoAMR.objects.all()))))
    for line in query:
      mpc = json.loads(serializers.serialize('json', Facility.objects.filter(id=line['facility'])))[0]['fields']['mpc']
      if mpc not in amr:
        amr[mpc] = {}
      if line['bacteria'] not in amr[mpc]:
        amr[mpc][line['bacteria']] = {}
      if line['drug'] not in amr[mpc][line['bacteria']]:
        amr[mpc][line['bacteria']][line['drug']] = []
      amr[mpc][line['bacteria']][line['drug']].append([line['date'], line['tested'], line['susceptible']])
    return amr

'''
class DemoPCAView(LoginRequiredMixin, generic.ListView):
  template_name = 'demo/demoPCA.html'
  context_object_name = 'demoPCA'
  def get_queryset(self):
    query = {}
    query["tree"] = self.filterRegions()
    query["region"] = self.getList(Region.objects.all())
    query["county"] = self.getList(County.objects.all())
    query["pca"] = self.getList(PCA.objects.all())
    query["coordinates"] = self.getCoordinates()
    query["amr"] = self.getAMR()
    return query

  # return AMR by BACTERIA, DRUG, PCA, YEAR
  def getAMR(self):
    query = {}
    for i in PCA.objects.all():
      query[i.id] = []
      for j in json.loads(serializers.serialize('json', self.filterMPC(i.id))):
        query[i.id].append(j['fields'])
    return query

  # return coordinates for each REGION, COUNTY, and PCA
  def getCoordinates(self):
    query = {}
    for i in Region.objects.all():
      query['region::' + i.id] = "[" + i.lat + "," + i.lon + "]"
    for i in County.objects.all():
      query['county::' + i.id] = "[" + i.lat + "," + i.lon + "]"
    for i in PCA.objects.all():
      query['pca::' + i.id] = "[" + i.lat + "," + i.lon + "]"
    query['state::all'] = '[35.452, -111.795]'
    return query

  # return simple list of IDs from REGION, COUNTY, and PCA
  def getList(self, query):
    out = []
    for i in query:
      out.append(i.id)
    return out

  # chain from REGION to AMR level to fill tree
  def filterRegions(self):
    query = {}
    for i in Region.objects.all():
      query[i.id] = self.filterCounties(County.objects.filter(region__id=i.id))
    return query

  def filterCounties(self, counties=County.objects.all()):
    query = {}
    for i in counties:
      queryPCA = PCA.objects.none()
      for j in CountyPCA.objects.filter(county__id=i.id):
        queryPCA = queryPCA | PCA.objects.filter(id=j.pca.id)
      query[i.id] = self.filterPCA(queryPCA)
    return query

  def filterPCA(self, pcas = PCA.objects.all()):
    query = {}
    for i in pcas:
      query[i.id] = json.loads(serializers.serialize('json', self.filterMPC(i.id)))
    return query

  def filterMPC(self, queryPCA):
    query = DemoAMR.objects.none()
    for index in MPC.objects.filter(mpc1__id=queryPCA):
      query = query | self.filterFacility(index.id)
    return query

  def filterFacility(self, queryMPC):
    query = DemoAMR.objects.none()
    for index in Facility.objects.filter(mpc__id=queryMPC):
      query = query | self.filterAMR(index.id)
    return query

  def filterAMR(self, queryFacility):
    #return DemoAMR.objects.all()
    return DemoAMR.objects.filter(facility__id=queryFacility)
'''

class TestView(LoginRequiredMixin, generic.ListView):
#class IndexView(generic.ListView):
  template_name = 'newick/test.html'
  def get_queryset(self):
    return ""

