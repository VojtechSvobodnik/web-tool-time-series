from django.urls import path
from django.urls import re_path as url
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    url(r'^ajax/ajax_getChartData/$', views.ajax_getChartData, name='ajax_getChartData'),
]
