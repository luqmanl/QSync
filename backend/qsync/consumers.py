import json
from channels.generic.websocket import WebsocketConsumer
from random import randint
from time import sleep
from .models import Book
from django.core import serializers

class WSConsumer(WebsocketConsumer):
    
    def connect(self):
        self.accept()
        books = Book.objects.all()
        self.send(json.dumps(serializers.serialize('json', books)))