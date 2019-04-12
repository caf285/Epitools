from django.urls import path

from . import views

app_name = 'newick'
urlpatterns = [
  path('', views.InitView.as_view(), name='init'),
  path('newick/', views.IndexView.as_view(), name='index'),
  path('samples/add/', views.SamplesAddView.as_view(), name='samplesAdd'),
  path('samples/view/', views.SamplesViewView.as_view(), name='samplesView'),
  path('samples/map/', views.SamplesMapView.as_view(), name='samplesMap'),
  path('trees/add/', views.TreesAddView.as_view(), name='treesAdd'),
  path('trees/view/', views.TreesViewView.as_view(), name='treesView'),
  path('trees/map/', views.TreesMapView.as_view(), name='treesMap'),
]

