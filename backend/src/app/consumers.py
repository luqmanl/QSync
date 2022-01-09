from channels.consumer import AsyncConsumer
import json
import numpy as np
from qpython.qconnection import QConnection
import re
from django.conf import settings
from datetime import datetime, timedelta
from .models import SupportedCurrencies, PriceInformation, CurrencyInformation
from django.forms.models import model_to_dict
from asgiref.sync import sync_to_async

""" 
    Consumers responsible for handling different types of data required by clients.
    Each Consumer receives request to subscribe to new streams of data, handled through django channels.
    Each Consumer has a "send_<datatype>_data" function utilised by django channels for sending new data to clients.
"""

# Handles trade data for exchange and pair specified by client in request


class TradeTableConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        self.channel_groups = []
        await self.send({
            "type": "websocket.accept"
        })

    async def send_data(self, event):
        await self.send({
            'type': 'websocket.send',
            'text': event['data']
        })

    async def websocket_receive(self, event):
        # req = {exchange: String, pair: String}
        req = json.loads(event["text"])
        self.channel_groups.append(f"{req['exchange']}_{req['pair']}_trades")
        await self.channel_layer.group_add(
            self.channel_groups[-1],
            self.channel_name
        )

    async def websocket_disconnect(self, event):
        for channel in self.channel_groups:
            await self.channel_layer.group_discard(channel, self.channel_name)
        print('disconnected trade table websocket: ', event['code'])


# Handles spot-future basis table data for exchanges and pairs specified by client in request
class BasisTableConsumer(AsyncConsumer):

    async def websocket_connect(self, event):

        self.future_prices = {}
        self.spot_prices = {}
        self.channel_groups = []

        await self.send({
            "type": "websocket.accept"
        })

    async def send_data(self, event):
        data = json.loads(event["data"])
        highestBid = data["bids"][0]
        lowestAsk = data["asks"][0]

        basis_prices = []

        # if symbol is perpetual
        if re.search("PERP", data["sym"]):
            self.future_prices[data["exchange"]] = (highestBid + lowestAsk) / 2
            for (exchange, spot) in self.spot_prices.items():
                basisAddition = {
                    "spotExchange": exchange,
                    "futureExchange": data["exchange"],
                    "sym": data["sym"],
                    "basisValue": spot - self.future_prices[data["exchange"]]
                }
                basis_prices.append(basisAddition)
        else:
            self.spot_prices[data["exchange"]] = (highestBid + lowestAsk) / 2
            for (exchange, future) in self.future_prices.items():
                basisAddition = {
                    "spotExchange": data["exchange"],
                    "futureExchange": exchange,
                    "sym": data["sym"],
                    "basisValue": self.spot_prices[data["exchange"]] - future
                }
                basis_prices.append(basisAddition)
        if len(basis_prices) != 0:
            data = {"basisAdditions": basis_prices}
            await self.send({
                'type': 'websocket.send',
                'text': json.dumps(data)
            })

    async def websocket_receive(self, event):
        # data = {futures_exchanges: String[], spot_exchanges: String[], spot_pairs: String[], futures_pairs: String[]}
        data = json.loads(event["text"])

        for exchange in data["futures_exchanges"]:
            for pair in data["futures_pairs"]:
                self.channel_groups.append(f"{exchange}_{pair}_orderbooktop")
                await self.channel_layer.group_add(
                    self.channel_groups[-1],
                    self.channel_name
                )

        for exchange in data["spot_exchanges"]:
            for pair in data["spot_pairs"]:
                self.channel_groups.append(f"{exchange}_{pair}_orderbooktop")
                await self.channel_layer.group_add(
                    self.channel_groups[-1],
                    self.channel_name
                )

    async def websocket_disconnect(self, event):
        for channel in self.channel_groups:
            await self.channel_layer.group_discard(channel, self.channel_name)
        print('disconnected basis table websocket: ', event['code'])


# Handles l2orderbook overview data for exchanges and pairs specified by client in request
class L2overviewConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        self.channel_groups = []
        await self.send({
            "type": "websocket.accept"
        })

    async def websocket_receive(self, event):
        # {exchanges: String[], pairs: String[]}
        data = json.loads(event["text"])
        for pair in data["pairs"]:
            for exchange in data["exchanges"]:
                self.channel_groups.append(f"{exchange}_{pair}_orderbooktop")
                await self.channel_layer.group_add(
                    self.channel_groups[-1],
                    self.channel_name
                )

    async def websocket_disconnect(self, event):
        for channel in self.channel_groups:
            await self.channel_layer.group_discard(channel, self.channel_name)
        print('disconnected l2overview websocket: ', event['code'])

    async def send_data(self, event):
        data = json.loads(event["data"])
        highestBid = data["bids"][0]
        lowestAsk = data["asks"][0]

        q = QConnection(host=settings.KDB_HOST, port=5011)
        q.open()
        try:
            volume = q.sendSync('.trades.vol', np.string_(data['sym']))
        except Exception as e:
            print(e)
        q.close()

        highestBidSize = data["bidSizes"][0]
        lowestAskSize = data["askSizes"][0]
        imbalance = (highestBidSize - lowestAskSize) / \
            (highestBidSize + lowestAskSize)

        data = {
            "exchange": data["exchange"],
            "sym": data["sym"],
            "highestBid": highestBid,
            "lowestAsk": lowestAsk,
            "volume": volume,
            "imbalance": imbalance,
        }

        await self.send({
            "type": 'websocket.send',
            "text": json.dumps(data)
        })

