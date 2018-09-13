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

})();