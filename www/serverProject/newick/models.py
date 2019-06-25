from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import Group

# Create your models here.

import datetime

from django.db import models
from django.utils import timezone

class PCA(models.Model):
  id = models.PositiveSmallIntegerField('PcaNumber', primary_key=True)

class County(models.Model):
  id = models.CharField('CountyName', max_length=50, primary_key=True)
  polygon = models.TextField('Polygon', max_length=10000, default='[]')

class MPC(models.Model):
  id = models.CharField('MajorPopulationCenter', max_length=50, primary_key=True)

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
