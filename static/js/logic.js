var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function(data) {
    createFeatures(data.features);
});

function getColor(d) {

    return d < 1 ? 'rgb(255,255,178)' : 
           d < 2 ? 'rgb(254,204,92)' :
           d < 3 ? 'rgb(253,141,60)' :
           d < 4 ? 'rgb(240,59,32)' :
                   'rgb(189,0,38)';
}

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3 align='center'>" + feature.properties.place +
            "</h3><hr><p><u>Occurrence:</u> " + new Date(feature.properties.time) + "</p>" +
            "</h3><p><u>Magnitude:</u> " + feature.properties.mag + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            var geojsonMarkerOptions = {
            radius: 4*feature.properties.mag,
            fillColor: getColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });
    
    createMap(earthquakes);
}

function createMap(earthquakes) {

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: "pk.eyJ1Ijoia2FyZW5lbWNnZWUiLCJhIjoiY2sweDMzcnFmMDJmZTNjb2M2bTA0bDBsYiJ9.2VPrGXusLoJpCMfTWrgBRQ"
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: "pk.eyJ1Ijoia2FyZW5lbWNnZWUiLCJhIjoiY2sweDMzcnFmMDJmZTNjb2M2bTA0bDBsYiJ9.2VPrGXusLoJpCMfTWrgBRQ"
    });
 
    var baseMaps = {
        "Outdoors": outdoors,
        "Light Map": lightmap 
    };
    
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    var map = L.map("map", {
        center: [39.83, -98.58],
        zoom: 4.5,
        layers: [outdoors, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {collapsed: false})
             .addTo(map);

    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (map) {    
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4],
        labels = [];
  
        div.innerHTML+='Magnitude<br><hr>'
    
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    
    return div;
    };
    
    legend.addTo(map);
}