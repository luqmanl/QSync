import json
from channels.generic.websocket import WebsocketConsumer
from django.core import serializers
from .models import Book


class WSConsumer(WebsocketConsumer):

    def connect(self):
        self.accept()
        books = Book.objects.all()
        self.send(json.dumps(serializers.serialize('json', books)))
