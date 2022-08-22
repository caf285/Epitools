/* eslint-disable react/no-direct-mutation-state */
import React, { useState, useRef, useEffect } from "react";
import Handsontable from 'handsontable';
import HandsontableSelection from "./HandsontableSelection.js"
import 'handsontable/dist/handsontable.full.css';

import SvgButton from "../svgButton/SvgButton.js";
import DropZ from "../svgButton/dropZ/DropZ.js";

function HandsontableView(props) {
  const hot = useRef();
  const licenseKey = useRef("non-commercial-and-evaluation")
  const [label, setLabel] = useState("")
  const [header, setHeader] = useState(false)
  const [data, setData] = useState([{}])
  const [height, setHeight] = useState("100%")
  const [width, setWidth] = useState("auto")
  const views = useRef(["readonly"]);

  console.log("%c HOT: ", "color: teal", hot)

  // initialize table
  useEffect(() => {
    console.log("initial hot")
    const container = document.getElementById('handsontable');
    hot.current = new Handsontable(container, {
      data,
      colHeaders: header,
      height: height,
      width: width,
      licenseKey: licenseKey.current
    })
    hot.current.render()
    console.log("hot:", hot)
  }, [])

  // set label; height and width if they exist
  useEffect(() => {
    if (props.label) { setLabel(props.label) }
  }, [props.label])
  useEffect(() => {
    if (props.height) { setHeight(props.height) }
    if (props.width) { setWidth(props.width) }
  }, [props.height, props.width])

  // set data
  useEffect(() => {
    if (props.data && props.data.length) {
      setData(props.data)
      setHeader(Object.keys(props.data[0]))
      hot.current.updateSettings({
        colHeaders: Object.keys(props.data[0]),
      })
      hot.current.updateData(props.data)
    }
  }, [props.data])

  // update data (add checkboxes/highlights/etc)
  const updateDataCallback = (e) => {
    console.log("updateDataCallback:", e)
    if (e && e.length && Object.keys(e[0]).length) {
      hot.current.updateData(e)
    }
  }

  const updateSettings = (settings) => {
    console.log("%c HOT: ", "color: red", hot)
    console.log("%c HOT,current: ", "color: red", hot.current)
    console.log("%c HOT.current.US: ", "color: red", hot.current.updateSettings)
    console.log("%c settings: ", "color: red", settings)
    if (hot.current.updateSettings) {
      hot.current.updateSettings(settings)
    }
  }

  // set view type (default: 'readonly')
  useEffect(() => {
    if (props.view && views.current.includes(props.view)) {
      if (props.view == "readonly") {
        console.log("readonly active")
        hot.current.updateSettings({
          readOnly: false, // make table cells read-only
          contextMenu: false, // disable context menu to change things
          disableVisualSelection: true, // prevent user from visually selecting
          manualColumnResize: false, // prevent dragging to resize columns
          manualRowResize: false, // prevent dragging to resize rows
          comments: false // prevent editing of comments
        })
      }
    }
  }, [props.view])

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div id="handsontable" style={{ zIndex: "1" }}></div>
      <HandsontableSelection
        data={data}
        importSelection={props.importSelection}
        updateDataCallback={updateDataCallback}
        exportTableSelectionCallback={props.exportTableSelectionCallback}
        updateFunction={updateSettings}
        hot={hot}
      />
      <div style={{ zIndex: "1000" }}>
        <DropZ
          buttonObj={
            [
              //<SvgButton key="settings" onClick={() => { }} svg="menuContext" label="settings" />,
            ]
          }
        />
      </div>
    </div>
  )
}

export default HandsontableView;
