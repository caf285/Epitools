var bacteriaDrug
var sr
var yearScale
var bugs = []
var drugs = []

window.addEventListener('DOMContentLoaded', function() {
  yearScale = document.getElementById('yearScale')
  yearScale.min = 0
  yearScale.max = Math.max(0, DB.amr.dates.length - 1)
  yearScale.addEventListener('input', function() {
    updateButtons()
    updateMap()
    updateAntibiogram()
  })
  yearScale.value = yearScale.min
  fillButtons()
  fillAntibiogram()
  mapFunctions.push(function() {
    updateAll()
  })
}, false);

function updateAll() {
  updateButtons()
  updateMap()
  updateAntibiogram()
  updatePlotly() 
}

function fillButtons() {
  // breakout bugs and drugs
  for (var i in DB.amr.bugDrugs) {
    if (bugs.indexOf(DB.amr.bugDrugs[i].split("::")[0]) == -1) {
      bugs.push(DB.amr.bugDrugs[i].split("::")[0])
    }
    if (drugs.indexOf(DB.amr.bugDrugs[i].split("::")[1]) == -1) {
      drugs.push(DB.amr.bugDrugs[i].split("::")[1])
    }
  }
  bugs = bugs.sort()
  drugs = drugs.sort()

  document.getElementById("bacteriaButton").innerHTML = bugs[0]
  for (var i in bugs) {
    document.getElementById("bacteriaDropdown").innerHTML += "<a class='dropdown-item' onclick='document.getElementById(\"bacteriaButton\").innerHTML = \"" + bugs[i] + "\"; updateButtons(); updateMap(); updatePlotly()'>" + bugs[i] + "</a>"
  }
  updateButtons()
}

function updateButtons() {
  sr = document.getElementById('sr').innerHTML
  document.getElementById('drugDropdown').innerHTML = ""
  for (var i in drugs) {
    if (!(DB.amr.bugDrugs.indexOf(document.getElementById('bacteriaButton').innerHTML + "::" + drugs[i]) == -1)) {
      document.getElementById('drugDropdown').innerHTML += "<a class='dropdown-item' onclick='document.getElementById(\"drugButton\").innerHTML = \"" + drugs[i] + "\"; updateMap(); updatePlotly()'>" + drugs[i] + "</a>"
    }
  }
  if (DB.amr.bugDrugs.indexOf(document.getElementById('bacteriaButton').innerHTML + "::" + document.getElementById('drugButton').innerHTML) == -1) {
    document.getElementById('drugButton').innerHTML = document.getElementById('drugDropdown').getElementsByTagName('a')[0].innerHTML
  }
  if (!(document.getElementById("mapColorButton").innerHTML == "Default")) {
    document.getElementById("mapColorButton").innerHTML = "By " + sr + " %</a>"
  }
  document.getElementById("mapColorDropdown").innerHTML = "<a class='dropdown-item' onclick='document.getElementById(\"mapColorButton\").innerHTML = \"Default\"; updateMap()'>Default</a><a class='dropdown-item' onclick='document.getElementById(\"mapColorButton\").innerHTML = \"By " + sr + " %\"; updateMap()'>By " + sr + " %</a>"
}

