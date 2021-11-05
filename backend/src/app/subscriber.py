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
            # subscribe to tick
            response = Q.sendSync(
                '.u.sub', np.string_('orderbooktop'), np.string_(''))
            # get table model
            if isinstance(response[1], QTable):
                print(f'{response[0]} table data model: {response[1].dtype}')

            self.q = Q

            while True:
                sleep(1)
                try:
                    # retrieve entire message
                    message = self.q.receive(data_only=False, raw=False)

                    if message.type != MessageType.ASYNC:
                        print('Unexpected message, expected message of type: ASYNC')
                    data_str = (
                        f'type: {type(message)}, message type: {message.type},')
                    data_str += (
                        f'data size: {message.size}, is_compressed: {message.is_compressed}')
                    # print(data_str)

                    if isinstance(message.data, list) and len(
                            message.data) == 3:
                        # unpack upd message
                        if message.data[0] == b'upd' and isinstance(
                                message.data[2], QTable):
                            for (time, sym, fht, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, bs1, bs2, bs3, bs4, bs5, bs6, bs7, bs8, bs9, bs10, as1, as2, as3, as4, as5, as6, as7, as8, as9, as10) in message.data[2]:
                                data = {
                                    'time': str(time),
                                    'sym': sym.decode("utf-8"),
                                    'feedhandlerTime': str(fht),
                                    'buys': [str(b1), str(b2), str(b3), str(b4), str(b5), str(b6), str(b7), str(b8), str(b9), str(b10)],
                                    'asks': [str(a1), str(a2), str(a3), str(a4), str(a5), str(a6), str(a7), str(a8), str(a9), str(a10)],
                                    'buy_sizes': [str(bs1), str(bs2), str(bs3), str(bs4), str(bs5), str(bs6), str(bs7), str(bs8), str(bs9), str(bs10)],
                                    'ask_sizes': [str(as1), str(as2), str(as3), str(as4), str(as5), str(as6), str(as7), str(as8), str(as9), str(as10)]
                                }
                                # print(data)

                                group_name = f"binance_{(sym).decode('utf-8')}_orderbook"

                                async_to_sync(
                                    channel_layer.group_send)(group_name, {
                                        "type": "send_tick_data", "text": json.dumps(data)})
                except QException as e:
                    print(e)


if __name__ == '__main__':
    with QConnection(host='localhost', port=5010) as Q:
        print(Q)
        print(
            f'IPC version: {Q.protocol_version}. Is connected: {Q.is_connected()}')
        print('Press <ENTER> to close application')

        # subscribe to tick
        print(dir(Q))
        response = Q.sendSync(
            '.u.sub', np.string_('orderbooktop'), np.string_(''))
        # get table model
        if isinstance(response[1], QTable):
            print(f'{response[0]} table data model: {response[1].dtype}')
        t = ListenerThread(Q)
        t.start()

        sys.stdin.readline()

        t.stopit()
