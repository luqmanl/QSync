import numpy as np
from cryptofeed import FeedHandler
from cryptofeed.defines import L2_BOOK

from cryptofeed.exchanges import (Binance)

from qpython import qconnection, qtemporal as qtemp
from qpython.qtype import QSYMBOL_LIST, QDOUBLE_LIST, QTIMESTAMP

from qpython.qcollection import qlist

# Examples of some handlers for different updates. These currently don't do much.
# Handlers should conform to the patterns/signatures in callback.py
# Handlers can be normal methods/functions or async. The feedhandler is paused
# while the callbacks are being handled (unless they in turn await other functions or I/O)
# so they should be as lightweight as possible


async def book(book_, timestamp):
    print("\n--------\n")
    for x in book_.book.bids:
        print(x, book_.book.bids[x])

        q.sendAsync('.u.upd', np.string_('book'), [
            qlist([np.string_(book_.symbol)], qtype=QSYMBOL_LIST),
            qlist([qtemp.from_raw_qtemporal(timestamp, QTIMESTAMP)],
                  qtype=QTIMESTAMP),
            qlist(['bid'], qtype=QSYMBOL_LIST),
            qlist([x], qtype=QDOUBLE_LIST),
            qlist([book_.book.bids[x]], qtype=QDOUBLE_LIST),
        ])

    for x in book_.book.asks:
        q.sendAsync('.u.upd', np.string_('book'), [
            qlist([np.string_(book_.symbol)], qtype=QSYMBOL_LIST),
            qlist([qtemp.from_raw_qtemporal(timestamp, QTIMESTAMP)],
                  qtype=QTIMESTAMP),
            qlist(['ask'], qtype=QSYMBOL_LIST),
            qlist([x], qtype=QDOUBLE_LIST),
            qlist([book_.book.asks[x]], qtype=QDOUBLE_LIST),
        ])


def main():
    config = {'log': {'filename': 'demo.log',
                      'level': 'DEBUG', 'disabled': False}}
    # The config will be automatically passed into any exchanges set up by string.
    # Instantiated exchange objects would need to pass the config in manually.
    f = FeedHandler(config=config)
    # pair is ['BTC-USDT']
    pairs = Binance.symbols()[10: 11]
    f.add_feed(Binance(symbols=pairs, channels=[
               L2_BOOK], callbacks={L2_BOOK: book}))
    f.run()


if __name__ == '__main__':
    with qconnection.QConnection(host='localhost', port=5010) as q:

        main()
