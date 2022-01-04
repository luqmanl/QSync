from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('historicalBasisData/<str:period>/<str:spotSym>/<str:futureSym>/<str:spotExch>/<str:futureExch>', views.getHistoricalBasisData,
         name='historicalBasisData'),
    path('api/data/newsfeed', views.getNewsfeed, name="newsfeed"),
]
