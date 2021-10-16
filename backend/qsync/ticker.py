from decimal import Decimal

from cryptofeed import FeedHandler
from cryptofeed.defines import CANDLES, L2_BOOK, TICKER, TRADES
# Also can import BID, ASK, BLOCKCHAIN, FUNDING, GEMINI, L3_BOOK,
# LIQUIDATIONS, OPEN_INTEREST, PERPETUAL, INDEX
from cryptofeed.exchanges import (Binance)
# from cryptofeed.exchanges.fmfw import FMFW
# from cryptofeed.exchanges.kraken_futures import KrakenFutures
# from cryptofeed.exchanges.blockchain import Blockchain
# from cryptofeed.exchanges.bithumb import Bithumb
# from cryptofeed.symbols import Symbol
# from cryptofeed.exchanges.phemex import Phemex
# from cryptofeed.exchanges.dydx import dYdX
# from cryptofeed.exchanges.deribit import Deribit
from qpython import qconnection


# Examples of some handlers for different updates. These currently don't do much.
# Handlers should conform to the patterns/signatures in callback.py
# Handlers can be normal methods/functions or async. The feedhandler is paused
# while the callbacks are being handled (unless they in turn await other functions or I/O)
# so they should be as lightweight as possible
async def ticker(t, receipt_timestamp):
    if t.timestamp is not None:
        assert isinstance(t.timestamp, float)
    assert isinstance(t.exchange, str)
    assert isinstance(t.bid, Decimal)
    assert isinstance(t.ask, Decimal)
    print(f'Ticker received at {receipt_timestamp}: {t}')


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


async def book(book_, receipt_timestamp):
    if (book_.symbol == "BTC-USDT"):
        print(book_)
    print(f'{book_.exchange} : BTC-USD :' +
          f'ASKS - {len(book_.book.asks)} :' +
          f'BIDS - {len(book_.book.bids)} :' +
          f'Last ASK - {book_.quantity} :' +
          f'Last BID - {book_.book.bid.index(0)} ')
    print(receipt_timestamp)


async def funding(f, receipt_timestamp):
    print(f"Funding update received at {receipt_timestamp}: {f}")


async def oi(update, receipt_timestamp):
    print(f"Open Interest update received at {receipt_timestamp}: {update}")


async def index(i, receipt_timestamp):
    print(f"Index received at {receipt_timestamp}: {i}")


async def candle_callback(c, receipt_timestamp):
    print(f"Candle received at {receipt_timestamp}: {c}")


async def liquidations(liquidation, receipt_timestamp):
    print(f"Liquidation received at {receipt_timestamp}: {liquidation}")


def main():
    config = {'log': {'filename': 'demo.log',
                      'level': 'DEBUG', 'disabled': False}}
    # The config will be automatically passed into any exchanges set up by string.
    # Instantiated exchange objects would need to pass the config in manually.
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
