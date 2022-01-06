import json
import numpy as np
from datetime import datetime

from cryptofeed import FeedHandler
from cryptofeed.defines import L2_BOOK, TRADES
from cryptofeed.exchanges import (
    Binance, Coinbase, Bitfinex, Deribit, KrakenFutures, OKEx)

from qpython import qconnection
from qpython.qtype import QSYMBOL_LIST, QDOUBLE_LIST, QTIMESTAMP_LIST
from qpython.qcollection import qlist

from channels.layers import get_channel_layer


# Connect to Q
q = qconnection.QConnection(host='localhost', port=5010)
# maps data type to last client send (e.g. BINANCE_BTC-USDT_trades -> 20:29:32.549549)
last_send = {}

""" Maps kdb table names to channels with data types that are subscribing
    for the corresponding table updates
"""
table_to_channel_datatypes = {
    "orderbooktop": (["l2orderbook", "l2overview", "basis", "top_currency"]),
    "trades": (["trade"]),
}

# send input data to frontend through channel group


async def send_data_to_frontend(datatypes, data):
    key = f"{data['exchange']}_{data['sym']}"

    for datatype in datatypes:
        group_name = f"{data['exchange']}_{data['sym']}_{datatype}"
        await (get_channel_layer().group_send)(group_name, {"type": f"send_{datatype}_data", "data": json.dumps(data)})


async def l2book_callback(book_, timestamp):
    key = f"{book_.exchange}_{book_.symbol}"
    # if book_.timestamp != None:
    #     timestamp = book_.timestamp

    # save data (and send to clients) once a second
    if ((not key in last_send) or (timestamp > last_send[key] + 1)):

        last_send[key] = timestamp

        bids = []
        bid_sizes = []
        asks = []
        ask_sizes = []

        for i in range(10):
            bid, size = book_.book.bids.index(i)
            bids.append(float(bid))
            bid_sizes.append(float(size))
            ask, size = book_.book.ask.index(i)
            asks.append(float(ask))
            ask_sizes.append(float(size))

        dataFrontend = {
            'sym': book_.symbol,
            'exchange': book_.exchange,
            'bids': bids,
            'asks': asks,
            'bidSizes': bid_sizes,
            'askSizes': ask_sizes
        }

        if SEND_TO_FRONTEND:
            datatypes = table_to_channel_datatypes["orderbooktop"]
            await send_data_to_frontend(datatypes, dataFrontend)
        dataBackend = [
            qlist([np.string_(book_.symbol)], qtype=QSYMBOL_LIST),
            qlist([np.string_(book_.exchange)], qtype=QSYMBOL_LIST),
            qlist([np.datetime64(datetime.fromtimestamp(timestamp), 'ns')],
                  qtype=QTIMESTAMP_LIST),
        ]

        bid_sizes = []
        ask_sizes = []

        for i in range(10):
            bid, size = book_.book.bids.index(i)
            dataBackend.append(qlist([bid], qtype=QDOUBLE_LIST))
            bid_sizes.append(qlist([size], qtype=QDOUBLE_LIST))
            ask, size = book_.book.asks.index(i)
            dataBackend.append(qlist([ask], qtype=QDOUBLE_LIST))
            bid_sizes.append(qlist([size], qtype=QDOUBLE_LIST))

        dataBackend.extend(bid_sizes)
        dataBackend.extend(ask_sizes)

        q.sendAsync('.u.upd', np.string_('orderbooktop'), dataBackend)


async def trade_callback(trade, timestamp):
    data = {
        'sym': trade.symbol,
        'exchange': trade.exchange,
        'timestamp': timestamp,
        'price': float(trade.price),
        'amount': float(trade.amount),
        'side': trade.side
    }

    if SEND_TO_FRONTEND:
        datatypes = table_to_channel_datatypes["trades"]
        await send_data_to_frontend(datatypes, data)

    q.sendAsync('.u.upd', np.string_('trades'), [
        qlist([np.string_(trade.symbol)], qtype=QSYMBOL_LIST),
        qlist([np.string_(trade.exchange)], qtype=QSYMBOL_LIST),
        qlist([np.datetime64(datetime.fromtimestamp(timestamp), 'ns')],
              qtype=QTIMESTAMP_LIST),
        qlist([trade.price], qtype=QDOUBLE_LIST),
        qlist([trade.amount], qtype=QDOUBLE_LIST),
        qlist([np.string_(trade.side)], qtype=QSYMBOL_LIST),
    ])


def run():
    with q:
        config = {'log': {'filename': 'feedhandler.log',
                          'level': 'DEBUG', 'disabled': True}}
        f = FeedHandler(config=config)

        # list of pairs for future and spot exchanges
        spot_pairs = [Binance.symbols()[i] for i in (0, 10, 11)]
        print(spot_pairs)
        future_pairs = ["BTC-USD-PERP"]

        # list of future and spot exchanges
        spot_exchanges = [Coinbase, Bitfinex]
        future_exchanges = [Deribit, KrakenFutures, OKEx]

        args = {"channels": [L2_BOOK, TRADES], "callbacks": {
            L2_BOOK: l2book_callback, TRADES: trade_callback}}

        for x in spot_exchanges:
            f.add_feed(x(symbols=spot_pairs, **args))

        for x in future_exchanges:
            f.add_feed(x(symbols=future_pairs, **args))

        # manually add Binance with extra symbols
        spot_pairs = ['ETH-BTC', 'BTC-USDT', 'ETH-USDT',
                      'SOL-USDT', 'DOGE-USDT', 'ADA-USDT']
        f.add_feed(Binance(symbols=spot_pairs, **args))

        f.run()


if __name__ == "__main__":
    SEND_TO_FRONTEND = False
    run()

# configure to send to front end and define channel_layers
SEND_TO_FRONTEND = True
