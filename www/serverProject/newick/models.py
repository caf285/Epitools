from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import Group

##### Arizona
class Region(models.Model):
  id = models.CharField('regionName', max_length=64, primary_key=True)
  lat = models.CharField('latitude', max_length=16, default="_")
  lon = models.CharField('longitude', max_length=16, default="_")
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

class County(models.Model):
  id = models.CharField('countyName', max_length=64, primary_key=True)
  lat = models.CharField('latitude', max_length=16, default="_")
  lon = models.CharField('longitude', max_length=16, default="_")
  region = models.ForeignKey(Region, on_delete=models.CASCADE, null=True)
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

class MPC(models.Model):
  id = models.CharField('majorPopulationCenter', max_length=64, primary_key=True)
  lat = models.CharField('latitude', max_length=16, default="_")
  lon = models.CharField('longitude', max_length=16, default="_")
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

class PCA(models.Model):
  id = models.CharField('pcaName', max_length=64, primary_key=True)
  lat = models.CharField('latitude', max_length=16, default="_")
  lon = models.CharField('longitude', max_length=16, default="_")
  number = models.PositiveSmallIntegerField('pcaNumber', default=0)
  score = models.PositiveSmallIntegerField('pcaScore', default=0)
  rural = models.CharField('ruralCode', max_length=16, default="_")
  tax = models.CharField('taxDistrict', max_length=2, default="_")
  azmua = models.CharField('AzMUA', max_length=64, default="_")
  pchpsa = models.CharField('PCHPSA', max_length=256, default="_")
  fedmuap = models.CharField('FedMUAP', max_length=256, default="_")
  mpc1 = models.ForeignKey(MPC, on_delete=models.CASCADE, null=True, related_name='mpc1')
  mpc2 = models.ForeignKey(MPC, on_delete=models.CASCADE, null=True, related_name='mpc2')
  mpc3 = models.ForeignKey(MPC, on_delete=models.CASCADE, null=True, related_name='mpc3')
  travel2 = models.CharField('travel2', max_length=64, default="_")
  travel3 = models.CharField('travel3', max_length=64, default="_")
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

##### Facilities
class FacilityType(models.Model):
  type1 = models.CharField('facilityType', max_length=64, db_index=True)
  type2 = models.CharField('facilitySubtype', max_length=64)
  class Meta:
    unique_together = ['type1', 'type2']
  def __str__(self):
    return str(self.type1) + "::" + str(self.type2)

class Facility(models.Model):
  id = models.CharField('facilityName', max_length=64, primary_key=True)
  type = models.ForeignKey(FacilityType, on_delete=models.CASCADE, null=True, related_name='type')
  capacity = models.PositiveSmallIntegerField('capacity', default=0)
  certification = models.CharField('certification', max_length=1, default="_")
  mpc = models.ForeignKey(MPC, on_delete=models.CASCADE, null=True, related_name='mpc')
  address = models.CharField('address', max_length=64, default='_')
  zip = models.CharField('zipCode', max_length=16, default='_')
  phone = models.CharField('phoneNumber', max_length=16, default='_')
  fax = models.CharField('faxNumber', max_length=16, default='_')
  lat = models.CharField('latitude', max_length=16, default="_")
  lon = models.CharField('longitude', max_length=16, default="_")
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

##### Group A Strep
class GAS(models.Model):
  id = models.CharField('sampleName', max_length=64, primary_key=True)
  tg = models.CharField('tgNumber', max_length=64)
  az = models.CharField('azNumber', max_length=64)
  collectionDate = models.DateField('collectionDate', default="2000-1-1")
  facility = models.ForeignKey(Facility, on_delete=models.CASCADE, null=True)
  r1 = models.CharField('read1', max_length=128)
  r2 = models.CharField('read2', max_length=128)
  sequenceDate = models.DateField('sequenceDate', default="2000-1-1")
  m1 = models.CharField('m1', max_length=16)
  mType = models.CharField('mType', max_length=8)

##### Prevent Haarm
class Bacteria(models.Model):
  id = models.CharField('bacteriaName', max_length=64, primary_key=True)
  gram = models.CharField('bacteriaGram', max_length=8, default="_")
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

class Antibiotic(models.Model):
  id = models.CharField('antibioticName', max_length=64, primary_key=True)
  type = models.CharField('antibioticType', max_length=64, default="_")
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

class CollectionMethod(models.Model):
  id = models.CharField('collectionMethod', max_length=64, primary_key=True)
  sterile = models.CharField('sterile', max_length=4)
  class Meta:
    ordering = ['id']
  def __str__(self):
    return str(self.id)

class AMR(models.Model):
  facility = models.ForeignKey(Facility, on_delete=models.CASCADE, null=True)
  bacteria = models.ForeignKey(Bacteria, on_delete=models.CASCADE, null=True)
  site = models.ForeignKey(CollectionMethod, on_delete=models.CASCADE, null=True)
  year = models.PositiveSmallIntegerField('year', default=2000)
  month = models.PositiveSmallIntegerField('month', default=1)
  range = models.PositiveSmallIntegerField('range', default=1)
  collected = models.PositiveSmallIntegerField('collected', default=0)
  class Meta:
    unique_together = ['facility', 'bacteria', 'site', 'year', 'month']
    ordering = ['facility', 'bacteria', 'site']
  def __str__(self):
    return str(self.facility) + '::' + str(self.bacteria) + '::' + str(self.site) + '::' + str(self.year) + '-' + str(self.month)

class Resistance(models.Model):
  id = models.AutoField('resistanceId', primary_key=True)
  amr = models.ForeignKey(AMR, on_delete=models.CASCADE, null=True)
  antibiotic = models.ForeignKey(Antibiotic, on_delete=models.CASCADE, null=True)
  pTested = models.PositiveSmallIntegerField('pTested', default=0)
  nTested = models.PositiveSmallIntegerField('nTested', default=0)
  pSusceptible = models.PositiveSmallIntegerField('pSusceptible', default=0)
  nSusceptible = models.PositiveSmallIntegerField('nSusceptible', default=0)
  class Meta:
    ordering = ['amr', 'antibiotic']
  def __str__(self):
    return str(self.amr) + '::' + str(self.antibiotic)



































