/* eslint-disable react/no-direct-mutation-state */
import React, { useState, useRef, useEffect } from "react";
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';

function HandsontableView(props) {
  const hot = useRef();
  const licenseKey = useRef("non-commercial-and-evaluation")
  const [header, setHeader] = useState(false)
  const [data, setData] = useState([{}])
  const [height, setHeight] = useState("100%")
  const [width, setWidth] = useState("auto")
  const views = useRef(["readonly"]);

  // initialize table
  useEffect(() => {
    //console.log("initial hot")
    const container = document.getElementById('handsontable');
    hot.current = new Handsontable(container, {
      data,
      colHeaders: header,
      height: height,
      width: width,
      licenseKey: licenseKey.current
    })
    hot.current.render()
    //console.log("hot:", hot)
  }, [data, header, height, width])

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
      <div id="handsontable" style={{ zIndex: "1" }}></div>
    </div>
  )
}

export default HandsontableView;
