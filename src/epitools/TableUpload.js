import React, { useEffect, useState, useCallback } from "react";
import "./TableUpload.css";

import SvgButton from "../svgButton/SvgButton.js";
import Switch from '@mui/material/Switch';
import Handsontable from '../handsontable/Handsontable.js';
import 'handsontable/dist/handsontable.full.css';

// mui
import Box from "@mui/material/Box";

function TableUpload(props) {
  // destructure props
  const fileText = props.fileText
  const primaryColumn = props.primaryColumn
  const setPrimaryColumn = props.setPrimaryColumn

  const [contextLabel, setContextLabel] = useState("")
  const [data, setData] = useState([[]])
  const [header, setHeader] = useState([])
  const [headerSwitch, setHeaderSwitch] = useState(true)
  const [primaryColumnLabel, setPrimaryColumnLabel] = useState("")
  const [primaryColumnList, setPrimaryColumnList] = useState([])

  function getTable() {
    let newTable = []

    for (let i in data) {
      let newLine = {}
      for (let j in data[i]) {
        if (headerSwitch) {
          newLine[header[j]] = data[i][j]
        } else {
          newLine[j] = data[i][j]
        }
      }
      newTable.push(newLine)
    }
    return newTable
  }

  // set history label on fileName change
  useEffect(() => {
    setContextLabel(props.fileName)
  }, [props.fileName])

  // initialize primaryColumnList, primaryColumn, and primaryColumnLabel on file upload
  const initializePrimaryColumnCallback = useCallback(() => {
    if (fileText) {
      //console.log("upload")
      setPrimaryColumn(0)
      setPrimaryColumnList([])
      if (fileText.length > 0) {
        setPrimaryColumnList(Object.values(fileText[0]).map((v, k) =>
          <div onClick={() => {setPrimaryColumn(k); setPrimaryColumnLabel(headerSwitch ? v : String(k) + ": " + v + " ...")}}>{headerSwitch ? v : String(k) + ": " + v + " ..."}</div>
        ))
      }
      if (fileText && fileText.length > 0) {
        if (fileText[0].length >= primaryColumn) {
          setPrimaryColumnLabel(headerSwitch ? fileText[0][primaryColumn] : String(primaryColumn) + ": " + fileText[0][primaryColumn] + " ...")
        }
      }
    }
  }, [fileText, headerSwitch, setPrimaryColumn])
  useEffect(()=> {
    initializePrimaryColumnCallback()
  }, [fileText, initializePrimaryColumnCallback])

  // TODO: break out callbacks to use both primaryColumn and setPrimaryColumn
  // update primaryColumnList, primaryColumn, and primaryColumnLabel on headerSwitch change
  const updatePrimaryColumnCallback = useCallback(() => {
    //console.log("update")
    setPrimaryColumnList([])
    if (fileText.length > 0) {
      setPrimaryColumnList(Object.values(fileText[0]).map((v, k) =>
        <div onClick={() => {setPrimaryColumn(k); setPrimaryColumnLabel(headerSwitch ? v : String(k) + ": " + v + " ...")}}>{headerSwitch ? v : String(k) + ": " + v + " ..."}</div>
      ))
    }
    if (fileText && fileText.length > 0) {
      if (fileText[0].length >= primaryColumn) {
        setPrimaryColumnLabel(headerSwitch ? fileText[0][primaryColumn] : String(primaryColumn) + ": " + fileText[0][primaryColumn] + " ...")
      }
    }
  }, [fileText, headerSwitch, setPrimaryColumn])
  useEffect(() => {
    updatePrimaryColumnCallback()
  }, [headerSwitch, updatePrimaryColumnCallback])

  // reset table header and data on file upload or headerSwitch change
  useEffect(() => {
    if (fileText && fileText.length >= 1) {
      if (headerSwitch) {
        if (fileText.length > 0) {
          setHeader(fileText[0])
        }
        if (fileText.length > 1) {
          setData(fileText.slice(1))
        }
      } else {
        setHeader(false)
        setData(fileText)
      }
    }
  }, [fileText, headerSwitch])

  return (
    <div className="TableUpload" style={{ visibility: props.visibility }}>
      <h3 style={{ textAlign: "center" }}>Table Upload Form</h3>
      <div>File Name: '{props.fileName}'</div>
      <div>Context Label:</div>
      <Box sx={{ paddingLeft: "15px", width: "150px" }}><input type="text" value={contextLabel} onChange={(e) => {setContextLabel(e.target.value)}} /></Box>
      <div style={{ position: "absolute", top: "16px", right: "16px", fontWeight: "bold" }}>
        <SvgButton label="X" onClick={() => props.setVisibility("hidden")} />
      </div>
      <form>
        <label>Table contains header:</label>
        <Switch color="primary" onChange={(e) => {setHeaderSwitch(e.target.checked)}} defaultChecked />
      </form>
      <div style={{ display: "flex", flexFlow: "row" }}>
        <div>Primary Column:&nbsp;&nbsp;</div>
        <SvgButton
          label={primaryColumnLabel}
          maxHeight="25vh"
          drop={
            <div>{primaryColumnList}</div>
          }
        />
      </div>
      <div>Table Preview:</div>
      <div style={{ backgroundColor: "#eee", flexGrow: 1, marginTop: "12px", marginBottom: "12px", overflow: "scroll" }}>
        <Handsontable
          data = {data}
          header = {header}
          view = "readonly"
        />
      </div>
      <div style={{ alignSelf: "center", display: "flex", flexFlow: "row" }}>
        <SvgButton label="Import" onClick={() => {
          props.importData(getTable())
          props.setHistoryLabel(contextLabel)
          props.setVisibility("hidden")
        }}/>
        <SvgButton label="Cancel" onClick={() => {props.setVisibility("hidden")}} />
      </div>
    </div>
  )
}

export default TableUpload;
