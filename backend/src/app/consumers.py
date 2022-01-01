from channels.consumer import AsyncConsumer
import json
import numpy as np
from qpython import qconnection
import re


""" 
    Consumers responsible for handling different types of data required by clients.
    Each Consumer receives request to subscribe to new streams of data, handled through django channels.
    Each Consumer has a "send_<datatype>_data" function utilised by django channels for sending new data to clients.
"""


# Handles trade data for exchange and pair specified by client in request
class TradeTableConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        await self.send({
            "type": "websocket.accept"
        })

    async def send_trade_data(self, event):
        await self.send({
            'type': 'websocket.send',
            'text': event['data']
        })

    async def websocket_receive(self, event):
        # req = {exchange: String, pair: String}
        req = json.loads(event["text"])
        await self.channel_layer.group_add(
            f"{req['exchange']}_{req['pair']}_trade",
            self.channel_name
        )

    async def websocket_disconnect(self, event):
        print('disconnected trade table websocket: ', event['code'])


# Handles spot-future basis table data for exchanges and pairs specified by client in request
class BasisTableConsumer(AsyncConsumer):

    async def websocket_connect(self, event):

        self.future_prices = {}
        self.spot_prices = {}

        await self.send({
            "type": "websocket.accept"
        })

    async def send_basis_data(self, event):
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
                await self.channel_layer.group_add(
                    f"{exchange}_{pair}_basis",
                    self.channel_name
                )

        for exchange in data["spot_exchanges"]:
            for pair in data["spot_pairs"]:
                await self.channel_layer.group_add(
                    f"{exchange}_{pair}_basis",
                    self.channel_name
                )

    async def websocket_disconnect(self, event):
        print('disconnected basis table websocket: ', event['code'])


# Handles l2orderbook overview data for exchanges and pairs specified by client in request
class L2overviewConsumer(AsyncConsumer):
    async def websocket_connect(self, event):

        await self.send({
            "type": "websocket.accept"
        })

    async def websocket_receive(self, event):
        # {exchanges: String[], pairs: String[]}
        data = json.loads(event["text"])
        for pair in data["pairs"]:
            for exchange in data["exchanges"]:
                await self.channel_layer.group_add(
                    f"{exchange}_{pair}_l2overview",
                    self.channel_name
                )

    async def websocket_disconnect(self, event):
        print('disconnected l2overview websocket: ', event['code'])

    async def send_l2overview_data(self, event):
        data = json.loads(event["data"])
        highestBid = data["bids"][0]
        lowestAsk = data["asks"][0]

        with qconnection.QConnection(host='localhost', port=5011) as q:
            volume = q.sendSync('.trades.vol', np.string_(data['sym']))

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
        await self.send({
            "type": "websocket.accept"
        })

    async def send_l2orderbook_data(self, event):
        await self.send({
            "type": 'websocket.send',
            "text": event["data"]
        })

    async def websocket_receive(self, event):
        # data = {exchange: String, pair: String}
        data = json.loads(event["text"])
        await self.channel_layer.group_add(
            f"{data['exchange']}_{data['pair']}_l2orderbook",
            self.channel_name
        )

    async def websocket_disconnect(self, event):
        print('disconnected l2orderbook websocket: ', event['code'])
