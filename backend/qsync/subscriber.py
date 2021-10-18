import numpy
import threading
import sys

from qpython import qconnection
from qpython.qtype import QException
from qpython.qconnection import MessageType
from qpython.qcollection import QTable

import requests

class ListenerThread(threading.Thread):
    def __init__(self, q):
        super(ListenerThread, self).__init__()
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
                message = self.q.receive(data_only = False, raw = False) # retrieve entire message

                if message.type != MessageType.ASYNC:
                    print('Unexpected message, expected message of type: ASYNC')

                print('type: %s, message type: %s, data size: %s, is_compressed: %s ' % (type(message), message.type, message.size, message.is_compressed))

                if isinstance(message.data, list):
                    # unpack upd message
                    if len(message.data) == 3 and message.data[0] == b'upd' and isinstance(message.data[2], QTable):
                        
                        for (time, sym, fht, side, price, qty) in message.data[2]:
                            data = { 
                                'time' : time,
                                'sym' : sym,
                                'feedhandlerTime' : fht,
                                'side' : side,
                                'price' : price,
                                'qty' : qty
                            }
                            print(data)
                            x = requests.post("http://127.0.0.1:8000/api/book/", data)
                            print(x.text)

            except QException as e:
                print(e)

if __name__ == '__main__':
    with qconnection.QConnection(host = 'localhost', port = 5010) as q:
        print(q)
        print('IPC version: %s. Is connected: %s' % (q.protocol_version, q.is_connected()))
        print('Press <ENTER> to close application')

        # subscribe to tick
        print(dir(q))
        response = q.sendSync('.u.sub', numpy.string_('book'), numpy.string_(''))
        # get table model
        if isinstance(response[1], QTable):
            print('%s table data model: %s' % (response[0], response[1].dtype))

        t = ListenerThread(q)
        t.start()

        sys.stdin.readline()

        t.stopit()