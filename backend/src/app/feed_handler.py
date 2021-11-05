import numpy as np
from cryptofeed import FeedHandler
from cryptofeed.defines import L2_BOOK

from cryptofeed.exchanges import (Binance)

from qpython import qconnection, qtemporal as qtemp
from qpython.qtype import QSYMBOL_LIST, QDOUBLE_LIST, QTIMESTAMP

from qpython.qcollection import qlist

import json

# Examples of some handlers for different updates. These currently don't do much.
# Handlers should conform to the patterns/signatures in callback.py
# Handlers can be normal methods/functions or async. The feedhandler is paused
# while the callbacks are being handled (unless they in turn await other functions or I/O)
# so they should be as lightweight as possible


async def book(book_, timestamp):
    print("\n--------\n")

    bid_sizes = []
    ask_sizes = []

    data = [
        qlist([np.string_(book_.symbol)], qtype=QSYMBOL_LIST),
        qlist([qtemp.from_raw_qtemporal(timestamp, QTIMESTAMP)],
              qtype=QTIMESTAMP),
    ]

    for i in range(10):
        bid, size = book_.book.bids.index(i)
        data.append(qlist([bid], qtype=QDOUBLE_LIST))
        bid_sizes.append(qlist([size], qtype=QDOUBLE_LIST))

    for i in range(10):
        ask, size = book_.book.asks.index(i)
        data.append(qlist([ask], qtype=QDOUBLE_LIST))
        bid_sizes.append(qlist([size], qtype=QDOUBLE_LIST))

    data.extend(bid_sizes)
    data.extend(ask_sizes)

    q.sendAsync('.u.upd', np.string_('orderbooktop'), data)


def main():
    # demo log
    # config = {'log': {'filename': 'demo.log',
    #                  'level': 'DEBUG', 'disabled': False}}
    # The config will be automatically passed into any exchanges set up by string.
    # Instantiated exchange objects would need to pass the config in manually.
    # f = FeedHandler(config=config)

    f = FeedHandler()
    # pair is ['BTC-USDT']
    pairs = Binance.symbols()[10: 11]
    f.add_feed(Binance(symbols=pairs, channels=[
               L2_BOOK], callbacks={L2_BOOK: book}))
    f.run()


if __name__ == '__main__':
    with qconnection.QConnection(host='localhost', port=5010) as q:

        main()