//TODO pull all icon code to own script
// change map icon and graph information
function updateMap() {
  sr = document.getElementById('sr').innerHTML
  bacteriaDrug = document.getElementById('bacteriaButton').innerHTML + "::" + document.getElementById('drugButton').innerHTML
  // update icon text
  for (var i in levels) {
    for (var j in DB.amr[levels[i]]) {
      value = avgPCA(DB.amr[levels[i]][j][bacteriaDrug][DB.amr.dates.sort()[yearScale.value]])
      icons[levels[i] + "::" + j].options.icon.options.html = j + avgPCA(DB.amr[levels[i]][j][bacteriaDrug][DB.amr.dates.sort()[yearScale.value]])
    }
  }

  // refresh icons
  for (var index in icons) {
    map.removeLayer(icons[index])
  }


  if (level == "state") {
    for (var i in DB.map["state::all"]) {
      if (document.getElementById("mapColorButton").innerHTML == "Default") {
        layers["state::all"][DB.map["state::all"][i]].setStyle({color: colorPalette[Object.keys(colorPalette)[i % Object.keys(colorPalette).length]][3], fillColor: colorPalette[Object.keys(colorPalette)[i % Object.keys(colorPalette).length]][2]})
      } else {
        if (DB.map["state::all"][i] in DB.amr["region"] && bacteriaDrug in DB.amr["region"][DB.map["state::all"][i]] && DB.amr.dates.sort()[yearScale.value] in DB.amr["region"][DB.map["state::all"][i]][bacteriaDrug]){
          layers["state::all"][DB.map["state::all"][i]].setStyle(getColor("region", DB.map["state::all"][i]))
        } else {
          layers["state::all"][DB.map["state::all"][i]].setStyle({ color: "hsl(0, 0%, 30%)", fillColor: "hsl(0, 0%, 50%)"})
        }
      }
      map.addLayer(icons["region::" + DB.map["state::all"][i]])
    }   
  } else if (level == "region") {
    for (var i in DB.map["region::" + label]) {
      if (document.getElementById("mapColorButton").innerHTML == "Default") {
        layers["region::" + label][DB.map["region::" + label][i]].setStyle({color: colorPalette[Object.keys(colorPalette)[i % Object.keys(colorPalette).length]][3], fillColor: colorPalette[Object.keys(colorPalette)[i % Object.keys(colorPalette).length]][2]})
      } else {
        if (DB.map["region::" + label][i] in DB.amr["county"] && bacteriaDrug in DB.amr["county"][DB.map["region::" + label][i]] && DB.amr.dates.sort()[yearScale.value] in DB.amr["county"][DB.map["region::" + label][i]][bacteriaDrug]) {
          layers["region::" + label][DB.map["region::" + label][i]].setStyle(getColor("county", DB.map["region::" + label][i]))
        } else {
          layers["region::" + label][DB.map["region::" + label][i]].setStyle({ color: "hsl(0, 0%, 30%)", fillColor: "hsl(0, 0%, 50%)"})
        }
      }
      map.addLayer(icons["county::" + DB.map["region::" + label][i]])
    }   
  } else if (level == "county") {
    for (var i in DB.map["county::" + label]) {
      if (document.getElementById("mapColorButton").innerHTML == "Default") {
        layers["county::" + label][DB.map["county::" + label][i]].setStyle({color: colorPalette[Object.keys(colorPalette)[i % Object.keys(colorPalette).length]][3], fillColor: colorPalette[Object.keys(colorPalette)[i % Object.keys(colorPalette).length]][2]})
      } else {
        if (DB.map["county::" + label][i] in DB.amr["pca"] && bacteriaDrug in DB.amr["pca"][DB.map["county::" + label][i]] && DB.amr.dates.sort()[yearScale.value] in DB.amr["pca"][DB.map["county::" + label][i]][bacteriaDrug]) {
          layers["county::" + label][DB.map["county::" + label][i]].setStyle(getColor("pca", DB.map["county::" + label][i]))
        } else {
          layers["county::" + label][DB.map["county::" + label][i]].setStyle({ color: "hsl(0, 0%, 30%)", fillColor: "hsl(0, 0%, 50%)"})
        }
      }
      map.addLayer(icons["pca::" + DB.map["county::" + label][i]])
    }   
  } else {
    if (document.getElementById("mapColorButton").innerHTML == "Default") {
      layers["pca::" + label][label].setStyle({color: colorPalette[Object.keys(colorPalette)[i % Object.keys(colorPalette).length]][3], fillColor: colorPalette[Object.keys(colorPalette)[i % Object.keys(colorPalette).length]][2]})
    } else {
      if (label in DB.amr["pca"] && bacteriaDrug in DB.amr["pca"][label] && DB.amr.dates.sort()[yearScale.value] in DB.amr["pca"][label][bacteriaDrug]) {
        layers["pca::" + label][label].setStyle(getColor("pca", label))
      } else {
        layers["pca::" + label][label].setStyle({ color: "hsl(0, 0%, 30%)", fillColor: "hsl(0, 0%, 50%)"})
      }
    }
    map.addLayer(icons[level + "::" + label])
  }
}


