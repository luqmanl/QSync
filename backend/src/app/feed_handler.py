import numpy as np
import asyncio
from queue import Queue
from cryptofeed import FeedHandler
from cryptofeed.defines import COINBASE, L2_BOOK, TRADES
from cryptofeed.exchanges import (
    Binance, Coinbase, Bitfinex, Deribit, HuobiDM, OKEx)

from qpython import qconnection
from qpython.qtype import QSYMBOL_LIST, QDOUBLE_LIST, QTIMESTAMP_LIST

from qpython.qcollection import qlist

from datetime import datetime
import threading
from qpython.qtype import QException
from qpython.qconnection import MessageType
from qpython.qcollection import QTable
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from time import sleep
import json
from queue import Queue
import sys
from qpython.qcollection import QTable
from qpython.qconnection import QConnection

""" Updates the L2 Orderbook table with the top 10 bids and asks from the latest snapshot.  """

def send_orderbook(data, datatype, channel_layer):
    print("entry")
    # print(data_table)

    group_name = f"{data['exchange']}_{data['sym']}_{datatype}"
    (channel_layer.group_send)(group_name, {"type": f"send_{datatype}_data", "data": data})    

    # for data_row in data_table:
    #     print("row")
    #     data_row = list(data_row)
    #     exchange = data_row[2]
    #     print(f"Exchange: {exchange}")
    #     if exchange not in seen_exchanges:
    #         seen_exchanges.add(exchange)
    #         data = {
    #             'sym': data_row[1],
    #             'exchange': exchange,
    #             'bids': data_row[4: 14],
    #             'asks': data_row[14: 24],
    #             'bidSizes': data_row[24: 34],
    #             'askSizes': data_row[34: 44]
    #         }

    #         group_name = f"{data['exchange']}_{data['sym']}_{datatype}"
    #         async_to_sync(
    #             channel_layer.group_send)(group_name, {
    #                 "type": f"send_{datatype}_data", "data": json.dumps(data)})


# submits trade data to socket
def send_trade(data_table, datatype, channel_layer):
    return
    for data_row in data_table:
        data_row = list(data_row)
        data = {
            'sym': data_row[1].decode("utf-8"),
            'exchange': data_row[2].decode("utf-8"),
            'price': float(data_row[4]),
            'quantity': float(data_row[5]),
            'type': data_row[6].decode("utf-8"),
        }

        group_name = f"{data['exchange']}_{data['sym']}_{datatype}"
        async_to_sync(
            channel_layer.group_send)(group_name, {
                "type": f"send_{datatype}_data", "data": json.dumps(data)})


""" Maps kdb table names to channels with data types that are subscribing
    for the corresponding table updates
"""
table_to_channel_datatypes = {
    "orderbooktop": (send_orderbook, ["l2orderbook", "l2overview", "basis"]),
    "trades": (send_trade, ["trade"]),
}

def run():
    print("About to run")
    channel_layer = get_channel_layer()
    q = qconnection.QConnection(host='localhost', port=5010)

    async def l2book_callback(book_, timestamp):
        bid_sizes = []
        ask_sizes = []
        if book_.timestamp != None:
            timestamp = book_.timestamp

        bids = []
        for i in range(10):
            bid, size = book_.book.bids.index(i)
            bids.append(float(bid))
            bid_sizes.append(float(size))

        asks = []
        for i in range(10):
            ask, size = book_.book.ask.index(i)
            asks.append(float(ask))
            ask_sizes.append(float(size))
                
        data = {
            'sym': book_.symbol,
            'exchange': book_.exchange,
            'bids': bids,
            'asks': asks,
            'bidSizes': bid_sizes,
            'askSizes': ask_sizes
        }    

        (send_func, datatypes) = table_to_channel_datatypes["orderbooktop"]
        for datatype in datatypes:
            group_name = f"{data['exchange']}_{data['sym']}_{datatype}"
            await (channel_layer.group_send)(group_name, {"type": f"send_{datatype}_data", "data": json.dumps(data)})  

        print(data)
        data = [
            qlist([np.string_(book_.symbol)], qtype=QSYMBOL_LIST),
            qlist([np.string_(book_.exchange)], qtype=QSYMBOL_LIST),
            qlist([np.datetime64(datetime.fromtimestamp(timestamp), 'ns')],
                qtype=QTIMESTAMP_LIST),
        ]
        print(data)

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
        print("orderbooktop updated: " + book_.exchange)
    


    async def trade_callback(trade, timestamp):
        return
        q.sendAsync('.u.upd', np.string_('trades'), [
            qlist([np.string_(trade.symbol)], qtype=QSYMBOL_LIST),
            qlist([np.string_(trade.exchange)], qtype=QSYMBOL_LIST),
            qlist([np.datetime64(datetime.fromtimestamp(timestamp), 'ns')],
                qtype=QTIMESTAMP_LIST),
            qlist([trade.price], qtype=QDOUBLE_LIST),
            qlist([trade.amount], qtype=QDOUBLE_LIST),
            qlist([np.string_(trade.side)], qtype=QSYMBOL_LIST),
        ])
        print("trades updated: " + trade.exchange)

    
    with q:
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
