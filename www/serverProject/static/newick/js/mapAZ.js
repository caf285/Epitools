//----- Global Variables
var level = "state"
var label = "all"
var layers = {}
var icons = {}
var map

//----- MAP
// mouse hover event
var popup = document.createElement("div")
popup.style.cssText = "position: fixed; z-index: 100; left: 100px; top: 100px;"
window.addEventListener('DOMContentLoaded', function() {
  document.body.appendChild(popup)
}, false);

window.addEventListener('mousemove', function(e) {
  popup.style.left = String(parseInt(e.clientX + 10)) + "px"
  popup.style.top = String(parseInt(e.clientY - popup.offsetHeight/2)) + "px"
});

// map initialization
window.addEventListener("map:init", function (e) {

  map = e.detail.map;
  map.scrollWheelZoom.disable()

  //----- base layers
  var baseLayers = {
    "Grey": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { 'attribution': 'Esri &mdash; Esri, DeLorme, NAVTEQ', 'maxZoom': 16 }),
    "Dark Grey": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { 'attribution': 'Esri &mdash; Esri, DeLorme, NAVTEQ', 'maxZoom': 16 }),
  };
  L.control.layers(baseLayers, null).addTo(map);
  map.addLayer(baseLayers["Grey"])

  //----- map layer groups
  layers["state::all"] = {}
  for (var i in DB.map["state::all"]) {
    let region = DB.map["state::all"][i]
    layers["state::all"][region] = new L.FeatureGroup();
    layers["region::" + region] = {}
    for (var j in DB.map["region::" + region]) {
      let county = DB.map["region::" + region][j]

      // define county polygon
      let countyPolygon = L.polygon(countyPolygons[county], {
        title: county,
        clickable: true,
        color: fillColors("region")[i],
        opacity: 0.7,
        weight: 1,
        fillOpacity: 0.7
      });
      countyPolygon.on("click", function (e) {
        cleanMap();
        switch(level) {
          case "state":
            level = "region"
            label = region
            break;
          case "region":
            level = "county"
            label = county
            break;
        }
        fillMap()
      });
      countyPolygon.on("mouseout", function () {
        popup.innerHTML = ""
      });
      countyPolygon.on("mouseover", function () {
        popup.innerHTML = county
      });

      // add county poly to STATE, REGION, COUNTY(shadow)
      layers["state::all"][region].addLayer(countyPolygon)
      layers["region::" + region][county] = countyPolygon
      layers["county::" + county] = {}

      for (var k in DB.map["county::" + county]) {
        let pca = DB.map["county::" + county].sort().reverse()[k]
        let pcaPolygon = new L.FeatureGroup();

        // define pca polygon
        if (pca == "Navajo Nation") {
          var polygonFill1 = L.polygon(pcaPolygons[pca]["Fill1"], {
            title: pca,
            clickable: true,
            color: fillColors("county")[k % fillColors("county").length],
            opacity: 0.7,
            weight: 0,
            fillOpacity: 0.7,
            smoothFactor: 0.8
          });
          var polygonLine1 = L.polygon(pcaPolygons[pca]["Line1"], {
            title: pca,
            clickable: true,
            color: fillColors("county")[k % fillColors("county").length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.0,
            smoothFactor: 0.8
          });
          var polygonLine2 = L.polygon(pcaPolygons[pca]["Line2"], {
            title: pca,
            clickable: true,
            color: fillColors("county")[k % fillColors("county").length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.0,
            smoothFactor: 0.8
          });
          var polygonLine3 = L.polygon(pcaPolygons[pca]["Line3"], {
            title: pca,
            clickable: true,
            color: fillColors("county")[k % fillColors("county").length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.0,
            smoothFactor: 0.8
          });
          pcaPolygon.addLayer(polygonFill1);
          pcaPolygon.addLayer(polygonLine1);
          pcaPolygon.addLayer(polygonLine2);
          pcaPolygon.addLayer(polygonLine3);
        } else if (pca == "Hopi Tribe") {
          var polygonFill1 = L.polygon(pcaPolygons[pca]["Fill1"], {
            title: pca,
            clickable: true,
            color: fillColors("county")[k % fillColors("county").length],
            opacity: 0.7,
            weight: 0,
            fillOpacity: 0.7,
            smoothFactor: 0.8
          });
          var polygonFill2 = L.polygon(pcaPolygons[pca]["Fill2"], {
            title: pca,
            clickable: true,
            color: fillColors("county")[k % fillColors("county").length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.7,
            smoothFactor: 0.8
          });
          var polygonLine1 = L.polygon(pcaPolygons[pca]["Line1"], {
            title: pca,
            clickable: true,
            color: fillColors("county")[k % fillColors("county").length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.0,
            smoothFactor: 0.8
          });
          var polygonLine2 = L.polygon(pcaPolygons[pca]["Line2"], {
            title: pca,
            clickable: true,
            color: fillColors("county")[k % fillColors("county").length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.0,
            smoothFactor: 0.8
          });
          pcaPolygon.addLayer(polygonFill1);
          pcaPolygon.addLayer(polygonFill2);
          pcaPolygon.addLayer(polygonLine1);
          pcaPolygon.addLayer(polygonLine2);
        } else {
          pcaPolygon.addLayer(L.polygon(pcaPolygons[pca], {
            title: pca,
            clickable: true,
            color: fillColors("county")[k % fillColors("county").length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.7
          }))
        }
        pcaPolygon.on("click", function (e) {
          cleanMap();
          switch(level) {
            case "county":
              level = "pca"
              label = pca
              break;
            case "pca":
              level = "state"
              label = "all"
              break;
          }
          fillMap()
        });
        pcaPolygon.on("mouseout", function (){
          popup.innerHTML = "";
        });
        pcaPolygon.on("mouseover", function (){
          popup.innerHTML = getPCA(pca);
        });
        // add pca poly to COUNTY, PCA
        layers["county::" + county][pca] = pcaPolygon
        layers["pca::" + pca] = {}
        layers["pca::" + pca][pca] = pcaPolygon
      }
    }
  }

  //----- map icon groups
  for (var i = 0; i < Object.keys(DB.coordinates).length; i++) {
    let iconName = Object.keys(DB.coordinates)[i]
    if (DB.coordinates[iconName] != "_") {
      var icon = L.divIcon({ className: iconName.split("::")[0], iconAnchor: 100, iconSize: 200, html: iconName.split("::")[1]});
      icon = L.marker(JSON.parse(DB.coordinates[iconName]), { icon: icon, interactive: false });
      icons[iconName] = icon
    }
  }
  fillMap();

  // remove all unused map polygons and icons
  function cleanMap() {
    popup.innerHTML = "";
    for (var i in layers[level + "::" + label]) {
      map.removeLayer(layers[level + "::" + label][i])
    }
  }

  // show all map polygons and icons at current level and label
  // levels are from PCA to STATE level, and label is the current selection ie. "County, Coconino", "PCA, Page"
  function fillMap() {
    for (var i in mapFunctions) {
      mapFunctions[i]()
    }
    for (var i in layers[level + "::" + label]) {
      map.addLayer(layers[level + "::" + label][i])
    }
    if (level == "state") {
      map.setView(JSON.parse(DB.coordinates[level + "::" + label]), 6)
    } else if (level == "region" || level == "county") {
      map.setView(JSON.parse(DB.coordinates[level + "::" + label]), 7)
    } else {
      map.setView(JSON.parse(DB.coordinates[level + "::" + label]), 8)
    }
  }


  function getPCA(pca) {
    out = []
    out.push([DB.pca[pca]['number'], pca])
    out.push(DB.pca[pca]['score'])
    out.push(DB.pca[pca]['rural'])
    out.push(DB.pca[pca]['tax'])
    out.push(DB.pca[pca]['azmua'])
    out.push(DB.pca[pca]['pchpsa'])
    out.push(DB.pca[pca]['fedmuap'])
    out.push(DB.pca[pca]['mpc1'])
    out.push(DB.pca[pca]['mpc2'])
    out.push(DB.pca[pca]['mpc3'])
    out.push(DB.pca[pca]['travel2'])
    out.push(DB.pca[pca]['travel2'])
    return out.join("</br>")
  }

  // fill color list for coloring polygons
  function fillColors(color) {
    let colorList = [];
    if (color == "region") {
      for (var i = 0; i < Object.keys(colorPalette).length; i++) {
        colorList.push(colorPalette[Object.keys(colorPalette).sort()[i]][2]);
      }
      return colorList;
    } else if (color == "county") {
      for (var i = 0; i < Object.keys(colorPalette).length; i++) {
        for (var j = 1; j < 4; j++) {
          colorList.push(colorPalette[Object.keys(colorPalette).sort()[i]][j]);
        }
      }
      return colorList;
    }
  }
}, false);
