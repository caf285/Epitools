import React, { useState, useRef, useEffect } from "react";

import SvgButton from "../svgButton/SvgButton.js";
import Phylocanvas from "../phylocanvas/Phylocanvas.js";
import SelectionHOT from "../handsontable/SelectionHOT.js";
import SplitPane from "react-split-pane";
import UploadScreen from "../uploadScreen/uploadScreen"
import './style.css'

function PhylocanvasView() {
  const [tree, setTree] = useState("(A:1)B;")
  const [branches, setBranches] = useState([])
  const [branchesData, setBranchesData] = useState([])
  const [phyloHeight, setPhyloHeight] = useState(["300"])
  const [hotHeight, setHOTHeight] = useState(["300"])
  const branchesRef = useRef([])
  const branchesDataRef = useRef([])
  const [importPhylocanvasSelection, setImportPhylocanvasSelection] = useState([])
  const [importTableSelection, setImportTableSelection] = useState([])
  const elementRef = useRef(null);
  const [uploadScreen, setUploadScreen] = useState(false)

  const host = useRef("https://pathogen-intelligence.tgen.org/go_epitools/")

  useEffect(() => {
    setHOTHeight(JSON.stringify(Math.floor(elementRef.current?.clientHeight / 2)))
    setPhyloHeight(Math.floor(elementRef.current?.clientHeight / 2))
  }, [])

  useEffect(() => {
    branchesRef.current = branches
    //console.log(branchesRef.current)
    mysqlRequest(branchesRef.current)
  }, [branches])

  useEffect(() => {
    branchesDataRef.current = branchesData
    //console.log("branchesData:", branchesData)
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
    //console.log("requestData:", data)
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
      .then(data => setTree(data))
      .catch(ERR => window.alert(ERR))
  }

  // lineage
  async function lineageRequest(data = "") {
    //const response = await fetch("/go-epitools/neighborjoin", {
    await fetch(host.current + "lineage", {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        lineage: data,
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
          setTree(data)
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
        setTree(reader.current.result)
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


  return (
    <div style={{ height: "100%" }} ref={elementRef}>
      {uploadScreen && <UploadScreen setData={(e) => { setBranchesData(e) }} setDisplay={(e) => { setUploadScreen(e) }}></UploadScreen>}
      <input type="file" ref={fileInput} onChange={handleFileInput} hidden />
        <div style={{ position: "absolute", display: "flex", flexFlow: "row"}}>
        <SvgButton onClick={e => fileInput.current.click()} label="upload txt" drop={true} />
        <SvgButton label="load covid lineage" drop={
          <div>
          <SvgButton onClick={e => lineageRequest("BG.2")} label="BG.2" />
          <SvgButton onClick={e => lineageRequest("BA.2")} label="BA.2" />
          <SvgButton onClick={e => lineageRequest("BA.2.18")} label="BA.2.18" />
          <SvgButton onClick={e => lineageRequest("BA.2.12.1")} label="BA.2.12.1" />
          <SvgButton onClick={e => lineageRequest("BA.2.3")} label="BA.2.3" />
          <SvgButton onClick={e => lineageRequest("BA.2.9")} label="BA.2.9" />
          <SvgButton onClick={e => lineageRequest("BA.4")} label="BA.4" />
          <SvgButton onClick={e => lineageRequest("BA.4.1")} label="BA.4.1" />
          <SvgButton onClick={e => lineageRequest("BA.5")} label="BA.5" />
          <SvgButton onClick={e => lineageRequest("BA.5.1")} label="BA.5.1" />
          <SvgButton onClick={e => lineageRequest("BA.5.2.1")} label="BA.5.2.1" />
          <SvgButton onClick={e => lineageRequest("BA.5.5")} label="BA.5.5" />
          <SvgButton onClick={e => lineageRequest("BG.2")} label="BG.2" />
          </div>
        } />
        </div>
      <SplitPane split="horizontal" defaultSize={"50%"} onChange={(drag) => {
        setPhyloHeight(drag);
        setHOTHeight(JSON.stringify(calculateBottomPaneHeight(drag)));
      }}>
        <Phylocanvas
          tree={tree}
          height={phyloHeight}
          branchNameCallback={branchNameCallback}
          branchesData={branchesData}
          importSelection={importPhylocanvasSelection}
          exportPhylocanvasSelectionCallback={exportPhylocanvasSelectionCallback}
        />
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
