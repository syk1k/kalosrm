from django.shortcuts import render
from mapbox import Directions
# Create your views here.


def default_map(request):
        # TODO: move this token to Django settings from an environment variable
    # found in the Mapbox account settings and getting started instructions
    # see https://www.mapbox.com/account/ under the "Access tokens" section
    mapbox_access_token = 'pk.eyJ1IjoiaGVybWFubmthc3MiLCJhIjoiMDQwM2RiZjA3OGE2NTU3YjE0NmIxYTE3NjkzMjI4MzYifQ.xZBFTfG8WU0pUfAvr6dH4A'
    return render(request, 'map/map.html', 
                  { 'mapbox_access_token': mapbox_access_token })

                  #https://api.mapbox.com/v4/mapbox.dark/-76.9,38.9,5/400x200.png?access_token=your-access-token