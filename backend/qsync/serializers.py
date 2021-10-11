from rest_framework import serializers
# from .models import qsync

class QsyncSerializer(serializers.ModelSerializer):
    class Meta:
        # model = qsync
        fields = ('id', 'title', 'description', 'completed')