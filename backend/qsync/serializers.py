from rest_framework import serializers
from .models import Qsync

class QsyncSerializer(serializers.ModelSerializer):
    class Meta:
        model = Qsync
        fields = ('id', 'title', 'description', 'completed')