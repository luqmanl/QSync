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
                '.u.sub', np.string_('orderbooktop'), np.string_(''))
            if isinstance(response[1], QTable):
                print(f'{response[0]} table data model: {response[1].dtype}')

            while not self.stopped():
                sleep(1)
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

                            if message.data[1].decode("utf-8") == "orderbooktop":
                                self.send_orderbook(
                                    message.data[2], channel_layer)

                except QException as e:
                    print(e)

    def send_orderbook(self, data_table, channel_layer):
        for data_row in data_table:
            data_row = list(data_row)
            data = {
                'time': str(data_row[0]),
                'sym': data_row[1].decode("utf-8"),
                'feedhandler_time': str(data_row[2]),
                'bids': [bid for bid in data_row[3: 13]],
                'asks': [ask for ask in data_row[13: 23]],
                'buy_sizes': [bid_price for bid_price in data_row[23: 33]],
                'ask_sizes': [ask_price for ask_price in data_row[33: 43]]
            }

            group_name = f"binance_{data['sym']}_orderbook"
            async_to_sync(
                channel_layer.group_send)(group_name, {
                    "type": "send_l2_data", "data": json.dumps(data)})

            group_name = f"binance_{data['sym']}_l2overview"
            async_to_sync(
                channel_layer.group_send)(group_name, {
                    "type": "send_l2_data", "data": json.dumps(data)})
