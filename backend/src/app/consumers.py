from channels.consumer import AsyncConsumer
import asyncio


class QsyncConsumer(AsyncConsumer):
    board_room = "qsync"

    async def websocket_connect(self, event):
        print('connected', event)
        await self.channel_layer.group_add(
            QsyncConsumer.board_room,
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
