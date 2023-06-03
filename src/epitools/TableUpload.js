import React, { useEffect, useState } from "react";
import "./TableUpload.css";

import SvgButton from "../svgButton/SvgButton.js";
import Switch from '@mui/material/Switch';
import Handsontable from '../handsontable/Handsontable.js';
import 'handsontable/dist/handsontable.full.css';

function TableUpload(props) {

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

  useEffect(()=> {
    if (props.fileText) {
      props.setPrimaryColumn(0)
      setPrimaryColumnList([])
      if (props.fileText.length > 0) {
        setPrimaryColumnList(Object.values(props.fileText[0]).map((v, k) =>
          <div onClick={() => {props.setPrimaryColumn(k); setPrimaryColumnLabel(headerSwitch ? v : String(k) + ": " + v + " ...")}}>{headerSwitch ? v : String(k) + ": " + v + " ..."}</div>
        ))
      }
      if (props.fileText && props.fileText.length > 0) {
        if (props.fileText[0].length >= props.primaryColumn) {
          setPrimaryColumnLabel(headerSwitch ? props.fileText[0][props.primaryColumn] : String(props.primaryColumn) + ": " + props.fileText[0][props.primaryColumn] + " ...")
        }
      }
    }
  }, [props.fileText])

  useEffect(() => {
    setPrimaryColumnList([])
    if (props.fileText.length > 0) {
      setPrimaryColumnList(Object.values(props.fileText[0]).map((v, k) =>
        <div onClick={() => {props.setPrimaryColumn(k); setPrimaryColumnLabel(headerSwitch ? v : String(k) + ": " + v + " ...")}}>{headerSwitch ? v : String(k) + ": " + v + " ..."}</div>
      ))
    }
    if (props.fileText && props.fileText.length > 0) {
      if (props.fileText[0].length >= props.primaryColumn) {
        setPrimaryColumnLabel(headerSwitch ? props.fileText[0][props.primaryColumn] : String(props.primaryColumn) + ": " + props.fileText[0][props.primaryColumn] + " ...")
      }
    }
  }, [headerSwitch])

  useEffect(() => {
    if (props.fileText && props.fileText.length >= 1) {
      if (headerSwitch) {
        if (props.fileText.length > 0) {
          setHeader(props.fileText[0])
        }
        if (props.fileText.length > 1) {
          setData(props.fileText.slice(1))
        }
      } else {
        setHeader(false)
        setData(props.fileText)
      }
    }
  }, [props.fileText, headerSwitch])

  return (
    <div className="TableUpload" style={{ visibility: props.visibility }}>
      <h3 style={{ textAlign: "center" }}>Table Upload Form</h3>
      <div>File Name: '{props.fileName}'</div>
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
        <SvgButton label="Import" onClick={() => {props.importData(getTable()); props.setVisibility("hidden")}}/>
        <SvgButton label="Cancel" onClick={() => props.setVisibility("hidden")} />
      </div>
    </div>
  )
}

export default TableUpload;
