from django.contrib import admin

# Register your models here.
from .models import PCA, County, MPC

admin.site.register(PCA)
admin.site.register(County)
admin.site.register(MPC)
