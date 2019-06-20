// Creating map object
var myMap = L.map("map", {
  center: [40.7128, -74.0059],
  zoom: 2.5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

//  $.ajax({
//    type: "POST",
//    url: 'http://127.0.0.1:5000/getdata.geojson',
//    dataType: 'json',
//    success: function (response) {
//        geojsonLayer = L.geoJson(response).addTo(myMap);
//        map.fitBounds(geojsonLayer.getBounds());
//        $("#info").fadeOut(500);
//    }
//  });

// Link to GeoJSON
var GetDataLink = "http://127.0.0.1:5000/getdata.geojson";
var geojson;


// Grab data with d3
d3.json(GetDataLink, function(data) {

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use - go back to check in the url
    valueProperty: "WHR",

    // Set color scale
    scale: ["#ffffb2", "#b10026"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.Entity + ", " + "<br>World Happiness Index:<br>"
         + feature.properties.WHR);
    }
  }).addTo(myMap);

  // Set up the legend - here is for our homework
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max - formatting legent here for homework needs to be changed - we can do anyway we want it
    var legendInfo = "<h1>World Happiness Index</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});
