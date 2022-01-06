from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('historicalBasisData/<str:period>/<str:spotSym>/<str:futureSym>/<str:spotExch>/<str:futureExch>', views.getHistoricalBasisData,
         name='historicalBasisData'),
    path('historical24hChangeData', views.getHistorical24hChangeData,
         name='historical24hChangeData'),
    path('api/data/newsfeed', views.getNewsfeed, name="newsfeed"),
    path('api/priceHistory/<str:exchange>/<str:sym>/<str:time_period>',
         views.getHistoricalPriceData, name='historicalPriceData'),
    path('api/data/general-info/<str:currency>', views.detailedAnalysis)
]
