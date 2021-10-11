from django.shortcuts import render, HttpResponse

def index(request):
    return HttpResponse("NARRRSAYEEEE")

from rest_framework import viewsets
from .serializers import QsyncSerializer
from .models import Qsync

class QsyncView(viewsets.ModelViewSet):
    serializer_class = QsyncSerializer
    queryset = Qsync.objects.all()