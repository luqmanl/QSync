from decimal import Decimal

import numpy as np
from cryptofeed import FeedHandler
from cryptofeed.defines import CANDLES, L2_BOOK, TICKER, TRADES, BID, ASK
# Also can import BID, ASK, BLOCKCHAIN, FUNDING, GEMINI, L3_BOOK,
# LIQUIDATIONS, OPEN_INTEREST, PERPETUAL, INDEX
from cryptofeed.exchanges import (Binance)
from cryptofeed.callback import BookCallback
# from cryptofeed.exchanges.fmfw import FMFW
# from cryptofeed.exchanges.kraken_futures import KrakenFutures
# from cryptofeed.exchanges.blockchain import Blockchain
# from cryptofeed.exchanges.bithumb import Bithumb
# from cryptofeed.symbols import Symbol
# from cryptofeed.exchanges.phemex import Phemex
# from cryptofeed.exchanges.dydx import dYdX
# from cryptofeed.exchanges.deribit import Deribit
from qpython import qconnection
from qpython.qtype import QFLOAT_LIST, QSYMBOL_LIST
from decimal import Decimal

import numpy as np
from cryptofeed import FeedHandler
from cryptofeed.defines import CANDLES, BID, ASK, BLOCKCHAIN, FUNDING, GEMINI, L2_BOOK, L3_BOOK, LIQUIDATIONS, OPEN_INTEREST, PERPETUAL, TICKER, TRADES, INDEX
from cryptofeed.exchanges import (Binance)
from qpython import qconnection, qtemporal as qtemp
from qpython.qtype import QTIMESTAMP
from qpython.qcollection import qlist
from qpython.qtype import QBOOL_LIST, QDOUBLE_LIST, QINT_LIST, QLONG_LIST, QSYMBOL_LIST


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
            qlist(['bid'], qtype=QSYMBOL_LIST),
            qlist([x], qtype=QDOUBLE_LIST),
            qlist([book_.book.bids[x]], qtype=QDOUBLE_LIST),
        ])
    quit()


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
    # capture orderbook quote date for BTC-USD from Binance
    with qconnection.QConnection(host='localhost', port=5010) as q:

        # create table for trades
        main()
