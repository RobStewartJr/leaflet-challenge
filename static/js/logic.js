// API key
const API_KEY = "pk.eyJ1Ijoicm9ic3Rld2FydCIsImEiOiJjazZkNmJrbTIwMDZpM21wZm53amgzZnd5In0.jLY9SUJ2xmKVrPMEmN0Oog";

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


function getColor(d) { 
  if (d >= 5) { return "#FF0000" } else
  if (d >= 4) { return "#FF6900" } else
  if (d >= 3) { return "#FFC100" } else
  if (d >= 2) { return "#E5FF00" } else
  if (d >= 1) { return "#8DFF00" } else
  if (d >= 0) { return "#00FF00" };
};


var map = L.map("map", {
    center: [
      39.5, -98.35
    ],
    zoom: 3,
    layers: [satMap, earthquakes]
});

// add tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 12,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

d3.json(queryUrl).then((data) => {
  
    console.log(data);
    for (var i = 0; i < data.features.length; i++) {
      var places= data.features[i].geometry;
     geojson= L.circle([places.coordinates[1],places.coordinates[0]], {
        fillOpacity: 0.9,
        weight:0.6,
        color: "black",
        fillColor: chooseColor(data.features[i].properties.mag),
        radius: markerSize(data.features[i].properties.mag)
      }).bindPopup("<h3>" + data.features[i].properties.place + " Mag: "+ data.features[i].properties.mag +
      "</h3><hr><p>" + new Date(data.features[i].properties.time) + "</p>").addTo(myMap)

// Legend

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];

  // loop through intervals
  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i]) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  return div;
};

legend.addTo(map);

