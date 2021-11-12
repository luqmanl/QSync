import json
from channels.consumer import AsyncConsumer
import asyncio


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

    async def send_l2_data(self, event):
        data = event["data"]

        # generate overview statistics if needed
        if self.data_type == "l2overview":
            data = json.loads(event["data"])
            highestBid = data["bids"][0]
            lowestAsk = data["asks"][0]
            volume = 0
            imbalance = (float(highestBid) - float(lowestAsk)) / \
                (float(highestBid) + float(lowestAsk))
            pairs = [{
                "pair_name": data["sym"],
                "highest_bid": highestBid,
                "lowest_ask": lowestAsk,
                "volume": volume,
                "imbalance": str(imbalance),
            }]
            data = json.dumps({"pairs": pairs})

        await self.send({
            "type": 'websocket.send',
            "text": data
        })

    async def websocket_disconnect(self, event):
        print('disconnected', event)
