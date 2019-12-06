var bacteriaDrug
var sr
var bugs = []
var drugs = []

// build double date range slider
$(document).ready(function() {
  // build date range slider
  let minDate = DB.amr.dates.sort()[0].split("::")
  let maxDate = DB.amr.dates.sort()[DB.amr.dates.length - 1].split("::")
  $("#slider").dateRangeSlider({
    defaultValues: {min: new Date(parseInt(minDate[0]), parseInt(minDate[1]-1)), max:new Date(parseInt(maxDate[0]), parseInt(maxDate[1]-1))},
    bounds: {min: new Date(parseInt(minDate[0]), parseInt(minDate[1]-1)), max:new Date(parseInt(maxDate[0]), parseInt(maxDate[1]-1))},
    step: {months: 1}
  })

  // daterange toggle function
  $("#slider").bind("valuesChanging", function(e, data){
    updateAll()
  });

  // susceptible toggle function
  $("#sr").change(function() {
    updateAll()
  })
})

window.addEventListener('DOMContentLoaded', function() {
  sr = document.getElementById("sr")
  fillButtons()
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

function selectDrugs(x) {
  drugs = Array.from(document.getElementsByClassName("drugCheck"))
  if (x == 'all') {
    for (let drug of drugs) {
      drug.checked = true
    }
  } else {
    for (let drug of drugs) {
      drug.checked = false
    }
  }
  updateAll()
}

//========================================( FILL BUTTONS )
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

  // fill bacteriaDropdown
  // bacteriaDropdown menu expected to remain constant
  document.getElementById("bacteriaButton").innerHTML = bugs[0]
  for (var i in bugs) {
    document.getElementById("bacteriaDropdown").innerHTML += "<a class='dropdown-item' onclick='document.getElementById(\"bacteriaButton\").innerHTML = \"" + bugs[i] + "\"; updateButtons(); updateMap(); updatePlotly()'>" + bugs[i].substring(0, 35) + "</a>"
  }

  // fill facilityDropdown
  for (var i in DB['amr']['facilityTypes']) {
    document.getElementById("facilityDropdown").innerHTML += "&nbsp;<input oninput=\"updateAll()\" type=\"checkbox\" class=\"facilityCheck\" name=\"" + DB['amr']['facilityTypes'][i] + "\" checked> " + DB['amr']['facilityTypes'][i] + "&nbsp;<br>"
  }

  // fill drugDropdown
  for (let drug of drugs) {
    document.getElementById("drugDropdown").innerHTML += "&nbsp;<input oninput=\"updateAll()\" type=\"checkbox\" class=\"drugCheck\" name=\"" + drug + "\" checked> " + drug.substring(0, 35) + "&nbsp;<br>"
  }

  // fill dateDropdown
  for (var i in DB['amr']['dates']) {
    document.getElementById("dateDropdown").innerHTML += "&nbsp;<input oninput=\"updateAll()\" type=\"checkbox\" class=\"dateCheck\" name=\"" + DB['amr']['dates'][i] + "\" checked> " + DB['amr']['dates'][i] + "&nbsp;<br>"
  }
  updateButtons()
}

//========================================( UPDATE BUTTONS )
function updateButtons() {
  // update button context toggle (SUSCEPTIBLE/RESISTANT)
  if (!(document.getElementById("mapColorButton").innerHTML == "Default")) {
    document.getElementById("mapColorButton").innerHTML = "By " + `${sr.checked ? 'Susceptible' : 'Resistant'}` + " %</a>"
  }
  document.getElementById("mapColorDropdown").innerHTML = "<a class='dropdown-item' onclick='document.getElementById(\"mapColorButton\").innerHTML = \"Default\"; updateMap()'>Default</a><a class='dropdown-item' onclick='document.getElementById(\"mapColorButton\").innerHTML = \"By " + `${sr.checked ? "Susceptible" : "Resistant"}` + " %\"; updateMap()'>By " + `${sr.checked ? "Susceptible" : "Resistant"}` + " %</a>"
}

//========================================( UPDATE MAP )
function updateMap() {
  // TODO: update level -> label to level::label
  // update icon text
  for (var i in DB['amr']['amr']) {
    icons[i].options.icon.options.html = "<b>" + i.split("::")[1] + "</b>Collected: " + parseInt(getSum(i))
  }

  // clean map icons
  for (var index in icons) {
    map.removeLayer(icons[index])
  }

  if (level == "pca") {
    map.addLayer(icons[level + "::" + label])
    if (document.getElementById("mapColorButton").innerHTML == "Default") {
      layers[level + "::" + label][label].setStyle({color: colorPalette[Object.keys(colorPalette)[Object.keys(layers).indexOf(level + "::" + label) % Object.keys(colorPalette).length]][3], fillColor: colorPalette[Object.keys(colorPalette)[Object.keys(layers).indexOf(level + "::" + label) % Object.keys(colorPalette).length]][2]})
    } else {
        let total = getSum(level+"::"+label)
        if (sr == 'Susceptible') {
          layers[level+"::"+label][label].setStyle({color: `${total[0] > 0 ? "hsl(" + (parseInt(total[2]/total[1]*100)) + ", 50%, "+ (40 + parseInt(total[2]/total[1]*10)) +"%)" : "hsl(0, 0%, 30%)"}`})
        } else {
          layers[level+"::"+label][label].setStyle({color: `${total[0] > 0 ? "hsl(" + (100 - (parseInt(total[2]/total[1]*100))) + ", 50%, "+ (50 - parseInt(total[2]/total[1]*10)) +"%)" : "hsl(0, 0%, 30%)"}`})
        }
      }
  } else {
    for (let index of DB.map[level + "::" + label]) {
      map.addLayer(icons[nextLevel() + "::" + index])
      if (document.getElementById("mapColorButton").innerHTML == "Default") {
        layers[level+"::"+label][index].setStyle({color: colorPalette[Object.keys(colorPalette)[Object.values(DB.map[level + "::" + label]).indexOf(index) % Object.keys(colorPalette).length]][3]})
      } else {
        let total = getSum(nextLevel()+"::"+index)
        if (sr == 'Susceptible') {
          layers[level+"::"+label][index].setStyle({color: `${total[0] > 0 ? "hsl(" + (parseInt(total[2]/total[1]*100)) + ", 50%, "+ (40 + parseInt(total[2]/total[1]*10)) +"%)" : "hsl(0, 0%, 30%)"}`})
        } else {
          layers[level+"::"+label][index].setStyle({color: `${total[0] > 0 ? "hsl(" + (100 - (parseInt(total[2]/total[1]*100))) + ", 50%, "+ (50 - parseInt(total[2]/total[1]*10)) +"%)" : "hsl(0, 0%, 30%)"}`})
        }
      }
    }
  }
}

//========================================( UPDATE ANTIBIOGRAM )
function updateAntibiogram() {
  // update antibiogram headers
  // TODO: replace yearScale
  let dateRange = Object.values($("#slider").dateRangeSlider("values")).map(x => String(x.getFullYear()) + '::' + String('0' + String(x.getMonth()+1)).substring(String('0' + String(x.getMonth()+1)).length - 2, String('0' + String(x.getMonth()+1)).length))
  if (level == "state") {
    document.getElementById("antibiogramHeader").innerHTML = "Arizona State Antibiogram between " + fixDate(dateRange[0]) + " and " + fixDate(dateRange[1])
  } else {
    if (level == 'pca') {
      document.getElementById("antibiogramHeader").innerHTML = proper(label) + " " + level.toUpperCase() + " Antibiogram for " + fixDate(DB.amr.dates.sort()[0])
    } else {
      document.getElementById("antibiogramHeader").innerHTML = proper(label + " " + level) + " Antibiogram for " + fixDate(DB.amr.dates.sort()[0])
    }
  }
  document.getElementById("antibiogramSubheader").innerHTML = "% " + `${ sr.checked ? 'Susceptible' : 'Resistant'}` + " for Isolates"

  // fill antibiogram % hash by level::label
  let bugHash = {}
  let allDrug = []
  if (Object.keys(DB.amr.amr).indexOf(level + "::" + label) >= 0) {
    let facilityList = Array.from(document.getElementsByClassName("facilityCheck")).filter(x => Object.keys(DB.amr.amr[level + "::" + label]).indexOf(x.name) >= 0 && x.checked).map(x => x.name)
    for (let facility of facilityList) {
      let sterileList = Array.from(document.getElementsByClassName("sterileCheck")).filter(x => Object.keys(DB.amr.amr[level + "::" + label][facility]).indexOf(x.name) >= 0 && x.checked).map(x => x.name)
      for (let sterile of sterileList) {
        for (let bacteria in DB.amr.amr[level + "::" + label][facility][sterile]) {
          if (Object.keys(bugHash).indexOf(bacteria) < 0) {
            bugHash[bacteria] = {'collected': 0}
          }
          let dateList = DB.amr.dates.filter(x => x >= dateRange[0] && x <= dateRange[1] && Object.keys(DB.amr.amr[level + "::" + label][facility][sterile][bacteria]).indexOf(x) >= 0)
          for (let date of dateList) {
            let total = []
            drugList = Array.from(document.getElementsByClassName("drugCheck")).filter(x => Object.keys(DB.amr.amr[level + "::" + label][facility][sterile][bacteria][date]).indexOf(x.name) >= 0 && x.checked).map(x => x.name)
            for (let drug of drugList) {
              if (allDrug.indexOf(drug) < 0) {
                allDrug.push(drug)
              }
              if (Object.keys(bugHash[bacteria]).indexOf(drug) < 0) {
                // [tested, susceptible]
                bugHash[bacteria][drug] = [0, 0]
              }
              let stats = DB.amr.amr[level + "::" + label][facility][sterile][bacteria][date][drug]
              total.push(stats['collected'])
              bugHash[bacteria][drug][0] += stats['tested']
              bugHash[bacteria][drug][1] += stats['susceptible']
            }
            bugHash[bacteria]['collected'] += total[0]
          }
        }
      }
    }
  }

  // translate hash to antibiogram
  var row = document.getElementById("bug")
  var col = document.getElementById("drug")

  col.innerHTML = "<td style=\"vertical-align: bottom;width: 200px;\"><div><center><b>Organism</b></center></div></td><td style=\"vertical-align: bottom;width: 50px;\"><div><center><b># Strains</b></center></div></td>"
  for (let drug of allDrug.sort()) {
    if (allDrug.length <= 8) {
      col.innerHTML += "<td><div><b>" + drug + "</b></div></td>"
    } else {
      col.innerHTML += "<td class=\"rotate\"><div><b>" + drug + "</b></div></td>"
    }
  }
  row.innerHTML = ""

  for (let bacteria of Object.keys(bugHash).sort()) {
    var newRow = "<tr><td><b>" + bacteria + "</b></td><td>" + parseInt(bugHash[bacteria]['collected']) + "</td>"
    for (let drug of allDrug.sort()) {
      if (Object.keys(bugHash[bacteria]).indexOf(drug) < 0) {
        newRow += "<td>-</td>"
      } else if (sr.checked) {
        newRow += "<td>" + String(parseInt((bugHash[bacteria][drug][1]/bugHash[bacteria][drug][0])*100)) + "%</td>"
      } else {
        newRow += "<td>" + String(100 - parseInt((bugHash[bacteria][drug][1]/bugHash[bacteria][drug][0])*100)) + "%</td>"
      }
    }
    row.innerHTML += newRow + "</tr>"
  }
}

//========================================( UPDATE PLOTLY )
function updatePlotly() {
  // initialize plotly
  var dataArr = []
  var pathogenGraph = {};
  let bacteria = document.getElementById('bacteriaButton').innerHTML
  let iterator = []
  if (level == "pca") {
    iterator.push(level+"::"+label)
  } else {
    for (index of DB.map[level + "::" + label])
    iterator.push(nextLevel()+"::"+index)
  }
  let highlightRange = Object.values($("#slider").dateRangeSlider("values")).map(x => String(x.getFullYear()) + '::' + String('0' + String(x.getMonth()+1)).substring(String('0' + String(x.getMonth()+1)).length - 2, String('0' + String(x.getMonth()+1)).length))
  let dateList = DB.amr.dates.filter(x => x >= highlightRange[0] && x <= highlightRange[1])

  // plotly layout
  var layout = {
    legend: {orientation: 'v'},
    title: {
      text: `% <b>${ sr.checked ? 'Susceptible' : 'Resistant'}</b> for <b>${bacteria}</b> ${level == 'state' ? 'in Arizona' : 'in ' + proper(label)} ${level == 'pca' ? level.toUpperCase() : proper(level)}`,
      font: {size: 20},
      x: 0.5
    },
    xaxis: {
      title: {text: "Time (months)"},
      range: [DB.amr.dates.sort()[0].split("::").join("-"), DB.amr.dates.sort()[DB.amr.dates.length-1].split("::").join("-")]
    },
    yaxis: {
      title: {text: `% <b>${ sr.checked ? 'Susceptible' : 'Resistant'}</b> for <b>${bacteria}</b>`},
      range: [0, 1],
      tickformat: ',.0%',
    },
    shapes: [{
      type: 'rect',
      xref: 'x',
      yref: 'paper',
      x0: `${dateList.length > 0 ? dateList[0].split("::").join("-") : highlightRange[0].split("::").join("-")}`,
      x1: `${dateList.length > 0 ? dateList[dateList.length - 1].split("::").join("-") : highlightRange[0].split("::").join("-")}`,
      y0: 0,
      y1: 1,
      fillcolor: '#33ccff',
      opacity: '0.2',
      line: {width: 0}
    }]
  }

  let dateStart = DB.amr.dates.sort()[DB.amr.dates.length-1]
  let dateEnd = DB.amr.dates.sort()[0]

  // fill graph
  let dateRange = Array.from(document.getElementsByClassName("dateCheck")).filter(x => x.checked).map(x => x.name)
  let totalDrugs = DB.amr.bugDrugs.filter(x => x.indexOf(bacteria) >= 0).map(x => x.split("::")[1])
  totalDrugs = Array.from(document.getElementsByClassName("drugCheck")).filter(x => x.checked && totalDrugs.indexOf(x.name) >= 0).map(x => x.name)
  for (let drug of totalDrugs) {
    let total = {}
    for (let date of dateRange) {
      total[date] = [0.0, 0.0]
    }
      for (index of iterator.filter(x => Object.keys(DB.amr.amr).indexOf(x) >= 0)) {
        let facilityList = Array.from(document.getElementsByClassName("facilityCheck")).filter(x => Object.keys(DB.amr.amr[index]).indexOf(x.name) >= 0 && x.checked).map(x => x.name)
        for (let facility of facilityList) {
          let sterileList = Array.from(document.getElementsByClassName("sterileCheck")).filter(x => Object.keys(DB.amr.amr[index][facility]).indexOf(x.name) >= 0 && x.checked).map(x => x.name)
          for (let sterile of sterileList) {
            if (Object.keys(DB.amr.amr[index][facility][sterile]).indexOf(bacteria) >= 0) {
              let dateList = dateRange.filter(x => Object.keys(DB.amr.amr[index][facility][sterile][bacteria]).indexOf(x) >= 0)
              for (let date of dateList) {
                // TODO: date axis to plotly
                if (Object.keys(DB.amr.amr[index][facility][sterile][bacteria][date]).indexOf(drug) >= 0) {
                  if (date > dateEnd) {
                    dateEnd = String(date)
                  }
                  if (date < dateStart) {
                    dateStart = String(date)
                  }
                  // add drug if not in total
                  let stats = DB.amr.amr[index][facility][sterile][bacteria][date][drug]
                  total[date][0] += stats['tested']
                  total[date][1] += stats['susceptible']
                }
              }
            }
          }
        }
      }
    let totalDates = Object.keys(total).filter(x => total[x][0] > 0)
    pathogenGraph[drug] = {'x': totalDates.map(x => x.split("::").join("-")), 'y': [], 'name': drug, mode: 'lines+markers'}
    for (let date of totalDates) {
      if (sr.checked) {
        pathogenGraph[drug]['y'].push(total[date][1]/total[date][0])
      } else {
        pathogenGraph[drug]['y'].push(1-total[date][1]/total[date][0])
      }
    }
    layout['xaxis']['range'] = [dateStart.split("::").join("-"), dateEnd.split("::").join("-")]
    dataArr.push(pathogenGraph[drug])
  }
  Plotly.react(document.getElementById("plot"), dataArr, layout)

  //document.getElementById("slider").innerHTML = ""
//  $("#slider").dateRangeSlider({
//    defaultValues: {min: new Date(parseInt(dateStart.split("::")[0]), parseInt(dateStart.split("::")[1])-1), max:new Date(parseInt(dateEnd.split("::")[0]), parseInt(dateEnd.split("::")[1])-1)},
//    bounds: {min: new Date(parseInt(dateStart.split("::")[0]), parseInt(dateStart.split("::")[1])-1), max:new Date(parseInt(dateEnd.split("::")[0]), parseInt(dateEnd.split("::")[1])-1)},
//    step: {months: 1}
//  })



}

//========================================( HELPER FUNCTIONS )
function nextLevel() {
  if (level == "pca") {
    return level
  } else {
    return levels[((levels.indexOf(level) + 1) % levels.length)]
  }
}

function getColor(level, label) {
  // TODO: replace yearScale
  var pcaList = DB.amr[level][label][bacteriaDrug][DB.amr.dates.sort()[0]]
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
  if (sr.checked) {
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

function getSum(i) {
  let total = 0.0
  let bacteria = document.getElementById("bacteriaButton").innerHTML
  let facilityList = Array.from(document.getElementsByClassName("facilityCheck")).filter(x => Object.keys(DB.amr.amr[i]).indexOf(x.name) >= 0 && x.checked).map(x => x.name)
  for (let facility of facilityList) {
    let sterileList = Array.from(document.getElementsByClassName("sterileCheck")).filter(x => Object.keys(DB.amr.amr[i][facility]).indexOf(x.name) >= 0 && x.checked).map(x => x.name)
    for (let sterile of sterileList) {
      if (Object.keys(DB.amr.amr[i][facility][sterile]).indexOf(bacteria) >= 0) {
        let dateRange = Object.values($("#slider").dateRangeSlider("values")).map(x => String(x.getFullYear()) + '::' + String('0' + String(x.getMonth()+1)).substring(String('0' + String(x.getMonth()+1)).length - 2, String('0' + String(x.getMonth()+1)).length))
        let dateList = Object.keys(DB.amr.amr[i][facility][sterile][bacteria]).filter(x => x >= dateRange[0] && x <= dateRange[1])
        for (let date of dateList) {
          let stats = Object.values(DB.amr.amr[i][facility][sterile][bacteria][date])[0]
          total += stats['collected']
        }
      }
    }
  }
  return total
}

function fixDate(text) {
  text = text.split("::")
  var d = new Date(text[0], text[1]-1, "1")
  return d.toLocaleString('default', { month: 'long' }) + ", " + text[0]
}
