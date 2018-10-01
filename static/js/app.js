mapboxgl.accessToken = 'pk.eyJ1IjoiaGVybWFubmthc3MiLCJhIjoiMDQwM2RiZjA3OGE2NTU3YjE0NmIxYTE3NjkzMjI4MzYifQ.xZBFTfG8WU0pUfAvr6dH4A';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [1.1756604,6.177847],
    zoom: 13,
    attributionControl: false,
    doubleClickZoom: false,
});

var nav = new mapboxgl.NavigationControl();
map.addControl(nav);

map.addControl(new mapboxgl.AttributionControl({
    compact: true,
    customAttribution : '<a href="http://kalamar.tg">kalamar</a>'
}));



// Locate the user on the map...
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

map.addControl(new mapboxgl.FullscreenControl());

var marker = new mapboxgl.Marker()
  .setLngLat([6.15,1.25])
  .addTo(map);


/*map.on('load', function () {

    map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates
                }
            }
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#888",
            "line-width": 8
        }
    });
});*/


class DirectionsControl {
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl direction-ctrl';
        this._container.textContent = 'Hello, world';
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

map.addControl(new DirectionsControl(), 'top-left');


let directionElement = document.querySelector(".direction-ctrl");
directionElement.innerHTML = "" +
    "<div class='field has-addons' id='from_'> " +
    "<div class='control'>" +
    "<a class='button is-primary' id='btn-from'>A</a>" +
    "</div>" +
    "<div class='control'>" +
    "<input id='depart' class='input' type='text' placeholder='Départ'>" +
    "</div>" +
    "</div>"+

    "<div class='field has-addons' id='to_'>" +
    "<div class='control'>" +
    "<a class='button is-success' id='btn-to'>B</a>" +
    "</div>" +
    "<div class='control'>" +
    "<input id='arrive' class='input' type='text' placeholder='Arrivé'>" +
    "</div>" +
    "</div>";

// How to display markers on the map on click

let btn_title = 'A';
let btn_from = document.querySelector("#btn-from");
btn_from.onclick = () => {
  console.log("Btn-from clicked");
  btn_title = "A";
};

let btn_to = document.querySelector("#btn-to");

btn_to.onclick = () => {
  console.log("Btn-to clicked");
};

let from_el = document.createElement('button');
from_el.className = 'button is-rounded is-primary from_';
from_el.innerText = "A";

let to_el = document.createElement('button');
to_el.className = 'button is-rounded is-success to_';
to_el.innerText = "B";


let fromMarker = new mapboxgl.Marker({
    element: from_el,
    draggable: true,
    anchor: 'center'
});


let toMarker = new mapboxgl.Marker({
    element: to_el,
    draggable: true,
    anchor: 'center',
});


// Adding markers on the map when the user make a doubleclick event.
map.on('dblclick', (data)=>{
    if(btn_title && btn_title==='A'){
        console.log(data);
        console.log(data.lngLat);
        fromMarker.setLngLat([data.lngLat.lng, data.lngLat.lat]).addTo(map);
        console.log(btn_title);
        btn_title = "B";
        data = {};
    }else if (btn_title==='B'){
        console.log(data);
        console.log(data.lngLat);
        toMarker.setLngLat([data.lngLat.lng, data.lngLat.lat]).addTo(map);
        console.log(btn_title);
        btn_title = "B";
        data = {};
    }
    
});


// Marker events

let ajax = new XMLHttpRequest();

let url = "";



fromMarker.on('dragend', ()=>{
    ajax.open("POST", url);
    ajax.send();
});

toMarker.on('dragend', ()=>{
    ajax.open("POST", url);
    ajax.setRequestHeader('X-CSRFToken', token);

    ajax.onreadystatechange = ()=>{
      console.log(ajax.response);
    };
    ajax.send();
});

toMarker.on('dragend', ()=>{
    console.log("To marker Drag ended ...");
});
