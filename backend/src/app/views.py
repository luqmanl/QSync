from django.http.response import HttpResponse
from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from qpython import qconnection
from qpython.qcollection import QTable
from qpython.qconnection import QConnection
from qpython.qtype import QException
from qpython.qconnection import MessageType
from qpython.qcollection import QTable
from qpython.qtype import QSYMBOL_LIST, QDOUBLE_LIST, QTIMESTAMP_LIST
import numpy as np
from django.http import JsonResponse


def index(request):
    return render(request, "index.html")


@csrf_exempt
def getHistoricalBasisData(request):
    data = {"data": "this is the data"}

    with qconnection.QConnection(host='localhost', port=5011) as q:
        try:
            print("IH")
            data = q.sendSync('.orderbook.basis', np.string_(
                "BTC-USDT"), np.string_("BTC-USD-21Z31"), np.string_("BINANCE"), np.string_("DERIBIT"))
            print(type(data))
            print(data)
            print(type(data[2]))
            print("Suui")
            print(data[0])
            print(data[1])
            print(data[2])
            print(data[3])
            print(data[4])
            print("unsuii")
            # print(data[3])
        except Exception as e:
            print("Error")

    outputData = {"data": []}

    for d in data:
        print(d)
        coordinate = {}
        coordinate["x"] = float(60*d[0] + d[1])
        coordinate["y"] = float(d[2])
        print(coordinate)
        outputData["data"].append(coordinate)

    print(outputData)

    # data = {"data":"this is the data"}
    return JsonResponse(outputData)
