from rest_framework import viewsets
from django.shortcuts import HttpResponse

from .models import Book
from .serializers import QsyncSerializer


def index(request):
    print(request)
    return HttpResponse("NARRRSAYEEEE")


class QsyncView(viewsets.ModelViewSet):
    serializer_class = QsyncSerializer
    # queryset = Qsync.objects.all() # Apparently Qsync has no 'objects' member
    queryset = Book.objects.all()  # To change
