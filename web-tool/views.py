from django.shortcuts import render
from django.http import JsonResponse
import ujson


# Create your views here.

def index(request):
    return render(request, "index.html", dict(baseUrl='http://localhost:8000'))


def ajax_getChartData(request):
    jsonId = request.GET.get('json_id', None)
    pointId = request.GET.get('point_id', None)

    data = getDataFromJson(jsonId, pointId)

    return JsonResponse(data, safe=False)


def getDataFromJson(jsonId, pointId):

    file = open("static/data/with-time/data-time-" + jsonId + ".json", "r")

    data = ujson.load(file)
    pointId = str(pointId)

    while pointId.count('') <= 12:
        pointId = pointId + '0'

    singleData = {}

    for layer in data['data']:
        if pointId in layer:
            for key, value in layer[pointId].items():
                singleData[key] = value

    return singleData
