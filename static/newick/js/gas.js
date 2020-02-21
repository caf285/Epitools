    //=========================( Sample Metadata )                                                                                                      
    function addMarks() {
      // RESET ALL MARKS
      for (let leaf of tree.leaves) {
        for (let style of Object.keys(leaf.markStyle)) {
          leaf.markStyle[style] = false
        }
      }
      // NEW SAMPLES
      let today = new Date()
      let recentSamples = []
      for (sample of DB.gas.filter(x => Object.keys(tree.branches).indexOf(x.pk) >= 0)) {
        let sampleDate = new Date(sample.fields.collectionDate)
        let monthDelta = parseInt((today.getFullYear() * 12 + today.getMonth()) - (sampleDate.getFullYear() * 12 + sampleDate.getMonth()))
        if (monthDelta <= newRange) {
          recentSamples.push(sample.pk)
        } 
      } 
      document.getElementById("treeContext1").innerHTML = "<div id='newSamples'>New Samples: " + recentSamples.length + "</div><div>Total Samples: " + tree.leaves.length + "</div><div></div>"
      document.getElementById("newSamples").addEventListener('click', function() {
        for (sample of recentSamples) {
          tree.branches[sample]['markStyle']["primary"] = true
        }
        tree.draw() 
      })
    }     
    function getCladeXY(master) {
      let cladeBounds = {}
      if (document.getElementById("gasMtypeButton").innerHTML === "ALL") {
        for (clade in trees[treeType][treeDate][master]) {
          cladeBounds[clade] = [Infinity, Infinity, 0]
          sample = []
          for (i of trees[treeType][treeDate][master][clade]) {
            if (['(', ')', ',', ':'].indexOf(i) === -1) {
              sample.push(i)
            } else {
              sample = sample.join("")
              if (Object.keys(tree.branches).filter(x => x.toLowerCase() !== "reference").indexOf(sample) > -1) {
                if (tree.branches[sample]['centerx'] < cladeBounds[clade][0]) {
                  cladeBounds[clade][0] = tree.branches[sample]['centerx']
                }
                if (tree.branches[sample]['centery'] < cladeBounds[clade][1]) {
                  cladeBounds[clade][1] = tree.branches[sample]['centery']
                }
                if (tree.branches[sample]['centery'] > cladeBounds[clade][2]) {
                  cladeBounds[clade][2] = tree.branches[sample]['centery']
                }
              }   
              sample = []
            }   
          }       
          if (cladeBounds[clade][0] < Infinity && cladeBounds[clade][1] < Infinity && cladeBounds[clade][2] > 0) {
            cladeBounds[clade][2] = cladeBounds[clade][2] - cladeBounds[clade][1]
            let shortClade
            if (clade === "ALL") {
              shortClade = "ALL"
            } else {
              shortClade = "emm" + clade.split("::")[0].split("M").slice(1)
            }
            tree.addClade(shortClade, cladeBounds[clade][0], 300, cladeBounds[clade][1], cladeBounds[clade][2], trees[treeType][treeDate][master][clade])             
          } 
        }     
      }     
      return cladeBounds
    }
    function updateSampleNames() {
      for (sample of tree.leaves) {
        let fields = Array.from(document.getElementsByClassName("sampleNamesCheck")).filter(x => x.checked).map(x => x.name)
        let newName = []
        if (sample['id'].indexOf("-reference") >= 0) {
          sample['id'] = sample['id'].split("-reference")[0]
          newName = ['Reference']
        }
        for (field of fields) {
          try {
            if (field === "id") {
              newName.push(sample.id)
            } else if (DB.gas.filter(x => x.pk === sample.id)[0]["fields"][field] === "") {
              newName.push("_")
            } else {
              if (field === "facilityStr") {
                if (userGroups.indexOf("((Arizona State))") >= 0) {
                  newName.push(DB.gas.filter(x => x.pk === sample.id)[0]["fields"][field])
                } else if (userGroups.indexOf(" County)") >= 0) {
                  for (let county of DB.gas[sample.id]["counties"]) {
                    county = "(" + county + " County)"
                    if ("{{ user.groups.all|safe }}".indexOf(county) >= 0) {
                      newName.push(DB.gas.filter(x => x.pk === sample.id)[0]["fields"][field])
                      break
                    }
                  }
                }
              } else {
                newName.push(DB.gas.filter(x => x.pk === sample.id)[0]["fields"][field])
              }
            }
          } catch {
            newName.push("_")
          }
        }
        sample.label = newName.join("::")
      }
    }
      // cluster detection (move to phylocanvas later)
      function getClusters(clusters) {
        console.log(clusters)
        for (let leaf of tree.leaves.filter(x => x.markStyle["secondary"] === true)) {
          leaf.markStyle["secondary"] = false
        }
        for (let cluster of Object.values(clusters)) {
          for (let leaf of cluster) {
            leaf.markStyle["secondary"] = true
          }
        }
        tree.draw()
      }
      // edit load function to run script after each load

      function resetM(i) {
        document.getElementById("masterButton").innerHTML = i
        document.getElementById("gasMtypeButton").innerHTML = "ALL"
        tree.load(trees[treeType][treeDate][i]["ALL"])
        getCladeXY(i)
        tree.draw()
        document.getElementById("gasMtypeDropdown").innerHTML = ""

        let emm = new Object();
        for (var j in trees[treeType][treeDate][i]) {
          if (j == "ALL") {
            emm[0] = j
          } else {
            emm[j.split('M')[1].split('::')[0]] = j
          }
        }

        for (var j in emm) {
          document.getElementById("gasMtypeDropdown").innerHTML += "<a class='dropdown-item' onclick='document.getElementById(\"gasMtypeButton\").innerHTML = \"" + ((j == 0) ? 'ALL' : 'emm' + j) + "\"; tree.load(\"" + trees[treeType][treeDate][i][emm[j]] + "\");getCladeXY(\"" + i + "\"); tree.draw();'>" + ((j == 0) ? 'ALL' : 'emm' + j) + "</a>"
        }
      }
      function getAZ() {
        for (let leaf of tree.leaves.filter(x => x.markStyle["info"] === true)) {
          leaf.markStyle["info"] = false
        }

        let azResults = document.getElementById("azResults")
        azResults.innerHTML = ""

        for (let leaf of tree.leaves.filter(x => document.getElementById("azNumber").value && DB.gas.filter(y => y.pk === x.id)[0]["fields"]["az"].indexOf(document.getElementById("azNumber").value) >= 0)) {
          leaf.markStyle["info"] = true
        }

        for (let az of DB.gas.filter(x => document.getElementById("azNumber").value && x.fields["az"].indexOf(document.getElementById("azNumber").value) >= 0).sort(function(a, b) {if (a[0] - b[0]) {return 1} else if (a[0] <= b[0]) {return -1}}          )) {
          m = Object.entries(trees[treeType][treeDate][Object.keys(trees[treeType][treeDate])[0]]).filter(x => x[0] !== "ALL" && x[1].indexOf(az.pk) >= 0)[0]
          if (m) {
            let emm = m[0].split("M")[1].split("::")[0]
            azResults.innerHTML += "<div class='azResults' onclick='loadAzTree(\"" + m[0] + "\"); tree.draw()'>" + az.fields["az"] + " --> emm" + emm + "</div>"
          }
        }

        tree.draw()
      }

      function loadAzTree(m) {
        tree.load(trees[treeType][treeDate][Object.keys(trees[treeType][treeDate])[0]][m])
      }

    //=========================( Option Controls )
    function rangeSelect(obj) {
      let drop = obj.parentNode.parentNode.getElementsByClassName("btn")[0]
      let index = Object.values(obj.parentNode.getElementsByClassName("dropdown-item")).map(x => x.innerHTML).indexOf(obj.innerHTML)
      drop.innerHTML = obj.innerHTML
      return index
    }
    function rangeArrow(obj, str) {
      let dropList = obj.parentNode.getElementsByClassName("dropdown")[0]
      let drop = dropList.getElementsByClassName("btn")[0]
      dropList = Object.values(dropList.getElementsByClassName("dropdown-item"))
      let index = dropList.map(x => x.innerHTML).indexOf(drop.innerHTML)
      index = (str === "left" ? index - 1 : index + 1)
      try {
        drop.innerHTML = dropList[index].innerHTML
        return index
      } catch {}
    }
    function sampleRangeFunc(str) {
      if (typeof str !== "undefined") {
        newRange = parseInt(str) + 1
        addMarks()
      }
    }
    function treeDateFunc(str) {
      if (typeof str !== "undefined") {
        tree.draw();
        treeDate = Object.keys(trees[treeType])[str]
        resetM(Object.keys(trees[treeType][treeDate])[0])
      }
    }
    function clusterSnpsFunc(str) {
      if (typeof str !== "undefined") {
        let dropDown = document.getElementById("clusterSnpsDropdown")
        dropDown.innerHTML = dropDown.parentNode.getElementsByClassName("dropdown-item")[str].innerHTML
        updateClusterContext()
      }
    }
    function clusterSamplesFunc(str) {
      if (typeof str !== "undefined") {
        let dropDown = document.getElementById("clusterSamplesDropdown")
        dropDown.innerHTML = dropDown.parentNode.getElementsByClassName("dropdown-item")[str].innerHTML
        updateClusterContext()
      }
    }

    function updateClusterContext() {
      let clusterSnps = document.getElementById("clusterSnpsDropdown")
      clusterSnps = clusterSnps.innerHTML.split(" ")[0]
      let clusterSamples = document.getElementById("clusterSamplesDropdown")
      clusterSamples = clusterSamples.innerHTML.split(" ")[0]
      clusters = tree.getClusters(clusterSnps, clusterSamples)
      document.getElementById("clusterContext").innerHTML = "<div id='newClusters'>Clusters: " + Object.keys(clusters).length + "</div><div></div>"
      document.getElementById("newClusters").addEventListener('click', function() {
        getClusters(clusters)
        tree.draw()
      })
    }