function fillAntibiogram() {
  var row = document.getElementById("bug")
  var col = document.getElementById("drug")

  // drug columns
  for (var i in drugs) {
    if (drugs.length <= 8) {
      col.innerHTML += "<td><div><b>" + drugs[i] + "</b></div></td>"
    } else {
      col.innerHTML += "<td class='rotate'><div><b>" + drugs[i] + "</b></div></td>"
    }
  }
  // bug rows + drug columns
  for (var i in bugs) {
    var newRow = "<tr><td><b>" + bugs[i] + "</b></td><td id='" + bugs[i] + "Strains'></td>"
    for (var j in drugs) {
      newRow += "<td id='" + bugs[i] + "::" + drugs[j] + "'></td>"
    }
    row.innerHTML += newRow + "</tr>"
  }
}

function updateAntibiogram() {
  // clear antibiogram
  for (var i in bugs) {
    document.getElementById(bugs[i] + "Strains").innerHTML = "-"
    for (var j in drugs) {
      document.getElementById(bugs[i] + "::" + drugs[j]).innerHTML = "-"
    }
  }
  var levelBugs = {}
  var levelDrugs = {}
  if (level == "state") {
    document.getElementById("antibiogramHeader").innerHTML = "Arizona State Antibiogram for " + fixDate(DB.amr.dates.sort()[yearScale.value])
  } else {
    document.getElementById("antibiogramHeader").innerHTML = proper(label + " " + level) + " Antibiogram for " + fixDate(DB.amr.dates.sort()[yearScale.value])
  }
  document.getElementById("antibiogramSubheader").innerHTML = "% " + sr + " for Isolates"
  if (level == "state") {
    for (var region in DB.amr.region) {
      for (var bugDrug in DB.amr.region[region]) {
        if (!(bugDrug in levelDrugs)) {
          levelDrugs[bugDrug] = []
        }
        if (!(bugDrug.split("::")[0] in levelBugs)) {
          levelBugs[bugDrug.split("::")[0]] = 0
        }
        for (var i in DB.amr.region[region][bugDrug][DB.amr.dates.sort()[yearScale.value]]) {
          levelBugs[bugDrug.split("::")[0]] += parseInt(DB.amr.region[region][bugDrug][DB.amr.dates.sort()[yearScale.value]][i][0])
          document.getElementById(bugDrug.split("::")[0] + "Strains").innerHTML = levelBugs[bugDrug.split("::")[0]]
          levelDrugs[bugDrug].push(parseInt(DB.amr.region[region][bugDrug][DB.amr.dates.sort()[yearScale.value]][i][1]))

          if (sr == "Susceptible") {
            document.getElementById(bugDrug).innerHTML = (levelDrugs[bugDrug].reduce((a, b) => a + b, 0) / levelDrugs[bugDrug].length).toFixed(2) + "%"
          } else {
            document.getElementById(bugDrug).innerHTML = (100 - (levelDrugs[bugDrug].reduce((a, b) => a + b, 0) / levelDrugs[bugDrug].length).toFixed(2)) + "%"
          }
        }
      }
    }
  } else {
    for (var bugDrug in DB.amr[level][label]) {
      if (!(bugDrug in levelDrugs)) {
        levelDrugs[bugDrug] = []
      }
      if (!(bugDrug.split("::")[0] in levelBugs)) {
        levelBugs[bugDrug.split("::")[0]] = 0
      }
      for (var i in DB.amr[level][label][bugDrug][DB.amr.dates.sort()[yearScale.value]]) {
        levelBugs[bugDrug.split("::")[0]] += parseInt(DB.amr[level][label][bugDrug][DB.amr.dates.sort()[yearScale.value]][i][0])
        document.getElementById(bugDrug.split("::")[0] + "Strains").innerHTML = levelBugs[bugDrug.split("::")[0]]
        levelDrugs[bugDrug].push(parseInt(DB.amr[level][label][bugDrug][DB.amr.dates.sort()[yearScale.value]][i][1]))
        if (sr == "Susceptible") {
          document.getElementById(bugDrug).innerHTML = (levelDrugs[bugDrug].reduce((a, b) => a + b, 0) / levelDrugs[bugDrug].length).toFixed(2) + "%"
        } else {
          document.getElementById(bugDrug).innerHTML = (100 - (levelDrugs[bugDrug].reduce((a, b) => a + b, 0) / levelDrugs[bugDrug].length).toFixed(2)) + "%"
        }
      }
    }
  }
}


