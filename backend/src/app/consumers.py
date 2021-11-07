from channels.consumer import AsyncConsumer
import asyncio


class QsyncConsumer(AsyncConsumer):
    board_room = "qsync"

    async def websocket_connect(self, event):
        self.exchange_name = self.scope['url_route']['kwargs']['exchange_name']
        self.pair_name = self.scope['url_route']['kwargs']['pair_name']
        self.data_type = self.scope['url_route']['kwargs']['data_type']

        await self.channel_layer.group_add(
            f"{self.exchange_name}_{self.pair_name}_{self.data_type}",
            self.channel_name
        )
        await self.send({
            "type": "websocket.accept"
        })

    async def send_tick_data(self, event):
        await self.send({
            "type": 'websocket.send',
            'text': event['text']
        })

    async def websocket_disconnect(self, event):
        print('disconnected', event)
