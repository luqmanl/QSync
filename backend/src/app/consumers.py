from channels.generic.websocket import AsyncWebsocketConsumer
import json

class WSConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        for i in range(1,10):
            await self.send(json.dumps({'message' : i}))