function updatePlotly() {
  bacteriaDrug = document.getElementById('bacteriaButton').innerHTML + "::" + document.getElementById('drugButton').innerHTML
  var dataArr = []
  var pathogenGraph = {};
  var layout = {
    legend: {orientation: 'h'},
    title: {text: `${sr} Isolates ${level == 'state' ? 'in Arizona' : 'in ' + proper(label)} ${level == 'pca' ? level.toUpperCase() : proper(level)}`,x: 0.9},
    xaxis: {title: {text: "Time (months)"}},
    yaxis: {title: {text: `Average Num of ${sr} Isolates`}}
  }
  for (i in DB.map[level + "::" + label]) {
    pathogenGraph[DB.map[level + "::" + label][i]] = {'x': DB.amr.dates, 'y': [], 'name': DB.map[level + "::" + label][i], 'type': 'scatter'}
    for (var j in DB.amr.dates) {
      try {
        if (sr == "Susceptible") {
          pathogenGraph[DB.map[level + "::" + label][i]]['y'].push((DB.amr[nextLevel()][DB.map[level + "::" + label][i]][bacteriaDrug][DB.amr.dates[j]].map(x => x[1]).reduce((x, y) => x + y, 0) / DB.amr[nextLevel()][DB.map[level + "::" + label][i]][bacteriaDrug][DB.amr.dates[j]].length))
        } else {
          pathogenGraph[DB.map[level + "::" + label][i]]['y'].push(100 - (DB.amr[nextLevel()][DB.map[level + "::" + label][i]][bacteriaDrug][DB.amr.dates[j]].map(x => x[1]).reduce((x, y) => x + y, 0) / DB.amr[nextLevel()][DB.map[level + "::" + label][i]][bacteriaDrug][DB.amr.dates[j]].length))
        }
      } catch {
        pathogenGraph[DB.map[level + "::" + label][i]]['y'].push(0)
      }
    }
    dataArr.push(pathogenGraph[DB.map[level + "::" + label][i]])
  }
  if (level == 'pca') {
    pathogenGraph[level + "::" + label] = {'x': DB.amr.dates, 'y': [], 'name': level + "::" + label, 'type': 'scatter'}
    for (var j in DB.amr.dates) {
      try {
        if (sr == "Susceptible") {
          pathogenGraph[level + "::" + label]['y'].push((DB.amr[level][label][bacteriaDrug][DB.amr.dates[j]].map(x => x[1]).reduce((x, y) => x + y, 0) / DB.amr[level][label][bacteriaDrug][DB.amr.dates[j]].length))
        } else {
          pathogenGraph[level + "::" + label]['y'].push(100 - (DB.amr[level][label][bacteriaDrug][DB.amr.dates[j]].map(x => x[1]).reduce((x, y) => x + y, 0) / DB.amr[level][label][bacteriaDrug][DB.amr.dates[j]].length))
        }
      } catch {
        pathogenGraph[level + "::" + label]['y'].push(0)
      }
    }
    dataArr.push(pathogenGraph[level + "::" + label])
  }
  Plotly.react(document.getElementById("plot"), dataArr, layout)

/*  // Capitalize first letter of string, unless is PCA (all caps)

text.split(" ").map(x => x[0].toUpperCase() + x.slice(1).toLowerCase()).join(" ")
  const toCap = (s) => {
    if (typeof s !== 'string') return ''

    if (s === 'pca') return s.toUpperCase()

    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  // Remove duplicates
  const removeDuplicates = (myArr, property) => {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }



  var plotDiv = document.getElementById('plot'); // Get element where plot will be placed
  // Array of trace objects
  var dataArr = []
  // Trace template
  var pathogenGraph = {};

  var layout = {
    legend: {
      orientation: 'h'
    },
    title: {
      text: `Susceptability ${level != 'pca' ? 'by' : 'in'} ${toCap(determineLevel())}`,
      x: 0.9
    },
    xaxis: {
      title: {
        text: "Time (yrs)"
      }
    },
    yaxis: {
      title: {
        text: `Average Num of Susceptable Samples`
      }
    }
  }

  // Will render different data based on the level selected.
  switch (level) {

    // if current level is state
    // TODO write the logic for each selected level
    case 'state':

    var regions = DB.amr.region

      for (region in regions) {

        pathogenGraph[region] = {
          'x': [],
          'y': [],
          'name': region,
          'type': 'scatter'
        }

        for (var year = 0; year < DB.amr.dates.length; year++) {

          // Average value calculation
          var avg_n_val = 0
          var avg_perc_susc = 0

          for (var arrCluster = 0; arrCluster < regions[region][bacteriaDrug][DB.amr.dates[year]].length; arrCluster++) {
            avg_n_val += regions[region][bacteriaDrug][DB.amr.dates[year]][arrCluster][0]
            avg_perc_susc += regions[region][bacteriaDrug][DB.amr.dates[year]][arrCluster][1]
          }
          avg_n_val = avg_n_val / arrCluster;
          avg_perc_susc = avg_perc_susc / arrCluster;

          pathogenGraph[region]['x'].push(DB.amr.dates[year]);
          pathogenGraph[region]['y'].push(Math.floor(avg_n_val * (avg_perc_susc / 100) * 100) / 100) // do average calculation for n and % for given year
        }

        dataArr.push(pathogenGraph[region])
        
      }
      break;

    // if current level is region
    default:
        for (var item in DB.amr[level]) {

         pathogenGraph[item] = {
            'x': [],
            'y': [],
            'name': item,
            'type': 'scatter'
          } 
  
          for (var year = 0; year < DB.amr.dates.length; year++) {
  
            // Average value calculation
            var avg_n_val = 0
            var avg_perc_susc = 0
  
            for (var arrCluster = 0; arrCluster < DB.amr[level][item][bacteriaDrug][DB.amr.dates[year]].length; arrCluster++) {
              avg_n_val += DB.amr[level][item][bacteriaDrug][DB.amr.dates[year]][arrCluster][0]
              avg_perc_susc += DB.amr[level][item][bacteriaDrug][DB.amr.dates[year]][arrCluster][1]
            }
            avg_n_val = avg_n_val / arrCluster;
            avg_perc_susc = avg_perc_susc / arrCluster;
  
            pathogenGraph[item]['x'].push(DB.amr.dates[year]);
            pathogenGraph[item]['y'].push(Math.floor(avg_n_val * (avg_perc_susc / 100) * 100) / 100) // do average calculation for n and % for given year
          }
  
          dataArr.push(pathogenGraph[item])
          
        }
      break;
  }

  Plotly.react(plotDiv, dataArr, layout)

  console.log("label: " + label + '\n' + 'level: ' + level +
  `\nlabel type: ${typeof(label)} \nlevel type: ${typeof(level)}`)

  console.log(DB.amr)
*/
}