# Handles l2 orderbook data for exchange and pair specified by client in request


class L2orderbookConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        self.channel_groups = []
        await self.send({
            "type": "websocket.accept"
        })

    async def send_data(self, event):
        await self.send({
            "type": 'websocket.send',
            "text": event["data"]
        })

    async def websocket_receive(self, event):
        # data = {exchange: String, pair: String}
        data = json.loads(event["text"])
        self.channel_groups.append(
            f"{data['exchange']}_{data['pair']}_orderbooktop")
        await self.channel_layer.group_add(
            self.channel_groups[-1],
            self.channel_name)

    async def websocket_disconnect(self, event):
        for channel in self.channel_groups:
            await self.channel_layer.group_discard(channel, self.channel_name)
        print('disconnected l2orderbook websocket: ', event['code'])


class TopCurrenciesConsumer(AsyncConsumer):
    def __init__(self, get_analysis_data=False):
        self.get_analysis_data = get_analysis_data

    def get_current_supply(self, ticker):
        ticker_object = SupportedCurrencies.objects.filter(ticker=ticker)[0]
        supply = model_to_dict(
            CurrencyInformation.objects.filter(currency=ticker_object)[0])
        return supply["current_supply"]

    def get_market_cap(self, ticker):
        ticker_object = SupportedCurrencies.objects.filter(ticker=ticker)[0]
        return model_to_dict(
            PriceInformation.objects.filter(currency=ticker_object)[0])["market_cap"]

    async def websocket_connect(self, event):
        self.historical_prices = {}
        await self.send({
            "type": "websocket.accept"
        })

    async def send_data(self, event):
        #response = {name, price, change24h, change7d}
        data = json.loads(event["data"])
        ticker = data["sym"].split("-")[0].upper()
        price = (data["bids"][0] + data["asks"][0]) / 2
        prev_price = self.historical_prices[data["sym"]]
        size_highest_bid = data["bidSizes"][0]
        size_lowest_ask = data["askSizes"][0]
        response = {
            "name": data["sym"],
            "price": price,
            "change24h": (price - prev_price["1D"]) / prev_price["1D"],
            "change7d": (price - prev_price["7D"]) / prev_price["7D"],
            "marketCap": await sync_to_async(self.get_market_cap)(ticker),
        }
        if self.get_analysis_data:
            response["imbalance"] = (
                size_highest_bid - size_lowest_ask) / (size_lowest_ask + size_highest_bid)
            response["currentSupply"] = await sync_to_async(self.get_current_supply)(ticker)
        await self.send({
            "type": 'websocket.send',
            "text": json.dumps({"currencyData": [response]})
        })

    async def websocket_receive(self, event):
        # data = {exchange: String, pairs: String[]}
        data = json.loads(event["text"])
        for pair in data['pairs']:
            await self.channel_layer.group_add(
                f"{data['exchange']}_{pair}_orderbooktop",
                self.channel_name
            )

        # get -1D and -7D prices
        q = QConnection(host='localhost', port=5012)
        q.open()
        try:
            historical_price = q.sendSync(
                '.orderbook.prevprice', np.string_(data['exchange']), np.array([np.string_(pair) for pair in data['pairs']]))
            for key, row in historical_price.items():
                self.historical_prices[key[0].decode(
                    'UTF-8')] = {"1D": row[0], "7D": row[1]}
        except Exception as e:
            print(e)
        q.close()

    async def websocket_disconnect(self, event):
        print('disconnected top currencies websocket: ', event['code'])


class ArbitrageTableConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        self.send_timestamps = {}
        self.channel_groups = []
        await self.send({
            "type": "websocket.accept"
        })

    async def send_arbitrage_data(self, event):
        data = json.loads(event["data"])
        if self.send_timestamps[data["sym"]] <= datetime.now() - timedelta(seconds=1):
            self.send_timestamps[data["sym"]] = datetime.now()
            response = {"currency": data["sym"],
                        "maxArbitrage": (data["bid"] - data["ask"]) / data["ask"],
                        "highestBid": data["bid"],
                        "bidExchange": data["bidExchange"],
                        "askExchange": data["askExchange"],
                        "lowestAsk": data["ask"],
                        "price": (data["ask"] + data["bid"]) / 2
                        }
            await self.send({
                'type': 'websocket.send',
                'text': json.dumps(response)
            })

    async def websocket_receive(self, event):
        # data = {"pairs": String}
        data = json.loads(event["text"])
        for pair in data["pairs"]:
            self.send_timestamps[pair] = datetime.now()
            self.channel_groups.append(f"{pair}_arbitrage")
            await self.channel_layer.group_add(self.channel_groups[-1], self.channel_name)

    async def websocket_disconnect(self, event):
        for channel in self.channel_groups:
            await self.channel_layer.group_discard(channel, self.channel_name)
        print('disconnected arbitrage table websocket: ', event['code'])
