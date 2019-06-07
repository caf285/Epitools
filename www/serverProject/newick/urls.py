from django.urls import path

from . import views

app_name = 'newick'
urlpatterns = [
  path('', views.InitView.as_view(), name='init'),
  path('newick/', views.IndexView.as_view(), name='index'),
  path('newick/test', views.TestView.as_view(), name='testView'),
  path('demo/antibiogram/', views.DemoAntibiogramView.as_view(), name='demoAntibiogram'),
  path('demo/query/', views.DemoQueryView.as_view(), name='demoQuery'),
  path('demo/emmtype/', views.DemoEmmtypeView.as_view(), name='demoEmmtype'),
]

