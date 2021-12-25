from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from qpython import qconnection
import numpy as np
from django.http import JsonResponse


def index(request):
    return render(request, "index.html")


# Returns the historical value of the difference in midprices of the given currencies and exchanges
@csrf_exempt
def getHistoricalBasisData(request):
    data = {}

    with qconnection.QConnection(host='localhost', port=5011) as q:
        try:
            data = q.sendSync('.orderbook.basis', np.string_(
                "BTC-USDT"), np.string_("BTC-USD-PERP"), np.string_("BINANCE"), np.string_("DERIBIT"))
        except Exception as e:
            print(e)

    outputData = {"data": []}

    for d in data:
        coordinate = {}
        coordinate["x"] = float(60*d[0] + d[1])
        coordinate["y"] = float(d[2])
        outputData["data"].append(coordinate)

    return JsonResponse(outputData)
