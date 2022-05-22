import json
import time
from django.conf import settings
from qpython.qtype import QSYMBOL_LIST, QException
from qpython.qconnection import MessageType
from qpython.qcollection import QTable, qlist
from channels.layers import get_channel_layer
import numpy as np
from qpython.qcollection import QTable
from qpython.qconnection import QConnection
from asgiref.sync import async_to_sync


def run():
    channel_layer = get_channel_layer()
    while True:
        with QConnection(host=settings.KDB_HOST, port=5011) as Q:
            response = Q.sendSync('.syms.easy', np.string_())

        data = {"currencyData": []}

        for d in response:
            currencyDataPoint = {}
            currencyDataPoint["name"] = d[1].decode(
                'UTF-8')  # change bytes type to string
            currencyDataPoint["price"] = d[2]
            num = d[3]
            if np.isnan(num):
                num = 0
            currencyDataPoint["change24h"] = num
            num = d[4]
            if np.isnan(num):
                num = 0
            currencyDataPoint["change7d"] = num
            currencyDataPoint["marketCap"] = d[5]
            data["currencyData"].append(currencyDataPoint)

        group_name = "top_currencies"
        async_to_sync(
            channel_layer.group_send)(group_name, {
                "type": "send_top_currencies_data", "data": json.dumps(data)})

        time.sleep(2)
