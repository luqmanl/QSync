from django.shortcuts import render
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, response
from django.utils import timezone

from qpython import qconnection
import numpy as np
from datetime import datetime, timedelta
import requests
from django.forms.models import model_to_dict

from .models import CachedNews, CurrencyDescriptions, CurrencyInformation, FutureInformation, PriceInformation, RelatedCharacteristics, CurrencyCharacteristics


def index(request):
    return render(request, "index.html")

# Exchange timestamps are kept as nanoseconds since midnight 2000/01/01


def convertExchangeTimestamp(nanosecs):
    jan2000 = datetime(2000, 1, 1)
    nanosecsAsSecs = nanosecs / 1000000000
    asDatetime = jan2000 + timedelta(0, nanosecsAsSecs)
    return asDatetime

#


def getKDBHistoricalBasisData(spotSym, futureSym, spotExch, futureExch, minTimestamp, resolution):
    data = {}
    outputData = {"data": []}

    # hdb data
    with qconnection.QConnection(host='localhost', port=5012) as q:
        try:
            data = q.sendSync('.orderbook.basis', np.string_(
                spotSym), np.string_(futureSym), np.string_(spotExch), np.string_(futureExch), np.datetime64(minTimestamp, 'ns'), resolution)
        except Exception as e:
            print(e)

    for d in data:
        timestamp = convertExchangeTimestamp(d[0])
        coordinate = {}
        coordinate["x"] = timestamp
        coordinate["y"] = float(d[1])
        outputData["data"].append(coordinate)

    # rdb data
    with qconnection.QConnection(host='localhost', port=5011) as q:
        try:
            data = q.sendSync('.orderbook.basis', np.string_(
                spotSym), np.string_(futureSym), np.string_(spotExch), np.string_(futureExch), np.datetime64(minTimestamp, 'ns'), resolution)
        except Exception as e:
            print(e)

    for d in data:
        timestamp = convertExchangeTimestamp(d[0])
        coordinate = {}
        coordinate["x"] = timestamp
        coordinate["y"] = float(d[1])
        outputData["data"].append(coordinate)

    return outputData


# Returns the historical value of the difference in midprices of the given currencies and exchanges
@csrf_exempt
def getHistoricalBasisData(request, period, spotSym, futureSym, spotExch, futureExch):

    minTimestamp = 0  # date to start at
    resolution = 0  # frequency of returned data (in seconds)

    if period == "1d":
        minTimestamp = datetime.now() - timedelta(days=1)
        resolution = 60  # 1 minute
    elif period == "1w":
        minTimestamp = datetime.now() - timedelta(days=7)
        resolution = 600  # 10 minutes
    elif period == "1m":
        minTimestamp = datetime.now() - timedelta(days=31)
        resolution = 3600  # 1 hour
    elif period == "3m":
        minTimestamp = datetime.now() - timedelta(days=90)
        resolution = 21600  # 6 hours
    elif period == "1y":
        minTimestamp = datetime.now() - timedelta(year=1)
        resolution = 86400  # 1 day
    elif period == "all":
        minTimestamp = datetime.now() - timedelta(year=100)
        resolution = 2629800  # 1 month
    else:  # 1 hour default
        minTimestamp = datetime.now() - timedelta(hours=1)
        resolution = 10

    outputData = getKDBHistoricalBasisData(
        spotSym, futureSym, spotExch, futureExch, minTimestamp, resolution)
    return JsonResponse(outputData)


@csrf_exempt
def getNewsfeed(request):

    if len(CachedNews.objects.filter(date_created__gte=timezone.now() - timedelta(minutes=30))):
        # if already have a cached version in the db

        r = CachedNews.objects.filter(
            date_created__gte=timezone.now() - timedelta(minutes=30))[0]
        return JsonResponse(model_to_dict(r)['news_list'])
    else:
        r = requests.get(settings.NEWS_URL + settings.NEWS_API_KEY)
        articles = r.json()['articles']
        toSave = {
            "newsListings": [],
        }

        i = 0
        for article in articles:
            if i >= 20:
                break

            toSave["newsListings"].append({
                "provider": article["source"]["name"],
                "timestamp": article["publishedAt"],
                "description": article["description"],
                "url": article["url"],
            })
            i += 1

        news = CachedNews(news_list=toSave, date_created=timezone.now())
        news.save()
        return JsonResponse(toSave)


@csrf_exempt
def detailedAnalysis(request, currency):
    currencyInformation = model_to_dict(
        CurrencyInformation.objects.filter(currency=currency)[0])
    priceInformation = model_to_dict(
        PriceInformation.objects.filter(currency=currency)[0])
    futureInformation = model_to_dict(
        FutureInformation.objects.filter(currency=currency)[0])
    description = model_to_dict(CurrencyDescriptions.objects.filter(
        currency=currency)[0])["general_description"]
    related_characteristics = RelatedCharacteristics.objects.filter(
        currency=currency)
    characteristics = []

    for currency_characteristic in related_characteristics:
        characteristic_def = model_to_dict(CurrencyCharacteristics.objects.filter(
            characteristic=model_to_dict(currency_characteristic)["characteristic"])[0])
        characteristics.append(
            [characteristic_def["characteristic"], characteristic_def["description"]])

    toSend = {
        "generalInfoDescription": description,
        "currencyCharacteristics": characteristics,
        "priceInformation": {
            "high24h": priceInformation["high_24h"],
            "low24h": priceInformation["low_24h"],
            "high1y": priceInformation["high_1y"],
            "low1y": priceInformation["low_1y"],
            "change1y": priceInformation["change_1y"],
            "change24h": priceInformation["change_24h"],
            "volume24h": priceInformation["volume_24h"],
            "marketCap": priceInformation["market_cap"]
        },
        "currencyInformation": {
            "currentSupply": currencyInformation["current_supply"],
            "totalSupply": currencyInformation["total_supply"],
            "transactionsPerSecond": currencyInformation["transactions_per_second"],
            "totalTransactions": currencyInformation["total_transactions"],
            "marketDominancePercentage": currencyInformation["market_dominance_percentage"],
            "activeAddresses": currencyInformation["active_addresses"],
            "transactions24h": currencyInformation["transactions_24h"],
            "transactionFee24h": currencyInformation["average_transaction_fee_usd_24h"]
        },
        "futureInformation": {
            "perpetualPrice": futureInformation["perpetual_price"],
            "fundingRate": futureInformation["funding_rate"],
            "basis": futureInformation["basis"],
            "openInterest": futureInformation["open_interest"]
        }
    }

    return JsonResponse(toSend)
