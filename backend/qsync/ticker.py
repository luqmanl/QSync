from decimal import Decimal

from cryptofeed import FeedHandler
from cryptofeed.defines import CANDLES, BID, ASK, BLOCKCHAIN, FUNDING, GEMINI, L2_BOOK, L3_BOOK, LIQUIDATIONS, OPEN_INTEREST, PERPETUAL, TICKER, TRADES, INDEX
from cryptofeed.exchanges import (Binance)
# from cryptofeed.exchanges.fmfw import FMFW
from cryptofeed.exchanges.kraken_futures import KrakenFutures
from cryptofeed.exchanges.blockchain import Blockchain
from cryptofeed.exchanges.bithumb import Bithumb
from cryptofeed.symbols import Symbol
from cryptofeed.exchanges.phemex import Phemex
from cryptofeed.exchanges.dydx import dYdX
from cryptofeed.exchanges.deribit import Deribit
from qpython import qconnection


# Examples of some handlers for different updates. These currently don't do much.
# Handlers should conform to the patterns/signatures in callback.py
# Handlers can be normal methods/functions or async. The feedhandler is paused
# while the callbacks are being handled (unless they in turn await other functions or I/O)
# so they should be as lightweight as possible
async def ticker(t, receipt_timestamp):
    pass
    # if t.timestamp is not None:
    #     assert isinstance(t.timestamp, float)
    # assert isinstance(t.exchange, str)
    # assert isinstance(t.bid, Decimal)
    # assert isinstance(t.ask, Decimal)
    # print(f'Ticker received at {receipt_timestamp}: {t}')


async def trade(t, receipt_timestamp):
    assert isinstance(t.timestamp, float)
    assert isinstance(t.side, str)
    assert isinstance(t.amount, Decimal)
    assert isinstance(t.price, Decimal)
    assert isinstance(t.exchange, str)

    if (t.symbol == "BTC-USDT"):
        side = "ask" if t.side == "sell" else "bid"
        print(f'{receipt_timestamp} : {t.exchange} : {t.amount} : {side} : {t.price} ')
        command = "`trades insert (`" + side + "," + \
            str(t.price) + "," + str(t.amount) + ")"
        q(command)

# -------- OTHER FUNCTIONS FOR OTHER DATA INPUTS ----------- #


async def book(book, receipt_timestamp):
    pass
    # if (book.symbol == "BTC-USDT"):
    #     print(book)
    # print(f'{book.exchange} : BTC-USD : ASKS - {len(book.book.asks)} : BIDS - {len(book.book.bids)} : Last ASK - {book.quantity} : Last BID - {book.book.bid.index(0)} ')


async def funding(f, receipt_timestamp):
    pass
    # print(f"Funding update received at {receipt_timestamp}: {f}")


async def oi(update, receipt_timestamp):
    pass
    # print(f"Open Interest update received at {receipt_timestamp}: {update}")


async def index(i, receipt_timestamp):
    pass
    # print(f"Index received at {receipt_timestamp}: {i}")


async def candle_callback(c, receipt_timestamp):
    pass
    # print(f"Candle received at {receipt_timestamp}: {c}")


async def liquidations(liquidation, receipt_timestamp):
    pass
    # print(f"Liquidation received at {receipt_timestamp}: {liquidation}")


def main():
    config = {'log': {'filename': 'demo.log',
                      'level': 'DEBUG', 'disabled': False}}
    # the config will be automatically passed into any exchanges set up by string. Instantiated exchange objects would need to pass the config in manually.
    f = FeedHandler(config=config)
    # pair is ['BTC-USDT']
    pairs = Binance.symbols()[10:11]
    f.add_feed(Binance(symbols=pairs, channels=[L2_BOOK, TRADES], callbacks={
               L2_BOOK: book, CANDLES: candle_callback, TRADES: trade, TICKER: ticker}))
    f.run()


if __name__ == '__main__':
    # capture orderbook quote date for BTC-USD from Binance
    with qconnection.QConnection(host='localhost', port=6969) as q:

        # create table for trades
        q("trades:([]side:`bid`ask; price: 0.0 0.0 ; quantity: 0.0 0.0)")
        main()
