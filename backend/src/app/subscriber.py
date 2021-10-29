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
                async_to_sync(channel_layer.group_send)("qsync", {"type": "send_tick_data", "text": "test"})
                try:
                    # retrieve entire message
                    message = self.q.receive(data_only=False, raw=False)

                    if message.type != MessageType.ASYNC:
                        print('Unexpected message, expected message of type: ASYNC')
                    data_str = (
                        f'type: {type(message)}, message type: {message.type},')
                    data_str += (
                        f'data size: {message.size}, is_compressed: {message.is_compressed}')
                    print(data_str)

                    if isinstance(message.data, list) and len(message.data) == 3:
                        # unpack upd message
                        if message.data[0] == b'upd' and isinstance(message.data[2], QTable):
                            for (time, sym, fht, side, price, qty) in message.data[2]:
                                data = {
                                    'time': str(time),
                                    'sym': str(sym),
                                    'feedhandlerTime': str(fht),
                                    'side': str(side),
                                    'price': str(price),
                                    'qty': str(qty)
                                }
                                print(data)

                                async_to_sync(channel_layer.group_send)("qsync", {"type": "send_tick_data", "text": json.dumps(data)})
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
