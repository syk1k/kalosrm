from django.http import JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
# Create your views here.


def default_map(request):
        # TODO: move this token to Django settings from an environment variable
    # found in the Mapbox account settings and getting started instructions
    # see https://www.mapbox.com/account/ under the "Access tokens" section
    mapbox_access_token = 'pk.eyJ1IjoiaGVybWFubmthc3MiLCJhIjoiMDQwM2RiZjA3OGE2NTU3YjE0NmIxYTE3NjkzMjI4MzYifQ.xZBFTfG8WU0pUfAvr6dH4A'
    return render(request, 'map/map.html', 
                  { 'mapbox_access_token': mapbox_access_token })

                  #https://api.mapbox.com/v4/mapbox.dark/-76.9,38.9,5/400x200.png?access_token=your-access-token


import requests
from django.shortcuts import render
from django.views import View


class MapView(View):

    def convert_longlat_latlong(self, coordinates):
        return_coordinates = []
        for coordinate in coordinates:
            lat, long_ = coordinate[1], coordinate[0]
            return_coordinates.append([lat, long_])
        return return_coordinates

    def get(self, *args, **kwargs):
        return render(self.request, 'map/map.html')


    @method_decorator(csrf_exempt)
    def post(self, *args, **kwargs):
        mapbox_access_token = 'pk.eyJ1Ijoic3lrMWsiLCJhIjoiY2plb2JqMHllNGYydjJ3cGVmMnE2aHlkYSJ9.uXv_J38Ndp0_aHJ0r9zP4A'
        context = {}
        try:
            from_ = self.request.POST['from']
            print(from_)
            # https://osmand.net/go?lat=6.1866007&lon=1.1579759&z=20
            to_ = self.request.POST['to']
            print(to_)
            result = requests.get(f'https://api.mapbox.com/directions/v5/mapbox/driving/{from_};{to_}?access_token={mapbox_access_token}&geometries=geojson')
            print(result)
            context['result'] = result.json()
            coordinates = result.json()['routes'][0]['geometry']['coordinates']
            print(coordinates)
            distance = result.json()['routes'][0]['distance']

            distance = distance / 1000

            distance_arrondie = int(distance)
            print(distance_arrondie)
            if distance_arrondie > distance:
                distance_arrondie = distance_arrondie - 1
            reste_distance = distance - distance_arrondie

            if reste_distance >= 0.5:
                distance_arrondie = distance_arrondie + 1

            prix = 100 * distance_arrondie

            #latlong = self.convert_longlat_latlong(coordinates)
            lnglat = coordinates

            print(lnglat)
            context = {
                'result': result.json(),
                'from': from_,
                'to': to_,
                'distance': distance,
                'distance_arrondie': distance_arrondie,
                'lnglat': lnglat,
                'prix': prix,
                'mapbox_access_token': mapbox_access_token,
            }
        except:
            print("Error")
        return JsonResponse(context)



class RouteResultView(View):
    def get(self, *args, **kwargs):
        from_ = self.request.GET.get('from')
        to_ = self.request.GET.get('to')
        distance = self.request.GET.get('distance')
        context = {
            "From": from_,
            "To": to_,
            "Distance": distance,
        }
        return JsonResponse(context)