// ==================================================( HELPER FUNCTIONS )

function nextLevel() {
  if (level == "pca") {
    return level
  } else {
    return levels[((levels.indexOf(level) + 1) % levels.length)]
  }
}

function getColor(level, label) {
  var pcaList = DB.amr[level][label][bacteriaDrug][DB.amr.dates.sort()[yearScale.value]]
  var value = 0
  for (var i = 0; i < pcaList.length; i++) {
    value += pcaList[i][1]
  }
  value = parseInt(value / pcaList.length)
  var hue = 200
  var saturation = 50
  var light = 25 + Math.min(value/2, 50)
  return { fillColor: "hsl("+ hue +", "+ saturation +"%, " + light + "%)", color: "hsl("+ hue +", "+ saturation +"%, " + (light - 10) + "%)"}
}

// return comparison symbol between values
// used for comparison of previous AMR year
function getPlus(x, y) {
  var xN = 0
  var yN = 0
  if (sr == "Susceptible") {
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
  var n = 0
  var p = 0
  for (var i = 0; i < pcaList.length; i++) {
    n += pcaList[i][0]
  }
  for (var i = 0; i < pcaList.length; i++) {
    p += pcaList[i][1]
  }
  if (sr == "Susceptible") {
    return "</br><div>Isolates: " + n + "</br>" + sr + ": " + (p / pcaList.length).toFixed(2) + "%</div>"
  } else {
    return "</br><div>Isolates: " + n + "</br>" + sr + ": " + (100 - (p / pcaList.length).toFixed(2)) + "%</div>"
  }
}

function fixDate(text) {
  text = text.split("::")
  var d = new Date(text[0], text[1], "1")
  return d.toLocaleString('default', { month: 'long' }) + ", " + text[0]
}
