from django.http import HttpResponse, JsonResponse

import requests
from django.shortcuts import render
from django.views import View


class MapView(View):
    def get(self, *args, **kwargs):
        return render(self.request, 'mapapp/routeform.html')

    def post(self, *args, **kwargs):
        try:
            from_ = self.request.POST['from']
            to_ = self.request.POST['to']
            result = requests.get(f'http://router.project-osrm.org/route/v1/driving/{from_};{to_}?exclude=motorway')
            print(result)
            distance = result.json()['routes'][0]['distance']
            context = {
                'result':result.json(),
                'from': from_,
                'to': to_,
                'distance': distance,
            }
        except:
            context = {}
        return render(self.request, 'mapapp/index.html', context)