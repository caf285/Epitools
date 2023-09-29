// TODO: hook up props.pathogenList and props.searchParams ... replace props.pathogen

import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Epitools.css";
import "./style.css";

import SplitPane from "react-split-pane";
import Phylocanvas from "../phylocanvas/Phylocanvas.js";
import SelectionHOT from "../handsontable/SelectionHOT.js";
import TableUpload from "./TableUpload.js";
import InfoButton from "../infoButton/InfoButton.js";
import SvgButton from "../svgButton/SvgButton.js";
import ReactLoading from "react-loading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ColorScheme from "../colorScheme/ColorScheme.js";

// mui
import Box from '@mui/material/Box';
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

function Epitools(props) {
  //====================================================================================================( set variables )
  // destructure props
  const pathogenList = props.pathogenList
  const searchParams = props.searchParams
  const setSearchParams = props.setSearchParams

  // phylocanvas
  const [nwk, setNwk] = useState("(A:1)B;")
  const fastaRef = useRef("");
  const uploadHistoryNodeRef = useRef([]);
  const [treeUpload, setTreeUpload] = useState(false)
  const [tableUpload, setTableUpload] = useState(false)

  const [phylocanvasLeafNames, setPhylocanvasLeafNames] = useState([])
  const [phyloHeight, setPhyloHeight] = useState(["300"])
  const [metadataLabels, setMetadataLabels] = useState([])
  const [importPhylocanvasSelection, setImportPhylocanvasSelection] = useState([])
  const [getNwk, setGetNwk] = useState(() => () => {})
  const [getCanvas, setGetCanvas] = useState(() => () => {})
  const [getCluster, setGetCluster] = useState(() => () => {return []})
  const [mutationsJson, setMutationsJson] = useState()
  const [updateTable, setUpdateTable] = useState(false)

  // handsontable
  const elementRef = useRef(null);
  const [importTableSelection, setImportTableSelection] = useState([])

  // both
  const [sampleSelection, setSampleSelection] = useState([])
  const [highlightRadio, setHighlightRadio] = useState("Cluster")
  const [additionalHighlight, setAdditionalHighlight] = useState("")
  const [additionalHighlightForms, setAdditionalHighlightForms] = useState([])
  const [colorGroup, setColorGroup] = useState([])
  const [colorContext, setColorContext] = useState([])
  const [clusterDistance, setClusterDistance] = useState(2)
  const [clusterSize, setClusterSize] = useState(2)
  const [highlightDateGranularity, setHighlightDateGranularity] = useState(0)
  const highlightDateGranularityRef = useRef(0)
  function _setHighlightDateGranularity(newValue) {
    highlightDateGranularityRef.current = newValue
    setHighlightDateGranularity(newValue)
  }
  const [highlightList, setHighlightList] = useState([]) // obj used for coloring sample in each group; {group: [sample, ...], ...}
  const [branchesData, setBranchesData] = useState([]) // will be filled with complete table
  const branchesDataRef = useRef([])
  const [pathogen, setPathogen] = useState()
  const [pathogenType, setPathogenType] = useState();
  const [pathogenTypeDisplay, setPathogenTypeDisplay] = useState("none");
  const [queryType, setQueryType] = useState("lineage");
  const maxHistory = 10
  const [historyLabel, setHistoryLabel] = useState("")
  const historyLabelRef = useRef("")
  function _setHistoryLabel(newValue) {
    historyLabelRef.current = newValue
    setHistoryLabel(newValue)
  }
  const [historyList, setHistoryList] = useState([]);
  const uploadFasta = useRef("")
  const [showLegend, setShowLegend] = useState(true)
  const [legendTextSize, setLegendTextSize] = useState(10)

  // pathogen lineage
  const [pathogenDateRange, setPathogenDateRange] = useState([new Date("06/01/2019"), new Date()])
  const [pathogenDateRangeForms, setPathogenDateRangeForms] = useState("")

  // other
  const [colorScheme, setColorScheme] = useState()
  const [loadingScreenVisibility, setLoadingScreenVisibility] = useState("hidden")
  const [tableUploadFormVisibility, setTableUploadFormVisibility] = useState("hidden")
  const [tableUploadFileName, setTableUploadFileName] = useState("")
  const [tableUploadFileText, setTableUploadFileText] = useState("")
  const [tablePrimaryColumn, setTablePrimaryColumn] = useState(0)
  const [metadataForms, setMetadataForms] = useState("")
  const host = useRef("https://pathogen-intelligence.tgen.org/go_epitools/")

  //====================================================================================================( callbacks )
  const formatDate = useCallback((date) => {
    let newYear = date.toLocaleString("default", { year: "numeric" })
    let newMonth = date.toLocaleString("default", { month: "2-digit" })
    let newDay = date.toLocaleString("default", { day: "2-digit" })
    return newYear + "-" + newMonth + "-" + newDay
  })

  const formatUTCDate = useCallback((date) => {
    let newYear = date.toLocaleString("default", { timeZone: "UTC", year: "numeric" })
    let newMonth = date.toLocaleString("default", { timeZone: "UTC", month: "2-digit" })
    let newDay = date.toLocaleString("default", { timeZone: "UTC", day: "2-digit" })
    return new Date(newMonth + "/" + newDay + "/" + newYear)
  })
 
  //====================================================================================================( initialize variables ) 
  useEffect(() => {
    //console.log(pathogenDateRange)
  }, [pathogenDateRange])

  useEffect(() => {
    //console.log("colorScheme:", colorScheme)
  }, [colorScheme])

  // load pathogen on searchParam change (TODO: TEMPORARY!!! will remove after pathogen dropdown button removed)
  const loadPathogenFromSearchParamsCallback = useCallback(() => {
    if (pathogenList) {
      if (searchParams && searchParams.get("pathogen") && pathogenList.includes(searchParams.get("pathogen"))) {
        setPathogen(searchParams.get("pathogen"))
      }
      if (searchParams && searchParams.get("samples")) {
        _setHistoryLabel("URL samples")
        setUpdateTable(true)
        samplesRequest(searchParams.get("samples").split(",").map(sample => sample.toUpperCase()))
        searchParams.delete("samples")
        setSearchParams(searchParams)
      }
    }
  }, [searchParams, pathogenList])
  useEffect(() => {
    loadPathogenFromSearchParamsCallback()
  }, [searchParams, loadPathogenFromSearchParamsCallback])

  // load pathogen from query parameter if exists and in pathogenList, else load default
  const loadPathogenFromPathogenListCallback = useCallback(() => {
    if (pathogenList && pathogenList.length > 1) {
      if (searchParams && searchParams.get("pathogen") && pathogenList.includes(searchParams.get("pathogen"))) {
        setPathogen(searchParams.get("pathogen"))
      } else {
        if (!pathogenList.includes(pathogen)) {
          //console.log("pathogen:", pathogen)
          setPathogen(pathogenList[0])
          searchParams.set("pathogen", pathogenList[0])
          setSearchParams(searchParams)
        }
      }
    }
  }, [pathogen, searchParams, setSearchParams, pathogenList])
  useEffect(() => {
    loadPathogenFromPathogenListCallback()
  }, [pathogenList, loadPathogenFromPathogenListCallback])

  useEffect(() => {
    if (pathogenType && pathogenType === "virus") {
      setPathogenTypeDisplay("block")
    } else {
      setPathogenTypeDisplay("none")
    }
  }, [pathogenType])

  // import date ranges if applicable and fill pathogen lineage button dropdown on pathogen change
  useEffect(() => {
    if (searchParams) {
      let dmin = pathogenDateRange[0]
      let dmax = pathogenDateRange[1]
      if (searchParams.get("dmin")) {
        if ( !isNaN(new Date(searchParams.get("dmin"))) ) {
          dmin = formatUTCDate(new Date(searchParams.get("dmin")))
        } else {
          //console.log("bad min")
          searchParams.set("dmin", formatDate(pathogenDateRange[0]))
          setSearchParams(searchParams)
        }
      }
      if (searchParams.get("dmax")) {
        if ( !isNaN(new Date(searchParams.get("dmax"))) ) {
          dmax = formatUTCDate(new Date(searchParams.get("dmax")))
        } else {
          //console.log("bad max")
          searchParams.set("dmax", formatDate(pathogenDateRange[1]))
          setSearchParams(searchParams)
        }
      }
      setPathogenDateRange([dmin, dmax])
      setPathogenDateRangeForms("")
      setQueryType("lineage")
      if (pathogen) {
        pathogenDateRangeRequest(pathogen, "lineage", dmin, dmax) // fill pathogen Lineage buttons on load
        pathogenTypeRequest(pathogen)
      }
    }
  }, [pathogen])

  // prep sample selection for build from selection button
  useEffect(() => {
    setSampleSelection(importPhylocanvasSelection)
  }, [importPhylocanvasSelection])
  useEffect(() => {
    setSampleSelection(importTableSelection)
  }, [importTableSelection])

  //====================================================================================================( handle branch selection ) 
  useEffect(() => {
    if (updateTable) {
      setTablePrimaryColumn(0) // resets to default column on DB data load
      mysqlRequest(phylocanvasLeafNames) // request data using leaf names and fill table
    }
    setUpdateTable(false)
  }, [phylocanvasLeafNames])

  useEffect(() => {
    if (mutationsJson) {
      console.log(mutationsJson)
    }
  }, [mutationsJson])

  //====================================================================================================( fill metadata buttons )
  const fillMetadataForms = useCallback(() => {
    let appendMetadataDiv = document.getElementsByClassName("appendMetadataDiv")
    while (appendMetadataDiv.firstChild) {appendMetadataDiv.removeChild(appendMetadataDiv.firstChild)}
    let newMetadataForms = []
    if (branchesData && branchesData.length >= 1) {
      //console.log("branchesData", branchesData)
      newMetadataForms = Object.keys(branchesData[0]).map((branch) =>
        <form key={branch} className="appendMetadataForm">
          <label>{branch}</label>
          <input type="checkbox" onClick={() => appendMetadataHandler()} defaultChecked={false} />
        </form>
      )
      appendMetadataHandler()
    }
    setMetadataForms(newMetadataForms)
  }, [branchesData])

  const fillAdditionalHighlights = useCallback(() => {
    let newAdditionalHighlightForms = []
    if (branchesData && branchesData.length >= 1) {
      setAdditionalHighlight(Object.keys(branchesData[0])[0])
      newAdditionalHighlightForms = Object.keys(branchesData[0]).map(col => {
        return <button key={col} onClick={() => {
          setAdditionalHighlight(col)
          setHighlightRadio(col)
        }}>{col}</button>
      })
      setAdditionalHighlightForms(newAdditionalHighlightForms)
    }
  }, [branchesData])

  useEffect(() => {
    branchesDataRef.current = branchesData
    fillMetadataForms()
    fillAdditionalHighlights()
  }, [branchesData, fillMetadataForms, fillAdditionalHighlights])

  // TODO: cleanup
  const treeInput = useRef(null)
  const tableInput = useRef(null)
  const reader = useRef(new FileReader())

  // get branch names callback
  const branchNameCallback = useCallback((e) => {
    setPhylocanvasLeafNames(e)
  }, [setPhylocanvasLeafNames])

  // get selection list
  const exportPhylocanvasSelectionCallback = useCallback((e) => {
    //console.log("phylocanvas selection:", e)
    setImportTableSelection(e)
  }, [setImportTableSelection])
  const exportTableSelectionCallback = useCallback((e) => {
    //console.log("table selection:", e)
    setImportPhylocanvasSelection(e)
  }, [setImportPhylocanvasSelection])

  const calculateBottomPaneHeight = (topPaneHeight) => {
    return elementRef.current?.clientHeight - topPaneHeight
  }

  //====================================================================================================( database queries )
  // database query type request
  async function pathogenTypeRequest(pathogen) {
    await fetch(host.current + "pathogenType", {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        pathogen: pathogen,
      })
    })
    .then(response => {
      if (response.status >= 400) {
        throw new Error(response.status + " " + response.statusText);
      }
      return response.json()
    })
    .then(data => {
      //console.log("data", data)
      if (data.includes("virus")) {
        setPathogenType("virus")
      } else {
        setPathogenType("")
      }
    })
    .catch(ERR => {
      setPathogenType("")
      window.alert("No pathogen type returned: " + ERR)
    })
  }

  // database query post request
  async function mysqlRequest(data = "") {
    //console.log("requestData:", data)
    setLoadingScreenVisibility("visible")
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
        setLoadingScreenVisibility("hidden")
        if (response.status >= 400) {
          throw new Error(response.status + " " + response.statusText);
        }
        return response.json()
      })
      .then(data => {
        for (let i in data) {
          if (data[i]?.Additional_metadata) {
            let branchObj = JSON.parse(data[i]["Additional_metadata"])
            for (let [k, v] of Object.entries(branchObj)) {
              data[i]["(" + k + ")"] = v
            }
          }
          delete data[i].Additional_metadata
        }
        setBranchesData(data)
      })
      .catch(ERR => window.alert(ERR))
  }

  // neighborjoin post request
  async function neighborJoinRequest(data = "") {
    let fastaFile = data
    //const response = await fetch("/go-epitools/neighborjoin", {
    setLoadingScreenVisibility("visible")
    await fetch(host.current + "neighborjoin", {
      //const response = await fetch("https://pathogen-intelligence.org/go-epitools/neighborjoin", {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        fasta: data,
      })
    })
      .then(response => {
        setLoadingScreenVisibility("hidden")
        if (response.status >= 400) {
          throw new Error(response.status + " " + response.statusText);
        }
        return response.text()
      })
      // uploadFasta = new fasta
      .then(data => {
        setNwk(data)
      })
      .catch(ERR => window.alert(ERR))
  }

  // pathogen lineage request
  async function pathogenLineageRequest(pathogen=pathogen, queryType=queryType, data="", date1=pathogenDateRange[0], date2=pathogenDateRange[1]) {
    //console.log("data", data)
    setLoadingScreenVisibility("visible")
    await fetch(host.current + "query_type", {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        pathogen: pathogen,
        queryType: queryType,
        data: data,
        date1: date1,
        date2: date2,
      })
    })
      .then(response => {
        setLoadingScreenVisibility("hidden")
        if (response.status >= 400) {
          throw new Error(response.status + " " + response.statusText);
        }
        return response.text()
      })
      .then(data => {
        if (data) {
          uploadFasta.current = ""
          setNwk(data)
        } else {
          console.log("no data")
        }
      })
      .catch(ERR => window.alert(ERR))
  }

  // request Augur Ancestral
  async function mutationsRequest(nwk = "", samples = [], url = "mutations") {
    //console.log("nwk", nwk)
    //console.log("samples", samples)
    setLoadingScreenVisibility("visible")
    await fetch(host.current + url, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        nwk: nwk,
        samples: samples,
      })
    })
      .then(response => {
        setLoadingScreenVisibility("hidden")
        if (response.status >= 400) {
          throw new Error(response.status + " " + response.statusText);
        }
        return response.json()
      })
      .then(data => {
        if (data) {
          setMutationsJson(data)
        } else {
          console.log("no data")
        }
      })
      .catch(ERR => window.alert(ERR))
  }

  // rebuild tree from selected samples
  async function samplesRequest(data = "", url = "samples") {
    //console.log("data", data)
    console.log(data)
    if (fastaRef.current !== "") {
      console.log(fastaRef.current.length)  // fasta file
      console.log(data) // selected samples
      console.log(branchesData) // entire table

      /* TODO!!!
        `data` should be a list of selected sample names.

        If `fastaRef.current` !== "", then it should be filled with the most current uploaded fasta.

        Use `data` to parse `fastaRef.current` and remove all fasta samples not in selection. Pass the altered fasta file to `neighborJoin(newFasta)` to build the new tree.

        Use `data` to parse `branchesData` removing all lines not in the selection. Pass new branchesData to handsontable with `setBranchesData(newBranchesData)`.

      */
      _setHistoryLabel(historyLabelRef.current + " (" + data.length + ")")
    } else {
      _setHistoryLabel(historyLabelRef.current + " (" + data.length + ")")
      setLoadingScreenVisibility("visible")
      await fetch(host.current + url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          query: data,
        })
      })
      .then(response => {
        setLoadingScreenVisibility("hidden")
        if (response.status >= 400) {
          throw new Error(response.status + " " + response.statusText);
        }
        return response.text()
      })
      .then(data => {
        if (data) {
          // uploadFasta = new fasta
          setNwk(data)
        } else {
          console.log("no data")
        }
      })
      .catch(ERR => window.alert(ERR))
    }
  }

  // pathogen date range query
  async function pathogenDateRangeRequest(pathogen, queryType, date1, date2, url = "dateRange") {
    //console.log(pathogen, date1, date2)
    await fetch(host.current + url, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        pathogen: pathogen,
        queryType: queryType,
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
    .then((data) => {
      if (data) {
        //console.log("data:", data)
        updatePathogenDateRangeForms(data, queryType, date1, date2)
      } else {
        setPathogenDateRangeForms([])
        console.log("no data")
      }
    })
    .catch(ERR => window.alert(ERR))
  }

  //====================================================================================================( import/export )
  // file i/o
  const handleTreeInput = (e) => {
    let file = e.target.files[0]
    reader.current.readAsText(file)
    reader.current.onloadend = () => {
      // if NWK
      if (file.name.toLowerCase().endsWith(".nwk")) {
        setNwk(reader.current.result)
        uploadFasta.current = ""
      }
      // if FASTA
      else if (file.name.toLowerCase().endsWith(".fasta")) {
        let fastaFile = reader.current.result
        uploadFasta.current = fastaFile
        neighborJoinRequest(fastaFile);
        setTreeUpload(true)
        fastaRef.current = fastaFile
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
        let fastaFile = []
        for (let i = 1; i < header.length; i++) {
          fastaFile.push(">" + header[i])
          fastaFile.push(fastaObj[header[i]].join(""))
        }
        fastaFile = fastaFile.join("\n")
        uploadFasta.current = fastaFile
        neighborJoinRequest(fastaFile);
        setTreeUpload(true)
        fastaRef.current = fastaFile
      }
    }
    // reset for same file upload
    e.target.value = ""
  }

  const handleTableInput = (e) => {
    let file = e.target.files[0]
    setTableUploadFileName(file.name)
    reader.current.readAsText(file)
    reader.current.onloadend = () => {
      // if TSV
      if (file.name.toLowerCase().endsWith(".tsv")) {
        setTableUploadFormVisibility("visible")
        let tsv = reader.current.result.split("\n").map((x) => { return x.split("\t") })
        setTableUploadFileText(tsv)
      }
      // if CSV
      else if (file.name.toLowerCase().endsWith(".csv")) {
        setTableUploadFormVisibility("visible")
        let csv = reader.current.result.split("\n").map((x) => { return x.split(",") })
        setTableUploadFileText(csv)
      }
    }
    // reset for same file upload
    e.target.value = ""
  }

  // text file downloader
  function downloadText(text, tag, type = "text") {
    let a = document.createElement('a');
    let file = URL.createObjectURL(new Blob([text], {type: type}));
    a.href = file;
    a.setAttribute('download', historyLabelRef.current ? historyLabelRef.current.replace(/\W/g, '_') + tag : "export" + tag);
    document.body.appendChild(a);
    a.click()
    a.parentNode.removeChild(a);
  }

  // image file downloader
  function downloadImage(imageType) {
    let a = document.createElement('a');
    let srcCanvas = getCanvas();
    let bgCanvas = document.createElement("canvas"); // create and fill dummy canvas
    bgCanvas.width = srcCanvas.width;
    bgCanvas.height = srcCanvas.height;
    let bgCtx = bgCanvas.getContext('2d');
    if (imageType.toLowerCase() === "jpeg") { // only paint white background if jpeg export
      bgCtx.fillStyle = "#FFFFFF";
      bgCtx.fillRect(0,0,srcCanvas.width,srcCanvas.height);
    }
    bgCtx.drawImage(srcCanvas, 0, 0); // draw phylocanvas to dummy canvas and export
    a.href = bgCanvas.toDataURL("image/" + imageType);
    a.setAttribute('download',  historyLabelRef.current ? historyLabelRef.current.replace(/\W/g, '_') : "export");
    document.body.appendChild(a);
    a.click()
    a.parentNode.removeChild(a);
  }

  //====================================================================================================( button drivers )
  // append metadata to phylocanvas
  function appendMetadataHandler() {
    let checked = []
    for (let e of [...document.getElementsByClassName("appendMetadataForm")].filter(x => x.childNodes[1].checked)) {
      checked.push(e.childNodes[0].innerHTML)
    }
    //console.log(checked)
    setMetadataLabels(checked)
    //console.log(metadataLabels)
  }

  // date range for adjusting pathogen buttons
  const handleMinDatePicker = (date) => {
    props.searchParams.set("dmin", formatDate(date))
    props.setSearchParams(props.searchParams)
    setPathogenDateRange([date, pathogenDateRange[1]])
    pathogenDateRangeRequest(pathogen, queryType, date, pathogenDateRange[1])
  }

  const handleMaxDatePicker = (date) => {
    props.searchParams.set("dmax", formatDate(date))
    props.setSearchParams(props.searchParams)
    setPathogenDateRange([pathogenDateRange[0], date])
    pathogenDateRangeRequest(pathogen, queryType, pathogenDateRange[0], date)
  }

  // sort array or maps by 'Lineage'
  function sortForms(data) {
    data = data.sort((a, b) => {return a.QueryType > b.QueryType})
    return data
  }

  function updatePathogenDateRangeForms(data, queryType, date1=pathogenDateRange[0], date2=pathogenDateRange[1]) {
    let newDateRangeForms = []
    if (data) {
      data = sortForms(data)
      newDateRangeForms = data.filter(x => x.Count >= 4 && x.QueryType).map((v, k) => {return <button key={k} onClick={() => {
        setTreeUpload(false)
        setTableUpload(false)
        setUpdateTable(true)
        fastaRef.current = ""
        _setHistoryLabel(queryType + ": " + v["QueryType"] + ", count: " + v["Count"])
        pathogenLineageRequest(pathogen, queryType, v["QueryType"], date1, date2)
      }}>{v["QueryType"]} ({v["Count"]})</button>})
    }
    setPathogenDateRangeForms(newDateRangeForms)
  };

  function handleCopyLink(samples = false) {
    let href = window.location.origin + window.location.pathname
    let search = []
    searchParams.forEach((v, k) => {if (k !== "samples") {search.push(k + "=" + v)}})
    if (samples) {
      search.push("samples=" + samples)
    }
    href += "?" + search.map(v => v.split(" ").join("+")).join("&")
    if (window.location.hostname === "localhost" || window.location.protocol === "http:") {
      alert("Cannot copy to 'navigator.clipboard' with unsecure http: " + href)
    } else {
      navigator.clipboard.writeText(href)
      alert("Copied link to clipboard: " + href)
    }
  }

  function handleQueryTypeChange(newQueryType) {
    setQueryType(newQueryType)
    pathogenDateRangeRequest(pathogen, newQueryType, pathogenDateRange[0], pathogenDateRange[1])
  }

  // set highlightList on highlightRadio change
  const handleHighlightRadioChange = useCallback(() => {
    if (highlightRadio) {
      //console.log(highlightRadio)
      if (highlightRadio === "Cluster") {
        let cluster = getCluster()
        //console.log("cluster", cluster)
        if (cluster) {
          setColorGroup(cluster)
          setColorContext(Object.keys(cluster).map((key) => {return "group_" + key}))
        }
      } else if (branchesData && branchesData.length >= 1 && Object.keys(branchesData[0]).includes(highlightRadio)) {
        let highlightGroup = {}
        for (let line of branchesData) {
          if (highlightRadio === "Collection_date") {
            if (line[highlightRadio] !== undefined) {
              let highlightParseDate = new Date(line[highlightRadio])
              let highlightDate = []
              // build date to YYYY-MM-DD format and reduce by granulatiry
              if (highlightDateGranularityRef.current >= 0) {highlightDate.push(highlightParseDate.getUTCFullYear())}
              if (highlightDateGranularityRef.current >= 1) {highlightDate.push(highlightParseDate.getUTCMonth() + 1)}
              if (highlightDateGranularityRef.current >= 2) {highlightDate.push(highlightParseDate.getUTCDate())}
              //highlightDate = line[highlightRadio].split("-").slice(0, highlightDateGranularityRef.current + 1).join("-")
              highlightDate = highlightDate.join("-")
              if (!Object.keys(highlightGroup).includes(highlightDate)) {
                highlightGroup[highlightDate] = []
              }
              highlightGroup[highlightDate].push(Object.values(line)[tablePrimaryColumn])
            }
          } else {
            if (!Object.keys(highlightGroup).includes(line[highlightRadio])) {
              highlightGroup[line[highlightRadio]] = []
            }
            if (Object.values(line)[tablePrimaryColumn] !== undefined) {
              highlightGroup[line[highlightRadio]].push(Object.values(line)[tablePrimaryColumn])
            }
          }
        }
        setColorGroup(Object.values(highlightGroup))
        setColorContext(Object.keys(highlightGroup))
      } else {
        setColorGroup([])
        setColorContext([])
      }
    }
  }, [highlightRadio, highlightDateGranularity, branchesData])
  useEffect(() => {
    handleHighlightRadioChange()
  }, [highlightRadio, handleHighlightRadioChange])

  const addUploadHistory = useCallback(() => {
    if (getCanvas() !== undefined) {
      let newFasta = fastaRef.current
      uploadHistoryNodeRef.current = [
        <div className="historyComponent" onClick={() => {setTreeUpload(true); setTableUpload(true); neighborJoinRequest(fastaRef.current); _setHistoryLabel(historyLabel); setBranchesData(branchesData); fastaRef.current = newFasta}}>
          <div>{historyLabelRef.current}</div>
          <img src={getCanvas().toDataURL("image/png")} height="100" width="300"></img>
        </div>
      ]
    }
    console.log(uploadHistoryNodeRef.current, treeUpload, tableUpload)
    if (uploadHistoryNodeRef.current !== [] && treeUpload && tableUpload) {
      setTreeUpload(false)
      setTableUpload(false)
      setHistoryList(uploadHistoryNodeRef.current.concat(historyList).slice(0, maxHistory))
    }
  }, [treeUpload, tableUpload])

  // push new PhylocanvasHistory object to history
  const addHistory = useCallback((image, nwk) => {
    if (historyLabelRef.current && fastaRef.current === "") {
      
      uploadHistoryNodeRef.current = []
      setHistoryList(
        [   
          <div className="historyComponent" onClick={() => {setUpdateTable(true); _setHistoryLabel(historyLabel); setNwk(nwk); fastaRef.current = ""}}>
            <div>{historyLabelRef.current}</div>
            <img src={image} height="100" width="300"></img>
          </div> 
  
        ].concat(historyList).slice(0, maxHistory)
      )   
    } else {
      addUploadHistory()
    }   
  })

  useEffect(() => {
    if (tableUpload) {
      addUploadHistory()
    }
  }, [tableUpload])

  //====================================================================================================( return )
  return (
    <div style={{ position: "relative", height: "100%" }} ref={elementRef}>
      {/* data components */}
      <ColorScheme
        setColorScheme={setColorScheme}
      />

      {/* loading splash screen */}
      <div style={{ visibility: loadingScreenVisibility }}>
        <div style={{ position: "absolute", height: "100%", width: "100%", backgroundColor: "rgba(255, 255, 255, 0.75)", zIndex: "1000" }}></div>
        <div style={{ position: "absolute", left: "50%", top: "50%", zIndex: "1000" }}>
          <div style={{ position: "relative", left: "-25px", top: "-25px" }}>
            <ReactLoading type="spin" color="#0000FF" height={50} width={50} />
          </div>
        </div>
      </div>

      {/* file upload window component */}
      <TableUpload
        primaryColumn={tablePrimaryColumn}
        setPrimaryColumn={setTablePrimaryColumn}
        setHistoryLabel={_setHistoryLabel}
        fileName={tableUploadFileName}
        fileText={tableUploadFileText}
        visibility={tableUploadFormVisibility}
        setVisibility={setTableUploadFormVisibility}
        importData={setBranchesData}
        setTableUpload={setTableUpload}
      />

      {/* buttons */}
      <div style={{ position: "relative"}}>
        <div style={{ position: "absolute", display: "flex", flexFlow: "row"}}>

          {/*========== Hamburger ==========*/}
          <SvgButton svg="menuSettings" drop={
            <div>

              {/* append metadata buttons */}
              <SvgButton label="append metadata" drop={
                <Box sx={{ paddingLeft: "15px", paddingRight: "15px" }}>
                  <div className="appendMetadataDiv">
                    {metadataForms}
                  </div>
                </Box>
              } />

              {/* build new phylocanvas and table from current selection */}
              <SvgButton onClick={() => {
                setUpdateTable(true)
                samplesRequest(sampleSelection)
              }} label="build from selection" />

              {/* augments tree with mutations  */}
              <SvgButton onClick={() => {mutationsRequest(nwk, phylocanvasLeafNames)}} label="get mutations" />

              <br/>

              {/* initialize phylocanvas file upload */}
              <SvgButton label="import data" drop={
                <div>
                  <div>Tree Import:</div>
                  <input type="file" ref={treeInput} onChange={handleTreeInput} hidden />
                  <SvgButton onClick={e => treeInput.current.click()} label="NWK Tree Format" drop={true} />
                  <SvgButton onClick={e => treeInput.current.click()} label="FASTA Alignment Format" drop={true} />
                  <SvgButton onClick={e => treeInput.current.click()} label="TSV NASP Matrix Format" drop={true} />
                  <br />
                  <div>Table Import</div>
                  <input type="file" ref={tableInput} onChange={handleTableInput} hidden />
                  <SvgButton onClick={e => tableInput.current.click()} label="TSV Text Format" drop={true} />
                  <SvgButton onClick={e => tableInput.current.click()} label="CSV Text Format" drop={true} />
                </div>
              } />

              {/* export buttons */}
              <SvgButton label="export data" drop={
                <div>
                  <div>Tree Export:</div>
                  <SvgButton label="PNG Image Format" onClick={() => {downloadImage("png")}} />
                  <SvgButton label="JPEG Image Format" onClick={() => {downloadImage("jpeg")}} />
                  <SvgButton label="NWK Text Format" onClick={() => {downloadText(getNwk(), ".nwk")}} />
                  <br />
                  <div>Table Export:</div>
                  <SvgButton label="TSV Text Format"
                    onClick={() => {
                      var exportText = [Object.keys(branchesData[0]).join("\t")]
                      for (var i in branchesData) {
                        exportText.push(Object.values(branchesData[i]).join("\t"))
                      }
                      downloadText(exportText.join("\n"), ".tsv", "text")
                    }}
                  />
                  <br />
                  <div>Link Export:</div>
                  <SvgButton label="Copy Link" onClick={() => {handleCopyLink()}} />
                  <SvgButton label="Copy Link with Sample Names" onClick={() => {handleCopyLink(branchesData.map(sample => sample.Sample).join(","))}} />
                </div>
              } />

            </div>
          } />

          {/*========== highlight selection ==========*/}
          
          <SvgButton label="highlight" drop={
            <div>
              <h5>Legend:</h5>
              <Box sx={{ paddingLeft: "15px", paddingRight: "15px" }}>
                <div>toggle display: <Switch checked={showLegend} onChange={() => {setShowLegend(!showLegend)}} /></div>
              </Box>
              <Box sx={{ paddingLeft: "15px", paddingRight: "15px" }}> 
                <span>text size: <b>{legendTextSize}</b>px</span>
                <Slider value={legendTextSize} min={5} max={20} size="small" onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === 'number') {
                    setLegendTextSize(newValue);
                  }   
                }} />
              </Box>
              <hr/>
              <h5>Highlight Selection:</h5>
              <FormControl sx={{ paddingLeft: "15px", paddingRight: "15px", width: "100%" }}>
                <RadioGroup value={highlightRadio} onChange={(e) => {setHighlightRadio(e.target.value)}}>
                  <div style={{ display: "flex", flexFlow: "row", alignItems: "center" }}><FormControlLabel value="Cluster" control={<Radio size="small" />} /><h6>Cluster Detection</h6></div>
                  <Box sx={{ paddingLeft: "15px" }}>
                    <div style={{ display: "flex", flexFlow: "row", justifyContent: "space-between" }}>
                      <span>cluster distance {"<="} <b>{clusterDistance}</b> SNPs</span>
                      <InfoButton text="cluster distance sets a maximum snp distance between samples to be considered a cluster" />
                    </div>
                    <Slider value={clusterDistance} min={1} max={20} size="small" onChange={(event: Event, newValue: number | number[]) => {
                      if (typeof newValue === "number") {
                        setClusterDistance(newValue)
                        if (highlightRadio === "Cluster") {
                          handleHighlightRadioChange()
                        }
                      }
                    }} />
                    <div style={{ display: "flex", flexFlow: "row", justifyContent: "space-between" }}>
                      <span>cluster size {">="} <b>{clusterSize}</b> samples</span>
                      <InfoButton text="cluster size sets the minimum amount of samples in a group to be considered a cluster" />
                    </div>
                    <Slider value={clusterSize} min={1} max={20} size="small" onChange={(event: Event, newValue: number | number[]) => {
                      if (typeof newValue === "number") {
                        setClusterSize(newValue)
                        if (highlightRadio === "Cluster") {
                          handleHighlightRadioChange()
                        }
                      }
                    }} />
                  </Box>
                  <div style={{ display: "flex", flexFlow: "row", alignItems: "center" }}><FormControlLabel value="Lineage" control={<Radio size="small" />} /><h6>Lineage</h6></div>
                  <div style={{ display: "flex", flexFlow: "row", alignItems: "center" }}><FormControlLabel value="Facility" control={<Radio size="small" />} /><h6>Facility</h6></div>
                  <div style={{ display: "flex", flexFlow: "row", alignItems: "center" }}><FormControlLabel value="Geographic_location" control={<Radio size="small" />} /><h6>Geographic Location</h6></div>
                  <div style={{ display: "flex", flexFlow: "row", alignItems: "center" }}><FormControlLabel value="Collection_date" control={<Radio size="small" />} /><h6>Collection Date</h6></div>
                  <Box sx={{ paddingLeft: "15px" }}>
                   <div style={{ display: "flex", flexFlow: "row", justifyContent: "space-between" }}>
                      <span>date highlight: <b>{["year", "month", "day"][highlightDateGranularity]}</b></span>
                      <InfoButton text="collection date granularity highlights based on year, month, or day" />
                    </div>
                    <Slider value={highlightDateGranularity} min={0} max={2} size="small" onChange={(event: Event, newValue: number | number[]) => {
                      if (typeof newValue === "number") {
                        _setHighlightDateGranularity(newValue)
                        if (highlightRadio === "Collection_date") {
                          handleHighlightRadioChange()
                        }
                      }
                    }} /> 
                  </Box>
                  <div style={{ display: "flex", flexFlow: "row", alignItems: "center" }}><FormControlLabel value={additionalHighlight} control={<Radio size="small" />} /><h6>{additionalHighlight}</h6></div>
                </RadioGroup>
              </FormControl>
              <Box sx={{ paddingLeft: "15px", paddingRight: "15px", display: "flex", flexFlow: "column" }}>{additionalHighlightForms}</Box>
            </div>
          } />

          {/*========== pathogenlineage loader ==========*/}
          <SvgButton label={"load " + (pathogen ? pathogen : "pathogen") + " " + (queryType ? queryType : "query type")} drop={
            <div style={{ display: "flex", flexFlow: "column" }}>
              <Box sx={{ paddingLeft: "7px", paddingRight: "7px" }}>
                <div style={{ display: "flex", flexFlow: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h5>Date Range:</h5>
                  <InfoButton
                    text={"select a date range to populate " + (pathogen ? pathogen : "pathogen") + " " + (queryType ? queryType : "query type") + " selection"}
                  />
                </div>
                <div style={{ display: "flex", flexFlow: "row" }}>
                  <DatePicker
                    className="EpitoolsDatePicker"
                    dateFormat="MMMM d, yyyy"
                    selected={pathogenDateRange[0]}
                    onChange={handleMinDatePicker}
                  />
                  <div>..</div>
                  <DatePicker
                    className="EpitoolsDatePicker"
                    dateFormat="MMMM d, yyyy"
                    selected={pathogenDateRange[1]}
                    onChange={handleMaxDatePicker}
                  />
                </div>
                <div style={{ display: pathogenTypeDisplay }}>
                  <hr/>
                  <div style={{ display: "flex", flexFlow: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h5>Query Type Selection:</h5>
                    <InfoButton
                      text={"select a query type to populate selection list"}
                    />
                  </div>
                  <SvgButton zIndex={"0"} label={queryType} drop={
                    <div>
                      <SvgButton label="lineage" onClick={() => handleQueryTypeChange("lineage")} />
                      <SvgButton label="facility" onClick={() => handleQueryTypeChange("facility")} />
                      <SvgButton label="geographic_location" onClick={() => handleQueryTypeChange("geographic_location")} />
                    </div>
                  } />
                </div>
                <hr/>
                <div style={{ display: "flex", flexFlow: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h5>{(queryType ? queryType.charAt(0).toUpperCase().concat(queryType.slice(1)) : "Query Type") + " Selection:"}</h5>
                  <InfoButton
                    text={"select a " + (queryType ? queryType : "query type") + " to display a tree and table for that " + (queryType ? queryType : "query type")}
                  />
                </div>
              </Box>
              <Box sx={{ paddingLeft: "15px", paddingRight: "15px" }}>
                <div style={{ display: "flex", flexFlow: "column" }}>
                  {pathogenDateRangeForms}
                </div>
              </Box>
            </div>
          } />
          <SvgButton label="history" drop={
            <div>
              {historyList}
            </div>
          } />

        </div>
      </div>

      {/* split pane drag */}
      <SplitPane split="horizontal" defaultSize={"50%"} style={{overflow: "hidden"}} pane1Style={{zIndex: 1, minHeight: "10%", maxHeight: "90%" }} pane2Style={{zIndex: 0, overflow: "hidden"}}  minSize={50} onDragFinished={
        (drag) => {
          setPhyloHeight(drag);
        }
      }>

       {/* phylocanvas component */}
        <Phylocanvas
          nwk={nwk}
          setNwk={setNwk}
          height={phyloHeight}
          clusterSize={clusterSize}
          clusterDistance={clusterDistance}
          branchNameCallback={branchNameCallback}
          branchesData={branchesData}
          metadataLabels={metadataLabels}
          importSelection={importPhylocanvasSelection}
          exportPhylocanvasSelectionCallback={exportPhylocanvasSelectionCallback}
          setGetNwk={setGetNwk}
          canvas={getCanvas()}
          setGetCanvas={setGetCanvas}
          setGetCluster={setGetCluster}
          primaryColumn={tablePrimaryColumn}
          colorScheme={colorScheme}
          colorGroup={colorGroup}
          colorContext={colorContext}
          addHistory={addHistory}
          historyLabel={historyLabelRef.current}
          showLegend={showLegend}
          legendTextSize={legendTextSize}
          handleHighlightRadioChange={handleHighlightRadioChange}
        />

        {/* handsontable component */}
        <SelectionHOT
          label="Metadata:"
          data={branchesData}
          view="readonly"
          importSelection={importTableSelection}
          exportTableSelectionCallback={exportTableSelectionCallback}
          primaryColumn={tablePrimaryColumn}
          colorScheme={colorScheme}
          colorGroup={colorGroup}
        />

      </SplitPane>
    </div >
  )
}

export default Epitools;
