from django.http.response import HttpResponse
from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt,csrf_protect


def index(request):
    return render(request, "index.html")

@csrf_exempt
def getHistoricalBasisData(request):
    data = {"data":"this is teh data"}
    return HttpResponse(json.dumps(data), content_type="application/json")
