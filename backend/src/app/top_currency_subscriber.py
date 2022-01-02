import time
from qpython.qtype import QSYMBOL_LIST, QException
from qpython.qconnection import MessageType
from qpython.qcollection import QTable, qlist
from channels.layers import get_channel_layer
import numpy as np
from qpython.qcollection import QTable
from qpython.qconnection import QConnection


def run():
    # channel_layer = get_channel_layer()

    with QConnection(host='localhost', port=5011) as Q:

        while True:
            response = Q.sendSync('.syms.easy', np.string_())
            print(response[0][0])

            data = {"currencyData": []}

            for d in response:
                currencyDataPoint = {}
                currencyDataPoint["name"] = d[1].decode('UTF-8') # change bytes type to string
                currencyDataPoint["price"] = d[2]
                currencyDataPoint["change24h"] = d[3]
                currencyDataPoint["change7d"] = d[4]
                currencyDataPoint["marketCap"] = d[5]
                data["currencyData"].append(currencyDataPoint)

            print(data)

            time.sleep(2)
