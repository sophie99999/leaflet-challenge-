function createMap(earthquakes) {
    var lightmap=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    //Create a baseMaps object to hold the lightmap layer
    var baseMaps= {
      "Light Map":lightmap
    };
  
    // Create an overlayMaps object to hold the earthquake layer
    var overlayMaps ={
      "Earthquakes":earthquakes
    };
  
  
    // Create the map objects 
    var map=L.map("map", {
      center:[40.7783, -111.4179],
      zoom:4,
      layers:[lightmap, earthquakes] 
    });
  
    // Create a layer control group, pass in the baseMaps and overlayMaps. Then add the layer control group to the map
    L.control.layers(baseMaps,overlayMaps, {
        collapsed: false
    }).addTo(map);

    var legend=L.control({position:"bottomright"});
    legend.onAdd=function() {
        var div=L.DomUtil.create("div","info legend");
        

        var legendInfo = "<h2>Magnitude</h2>" 
      +
        "<div class=\"labels\">" +
          "<div class=\"min\">0</div>" +
          "<div class=\"max\">7+</div>" +
        "</div>"
        ;

        div.innerHTML=legendInfo;

        div.innerHTML += "<ul>" + "<li style=\"background-color: " + "#66ff33" + "\"></li>" +
      "<li style=\"background-color: " + "#ccff66" + "\"></li>" +
      "<li style=\"background-color: " + "#ffff66" + "\"></li>" +
      "<li style=\"background-color: " + "#ffcc00" + "\"></li>" +
      "<li style=\"background-color: " + "#ff9933" + "\"></li>" +
      "<li style=\"background-color: " + "#ff6600" + "\"></li>" +
      "<li style=\"background-color: " + "#ff0000" + "\"></li>" +
      "<li style=\"background-color: " + "#800000" + "\"></li></ul>";
      return div;

    };

    legend.addTo(map);
    }
  
  
  // Create another function to add circle layer on the map
  // features is an array of js objects.
  function createMarkers(response) {
      var locations=response.features;
      var earthquake_markers=[];
      
      for (var i=0; i<locations.length; i++) {
          var location=locations[i];
          if (location.properties.mag < 1){
              var colorChoice = "#66ff33";
            }
              else if (location.properties.mag <2){
                var colorChoice = "#ccff66";
              }
              else if (location.properties.mag <3){
                var colorChoice = "#ffff66";
              }
              else if (location.properties.mag <4){
                var colorChoice = "#ffcc00";
              }
              else if (location.properties.mag <5){
                var colorChoice = "#ff9933";
              }
              else if (location.properties.mag <6){
                var colorChoice = "#ff6600";
              }
              else if (location.properties.mag <7){
                var colorChoice = "#ff0000";
              }
              else {
                var colorChoice = "#800000";
              }
          // For each location, create a circle as the marker
          var earthquake_marker=L.circle([location.geometry.coordinates[1],location.geometry.coordinates[0]],{
              color:colorChoice,
              fillColor:colorChoice,
              fillOpacity:0.75,
              radius:parseInt(location.properties.mag)*50000})
             .bindPopup("<h3>"+location.properties.place +"<h3><hr><h3>Time: "+location.properties.time +"<h3>");
            
         earthquake_markers.push(earthquake_marker);
         console.log(earthquake_markers)
             
      };

      // calling the function createMap() is outside the forloop
      createMap(L.layerGroup(earthquake_markers));  
  }
  
  
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",createMarkers);
  
  
  
  
  