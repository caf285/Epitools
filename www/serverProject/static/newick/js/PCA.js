//----- MAP
// mouse hover event
window.addEventListener('mousemove', function(e) {
  document.getElementById("popupHover").style.left = String(parseInt(e.clientX + 10)) + "px"
  document.getElementById("popupHover").style.top = String(parseInt(e.clientY - document.getElementById("popupHover").offsetHeight/2)) + "px"
});

// map initialization
window.addEventListener("map:init", function (e) {
  var detail = e.detail;
  detail.map.scrollWheelZoom.disable()

  //----- base layers
  var baseLayers = {
    "Grey": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { 'attribution': 'Esri &mdash; Esri, DeLorme, NAVTEQ', 'maxZoom': 16 }),
    "Dark Grey": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { 'attribution': 'Esri &mdash; Esri, DeLorme, NAVTEQ', 'maxZoom': 16 }),
  };
  L.control.layers(baseLayers, null).addTo(detail.map);
  detail.map.addLayer(baseLayers["Grey"])

  //----- map layer groups
  var mapLevel = { "state": L.layerGroup(), "region": L.layerGroup(), "county": L.layerGroup(), "pca": L.layerGroup() }
  var regionLayers = {};
  var countyLayers = {};
  var pcaLayers = {};

  // for each region
  for (var i = 0; i < Object.keys(DB.tree).length; i++) {
    let regionName = Object.keys(DB.tree)[i]
    regionLayers[regionName] = {}

    // for each county
    for (var j = 0; j < Object.keys(DB.tree[regionName]).length; j++) {
      let countyName = Object.keys(DB.tree[regionName])[j]
      regionLayers[regionName][countyName] = L.polygon(countyPolygons[countyName], {
        title: countyName,
        clickable: true,
        color: fillColors("region")[i],
        opacity: 0.7,
        weight: 1,
        fillOpacity: 0.7
      });
      regionLayers[regionName][countyName].on("click", function (e) {
        if (detail.map.hasLayer(mapLevel["state"])) {
          fillMap("region", regionName)
        } else {
          fillMap("county", regionName + "::" + e.target.options.title)
        }
      });
      regionLayers[regionName][countyName].on("mouseout", function (){
        document.getElementById("popupHover").innerHTML = "";
      });
      regionLayers[regionName][countyName].on("mouseover", function (){
        if (detail.map.hasLayer(mapLevel["state"])) {
          document.getElementById("popupHover").innerHTML = regionName;
        } else {
          document.getElementById("popupHover").innerHTML = countyName;
        }
      });

      countyLayers[countyName] = {}
      countyLayers[countyName]['background'] = L.polygon(countyPolygons[countyName], {
        title: countyName,
        clickable: false,
        color: 'hsl(50, 100%, 0%)',
        opacity: 0,
        weight: 0,
        fillOpacity: 0.1
      });

      // for each pca
      for (var k = 0; k < Object.keys(DB.tree[regionName][countyName]).length; k++) {
        let pcaName = Object.keys(DB.tree[regionName][countyName]).sort().reverse()[k]
        let pcaColors = fillColors("county")
        // build Navajo Nation polygon group
        if (pcaName == "Navajo Nation") {
          var polygonFill1 = L.polygon(pcaPolygons[pcaName]["Fill1"], {
            title: pcaName,
            clickable: true,
            color: pcaColors[k % pcaColors.length],
            opacity: 0.7,
            weight: 0,
            fillOpacity: 0.7,
            smoothFactor: 0.8
          });
          var polygonLine1 = L.polygon(pcaPolygons[pcaName]["Line1"], {
            title: pcaName,
            clickable: true,
            color: pcaColors[k % pcaColors.length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.0,
            smoothFactor: 0.8
          });
          var polygonLine2 = L.polygon(pcaPolygons[pcaName]["Line2"], {
            title: pcaName,
            clickable: true,
            color: pcaColors[k % pcaColors.length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.0,
            smoothFactor: 0.8
          });
          var polygonLine3 = L.polygon(pcaPolygons[pcaName]["Line3"], {
            title: pcaName,
            clickable: true,
            color: pcaColors[k % pcaColors.length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.0,
            smoothFactor: 0.8
          });
          pcaLayers[pcaName] = new L.FeatureGroup();
          pcaLayers[pcaName].addLayer(polygonFill1);
          pcaLayers[pcaName].addLayer(polygonLine1);
          pcaLayers[pcaName].addLayer(polygonLine2);
          pcaLayers[pcaName].addLayer(polygonLine3);
          pcaLayers[pcaName].on("click", function (e) {
            if (detail.map.hasLayer(mapLevel["county"])) {
              fillMap("pca", pcaName)
            } else {
              fillMap("state", "all")
            }
          });
          pcaLayers[pcaName].on("mouseout", function (){
            document.getElementById("popupHover").innerHTML = "";
          });
          pcaLayers[pcaName].on("mouseover", function (){
            document.getElementById("popupHover").innerHTML = getPCA(pcaName);
          });
          countyLayers[countyName][pcaName] = pcaLayers[pcaName]

        // build Hopi Tribe polygon group
        } else if (pcaName == "Hopi Tribe") {
          var polygonFill1 = L.polygon(pcaPolygons[pcaName]["Fill1"], {
            title: pcaName,
            clickable: true,
            color: pcaColors[k % pcaColors.length],
            opacity: 0.7,
            weight: 0,
            fillOpacity: 0.7,
            smoothFactor: 0.8
          });
          var polygonFill2 = L.polygon(pcaPolygons[pcaName]["Fill2"], {
            title: pcaName,
            clickable: true,
            color: pcaColors[k % pcaColors.length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.7,
            smoothFactor: 0.8
          });
          var polygonLine1 = L.polygon(pcaPolygons[pcaName]["Line1"], {
            title: pcaName,
            clickable: true,
            color: pcaColors[k % pcaColors.length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.0,
            smoothFactor: 0.8
          });
          var polygonLine2 = L.polygon(pcaPolygons[pcaName]["Line2"], {
            title: pcaName,
            clickable: true,
            color: pcaColors[k % pcaColors.length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.0,
            smoothFactor: 0.8
          });
          pcaLayers[pcaName] = new L.FeatureGroup();
          pcaLayers[pcaName].addLayer(polygonFill1);
          pcaLayers[pcaName].addLayer(polygonFill2);
          pcaLayers[pcaName].addLayer(polygonLine1);
          pcaLayers[pcaName].addLayer(polygonLine2);
          pcaLayers[pcaName].on("click", function (e) {
            if (detail.map.hasLayer(mapLevel["county"])) {
              fillMap("pca", pcaName)
            } else {
              fillMap("state", "all")
            }
          });
          pcaLayers[pcaName].on("mouseout", function (){
            document.getElementById("popupHover").innerHTML = "";
          });
          pcaLayers[pcaName].on("mouseover", function (){
            document.getElementById("popupHover").innerHTML = getPCA(pcaName);
          });
          countyLayers[countyName][pcaName] = pcaLayers[pcaName]

        // build all other single polygon layers
        } else {
          pcaLayers[pcaName] = L.polygon(pcaPolygons[pcaName], {
            title: pcaName,
            clickable: true,
            color: pcaColors[k % pcaColors.length],
            opacity: 0.7,
            weight: 1,
            fillOpacity: 0.7
          });
          pcaLayers[pcaName].on("click", function (e) {
            if (detail.map.hasLayer(mapLevel["county"])) {
              fillMap("pca", pcaName)
            } else {
              fillMap("state", "all")
            }
          });
          pcaLayers[pcaName].on("mouseout", function (){
            document.getElementById("popupHover").innerHTML = "";
          });
          pcaLayers[pcaName].on("mouseover", function (){
            document.getElementById("popupHover").innerHTML = getPCA(pcaName);
          });
          countyLayers[countyName][pcaName] = pcaLayers[pcaName]
        }
      }
    }
  }

  //----- map icon groups
  var mapIcons = {};
  for (var i = 0; i < Object.keys(DB.coordinates).length; i++) {
    let iconName = Object.keys(DB.coordinates)[i]
    if (DB.coordinates[iconName] != "_") {
      var icon = L.divIcon({ className: iconName.split("::")[0], iconAnchor: 100, iconSize: 200 });
      icon = L.marker(JSON.parse(DB.coordinates[iconName]), { icon: icon, interactive: false });
      mapIcons[iconName] = icon
    }
  }

  //----- fill AMR data in tree
  var bugDrug = {}
  var dates = []
  for (var i = 0; i < Object.keys(DB.amr.region).length; i++) {
    region = Object.keys(DB.amr.region)[i]
    for (var j = 0; j < Object.keys(DB.amr.region[region]).length; j++) {
      pathOWOgen = Object.keys(DB.amr.region[region])[j]
      bugDrug[pathOWOgen] = L.layerGroup()
      dates = dates.concat(Object.keys(DB.amr.region[region][pathOWOgen]))
    } 
  }
  dates = dates.filter((x,y) => dates.indexOf(x) == y).sort()
  var np = { 'n': L.layerGroup(), '%': L.layerGroup() }

  // setup year slider
  document.getElementById("yearScale").min = 0;
  document.getElementById("yearScale").max = dates.length - 1;
  document.getElementById("yearScale").value = 0;

  // fill map and set controls
  L.control.layers(bugDrug, null).addTo(detail.map);
  detail.map.addLayer(bugDrug[Object.keys(bugDrug)[0]]);
  L.control.layers(np, null).addTo(detail.map);
  detail.map.addLayer(np[Object.keys(np)[0]]);
  updateMap();
  fillMap("state", "all");

  // remove all unused map polygons and icons
  function clearMap() {
    document.getElementById("popupHover").innerHTML = "";
    for (var i = 0; i < Object.keys(mapLevel).length; i++) {
      detail.map.removeLayer(mapLevel[Object.keys(mapLevel)[i]]);
    }
    for (var regionName in DB.tree) {
      for (var countyName in DB.tree[regionName]) {
        detail.map.removeLayer(regionLayers[regionName][countyName]);
        detail.map.removeLayer(countyLayers[countyName]["background"]);
        for (var pcaName in DB.tree[regionName][countyName]) {
          detail.map.removeLayer(countyLayers[countyName][pcaName]);
          detail.map.removeLayer(pcaLayers[pcaName]);
          detail.map.removeLayer(mapIcons["pca::" + pcaName])
        }
        detail.map.removeLayer(mapIcons["county::" + countyName])
      }
      detail.map.removeLayer(mapIcons["region::" + regionName])
    }
  }

  // show all map polygons and icons at current level and label
  // levels are from PCA to STATE level, and label is the current selection ie. "County, Coconino", "PCA, Page"
  function fillMap(level, label) {
    clearMap();
    if (level == "state") {
      detail.map.addLayer(mapLevel["state"]);
      for (var regionName in DB.tree) {
        for (var countyName in DB.tree[regionName]) {
          detail.map.addLayer(regionLayers[regionName][countyName]);
        }
        detail.map.addLayer(mapIcons["region::" + regionName])
      }
      detail.map.setView(JSON.parse(DB.coordinates[level + "::" + label]), 7)
    } else if (level == "region") {
      detail.map.addLayer(mapLevel[level])
      for (var countyName in DB.tree[label]) {
        detail.map.addLayer(regionLayers[label][countyName]);
        detail.map.addLayer(mapIcons["county::" + countyName])
      }
      detail.map.setView(JSON.parse(DB.coordinates[level + "::" + label]), 7)
    } else if (level == "county") {
      let regionName = label.split("::")[0]
      let countyName = label.split("::")[1]
      detail.map.addLayer(mapLevel[level])
      detail.map.addLayer(countyLayers[countyName]["background"])
      for (var pcaName in DB.tree[regionName][countyName]) {
        detail.map.addLayer(pcaLayers[pcaName])
        detail.map.addLayer(mapIcons["pca::" + pcaName])
      }
      detail.map.setView(JSON.parse(DB.coordinates["county::" + countyName]), 8)
    } else if (level == "pca") {
      detail.map.addLayer(mapLevel[level])
      detail.map.addLayer(pcaLayers[label])
      detail.map.addLayer(mapIcons["pca::" + label])
      if (label == "Navajo Nation") {
        detail.map.setView(JSON.parse(DB.coordinates[level + "::" + label]), 8)
      } else {
        detail.map.setView(JSON.parse(DB.coordinates[level + "::" + label]), 9)
      }
    }
    updateMap();
  }

  // change map icon and graph information
  function updateMap() {
    dataArr = []
    for (var regionName in DB.tree) {
      if (detail.map.hasLayer(mapIcons["region::" + regionName])) {
        if (regionName in DB.amr['region']) {
          regionKey = getBugDrug(DB.amr['region'][regionName])
          //====================( UPDATE ALL REGION DATA )
          //----- This section updates all region data when region icons are active, and AMR data exists at the region level.
          //----- Update is triggered after interacting with map, date slider, or drop down menu.

          // update map
          let regionPlus = getPlus(DB.amr['region'][regionName][regionKey][dates[Math.max(document.getElementById("yearScale").value - 1, document.getElementById("yearScale").min)]], DB.amr['region'][regionName][regionKey][dates[document.getElementById("yearScale").value]])
          let regionValue = avgPCA(DB.amr['region'][regionName][regionKey][dates[document.getElementById("yearScale").value]])
          mapIcons["region::" + regionName].options.icon.options.html = regionName + "<br>" + regionPlus + regionValue
          let regionStroke = getColor(100 - Math.min(regionValue / 4, 90), 25 + Math.min(regionValue / 4 / 4, 25), 30)
          let regionFill = getColor(100 - Math.min(regionValue / 4, 90), 25 + Math.min(regionValue / 4 / 4, 25), 50)
          for (var countyName in DB.tree[regionName]) {
            regionLayers[regionName][countyName].setStyle({ color: regionStroke, fillColor: regionFill })
          }
          // update graph

        } else {
          for (var countyName in DB.tree[regionName]) {
            regionLayers[regionName][countyName].setStyle({ color: getColor(0, 0, 30), fillColor: getColor(0, 0, 50) })
          }
          mapIcons["region::" + regionName].options.icon.options.html = regionName + "<br>-"
        }
        detail.map.removeLayer(mapIcons["region::" + regionName])
        detail.map.addLayer(mapIcons["region::" + regionName])
      } else {
        for (var countyName in DB.tree[regionName]) {
          if (detail.map.hasLayer(mapIcons["county::" + countyName])) {
            if (countyName in DB.amr['county']) {
              countyKey = getBugDrug(DB.amr['county'][countyName])
              //====================( UPDATE ALL COUNTY DATA )
              //----- This section updates all county data when county icons are active, and AMR data exists at the county level.
              //----- Update is triggered after interacting with map, date slider, or drop down menu.

              // update map
              let countyPlus = getPlus(DB.amr['county'][countyName][countyKey][dates[Math.max(document.getElementById("yearScale").value - 1, document.getElementById("yearScale").min)]], DB.amr['county'][countyName][countyKey][dates[document.getElementById("yearScale").value]])
              let countyValue = avgPCA(DB.amr['county'][countyName][countyKey][dates[document.getElementById("yearScale").value]])
              mapIcons["county::" + countyName].options.icon.options.html = countyName + "<br>" + countyPlus + countyValue
              let countyStroke = getColor(100 - Math.min(countyValue / 2, 90), 25 + Math.min(countyValue / 4, 25), 30)
              let countyFill = getColor(100 - Math.min(countyValue / 2, 90), 25 + Math.min(countyValue / 4, 25), 50)
              for (var pcaName in DB.tree[regionName][countyName]) {
                regionLayers[regionName][countyName].setStyle({ color: countyStroke, fillColor: countyFill })
              }

              // update graph

            } else {
              for (var pcaName in DB.tree[regionName][countyName]) {
                regionLayers[regionName][countyName].setStyle({ color: getColor(0, 0, 30), fillColor: getColor(0, 0, 50) })
              }
              dataArr = []
              mapIcons["county::" + countyName].options.icon.options.html = countyName + "<br>-"
            }
            detail.map.removeLayer(mapIcons["county::" + countyName])
            detail.map.addLayer(mapIcons["county::" + countyName])
          } else {
            for (var pcaName in DB.tree[regionName][countyName]) {
              if (detail.map.hasLayer(mapIcons["pca::" + pcaName])) {
                if (pcaName in DB.amr['pca']) {
                  pcaKey = getBugDrug(DB.amr['pca'][pcaName])
                  //====================( UPDATE ALL PCA DATA )
                  //----- This section updates all pca data when pca icons are active, and AMR data exists at the pca level.
                  //----- Update is triggered after interacting with map, date slider, or drop down menu.

                  // update map

                  let pcaPlus = getPlus(DB.amr['pca'][pcaName][pcaKey][dates[Math.max(document.getElementById("yearScale").value - 1, document.getElementById("yearScale").min)]], DB.amr['pca'][pcaName][pcaKey][dates[document.getElementById("yearScale").value]])
                  let pcaValue = avgPCA(DB.amr['pca'][pcaName][pcaKey][dates[document.getElementById("yearScale").value]])
                  mapIcons["pca::" + pcaName].options.icon.options.html = pcaName + "<br>" + pcaPlus + pcaValue
                  let pcaStroke = getColor(100 - Math.min(pcaValue, 90), 25 + Math.min(pcaValue, 25), 30)
                  let pcaFill = getColor(100 - Math.min(pcaValue, 90), 25 + Math.min(pcaValue, 25), 50)

                  countyLayers[countyName][pcaName].setStyle({ color: pcaStroke, fillColor: pcaFill })
                  pcaLayers[pcaName].setStyle({ color: pcaStroke, fillColor: pcaFill })

                  // update graph

                } else {
                  countyLayers[countyName][pcaName].setStyle({ color: getColor(0, 0, 30), fillColor: getColor(0, 0, 50) })
                  pcaLayers[pcaName].setStyle({ color: getColor(0, 0, 30), fillColor: getColor(0, 0, 50) })
                  mapIcons["pca::" + pcaName].options.icon.options.html = pcaName + "<br>-"
                }
                detail.map.removeLayer(mapIcons["pca::" + pcaName])
                detail.map.addLayer(mapIcons["pca::" + pcaName])
              }
            }
          }
        }
      }
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

  // return active AMR data
  // used to return AMR data attributed to visible map icons
  function getBugDrug(obj) {
    for (key in obj) {
      if (detail.map.hasLayer(bugDrug[key])) {
        return key;
      }
    }
    return false;
  }

  function getColor(hue, saturation, light) {
    return "hsl(" + String(hue) + ", " + String(saturation) + "%, " + String(light) + "%)"
  }

  // return comparison symbol between values
  // used for comparison of previous AMR year
  function getPlus(x, y) {
    var xN = 0
    var yN = 0
    if (detail.map.hasLayer(np["n"])) {
      for (var i = 0; i < x.length; i++) {
        xN += x[i][0]
        yN += y[i][0]
      }
    } else {
      for (var i = 0; i < x.length; i++) {
        xN += x[i][1]
        yN += y[i][1]
      }
    }
    if (xN > yN) {
      return "<img style='width:20px;' src='"+downImage+"' alt='down'>"
    } else if (xN < yN) {
      return "<img style='width:20px;' src='"+upImage+"' %}' alt='up'>"
    } else {
      return ""
    }
  }

  function avgPCA(pcaList) {
    var out = 0
    if (detail.map.hasLayer(np["n"])) {
      for (var i = 0; i < pcaList.length; i++) {
        out += pcaList[i][0]
      }
      return String(out)
    } else {
      for (var i = 0; i < pcaList.length; i++) {
        out += pcaList[i][1]
      }
      return String(parseInt(out / pcaList.length))
    }
  }

  function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  // listener events for map interaction
  document.getElementById("yearScale").addEventListener('input', function (event) {
    updateMap()
  });
  detail.map.on('baselayerchange', function () {
    updateMap()
  })

}, false);
