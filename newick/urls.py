from django.conf import settings
from django.urls import path, include

from . import views
'''
urlpatterns = [
  path('', views.InitView.as_view(), name='init'),
  path(r'^$', views.IndexView.as_view(), name='index')
]
'''
urlpatterns = [
  path('', views.InitView.as_view(), name='init'),
  path('newick/', views.IndexView.as_view(), name='index'),
  path('newick/test/', views.TestView.as_view(), name='testView'),
  path('demo/prevharm/', views.DemoPrevHarmView.as_view(), name='demoPrevHarm'),
  path('demo/gas/', views.DemoGASView.as_view(), name='demoGAS'),
  path('demo/biomod/', views.DemoBioModView.as_view(), name='demoBioMod'),
  path('covid19/map/', views.Covid19MapView.as_view(), name='covid19MapView'),
  path('covid19/coverage/', views.Covid19CoverageView.as_view(), name='covid19CoverageView'),
  path('covid19/tree/', views.Covid19TreeView.as_view(), name='covid19TreeView'),
  path('covid19/treetypes/', views.Covid19TreeTypesView.as_view(), name='covid19TreeTypesView'),
]

#django auth
urlpatterns += [
  path('accounts/', include('django.contrib.auth.urls'))
]
