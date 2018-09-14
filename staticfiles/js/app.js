(()=>{
    var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    });

    var map = L.map("map", {
        center : [8.695, 2.395],
        zoom : 7,
        zoomControl: true,
        scrollWheelZoom : true,
        attributionControl: true,
        layers: [osm]
    });


    var redMarker = L.ExtraMarkers.icon({
        icon: 'fa-coffee',
        markerColor: 'red',
        shape: 'circle',
        prefix: 'fa'
    });

    var greenMarker = L.ExtraMarkers.icon({
        icon: 'fa-coffee',
        markerColor: 'green',
        shape: 'circle',
        prefix: 'fa'
    });

    try{
        latlong = JSON.parse(latlong);
        console.log(latlong);

        from_ = latlong[0]
        to_ = latlong[latlong.length-1]

        from_marker = L.marker(from_, {icon: redMarker});
        from_marker.addTo(map);
        from_marker.bindPopup("From");
        to_marker = L.marker(to_, {icon: greenMarker});
        to_marker.addTo(map);
        to_marker.bindPopup("To");

       
        

        var polyline = L.polyline(latlong, {color: 'red'}).addTo(map);
        // zoom the map to the polyline
        map.fitBounds(polyline.getBounds());
    }catch(e){

    }
    

    

})();