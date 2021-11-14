import json
from channels.consumer import AsyncConsumer
import asyncio
import numpy as np

from qpython import qconnection

""" Consumer responsible for handling connection from each frontend component. """


class ClientConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        self.exchange_name = self.scope['url_route']['kwargs']['exchange_name']
        self.pair_names = self.scope['url_route']['kwargs']['pair_names'].split(
            "_")
        self.data_type = self.scope['url_route']['kwargs']['data_type']

        for pair in self.pair_names:
            await self.channel_layer.group_add(
                f"{self.exchange_name}_{pair}_{self.data_type}",
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

        pairs = [{
            "pairName": data["sym"],
            "highestBid": highestBid,
            "lowestAsk": lowestAsk,
            "volume": volume,
            "imbalance": imbalance,
        }]
        data = json.dumps({"pairs": pairs})

        await self.send({
            "type": 'websocket.send',
            "text": data
        })

    async def send_l2orderbook_data(self, event):

        await self.send({
            "type": 'websocket.send',
            "text": event["data"]
        })

    async def websocket_disconnect(self, event):
        print('disconnected', event)
