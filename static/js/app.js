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
    //compact: true,
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

let marker = new mapboxgl.Marker()
  .setLngLat([6.15,1.25])
  .addTo(map);

let distance = 0;
let distance_arrondie = 0;
let prix = 0;



/******************************************************************************************************************** /

Custom IControls

 / *******************************************************************************************************************/

// Direction inputs controls.

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
    "<a class='button is-primary is-small' id='btn-from'>A</a>" +
    "</div>" +
    "<div class='control'>" +
    "<input id='depart' class='input is-small' type='text' placeholder='Départ'>" +
    "</div>" +
    "</div>"+

    "<div class='field has-addons' id='to_'>" +
    "<div class='control'>" +
    "<a class='button is-success is-small' id='btn-to'>B</a>" +
    "</div>" +
    "<div class='control'>" +
    "<input id='arrive' class='input is-small' type='text' placeholder='Arrivé'>" +
    "</div>" +
    "</div>";




// Routing result control


class RoutingResult{
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl route-ctrl';
        this._container.textContent = 'Hello, world';
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

map.addControl(new RoutingResult(), 'bottom-left');

let routeElement = document.querySelector(".route-ctrl");
routeElement.innerHTML = ""+
    "<div class='card'>" +
    "<header class='card-header'><p class='card-header-title'>Information concernant la livraison</p></header>" +
    "<div class='card-content'><div class='content'></div></div>"+
    "<footer class='card-footer'><a href='https://bulma.io'> " +
    "<p>Made with Bulma</p>" +
    "</a></footer>"+
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
    //element: to_el,
    draggable: true,
});



let fromCoordinates;
let toCoordinates;

// Ajax request object for the server communications...

let ajax = new XMLHttpRequest();

let url = "";




/********************************************************************************************************************* /

 Adding markers on the map when the user make a doubleclick event and getting the coordinates of the marker on the map.


/ *********************************************************************************************************************/

map.on('dblclick', (data)=>{
    if(btn_title==='A'){
        console.log(data);
        console.log(data.lngLat);
        fromMarker.setLngLat([data.lngLat.lng, data.lngLat.lat]).addTo(map);
        fromCoordinates = [data.lngLat.lng,data.lngLat.lat];

        // Fetch the input value
        let element = document.getElementById('depart');
        element.setAttribute('value', fromCoordinates);

        console.log(btn_title);
        btn_title = "B";

        if(toCoordinates){
            route();
        }

    }else if (btn_title==='B'){
        console.log(data);
        console.log(data.lngLat);
        toMarker.setLngLat([data.lngLat.lng, data.lngLat.lat]).addTo(map);
        toCoordinates = [data.lngLat.lng,data.lngLat.lat];
        console.log(btn_title);
        btn_title = "B";

        // Fetch the input value
        let element = document.getElementById('arrive');
        element.setAttribute('value', toCoordinates);
        console.log(fromCoordinates+","+toCoordinates);

        route();
    }
    
});



/********************************************************************************************************************* /

 Marker events

/ *********************************************************************************************************************/




fromMarker.on('dragend', (e)=>{
    fromCoordinates = [fromMarker.getLngLat().lng,fromMarker.getLngLat().lat];
    console.log(fromCoordinates);

    let element = document.getElementById('depart');
    element.setAttribute('value', fromCoordinates);

    if(toCoordinates){
        route();
    }

});


toMarker.on('dragend', ()=>{
    toCoordinates = [toMarker.getLngLat().lng,toMarker.getLngLat().lat];
    console.log(toCoordinates);

     let element = document.getElementById('arrive');
     element.setAttribute('value', toCoordinates);

     route();


});


function route() {
    ajax.open("POST", url);
    ajax.setRequestHeader('X-CSRFToken', token);

    ajax.responseType = 'json';

    ajax.onreadystatechange = ()=>{

        let reponse = ajax.response;

        if (reponse){
            console.log(reponse);



            // Add the layer to the map.

            if(map.getLayer('route')){
                console.log('The layer already exist');
                map.removeLayer('route');
                map.removeSource('route');

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
                                "coordinates": reponse['lnglat']
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
                    },
                 });

            }else{

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
                                "coordinates": reponse['lnglat']
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
                    },
                 });

            }

            distance = reponse['distance'];
            distance_arrondie = reponse['distance_arrondie'];
            prix = reponse['prix'];

            let content = document.querySelector(".content");
            content.innerHTML = "Distance: "+distance+" KM<br>"+
                "Distance Arrondie: "+distance_arrondie+" KM<br>" +
                "Prix de la livraison: "+prix+" FCFA<br><br>" +
                "<a href='/route/result/?" +
                "from="+reponse['from']+
                "&to="+reponse['to']+
                "&distance="+reponse['distance']
                +"' class='button is-small is-link is-right'> Submit</a>"

        }

    };


    // Bind data to the request
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("from="+fromCoordinates+"&to="+toCoordinates);
}



