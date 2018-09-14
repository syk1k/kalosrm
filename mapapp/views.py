from django.http import HttpResponse, JsonResponse

import requests
from django.shortcuts import render
from django.views import View


class MapView(View):

    def convert_longlat_latlong(self, coordinates):
        return_coordinates = []
        for coordinate in coordinates:
            lat,long_ = coordinate[1], coordinate[0]
            return_coordinates.append([lat, long_])
        return return_coordinates



    def get(self, *args, **kwargs):
        return render(self.request, 'mapapp/routeform.html')


    
    def post(self, *args, **kwargs):
        context = {}
        try:
            from_ = self.request.POST['from']
            #https://osmand.net/go?lat=6.1866007&lon=1.1579759&z=20
            to_ = self.request.POST['to']
            result = requests.get(f'http://router.project-osrm.org/route/v1/driving/{from_};{to_}?geometries=geojson')
            print(result)
            context['result'] = result.json()
            coordinates = result.json()['routes'][0]['geometry']['coordinates']
            distance = result.json()['routes'][0]['distance']

            distance = distance/1000

            distance_arrondie = int(distance)
            print(distance_arrondie)
            if distance_arrondie > distance:
                distance_arrondie = distance_arrondie - 1
            reste_distance = distance - distance_arrondie

            if reste_distance >= 0.5:
                distance_arrondie = distance_arrondie + 1
            
            prix = 100 * distance_arrondie

            latlong = self.convert_longlat_latlong(coordinates)
            print(latlong);
            context = {
                'result':result.json(),
                'from': from_,
                'to': to_,
                'distance': distance,
                'distance_arrondie': distance_arrondie,
                'latlong' : latlong,
                'prix': prix,
            }
        except:
            print("Error")
        return render(self.request, 'mapapp/index.html', context)