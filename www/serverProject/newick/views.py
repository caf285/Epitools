from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from django.utils import timezone

#from .models import Question
from .models import Sample
from .models import Pathogen

from django.contrib.auth.mixins import LoginRequiredMixin

import datetime

class InitView(generic.ListView):
  template_name = 'newick/init.html'
  def get_queryset(self):
    return ""

class IndexView(LoginRequiredMixin, generic.ListView):
#class IndexView(generic.ListView):
  template_name = 'newick/index.html'
  context_object_name = 'index'
  def get_queryset(self):
    query = {}
    query["sample"] = Sample.objects.all()
    return query
  def getYear(self):
    return str(datetime.datetime.now().year)

class SamplesAddView(LoginRequiredMixin, generic.ListView):
  template_name = 'newick/samplesAdd.html'
  context_object_name = 'samplesAdd'
  def get_queryset(self):
    query = {}
    query["pathogens"] = Pathogen.objects.all()
    return query

class SamplesViewView(LoginRequiredMixin, generic.ListView):
  template_name = 'newick/samplesView.html'
  context_object_name = 'samplesView'
  def get_queryset(self):
    return ""

class SamplesMapView(LoginRequiredMixin, generic.ListView):
  template_name = 'newick/samplesMap.html'
  context_object_name = 'samplesMap'
  def get_queryset(self):
    return ""

class TreesAddView(LoginRequiredMixin, generic.ListView):
  template_name = 'newick/treesAdd.html'
  context_object_name = 'index'
  def get_queryset(self):
    return ""

class TreesViewView(LoginRequiredMixin, generic.ListView):
  template_name = 'newick/treesView.html'
  context_object_name = 'index'
  def get_queryset(self):
    return ""

class TreesMapView(LoginRequiredMixin, generic.ListView):
  template_name = 'newick/treesMap.html'
  context_object_name = 'index'
  def get_queryset(self):
    return ""
