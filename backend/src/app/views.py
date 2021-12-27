from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from qpython import qconnection
import numpy as np
from django.http import JsonResponse
from datetime import datetime, timedelta


def index(request):
    return render(request, "index.html")


def convertToDateTime(days):
    jan2000 = datetime(2000, 1, 1)
    daysAsSeconds = days * 86400
    a = jan2000 + timedelta(0, daysAsSeconds)
    return a


def getDataFromKDB(minTimestamp):
    data = {}

    minTimestamp = datetime.now() - timedelta(minutes=20)

    with qconnection.QConnection(host='localhost', port=5011) as q:
        try:
            data = q.sendSync('.orderbook.basis', np.string_(
                "BTC-USDT"), np.string_("BTC-USD-PERP"), np.string_("BINANCE"), np.string_("DERIBIT"), np.datetime64(minTimestamp, 'ns'))
        except Exception as e:
            print(e)

    outputData = {"data": []}

    for d in data:
        timestamp = convertToDateTime(d[0])
        coordinate = {}
        coordinate["x"] = timestamp
        coordinate["y"] = float(d[1])
        outputData["data"].append(coordinate)

    # with qconnection.QConnection(host='localhost', port=5012) as q:

    return outputData

# Returns the historical value of the difference in midprices of the given currencies and exchanges


@csrf_exempt
def getHistoricalBasisData(request, period="1h"):

    minTimestamp = 0

    if period == "1d":
        minTimestamp = datetime.now() - timedelta(days=1)
    elif period == "1w":
        minTimestamp = datetime.now() - timedelta(weeks=1)
    else:  # 1 hour default
        minTimestamp = datetime.now() - timedelta(hours=1)

    outputData = getDataFromKDB(minTimestamp)
    return JsonResponse(outputData)
