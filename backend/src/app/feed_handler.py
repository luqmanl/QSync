import numpy as np
from cryptofeed import FeedHandler
from cryptofeed.defines import COINBASE, L2_BOOK, TRADES

from cryptofeed.exchanges import (
    Binance, Coinbase, Bitfinex, Deribit, HuobiDM, OKEx)

from qpython import qconnection
from qpython.qtype import QSYMBOL_LIST, QDOUBLE_LIST, QTIMESTAMP_LIST

from qpython.qcollection import qlist

from datetime import datetime
""" Updates the L2 Orderbook table with the top 10 bids and asks from the latest snapshot.  """


async def l2book_callback(book_, timestamp):
    bid_sizes = []
    ask_sizes = []
    if book_.timestamp != None:
        timestamp = book_.timestamp

    data = [
        qlist([np.string_(book_.symbol)], qtype=QSYMBOL_LIST),
        qlist([np.string_(book_.exchange)], qtype=QSYMBOL_LIST),
        qlist([np.datetime64(datetime.fromtimestamp(timestamp), 'ns')],
              qtype=QTIMESTAMP_LIST),
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


async def trade_callback(trade, timestamp):
    q.sendAsync('.u.upd', np.string_('trades'), [
        qlist([np.string_(trade.symbol)], qtype=QSYMBOL_LIST),
        qlist([np.string_(trade.exchange)], qtype=QSYMBOL_LIST),
        qlist([np.datetime64(datetime.fromtimestamp(timestamp), 'ns')],
              qtype=QTIMESTAMP_LIST),
        qlist([trade.price], qtype=QDOUBLE_LIST),
        qlist([trade.amount], qtype=QDOUBLE_LIST),
        qlist([np.string_(trade.side)], qtype=QSYMBOL_LIST),
    ])
    print("trades updated")


def main():

    config = {'log': {'filename': 'feedhandler.log',
                      'level': 'DEBUG', 'disabled': True}}
    f = FeedHandler(config=config)

    # Add spot exchange feeds

    # pair is ['ETH-BTC', 'BTC-USDT', 'ETH-USDT']
    spot_pairs = [Binance.symbols()[i] for i in (0, 10, 11)]

    f.add_feed(Binance(symbols=spot_pairs, channels=[L2_BOOK, TRADES], callbacks={
        L2_BOOK: l2book_callback, TRADES: trade_callback}))
    f.add_feed(Coinbase(symbols=spot_pairs, channels=[
               L2_BOOK, TRADES], callbacks={L2_BOOK: l2book_callback, TRADES: trade_callback}))
    f.add_feed(Bitfinex(symbols=spot_pairs, channels=[
               L2_BOOK, TRADES], callbacks={L2_BOOK: l2book_callback, TRADES: trade_callback}))

    # Add Future Exchange feeds
    future_pairs = ["BTC-USD-21Z31"]
    f.add_feed(Deribit(symbols=future_pairs, channels=[
               L2_BOOK, TRADES], callbacks={L2_BOOK: l2book_callback, TRADES: trade_callback}))
    f.add_feed(HuobiDM(symbols=future_pairs, channels=[
               L2_BOOK, TRADES], callbacks={L2_BOOK: l2book_callback, TRADES: trade_callback}))
    f.add_feed(OKEx(symbols=future_pairs, channels=[
               L2_BOOK, TRADES], callbacks={L2_BOOK: l2book_callback, TRADES: trade_callback}))

    f.run()


if __name__ == '__main__':
    with qconnection.QConnection(host='localhost', port=5010) as q:
        main()
