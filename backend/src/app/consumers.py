from channels.consumer import AsyncConsumer
import asyncio

class QsyncConsumer(AsyncConsumer):
  async def websocket_connect(self, event):
    print('connected', event)
    board_room = "qsync"
    self.board_room = board_room
    await self.channel_layer.group_add(
      board_room,
      self.channel_name
    )
    await self.send({
      "type": "websocket.accept"
    })

    await self.board_message({"text": str(1)})

  async def websocket_receive(self, event):
    data = event.get('text', None)
    await self.channel_layer.group_send(
      self.board_room,
      {
        "type": "board_message",
        "text": data
      })

  async def board_message(self, event):

    for i in range(10):
        event["text"] = str(i)    
        await self.send({
            "type": 'websocket.send',
            'text': event['text']
        })


   
  async def websocket_disconnect(self, event):
    print('disconnected', event)