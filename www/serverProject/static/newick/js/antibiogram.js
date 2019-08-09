var bacteriaDrug
var np
var yearScale

window.addEventListener('DOMContentLoaded', function() {
  mapFunctions.push(function() {
    updateMap()
    updateAntibiogram()
    updatePlotly()
  })
}, false);

//TODO pull all icon code to own script
// change map icon and graph information
function updateMap() {
  bacteriaDrug = document.getElementById('bacteriaDrug').innerHTML
  np = document.getElementById('n%').innerHTML
  yearScale = document.getElementById('yearScale').innerHTML
  // update icon text
  for (var i in levels) {
    for (var j in DB.amr[levels[i]]) {
      value = avgPCA(DB.amr[levels[i]][j][bacteriaDrug][yearScale])
      icons[levels[i] + "::" + j].options.icon.options.html = j + "</br>" + avgPCA(DB.amr[levels[i]][j][bacteriaDrug][yearScale])
    }
  }

  // refresh icons
  for (var index in icons) {
    map.removeLayer(icons[index])
  }
  if (level == "state") {
    for (var i in DB.map["state::all"]) {
      if (DB.map["state::all"][i] in DB.amr["region"] && bacteriaDrug in DB.amr["region"][DB.map["state::all"][i]] && yearScale in DB.amr["region"][DB.map["state::all"][i]][bacteriaDrug]){
        layers["state::all"][DB.map["state::all"][i]].setStyle(getColor("region", DB.map["state::all"][i]))
      } else {
        layers["state::all"][DB.map["state::all"][i]].setStyle({ color: "hsl(0, 0%, 10%)", fillColor: "hsl(0, 0%, 20%)"})
      }
      map.addLayer(icons["region::" + DB.map["state::all"][i]])
    }   
  } else if (level == "region") {
    for (var i in DB.map["region::" + label]) {
      if (DB.map["region::" + label][i] in DB.amr["county"] && bacteriaDrug in DB.amr["county"][DB.map["region::" + label][i]] && yearScale in DB.amr["county"][DB.map["region::" + label][i]][bacteriaDrug]) {
        layers["region::" + label][DB.map["region::" + label][i]].setStyle(getColor("county", DB.map["region::" + label][i]))
      } else {
        layers["region::" + label][DB.map["region::" + label][i]].setStyle({ color: "hsl(0, 0%, 10%)", fillColor: "hsl(0, 0%, 20%)"})
      }
      map.addLayer(icons["county::" + DB.map["region::" + label][i]])
    }   
  } else if (level == "county") {
    for (var i in DB.map["county::" + label]) {
      if (DB.map["county::" + label][i] in DB.amr["pca"] && bacteriaDrug in DB.amr["pca"][DB.map["county::" + label][i]] && yearScale in DB.amr["pca"][DB.map["county::" + label][i]][bacteriaDrug]) {
        layers["county::" + label][DB.map["county::" + label][i]].setStyle(getColor("pca", DB.map["county::" + label][i]))
      } else {
        layers["county::" + label][DB.map["county::" + label][i]].setStyle({ color: "hsl(0, 0%, 10%)", fillColor: "hsl(0, 0%, 20%)"})
      }
      map.addLayer(icons["pca::" + DB.map["county::" + label][i]])
    }   
  } else {
    if (label in DB.amr["pca"] && bacteriaDrug in DB.amr["pca"][label] && yearScale in DB.amr["pca"][label][bacteriaDrug]) {
      layers["pca::" + label][label].setStyle(getColor("pca", label))
    } else {
      layers["pca::" + label][label].setStyle({ color: "hsl(0, 0%, 10%)", fillColor: "hsl(0, 0%, 20%)"})
    }
    map.addLayer(icons[level + "::" + label])
  }
}

function updateAntibiogram() {
  console.log("antibiogram")
}

function updatePlotly() {
  console.log("plotly")
}


function getColor(level, label) {
  var value = avgPCA(DB.amr[level][label][bacteriaDrug][yearScale])
  var hue
  if (np == "n") {
    hue = 100 - Math.min(value/4, 90)
  } else {
    hue = 100 - Math.min(value*2, 90)
  }
  var saturation = 25 + Math.min(value, 25)
    return { fillColor: "hsl("+ hue +", "+ saturation +"%, 50%)", color: "hsl("+ hue +", "+ saturation +"%, 30%)"}
}

// return comparison symbol between values
// used for comparison of previous AMR year
function getPlus(x, y) {
  var xN = 0
  var yN = 0
  if (np == "n") {
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
  var np = document.getElementById('n%').innerHTML
  var out = 0
  if (np == "n") {
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
