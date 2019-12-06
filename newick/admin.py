from django.contrib import admin

# Register your models here.
from .models import Region, County, MPC, PCA, CountyPCA
from .models import FacilityType, Facility
from .models import GAS
from .models import Bacteria, Antibiotic, CollectionMethod, AMR, Resistance

admin.site.register(Region)
admin.site.register(County)
admin.site.register(MPC)
admin.site.register(PCA)
admin.site.register(CountyPCA)

admin.site.register(FacilityType)
admin.site.register(Facility)

admin.site.register(GAS)

admin.site.register(Bacteria)
admin.site.register(Antibiotic)
admin.site.register(CollectionMethod)
admin.site.register(AMR)
admin.site.register(Resistance)
