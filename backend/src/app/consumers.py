from channels.generic.websocket import WebsocketConsumer
import json
import random


class WSConsumer(WebsocketConsumer):
    # def __init__(self):
    #     self.x = 0

    async def connect(self):
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # for i in range(1, 10):
        #     await self.send(json.dumps({'message': i}))
