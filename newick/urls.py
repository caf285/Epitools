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
  path('demo/covid19/', views.DemoCovid19View.as_view(), name='demoCovid19View'),
]

#django auth
urlpatterns += [
  path('accounts/', include('django.contrib.auth.urls'))
]
