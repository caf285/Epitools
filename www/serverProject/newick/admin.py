from django.contrib import admin

# Register your models here.
from .models import Region, County, PCA, CountyPCA, MPC, Facility, Bacteria, Drug, AMR, DemoAMR, FacilityType

admin.site.register(Region)
admin.site.register(County)
admin.site.register(PCA)
admin.site.register(CountyPCA)
admin.site.register(MPC)
admin.site.register(Facility)
admin.site.register(Bacteria)
admin.site.register(Drug)
admin.site.register(AMR)
admin.site.register(DemoAMR)
admin.site.register(FacilityType)

