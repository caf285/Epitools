    // resize window event for Phylocanvas to adjust to flex boxes
    if(document.readyState === "complete") {
      window.dispatchEvent(new Event('resize'));
    }
    else {
      window.addEventListener("load", () => {
        window.dispatchEvent(new Event('resize'));
      });
    }

    // load database
    var groups = []

    newRange = 1

      // prep 'bestsnp' toggle
      var treeType = 'bestsnp'
      $(function() {
        $('#bestsnp').change(function() {
          if ($(this).prop('checked')) {
            treeType = 'bestsnp'
          } else {
            treeType = 'missingdata'
          }
          resetM(Object.keys(trees[treeType][treeDate])[0])
        })
      })

    
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
      for (sample of Object.keys(DB.gas).filter(x => Object.keys(tree.branches).indexOf(x) >= 0)) {
        let sampleDate = new Date(DB.gas[sample]['collectionDate'])
        let monthDelta = parseInt((today.getFullYear() * 12 + today.getMonth()) - (sampleDate.getFullYear() * 12 + sampleDate.getMonth()))
        if (monthDelta <= newRange) {
          recentSamples.push(sample)
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

        // fill dropdown
        let dropDown = document.getElementById("treeDateDropdown")
        var treeDate;
        for (let newDate of Object.keys(trees[treeType])) {
          dropDown.innerHTML += "<button type='button' class='dropdown-item' onclick='treeDateFunc(rangeSelect(this))'>" + newDate + " Months</button>"
          dropDown.parentNode.getElementsByClassName("btn")[0].innerHTML = newDate + " Months"
        }

        // button function
        function treeDateFunc(str) {
          if (typeof str !== "undefined") {
            tree.draw();
            treeDate = Object.keys(trees[treeType])[str]
            resetM(Object.keys(trees[treeType][treeDate])[0])
            
          }
        }

        function clusterSamplesFunc(str) {
          if (typeof str !== "undefined") {
            let dropDown = document.getElementById("clusterSamplesDropdown")
            dropDown.innerHTML = dropDown.parentNode.getElementsByClassName("dropdown-item")[str].innerHTML
            index = Array.from(document.getElementById("clusterSnpsDropdown").parentNode.getElementsByClassName("dropdown-item")).map(x => x.innerHTML).indexOf(document.getElementById("clusterSnpsDropdown").innerHTML)
            console.log(str, index)

            // CLUSTER DETECTION
            document.getElementById("clusterContext").innerHTML = "<div id='newClusters'>Clusters: " + tree.getClusters(str, index).length + "</div><div></div>"
            document.getElementById("newClusters").addEventListener('click', function() {
              getClusters(str, index)
              tree.draw()
            })

          }
        }

        function clusterSnpsFunc(str) {
          if (typeof str !== "undefined") {
            let dropDown = document.getElementById("clusterSnpsDropdown")
            dropDown.innerHTML = dropDown.parentNode.getElementsByClassName("dropdown-item")[str].innerHTML
            index = Array.from(document.getElementById("clusterSamplesDropdown").parentNode.getElementsByClassName("dropdown-item")).map(x => x.innerHTML).indexOf(document.getElementById("clusterSamplesDropdown").innerHTML)

            // CLUSTER DETECTION
            document.getElementById("clusterContext").innerHTML = "<div id='newClusters'>Clusters: " + tree.getClusters(index, str).length + "</div><div></div>"
            document.getElementById("newClusters").addEventListener('click', function() {
              getClusters(index, str)
              tree.draw()
            })

          }
        }

      // edit load function to run script after each load
      var tree = Phylocanvas.default.createTree('phylocanvas')
      tree.load = (function() {
        var cached = tree.load;
        return function() {
          var result = cached.apply(this, arguments)
          let emm = Object.keys(trees[treeType][treeDate][document.getElementById("masterButton").innerHTML]).filter(x => trees[treeType][treeDate][document.getElementById("masterButton").innerHTML][x] === arguments[0])[0]
          document.getElementById("gasMtypeButton").innerHTML = ((emm == 'ALL') ? 'ALL' : 'emm' + emm.split('M')[1].split('::')[0])
          tree.textSize = Math.min(3 + (800 / tree.leaves.length), 35)
          tree.canvas.font = tree.textSize + 'px ' + tree.canvas.font.split(' ')[1];
          tree.branchScalar = 1800/tree.maxBranchLength
          tree.setTitle(document.getElementById("gasMtypeButton").innerHTML)
          updateSampleNames()
          addMarks()
          return result
        }
      })()

      tree.baseNodeSize = 2
      tree.setTreeType('rectangular')
      tree.showBranchLengthLabels = true
      for (var i in trees[treeType][treeDate]) {
        document.getElementById("masterDropdown").innerHTML += "<a class='dropdown-item' onclick='resetM(\"" + i + "\")'>" + i + "</a>"
      }
      function resetM(i) {
        document.getElementById("masterButton").innerHTML = i
        document.getElementById("gasMtypeButton").innerHTML = "ALL"
        tree.load(trees[treeType][treeDate][i]["ALL"])
        getCladeXY(i)
        tree.draw()
        document.getElementById("gasMtypeDropdown").innerHTML = ""

        let emm = new Object();
        console.log(trees[treeType][treeDate][i])
        for (var j in trees[treeType][treeDate][i]) {
          if (j == "ALL") {
            emm[0] = j
          } else {
            emm[j.split('M')[1].split('::')[0]] = j
          }
        }
        console.log(emm)

        for (var j in emm) {
          document.getElementById("gasMtypeDropdown").innerHTML += "<a class='dropdown-item' onclick='document.getElementById(\"gasMtypeButton\").innerHTML = \"" + ((j == 0) ? 'ALL' : 'emm' + j) + "\"; tree.load(\"" + trees[treeType][treeDate][i][emm[j]] + "\");getCladeXY(\"" + i + "\"); tree.draw();'>" + ((j == 0) ? 'ALL' : 'emm' + j) + "</a>"
        }
      }

      clusterSamplesFunc(0)
      clusterSnpsFunc(0)
      treeDateFunc(Object.keys(trees[treeType]).length - 1)


      document.getElementsByClassName('biomod-options-icon')[0].addEventListener('click', function() {
        document.getElementsByClassName('biomod-options')[0].classList.toggle('tog');
        window.dispatchEvent(new Event('resize'));
      })



      // cluster detection (move to phylocanvas later)
      function getClusters(x, y) {
        for (let leaf of tree.leaves.filter(x => x.markStyle["secondary"] === true)) {
          leaf.markStyle["secondary"] = false
        }
        for (let cluster of tree.getClusters(x, y)) {
          for (let leaf of cluster) {
            leaf.markStyle["secondary"] = true
          }
        }
        tree.draw()
      }

      function getAZ() {
        for (let leaf of tree.leaves.filter(x => x.markStyle["info"] === true)) {
          leaf.markStyle["info"] = false
        }

        let azResults = document.getElementById("azResults")
        azResults.innerHTML = ""

        for (let leaf of tree.leaves.filter(x => document.getElementById("azNumber").value && DB.gas[x.id]["az"].indexOf(document.getElementById("azNumber").value) >= 0)) {
          leaf.markStyle["info"] = true
        }

        for (let az of Object.entries(DB.gas).filter(x => document.getElementById("azNumber").value && x[1]["az"].indexOf(document.getElementById("azNumber").value) >= 0).sort(function(a, b) {if (a[0] - b[0]) {return 1} else if (a[0] <= b[0]) {return -1}}          )) {

          m = Object.entries(trees[treeType][treeDate][Object.keys(trees[treeType][treeDate])[0]]).filter(x => x[0] !== "ALL" && x[1].indexOf(az[0]) >= 0)[0]
          if (m) {
            let emm = m[0].split("M")[1].split("::")[0]
            azResults.innerHTML += "<div class='azResults' onclick='loadAzTree(\"" + m[0] + "\"); tree.draw()'>" + az[1]["az"] + " --> emm" + emm + "</div>"
          }
        }

        tree.draw()
      }

      function loadAzTree(m) {
        tree.load(trees[treeType][treeDate][Object.keys(trees[treeType][treeDate])[0]][m])
      }
