from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from qpython.qconnection import QConnection
import numpy as np
from django.http import JsonResponse


def index(request):
    return render(request, "index.html")


# Returns the historical value of the difference in midprices of the given currencies and exchanges
@csrf_exempt
def getHistoricalBasisData(request):
    data = {}

    q = QConnection(host='localhost', port=5011)
    q.open()
    try:
        data = q.sendSync('.orderbook.basis', np.string_(
            "BTC-USDT"), np.string_("BTC-USD-PERP"), np.string_("BINANCE"), np.string_("DERIBIT"))
    except Exception as e:
        print(e)
    q.close()

    outputData = {"data": []}
    for d in data:
        coordinate = {}
        coordinate["x"] = float(60*d[0] + d[1])
        coordinate["y"] = float(d[2])
        outputData["data"].append(coordinate)

    return JsonResponse(outputData)
