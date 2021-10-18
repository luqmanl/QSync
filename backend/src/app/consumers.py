from channels.generic.websocket import WebsocketConsumer
import json
import random


class WSConsumer(WebsocketConsumer):
    # def __init__(self):
    #     self.x = 0

    def connect(self):
        self.accept()

        for i in range(1, 10):
            self.send(json.dumps({'message': 0}))
