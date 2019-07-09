from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import Group

# Create your models here.

import datetime

from django.db import models
from django.utils import timezone

class Region(models.Model):
  id = models.CharField('regionName', max_length=50, primary_key=True)
  coordinate = models.CharField('regionCoord', max_length=50, default="_")
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

class MPC(models.Model):
  id = models.CharField('majorPopulationCenter', max_length=50, primary_key=True)
  coordinate = models.CharField('mpcCoord', max_length=50, default="_")
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

class PCA(models.Model):
  id = models.CharField('pcaName', max_length=50, primary_key=True)
  coordinate = models.CharField('pcaCoord', max_length=50, default="_")
  mpc1 = models.ForeignKey(MPC, on_delete=models.CASCADE, null=True, related_name='mpc1')
  mpc2 = models.ForeignKey(MPC, on_delete=models.CASCADE, null=True, related_name='mpc2')
  mpc3 = models.ForeignKey(MPC, on_delete=models.CASCADE, null=True, related_name='mpc3')
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

class County(models.Model):
  id = models.CharField('countyName', max_length=50, primary_key=True)
  coordinate = models.CharField('countyCoord', max_length=50, default="_")
  region = models.ForeignKey(Region, on_delete=models.CASCADE, null=True)
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

class CountyPCA(models.Model):
  id = models.AutoField('bridgeId', primary_key=True)
  county = models.ForeignKey(County, on_delete=models.CASCADE, null=True)
  pca = models.ForeignKey(PCA, on_delete=models.CASCADE, null=True)
  class Meta:
    ordering = ['county', 'pca']
  def __str__(self):
    return str(self.county) + "::" + str(self.pca)

class Facility(models.Model):
  typeChoices = [('H', 'Hospital'), ('C', 'Clinic')]
  id = models.CharField('facilityName', max_length=50, primary_key=True)
  type = models.CharField('facilityType', max_length=1, choices=typeChoices, default='H')
  coordinate = models.CharField('facilityCoord', max_length=50, default="_")
  mpc = models.ForeignKey(MPC, on_delete=models.CASCADE, null=True)
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

class Bacteria(models.Model):
  id = models.CharField('bacteriaName', max_length=50, primary_key=True)
  type = models.CharField('bacteriaType', max_length=50, default="_")
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

class Drug(models.Model):
  id = models.CharField('drugName', max_length=50, primary_key=True)
  type = models.CharField('drugType', max_length=50, default="_")
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

class AMR(models.Model):
  id = models.AutoField('amrId', primary_key=True)
  facility = models.ForeignKey(Facility, on_delete=models.CASCADE, null=True)
  bacteria = models.ForeignKey(Bacteria, on_delete=models.CASCADE, null=True)
  drug = models.ForeignKey(Drug, on_delete=models.CASCADE, null=True)
  date = models.DateField('amrDate', default="2000-1-1")
  tested = models.PositiveSmallIntegerField('numberTested', default=0)
  suseptable = models.PositiveSmallIntegerField('percentSuseptable', default=0)
  class Meta:
    ordering = ['date', 'facility', 'bacteria', 'drug']
  def __str__(self):
    return str(self.date) + '::' + str(self.facility) + '::' + str(self.bacteria) + '::' + str(self.drug)

class DemoAMR(models.Model):
  id = models.AutoField('amrId', primary_key=True)
  facility = models.ForeignKey(Facility, on_delete=models.CASCADE, null=True)
  bacteria = models.ForeignKey(Bacteria, on_delete=models.CASCADE, null=True)
  drug = models.ForeignKey(Drug, on_delete=models.CASCADE, null=True)
  date = models.DateField('amrDate', default="2000-1-1")
  tested = models.PositiveSmallIntegerField('numberTested', default=0)
  suseptable = models.PositiveSmallIntegerField('percentSuseptable', default=0)
  class Meta:
    ordering = ['date', 'facility', 'bacteria', 'drug']
  def __str__(self):
    return str(self.date) + '::' + str(self.facility) + '::' + str(self.bacteria) + '::' + str(self.drug)

'''
class Pathogen(models.Model):
  id = models.AutoField(primary_key=True) 
  name = models.CharField('pathogen name', max_length=100)

  def __str__(self):
    return str(self.name)

class Sample(models.Model):
  id = models.AutoField(primary_key=True)
  name = models.CharField('sample name', max_length=50)
  date = models.DateField('date published')
  location = models.CharField('address', max_length=100)
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  group = models.ForeignKey(Group, on_delete=models.CASCADE)
  pathogen = models.ForeignKey(Pathogen, on_delete=models.CASCADE)
  dataFile = models.CharField('sequence file', max_length=250)

  def __str__(self):
    return str(self.id) + "." + str(self.name)

class Tree(models.Model):
  id = models.AutoField(primary_key=True)
  svg = models.CharField('image file', max_length=250)
  dataFile = models.CharField('newick file', max_length=250)
  samples = models.ManyToManyField(Sample)
'''

'''
class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')
    def __str__(self):
      return self.question_text
    def was_published_recently(self):
      now = timezone.now()
      return now - datetime.timedelta(days=1) <= self.pub_date <= now

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
    def __str__(self):
      return self.choice_text
'''
