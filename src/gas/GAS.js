import React, { useState, useRef, useEffect } from "react";

import SvgButton from "../svgButton/SvgButton.js";
import Phylocanvas from "../phylocanvas/Phylocanvas.js";
import SelectionHOT from "../handsontable/SelectionHOT.js";
import SplitPane from "react-split-pane";
import UploadScreen from "../uploadScreen/uploadScreen"
import Slider from "@mui/material/Slider";
import Box from '@mui/material/Box';
import './style.css'

function PhylocanvasView() {
  // phylocanvas
  const [nwk, setNwk] = useState("(A:1)B;")
  const [branches, setBranches] = useState([])
  const branchesRef = useRef([])
  const [phyloHeight, setPhyloHeight] = useState(["300"])
  const [metadataLabels, setMetadataLabels] = useState([])
  const [importPhylocanvasSelection, setImportPhylocanvasSelection] = useState([])
  const [getTree, setGetTree] = useState()

  // handsontable
  const [hotHeight, setHOTHeight] = useState(["300"])
  const elementRef = useRef(null);
  const [importTableSelection, setImportTableSelection] = useState([])

  // both
  const [dragCheck, setDragCheck] = useState(false)
  const dragRef = useRef(0)
  const [branchesData, setBranchesData] = useState([])
  const branchesDataRef = useRef([])
  const [getImage, setGetImage] = useState(false)
  const [uploadScreen, setUploadScreen] = useState(false);

  // other
  const [dateSliderRange, setDateSliderRange] = useState([90, 180]);
  const [dateRange, setDateRange] = useState([new Date(new Date() - (180 - dateSliderRange[0]) * (1000 * 60 * 60 * 24)).toISOString().split("T")[0], new Date(new Date() - (180 - dateSliderRange[1]) * (1000 * 60 * 60 * 24)).toISOString().split("T")[0]])
  const [dateRangeForms, setDateRangeForms] = useState("")
  const [metadataForms, setMetadataForms] = useState("")
  const host = useRef("https://pathogen-intelligence.tgen.org/go_epitools/")

  useEffect(() => {
    setHOTHeight(JSON.stringify(Math.floor(elementRef.current?.clientHeight / 2)))
    setPhyloHeight(Math.floor(elementRef.current?.clientHeight / 2))
    dateRangeRequest("Group A Strep", dateRange[0], dateRange[1]) // fill GAS Lineage buttons on load
  }, [])

  useEffect(() => {
    branchesRef.current = branches
    //console.log(branchesRef.current)
    mysqlRequest(branchesRef.current)
  }, [branches])

  // fill metadata buttons
  useEffect(() => {
    branchesDataRef.current = branchesData
    let appendMetadataDiv = document.getElementsByClassName("appendMetadataDiv")
    while (appendMetadataDiv.firstChild) {appendMetadataDiv.removeChild(appendMetadataDiv.firstChild)}
    var newMetadataForms = []
    if (branchesData && branchesData.length >= 1) {
      console.log("branchesData", branchesData)
      newMetadataForms = Object.keys(branchesData[0]).map((branch) =>
        <form key={branch} className="appendMetadataForm">
          <label>{branch}</label>
          <input type="checkbox" onClick={() => appendMetadataHandler()} defaultChecked="" />
        </form>
      )
      appendMetadataHandler()
    }
    setMetadataForms(newMetadataForms)
  }, [branchesData])

  // TODO: cleanup
  const fileInput = useRef(null)
  const reader = useRef(new FileReader())

  // get branch names callback
  const branchNameCallback = (e) => {
    setBranches(e)
  }

  // get selection list
  const exportPhylocanvasSelectionCallback = (e) => {
    //console.log("phylocanvas selection:", e)
    setImportTableSelection(e)
  }
  const exportTableSelectionCallback = (e) => {
    //console.log("table selection:", e)
    setImportPhylocanvasSelection(e)
  }

  const calculateBottomPaneHeight = (topPaneHeight) => {
    return elementRef.current?.clientHeight - topPaneHeight
  }

  // database query post request
  async function mysqlRequest(data = "") {
    console.log("requestData:", data)
    //const response = await fetch("/go-epitools/mysql", {
    await fetch(host.current + "mysql", {
      //console.log("hello new build")
      //const response = await fetch("https://pathogen-intelligence.org/go-epitools/mysql", {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        query: data,
      })
    })
      .then(response => {
        if (response.status >= 400) {
          throw new Error(response.status + " " + response.statusText);
        }
        return response.json()
      })
      .then(data => {
        for (let i in data) {
          if (data[i]?.Additional_metadata) {
            let branchObj = JSON.parse(data[i]["Additional_metadata"])
            data[i] = Object.assign(data[i], branchObj)
          }
          delete data[i].Additional_metadata
        }
        setBranchesData(data)
      })
      .catch(ERR => window.alert(ERR))
  }

  // neighborjoin post request
  async function neighborJoinRequest(data = "") {
    //const response = await fetch("/go-epitools/neighborjoin", {
    await fetch(host.current + "neighborjoin", {
      //const response = await fetch("https://pathogen-intelligence.org/go-epitools/neighborjoin", {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        fasta: data,
      })
    })
      .then(response => {
        if (response.status >= 400) {
          throw new Error(response.status + " " + response.statusText);
        }
        return response.text()
      })
      .then(data => setNwk(data))
      .catch(ERR => window.alert(ERR))
  }

  // lineage
  async function lineageRequest(data = "", url = "lineage", date1=dateRange[0], date2=dateRange[1]) {
    console.log("data", data)
    await fetch(host.current + url, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        lineage: data,
        date1: date1,
        date2: date2,
      })
    })
      .then(response => {
        if (response.status >= 400) {
          throw new Error(response.status + " " + response.statusText);
        }
        return response.text()
      })
      .then(data => {
        if (data) {
          setNwk(data)
        } else {
          console.log("no data")
        }
      })
      .catch(ERR => window.alert(ERR))
  }

  // samples
  async function samplesRequest(data = "", url = "samples") {
    console.log("data", data)
    await fetch(host.current + url, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        query: data,
      })
    })
      .then(response => {
        if (response.status >= 400) {
          throw new Error(response.status + " " + response.statusText);
        }
        return response.text()
      })
      .then(data => {
        if (data) {
          setNwk(data)
        } else {
          console.log("no data")
        }
      })
      .catch(ERR => window.alert(ERR))
  }

  // dates
  async function dateRangeRequest(pathogen, date1, date2, url = "dateRange") {
    console.log(pathogen, date1, date2)
    await fetch(host.current + url, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        pathogen: pathogen,
        date1: date1,
        date2: date2,
      })
    })
      .then(response => {
        if (response.status >= 400) {
          throw new Error(response.status + " " + response.statusText);
        }
        return response.json()
      })
      .then(data => {
        if (data) {
          updateDateRangeForms(data)
        } else {
          console.log("no data")
        }
      })
      .catch(ERR => window.alert(ERR))
  }


  // file i/o
  const handleFileInput = (e) => {
    let file = e.target.files[0]
    reader.current.readAsText(file)
    reader.current.onloadend = () => {
      // if NWK
      if (file.name.toLowerCase().endsWith(".nwk")) {
        setNwk(reader.current.result)
      }
      // if FASTA
      else if (file.name.toLowerCase().endsWith(".fasta")) {
        let fasta = reader.current.result
        neighborJoinRequest(fasta);
      }

      // if TSV
      else if (file.name.endsWith(".tsv")) {
        // split out fasta and positions
        let tsv = reader.current.result.split("\n")
        let header = tsv.shift().split("\t#SNPcall")[0].split("\t").map((x) => { return x.split("::")[0] })
        let fastaObj = {}
        header.forEach((key) => { fastaObj[key] = [] })
        for (let i = 0; i < tsv.length; i++) {
          tsv[i] = tsv[i].split("\t")
          for (let j = 0; j < header.length; j++) {
            fastaObj[header[j]].push(tsv[i][j])
          }
        }
        let fasta = []
        for (let i = 1; i < header.length; i++) {
          fasta.push(">" + header[i])
          fasta.push(fastaObj[header[i]].join(""))
        }
        fasta = fasta.join("\n")
        neighborJoinRequest(fasta);
      }
    }
  }

  // text file downloader
  function download(text, name, type = "text") {
    var a = document.createElement('a');
    var file = URL.createObjectURL(new Blob([text], {type: type}));
    a.href = file;
    a.setAttribute('download', name);
    document.body.appendChild(a);
    a.click()
    a.parentNode.removeChild(a);
  }

  // image file downloader
  const exportCanvasCallback = (e) => {
    console.log("exportCanvasCallback", e)
    setGetImage(false)
    var a = document.createElement('a');
    a.href = e;
    a.setAttribute('download', "export.png");
    document.body.appendChild(a);
    a.click()
    a.parentNode.removeChild(a);
  }

  // append metadata to phylocanvas
  function appendMetadataHandler() {
    let checked = []
    for (let e of [...document.getElementsByClassName("appendMetadataForm")].filter(x => x.childNodes[1].checked)) {
      checked.push(e.childNodes[0].innerHTML)
    }
    console.log(checked)
    setMetadataLabels(checked)
    console.log(metadataLabels)
  }

  // date range slider for adjusting gas buttons
  const handleDateRangeSlider = (event: Event, newValue: number | number[]) => {
    setDateSliderRange(newValue);
    let today = new Date()
    let date0 = new Date(today - (180 - dateSliderRange[0]) * (1000 * 60 * 60 * 24))
    let date1 = new Date(today - (180 - dateSliderRange[1]) * (1000 * 60 * 60 * 24))
    setDateRange([date0.toISOString().split("T")[0], date1.toISOString().split("T")[0]])
    dateRangeRequest("Group A Strep", dateRange[0], dateRange[1])
  };

  function updateDateRangeForms(data) {
    let appendDateRangeDiv = document.getElementsByClassName("appendDateRangeDiv")
    let newDateRangeForms = []
    if (data) {
      console.log(data)
      for (let line of data.filter(x => x.Count >= 4 && x.Lineage.includes("emm"))) {
        newDateRangeForms.push(
          <button onClick={() => lineageRequest(line["Lineage"], "emm")}>{line["Lineage"]} ({line["Count"]})</button>
        )
      }
    }
    setDateRangeForms(newDateRangeForms)
  };

  // update HOT and Phylocanvas window sizes
  function updateDrag() {
    setHOTHeight(JSON.stringify(calculateBottomPaneHeight(dragRef.current)));
    setPhyloHeight(dragRef.current);
  }

  return (
    <div style={{ height: "100%" }} ref={elementRef}>
      {uploadScreen && <UploadScreen setData={(e) => { setBranchesData(e) }} setDisplay={(e) => { setUploadScreen(e) }}></UploadScreen>}
      <input type="file" ref={fileInput} onChange={handleFileInput} hidden />
      <div style={{ position: "absolute", display: "flex", flexFlow: "row"}}>

        {/* initialize phylocanvas file upload */}
        <SvgButton onClick={e => fileInput.current.click()} label="import data" drop={true} />

        {/* build new phylocanvas and table from current selection */}
        <SvgButton onClick={() => {samplesRequest(importPhylocanvasSelection)}} label="build from selection" />

        {/* covid lineage buttons */}
        <SvgButton label="load covid lineage" drop={
          <div style={{display: "flex", flexFlow: "column"}}>
            <button onClick={() => lineageRequest("BG.2")}>BG.2</button>
            <button onClick={() => lineageRequest("BA.2")}>BA.2</button>
            <button onClick={() => lineageRequest("BA.2.18")}>BA.2.18</button>
            <button onClick={() => lineageRequest("BA.2.12.1")}>BA.2.12.1</button>
            <button onClick={() => lineageRequest("BA.2.3")}>BA.2.3</button>
            <button onClick={() => lineageRequest("BA.2.9")}>BA.2.9</button>
            <button onClick={() => lineageRequest("BA.4")}>BA.4</button>
            <button onClick={() => lineageRequest("BA.4.1")}>BA.4.1</button>
            <button onClick={() => lineageRequest("BA.5")}>BA.5</button>
            <button onClick={() => lineageRequest("BA.5.1")}>BA.5.1</button>
            <button onClick={() => lineageRequest("BA.5.2.1")}>BA.5.2.1</button>
            <button onClick={() => lineageRequest("BA.5.5")}>BA.5.5</button>
            <button onClick={() => lineageRequest("BG.2")}>BG.2</button>
          </div>
        } />

        {/* gas lineage buttons */}
        <SvgButton label="load gas lineage" drop={
          <div style={{display: "flex", flexFlow: "column"}}>
            <Box sx={{ margin:"5px" }}>
              <div style={{display: "flex", justifyContent: "center"}}>
                {new Date(dateRange[0]).toLocaleDateString('en-us', {year:"numeric", month:"short", day:"numeric"})} .. {new Date(dateRange[1]).toLocaleDateString('en-us', {year:"numeric", month:"short", day:"numeric"})}
              </div>
              <Slider min={0} step={1} max={180} value={dateSliderRange} onChange={handleDateRangeSlider} />
            </Box>
            <div style={{display: "flex", flexFlow: "column"}} className="appendDateRangeDiv">
              {dateRangeForms}
            </div>
          </div>
        } />

        {/* append metadata buttons */}
        <SvgButton label="append metadata" drop={
          <div className="appendMetadataDiv">
            {metadataForms}
          </div>
        } />

        {/* export buttons */}
        <SvgButton label="export" drop={
          <div>
            <div>Tree Export:</div>
            <SvgButton label="PNG Image Format" onClick={() => {setGetImage(true)}} />
            <SvgButton label="NWK Text Format" onClick={() => {
              setGetTree(() => (e) => {
                let treeString = e.stringRepresentation
                for (let leaf of e.leaves) {
                  let label = leaf.label
                  for (let character of ["(", ")", ":", ";", " "]) {
                    label = label.replaceAll(character, "_")
                  }
                  treeString = treeString.replace(leaf.id, label)
                }
                download(treeString, "export.nwk")
                setGetTree()
              })
              //console.log(tree)
            }} />
            <br />
            <div>Table Export:</div>
            <SvgButton label="TSV Text Format"
              onClick={() => {
                var exportText = [Object.keys(branchesData[0]).join("\t")]
                for (var i in branchesData) {
                  exportText.push(Object.values(branchesData[i]).join("\t"))
                }
                download(exportText.join("\n"), "export.tsv", "text")
              }}
            />
          </div>
        } />
      </div>

      {/* split pane drag */}
      <SplitPane split="horizontal" defaultSize={"50%"} onChange={
        (drag) => {
          dragRef.current = drag
          if (!dragCheck) {
            setDragCheck(true)
            setTimeout(function() {
              setDragCheck(false)
              updateDrag()
            }, 1000);
          }
        }
      }>

       {/* phylocanvas component */}
        <Phylocanvas
          nwk={nwk}
          height={phyloHeight}
          branchNameCallback={branchNameCallback}
          branchesData={branchesData}
          metadataLabels={metadataLabels}
          importSelection={importPhylocanvasSelection}
          exportPhylocanvasSelectionCallback={exportPhylocanvasSelectionCallback}
          getTree={getTree}
          triggerCanvasCallback={getImage}
          exportCanvasCallback={exportCanvasCallback}
        />

        {/* handsontable component */}
        <div>
          <button onClick={() => { setUploadScreen(!uploadScreen) }}>Upload</button>
          <SelectionHOT
            label="Metadata:"
            data={branchesData}
            view="readonly"
            height={hotHeight}
            importSelection={importTableSelection}
            exportTableSelectionCallback={exportTableSelectionCallback}
          />

        </div>
      </SplitPane>
    </div >
  )
}

export default PhylocanvasView;
