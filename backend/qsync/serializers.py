from rest_framework import serializers
from .models import Book


class QsyncSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('id', 'time', 'sym', 'feedhandlerTime',
                  'side', 'price', 'qty')
