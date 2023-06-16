import React, { useState, useRef, useEffect, useCallback } from "react";
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';

function HandsontableView(props) {
  const hot = useRef();
  const licenseKey = useRef("non-commercial-and-evaluation")
  const containerRef = useRef()
  const [height, setHeight] = useState("100%")
  const [width, setWidth] = useState("auto")
  const views = useRef(["readonly"]);

  // initialize table
  const initializeTableCallback = useCallback(() => {
    const data = [{}]
    const header = false
    hot.current = new Handsontable(containerRef.current, {
      data,
      colHeaders: header,
      height: height,
      width: width,
      licenseKey: licenseKey.current
    })
    hot.current.render()
  }, [height, width])
  useEffect(() => {
    initializeTableCallback()
  }, [initializeTableCallback])
  useEffect(() => {
    if (props.height) { setHeight(props.height) }
    if (props.width) { setWidth(props.width) }
  }, [props.height, props.width])

  // set data / header
  useEffect(() => {
    if (containerRef.current && props.data && props.data.length) {
      hot.current.updateSettings({
        colHeaders: props.header,
      })
      hot.current.updateData(props.data)
    }
  }, [props.data, props.header])

  // set view type (default: 'readonly')
  useEffect(() => {
    if (props.view && views.current.includes(props.view)) {
      if (props.view === "readonly") {
        //console.log("readonly active")
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
      <div ref={containerRef} style={{ zIndex: "1" }}></div>
    </div>
  )
}

export default HandsontableView;
