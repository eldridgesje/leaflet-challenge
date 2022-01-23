// Initialize all of the LayerGroups we'll be using
var layers = {
    underTen: new L.LayerGroup(),
    tenToThirty: new L.LayerGroup(),
    thirtyToFifty: new L.LayerGroup(),
    fiftyToSeventy: new L.LayerGroup(),
    seventyToNinety: new L.LayerGroup(),
    ninetyPlus: new L.LayerGroup()
};


// Create the map with our layers
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2,
    layers: [
    layers.underTen,
    layers.tenToThirty,
    layers.thirtyToFifty,
    layers.fiftyToSeventy,
    layers.seventyToNinety,
    layers.ninetyPlus
    ]
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: API_KEY
}).addTo(myMap);


d3.json("./static/resources/PB2002_boundaries.json").then(function(data) {
    L.geoJSON(data.features,{
        style: function() {
            return {color: "brown"}
        }
    }).addTo(myMap);
});



var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

d3.json(url).then(function(response) {


    quakes = response["features"];


    var depthCategory;


    for (var i = 0; i < quakes.length; i++) {
        var location = quakes[i].geometry;
        var size = quakes[i].properties.mag;
        var place = quakes[i].properties.place;

        var newMarker

        if (location.coordinates[2] < 10) {
            depthCategory = "underTen";
            newMarker = L.circleMarker([location.coordinates[1], location.coordinates[0]], {
                radius: (size*2),
                fillOpacity: 1,
                color: "black",
                fillColor: "green",
                weight: 1
            })
        }

        else if (location.coordinates[2] < 30) {
            depthCategory = "tenToThirty";
            newMarker = L.circleMarker([location.coordinates[1], location.coordinates[0]], {
                radius: (size**2),
                fillOpacity: 1,
                color: "black",
                fillColor: "yellow",
                weight: 1
            })
        }

        else if (location.coordinates[2] < 50) {
            depthCategory = "thirtyToFifty";
            newMarker = L.circleMarker([location.coordinates[1], location.coordinates[0]], {
                radius: (size**2),
                fillOpacity: 1,
                color: "black",
                fillColor: "orange",
                weight: 1
            })
        }

        else if (location.coordinates[2] < 70) {
            depthCategory = "fiftyToSeventy";
            newMarker = L.circleMarker([location.coordinates[1], location.coordinates[0]], {
                radius: (size**2),
                fillOpacity: 1,
                color: "black",
                fillColor: "red",
                weight: 1
            })
        }

        else if (location.coordinates[2] < 90) {
            depthCategory = "seventyToNinety";
            newMarker = L.circleMarker([location.coordinates[1], location.coordinates[0]], {
                radius: (size**2),
                fillOpacity: 1,
                color: "black",
                fillColor: "brown",
                weight: 1
            })
        }

        else {
            depthCategory = "ninetyPlus";
            newMarker = L.circleMarker([location.coordinates[1], location.coordinates[0]], {
                radius: (size**2),
                fillOpacity: 1,
                color: "black",
                fillColor: "black",
                weight: 1
            })
        }

        // Add the new marker to the appropriate layer
        newMarker.addTo(layers[depthCategory]);

        // Bind a popup to the marker that will  display on click. This will be rendered as HTML
        newMarker.bindPopup(`Location: ${place}<br>Magnitude: ${size}<br>Depth: ${location.coordinates[2]}`);

    }

});

/*Legend specific*/
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(myMap) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Quake Depth</h4>";
  div.innerHTML += '<i style="background: green"></i><span>Less Than 10 Meters</span><br>';
  div.innerHTML += '<i style="background: yellow"></i><span>10 - 30 Meters</span><br>';
  div.innerHTML += '<i style="background: orange"></i><span>30 - 50 Meters</span><br>';
  div.innerHTML += '<i style="background: red"></i><span>50 - 70 Meters</span><br>';
  div.innerHTML += '<i style="background: brown"></i><span>70 - 90 Meters</span><br>';
  div.innerHTML += '<i style="background: black"></i><span>More Than 90 Meters</span><br>';
  
  

  return div;
};

legend.addTo(myMap);
