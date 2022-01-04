from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from qpython import qconnection
import numpy as np
from django.http import JsonResponse
from datetime import datetime, timedelta


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


def getKDBHistorical24hChangeData():
    outputData = {"points": []}

    # hdb data
    with qconnection.QConnection(host='localhost', port=5011) as q:
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
