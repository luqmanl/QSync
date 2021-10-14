from rest_framework import viewsets
from .models import Qsync
from .serializers import QsyncSerializer
from django.shortcuts import render, HttpResponse


def index(request):
    return HttpResponse("NARRRSAYEEEE")


class QsyncView(viewsets.ModelViewSet):
    serializer_class = QsyncSerializer
    queryset = Qsync.objects.all()
