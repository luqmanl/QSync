from django.shortcuts import render
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, response
from django.utils import timezone

from math import nan
from qpython import qconnection
from qpython.qconnection import QConnection
import numpy as np
from datetime import datetime, timedelta
import requests
from django.forms.models import model_to_dict

from .models import CachedNews, CurrencyDescriptions, CurrencyInformation, FutureInformation, PriceInformation, RelatedCharacteristics, CurrencyCharacteristics, SupportedCurrencies


def index(request):
    return render(request, "index.html")

# Exchange timestamps are kept as nanoseconds since midnight 2000/01/01


def convertExchangeTimestamp(nanosecs):
    jan2000 = datetime(2000, 1, 1)
    nanosecsAsSecs = nanosecs / 1000000000
    asDatetime = jan2000 + timedelta(0, nanosecsAsSecs)
    return asDatetime


def getKDBHistoricalBasisData(spotSym, futureSym, spotExch, futureExch, minTimestamp, resolution):
    data = {}
    outputData = {"data": []}

    # hdb data
    q = QConnection(host='localhost', port=5012)
    q.open()
    try:
        data = q.sendSync('.orderbook.basis', np.string_(
            spotSym), np.string_(futureSym), np.string_(spotExch), np.string_(futureExch), np.datetime64(minTimestamp, 'ns'), resolution)
    except Exception as e:
        print(e)
    q.close()

    for d in data:
        timestamp = convertExchangeTimestamp(d[0])
        coordinate = {}
        coordinate["x"] = timestamp
        coordinate["y"] = float(d[1])
        outputData["data"].append(coordinate)

    # rdb data
    q = QConnection(host='localhost', port=5011)
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


def getKDBHistorical24hChangeData():
    outputData = {"points": []}

    # hdb data
    with QConnection(host='localhost', port=5011) as q:
        try:
            data = q.sendSync('.historic.easy', np.string_())
        except Exception as e:
            print(e)

    # print(data)
    for d in data:
        point = {}
        point["currency"] = d[0].decode('UTF-8')
        point["timestamp"] = convertExchangeTimestamp(d[1])
        point["percentage"] = d[2]
        outputData["points"].append(point)

    return outputData

# Returns the historical value of the difference in midprices of the given currencies and exchanges


@csrf_exempt
def getHistorical24hChangeData(request):

    outputData = getKDBHistorical24hChangeData()
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
    detailedInfoInitial = {
        "generalInfoDescription": "No Description for this currency",
        "currencyCharacteristics": [[]],
        "priceInformation": {
            "high24h": nan,
            "low24h": nan,
            "high1y": nan,
            "low1y": nan,
            "change1y": nan,
            "change24h": nan,
            "volume24h": nan,
            "marketCap": nan
        },
        "currencyInformation": {
            "currentSupply": nan,
            "totalSupply": nan,
            "transactionsPerSecond": nan,
            "totalTransactions": nan,
            "marketDominancePercentage": nan,
            "activeAddresses": nan,
            "transactions24h": nan,
            "transactionFee24h": nan
        },
        "futureInformation": {
            "perpetualPrice": nan,
            "fundingRate": nan,
            "basis": nan,
            "openInterest": nan
        }
    }
    print(currency)
    print(len(SupportedCurrencies.objects.filter(ticker=currency)))
    if len(SupportedCurrencies.objects.filter(ticker=currency)) == 0:
        return JsonResponse(detailedInfoInitial)

    toSend = detailedInfoInitial

    if len(CurrencyInformation.objects.filter(currency=currency)) > 0:
        currencyInformation = model_to_dict(
            CurrencyInformation.objects.filter(currency=currency)[0])

        toSend["currencyInformation"] = {
            "currentSupply": currencyInformation["current_supply"],
            "totalSupply": currencyInformation["total_supply"],
            "transactionsPerSecond": currencyInformation["transactions_per_second"],
            "totalTransactions": currencyInformation["total_transactions"],
            "marketDominancePercentage": currencyInformation["market_dominance_percentage"],
            "activeAddresses": currencyInformation["active_addresses"],
            "transactions24h": currencyInformation["transactions_24h"],
            "transactionFee24h": currencyInformation["average_transaction_fee_usd_24h"]
        }

    if len(PriceInformation.objects.filter(currency=currency)) > 0:
        priceInformation = model_to_dict(
            PriceInformation.objects.filter(currency=currency)[0])

        toSend["priceInformation"] = {
            "high24h": priceInformation["high_24h"],
            "low24h": priceInformation["low_24h"],
            "high1y": priceInformation["high_1y"],
            "low1y": priceInformation["low_1y"],
            "change1y": priceInformation["change_1y"],
            "change24h": priceInformation["change_24h"],
            "volume24h": priceInformation["volume_24h"],
            "marketCap": priceInformation["market_cap"]
        }

    if len(FutureInformation.objects.filter(currency=currency)) > 0:
        futureInformation = model_to_dict(
            FutureInformation.objects.filter(currency=currency)[0])

        toSend["futureInformation"] = {
            "perpetualPrice": futureInformation["perpetual_price"],
            "fundingRate": futureInformation["funding_rate"],
            "basis": futureInformation["basis"],
            "openInterest": futureInformation["open_interest"]
        }

    if len(CurrencyDescriptions.objects.filter(currency=currency)) > 0:
        description = model_to_dict(CurrencyDescriptions.objects.filter(
            currency=currency)[0])["general_description"]

        toSend["generalInfoDescription"] = description

    related_characteristics = RelatedCharacteristics.objects.filter(
        currency=currency)
    characteristics = []

    for currency_characteristic in related_characteristics:
        characteristic_def = model_to_dict(CurrencyCharacteristics.objects.filter(
            characteristic=model_to_dict(currency_characteristic)["characteristic"])[0])
        characteristics.append(
            [characteristic_def["characteristic"], characteristic_def["description"]])

    toSend["currencyCharacteristics"] = characteristics

    return JsonResponse(toSend)
