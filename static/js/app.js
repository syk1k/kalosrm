mapboxgl.accessToken = 'pk.eyJ1IjoiaGVybWFubmthc3MiLCJhIjoiMDQwM2RiZjA3OGE2NTU3YjE0NmIxYTE3NjkzMjI4MzYifQ.xZBFTfG8WU0pUfAvr6dH4A';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [1.1756604,6.177847],
    zoom: 13,
    attributionControl: false,
});


// Control implemented as ES6 class
class InfoControl {
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl info-ctrl';
        this._container.innerHTML = '<span class="info-ctrl-head">Information concernant la livraison</span>';
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

var control_ = new InfoControl();


var direction = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
});


map.addControl( direction , 'top-right');
map.addControl(control_, 'top-right');

direction.on('route', (e)=>{
    // e => {route:[]}
    console.log(e);
    var distance = e["route"][0]["distance"];
    distance = distance / 1000;
    var distance_arrondie = parseInt(distance);

    if (distance_arrondie>distance){
        distance_arrondie = distance_arrondie - 1;
    }

    var rest_distance = distance - distance_arrondie;

    if (rest_distance>0.5){
        distance_arrondie = distance_arrondie + 1 ;
    }
    

    var prix = 100 * distance_arrondie;
    console.log(distance);
    console.log(distance_arrondie);
    console.log(prix);

    var infoElement = document.querySelector('.info-ctrl');
    infoElement.innerHTML = infoElement.innerHTML + "<br><div class='info-ctrl-content'>"+
    "<p>Distance: "+distance+" KM</p>"+
    "<p>Distance Arrondie: "+distance_arrondie+" KM</p>"+
    "<p>Prix de la livraison: "+prix+" FCFA </p>"+
    "</div>";
});

map.on('load', ()=>{
    direction.setOrigin([1.15800,6.18671])
});

var language = new MapboxLanguage();
map.addControl(language, 'top-left');

map.addControl(new mapboxgl.AttributionControl({
    compact: true,
    customAttribution : '<a href="http://kalamar.tg">kalamar</a>'
}));