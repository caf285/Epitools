from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from django.utils import timezone

#from .models import Question
#from .models import Sample
#from .models import Pathogen

from django.contrib.auth.mixins import LoginRequiredMixin

import datetime

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
    return ""

class TestView(LoginRequiredMixin, generic.ListView):
#class IndexView(generic.ListView):
  template_name = 'newick/test.html'
  def get_queryset(self):
    return ""

