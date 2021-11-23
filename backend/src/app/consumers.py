import json
from channels.consumer import AsyncConsumer
import asyncio
import numpy as np
import re

from qpython import qconnection

""" Consumer responsible for handling connection from each frontend component. """


class ClientConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        self.spot_prices = {"BINANCE": 66000,
                            "BITFINEX": 65000, "COINBASE": 50000}
        self.future_prices = {}
        exchanges = self.scope['url_route']['kwargs']['exchange_name'].split(
            "-")
        self.spot_exchanges = exchanges[0].split("_")
        self.future_exchanges = []
        if len(exchanges) == 2:
            self.future_exchanges = exchanges[1].split("_")

        self.pair_names = self.scope['url_route']['kwargs']['pair_names'].split(
            "_")
        self.data_type = self.scope['url_route']['kwargs']['data_type']

        # <spot>-<future>/<spot_prices>-<future_prices>

        for spot in spot_exchanges:
            for pair in self.pair_names

        for exchange in exchange_names:
            for pair in self.pair_names:
                print(f"{exchange}_{pair}_{self.data_type}")
                await self.channel_layer.group_add(
                    f"{exchange}_{pair}_{self.data_type}",
                    self.channel_name
                )

        await self.send({
            "type": "websocket.accept"
        })

    async def send_l2overview_data(self, event):
        data = json.loads(event["data"])
        highestBid = data["bids"][0]
        lowestAsk = data["asks"][0]
        with qconnection.QConnection(host='localhost', port=5011) as q:
            volume = q.sendSync('.trades.vol', np.string_(data['sym']))
        imbalance = (highestBid - lowestAsk) / \
            (highestBid + lowestAsk)

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

    async def send_l2orderbook_data(self, event):

        await self.send({
            "type": 'websocket.send',
            "text": event["data"]
        })

    async def send_trade_data(self, event):

        await self.send({
            'type': 'websocket.send',
            'text': event['data']
        })

    async def send_basis_data(self, event):
        print("entry")
        data = json.loads(event["data"])
        highestBid = data["bids"][0]
        lowestAsk = data["asks"][0]

        basis_prices = []

        if re.search("[0-9][0-9].[0-9][0-9]", data["sym"]):
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
                    "basisValue": future - self.spot_prices[data["exchange"]]
                }
                basis_prices.append(basisAddition)

        data = {"basisAdditions": basis_prices}

        print(data)
        print("should've printed data")

        await self.send({
            'type': 'websocket.send',
            'text': json.dumps(data)
        })

    async def websocket_disconnect(self, event):
        print('disconnected', event)
