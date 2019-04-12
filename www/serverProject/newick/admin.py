from django.contrib import admin

# Register your models here.
from .models import Pathogen, Sample, Tree

admin.site.register(Pathogen)
admin.site.register(Sample)
admin.site.register(Tree)
