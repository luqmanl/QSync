import threading
from qpython.qtype import QException
from qpython.qconnection import MessageType
from qpython.qcollection import QTable
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from time import sleep
import json

import sys
import numpy as np
from qpython.qcollection import QTable
from qpython.qconnection import QConnection

# submits orderbook data to socket


def send_orderbook(data_table, datatype, channel_layer):
    for data_row in data_table:
        data_row = list(data_row)
        data = {
            'sym': data_row[1].decode("utf-8"),
            'exchange': data_row[2].decode("utf-8"),
            'bids': [bid for bid in data_row[4: 14]],
            'asks': [ask for ask in data_row[14: 24]],
            'bidSizes': [bid_price for bid_price in data_row[24: 34]],
            'askSizes': [ask_price for ask_price in data_row[34: 44]]
        }

        group_name = f"{data['exchange']}_{data['sym']}_{datatype}"
        async_to_sync(
            channel_layer.group_send)(group_name, {
                "type": f"send_{datatype}_data", "data": json.dumps(data)})


# submits trade data to socket
def send_trade(data_table, datatype, channel_layer):
    for data_row in data_table:
        data_row = list(data_row)
        data = {
            'sym': data_row[1].decode("utf-8"),
            'exchange': data_row[2].decode("utf-8"),
            'price': float(data_row[4]),
            'quantity': float(data_row[5]),
            'type': data_row[6].decode("utf-8"),
        }

        group_name = f"{data['exchange']}_{data['sym']}_{datatype}"
        async_to_sync(
            channel_layer.group_send)(group_name, {
                "type": f"send_{datatype}_data", "data": json.dumps(data)})


""" Maps kdb table names to channels with data types that are subscribing
    for the corresponding table updates
"""
table_to_channel_datatypes = {

    "orderbooktop": (send_orderbook, ["l2orderbook", "l2overview", "basis"]),
    "trades": (send_trade, ["trade"]),
}


class ListenerThread(threading.Thread):
    def __init__(self):
        super().__init__()
        self._stopper = threading.Event()

    def stopit(self):
        self._stopper.set()

    def stopped(self):
        return self._stopper.is_set()

    def run(self):
        channel_layer = get_channel_layer()

        with QConnection(host='localhost', port=5010) as Q:

            response = Q.sendSync(
                '.u.sub', np.string_(''), np.string_(''))
            if isinstance(response[1], QTable):
                print(f'{response[0]} table data model: {response[1].dtype}')

            while not self.stopped():
                try:
                    message = Q.receive(data_only=False, numpy_temporals=True)

                    if message.type != MessageType.ASYNC:
                        print('Unexpected message, expected message of type: ASYNC')
                    data_str = (
                        f'type: {type(message)}, message type: {message.type},')
                    data_str += (
                        f'data size: {message.size}, is_compressed: {message.is_compressed}')
                    print(data_str)

                    if isinstance(message.data, list) and len(message.data) == 3:
                        if message.data[0] == b'upd' and isinstance(
                                message.data[2], QTable):

                            table_name = message.data[1].decode("utf-8")
                            (send_func,
                             datatypes) = table_to_channel_datatypes[table_name]
                            for datatype in datatypes:
                                send_func(
                                    message.data[2], datatype, channel_layer)

                except QException as e:
                    print(e)
