import json
from channels.consumer import AsyncConsumer
import asyncio
import numpy as np
import re

from qpython import qconnection

""" Consumer responsible for handling connection from each frontend component. """


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
        # {exchange: "", pair: ""}
        data = json.loads(event["text"])
        await self.channel_layer.group_add(
            f"{data['exchange']}_{data['pair']}_trade",
            self.channel_name
        )

    async def websocket_disconnect(self, event):
        print('disconnected', event)


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

        if re.search("[0-9][0-9].[0-9][0-9]", data["sym"]):  # if symbol has future form
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

        data = {"basisAdditions": basis_prices}

        await self.send({
            'type': 'websocket.send',
            'text': json.dumps(data)
        })

    async def websocket_receive(self, event):
        # {futures-exchanges: [], spot-exchanges: [], spot-pairs: [], futures_pairs: []}
        data = json.loads(event["text"])
        # add FUTURES exchanges and pairs to group
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
        print('disconnected', event)


class L2overviewConsumer(AsyncConsumer):
    async def websocket_connect(self, event):

        await self.send({
            "type": "websocket.accept"
        })

    async def websocket_receive(self, event):
        # {exchanges: [], pairs: []}
        data = json.loads(event["text"])
        for pair in data["pairs"]:
            for exchange in data["exchanges"]:
                await self.channel_layer.group_add(
                    f"{exchange}_{pair}_l2overview",
                    self.channel_name
                )

    async def websocket_disconnect(self, event):
        print('disconnected', event)

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
        # {exchange: "", pair: ""}
        data = json.loads(event["text"])
        await self.channel_layer.group_add(
            f"{data['exchange']}_{data['pair']}_l2orderbook",
            self.channel_name
        )

    async def websocket_disconnect(self, event):
        print('disconnected', event)
