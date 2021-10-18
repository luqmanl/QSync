import threading
import sys
import numpy
from qpython import qconnection
from qpython.qtype import QException
from qpython.qconnection import MessageType
from qpython.qcollection import QTable

import requests

class ListenerThread(threading.Thread):
    def __init__(self, q):
        super().__init__()
        self.q = q
        self._stopper = threading.Event()

    def stopit(self):
        self._stopper.set()

    def stopped(self):
        return self._stopper.is_set()

    def run(self):
        while not self.stopped():
            print('.')
            try:
                # retrieve entire message
                message = self.q.receive(data_only=False, raw=False)

                if message.type != MessageType.ASYNC:
                    print('Unexpected message, expected message of type: ASYNC')
                data_str = (f'type: {type(message)}, message type: {message.type},')
                data_str += (f'data size: {message.size}, is_compressed: {message.is_compressed}')
                print(data_str)

                if isinstance(message.data, list) and len(message.data) == 3:
                    # unpack upd message
                    if message.data[0] == b'upd' and isinstance(message.data[2], QTable):
                        for (time, sym, fht, side, price, qty) in message.data[2]:
                            data = {
                                'time': time,
                                'sym': sym,
                                'feedhandlerTime': fht,
                                'side': side,
                                'price': price,
                                'qty': qty
                            }
                            print(data)
                            x = requests.post(
                                "http://127.0.0.1:8000/api/book/", data)
                            print(x.text)

            except QException as e:
                print(e)


if __name__ == '__main__':
    with qconnection.QConnection(host='localhost', port=5010) as Q:
        print(Q)
        print(f'IPC version: {Q.protocol_version}. Is connected: {Q.is_connected()}')
        print('Press <ENTER> to close application')

        # subscribe to tick
        print(dir(Q))
        response = Q.sendSync(
            '.u.sub', numpy.string_('book'), numpy.string_(''))
        # get table model
        if isinstance(response[1], QTable):
            print(f'{response[0]} table data model: {response[1].dtype}')
        t = ListenerThread(Q)
        t.start()

        sys.stdin.readline()

        t.stopit()
