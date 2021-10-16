from rest_framework import viewsets
from django.shortcuts import HttpResponse  # , render
from .models import Qsync
from .serializers import QsyncSerializer


def index(request):
    print(request)
    return HttpResponse("NARRRSAYEEEE")


class QsyncView(viewsets.ModelViewSet):
    serializer_class = QsyncSerializer
    # queryset = Qsync.objects.all() # Apparently Qsync has no 'objects' member
    queryset = Qsync.objects.all()  # To change
