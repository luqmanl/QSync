from time import time
import numpy as np
from cryptofeed import FeedHandler
from cryptofeed.defines import L2_BOOK

from cryptofeed.exchanges import (Binance)

from qpython import qconnection, qtemporal as qtemp
from qpython.qtype import QSYMBOL_LIST, QDOUBLE_LIST, QTIMESTAMP, QTIMESTAMP_LIST

from qpython.qcollection import qlist
from datetime import datetime
""" Updates the L2 Orderbook table with the top 10 bids and asks from the latest snapshot.  """


async def l2book_callback(book_, timestamp):
    print(type(timestamp))
    bid_sizes = []
    ask_sizes = []

    data = [
        qlist([np.string_(book_.symbol)], qtype=QSYMBOL_LIST),
        qlist([timestamp], qtype=QTIMESTAMP_LIST),
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
    print("orderbooktop updated: ")


def main():

    config = {'log': {'filename': 'feedhandler.log',
                      'level': 'DEBUG', 'disabled': True}}
    f = FeedHandler(config=config)

    # pair is ['BTC-USDT']
    pairs = Binance.symbols()[10: 11]
    f.add_feed(Binance(symbols=pairs, channels=[
               L2_BOOK], callbacks={L2_BOOK: l2book_callback}))
    f.run()


if __name__ == '__main__':
    with qconnection.QConnection(host='localhost', port=5010) as q:

        main()
