// Creating map object
var myMap = L.map("map", {
  center: [37.8,-96],
  zoom: 2.5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

// Link to GeoJSON
var GetDataLink = "http://127.0.0.1:5000/getdata.geojson";
var geojson;

// Grab data with d3
 d3.json(GetDataLink, function(data) {
   console.log(data)

  // // control that shows country info on hover
   var info = L.control();

   info.onAdd = function(myMap) {
     this._div = L.DomUtil.create("div", "info");
     this.update();
     return this._div;
   };

   info.update = function(props) {
     this._div.innerHTML =
       "<h4>World Happiness Index</h4>" +
       (props
         ? "<b>" +
           props.Entity +
           "</b><br />" +
           props.WHR +
           "index"
           : "Hover over a country");
   };
 
   info.addTo(myMap);

  // // get color depending on world happiness report value
   function getColor(d) {
     return d > 5
       ? "#800026"
       : d > 4
         ? "#BD0026"
         : d > 3
           ? "#E31A1C"
           : d > 2
             ? "#FC4E2A"
               : d > 1 ? "#FEB24C" : d > 0 ? "#FED976" : "#FFEDA0";
   }

   function style(feature) {
     return {
       weight: 2,
       opacity: 1,
       color: "white",
       dashArray: "3",
       fillOpacity: 0.7,
       fillColor: getColor(feature.properties.WHR)
     };
   }

   function highlightFeature(e) {
     var layer = e.target;

     layer.setStyle({
       weight: 5,
       color: "#666",
       dashArray: "",
       fillOpacity: 0.7
     });

     if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
       layer.bringToFront();
     }

     info.update(layer.feature.properties);
   }

   var geojson;

   function resetHighlight(e) {
     geojson.resetStyle(e.target);
     info.update();
   }

   function zoomToFeature(e) {
     map.fitBounds(e.target.getBounds());
   }

   function onEachFeature(feature, layer) {
     layer.on({
       mouseover: highlightFeature,
       //mouseover: function(){
       //}
       mouseout: resetHighlight,
       click: zoomToFeature
     });
   }
  
   geojson = L.geoJSON(data, {
     style: style,
     onEachFeature: onEachFeature
   }).addTo(myMap);

  // // // Binding a pop-up to each layer
  //  L.geoJson(data, {
  //   pointToLayer: function(feature, latlng) {
  //    return L.circleMarker(latlng);
  //  },
  //  style: styleInfo,
  //  onEachFeature: function(feature, layer) {
  //    layer.bindPopup(feature.properties.Entity + ", " + "<br>World Happiness Index<br>" + feature.properties.WHR);
  //       }
  //     }).addTo(myMap),

  // Set up the legend - here is for project 2
 var legend = L.control({ position: "bottomright" });

 legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [],
      from,
      to;
 
    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];
      labels.push(
        '<i style="background:' +
          getColor(from + 1) +
          '"></i> ' +
          from +
          (to ? "&ndash;" + to : "+")
      );
    }
 
    div.innerHTML = labels.join("<br>");
    return div;
  };
 
  legend.addTo(myMap);

// var legend = L.control({ position: "bottomright" });

// legend.onAdd = function(myMap) {
//   var div = L.DomUtil.create("div", "info legend"),
//     grades = [0, 1, 2, 3, 4, 5],
//     labels = [],
//     from,
//     to;

//   for (var i = 0; i < grades.length; i++) {
//     from = grades[i];
//     to = grades[i + 1];

//     labels.push(
//       '<i style="background:' +
//         getColor(from + 1) +
//         '"></i> ' +
//         from +
//         (to ? "&ndash;" + to : "+")
//     );
//   }

//   div.innerHTML = labels.join("<br>");
//   return div;
// };

// legend.addTo(myMap);

});
