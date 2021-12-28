from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('historicalBasisData/<str:period>/', views.getHistoricalBasisData,
         name='historicalBasisData'),

]
