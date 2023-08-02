import React, { useState, useRef, useEffect } from "react";
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';

function SelectionHOT(props) {
  const containerRef = useRef();
  const hot = useRef();
  const licenseKey = useRef("non-commercial-and-evaluation")
  //const [header, setHeader] = useState(false)
  const [data, setData] = useState([{}])
  const [sdata, setSdata] = useState([])
  //const [height, setHeight] = useState("props.height")
  const [width, setWidth] = useState("auto")
  const views = useRef(["readonly"]);

  const importSelection = props.importSelection
  const primaryColumn = props.primaryColumn

  // initialize table
  useEffect(() => {
    hot.current = new Handsontable(containerRef.current, {
      data,
      height: props.height,
      width: width,
      licenseKey: licenseKey.current,
      columnSorting: true,
      filters: true,
      dropdownMenu: ['filter_by_condition', 'filter_action_bar'],
    })
    hot.current.render()
  }, [])

  // ==================================================( Highlighting )
  // custom renderer for per cell formatting
  Handsontable.renderers.registerRenderer('customStylesRenderer', (instance, td, row, col, prop, value, cellProperties) => {
    Handsontable.renderers.getRenderer('text')(instance, td, row, col, prop, value, cellProperties);
    //console.log(instance, td, row, col, prop, value, cellProperties)
    if (sdata.includes(hot.current.getDataAtCell(row, primaryColumn))) { // selection
      td.style.backgroundColor = "#d2e8fa";
    }
    if (props.colorScheme && props.colorGroup) { // highlighting
      for (let i in props.colorGroup) {
        if (props.colorGroup[i].includes(hot.current.getDataAtCell(row, primaryColumn))) {
          td.style.color = "#" + props.colorScheme[i % props.colorScheme.length]
        }
      }
    }
  });

  // intercept and handle per cell clicks
  useEffect(() => {
    hot.current.updateSettings({
      afterOnCellMouseDown: (event, coords, td) => {
        if (!sdata.includes(hot.current.getDataAtCell(coords.row, primaryColumn))) {
          setSdata(sdata.concat(hot.current.getDataAtCell(coords.row, primaryColumn)))
        } else {
          setSdata(sdata.filter(x => x !== hot.current.getDataAtCell(coords.row, props.primaryColumn)))
        }
      }
    })
  })

  // handle colorscheme/group
  useEffect(() => {
    if (props.colorScheme && props.colorGroup) {
      console.log("handsonTableColors:", props.colorScheme, props.colorGroup)
    }   
  }, [props.colorScheme, props.colorGroup])

  // Export Table Selection Callback
  useEffect(() => {
    props.exportTableSelectionCallback(sdata)
  }, [sdata])

  useEffect(() => {
    //if (props.height) { setHeight(props.height) }
    if (props.width) { setWidth(props.width) }
  }, [props.height, props.width])

  //update sdata and table based on new phylo imported data.
  useEffect(() => {
    setSdata(importSelection)
  }, [importSelection])

  // set data
  useEffect(() => {
    if (containerRef.current && props.data && props.data.length) {
      setData(props.data)
      hot.current.updateSettings({
        data: props.data,
        colHeaders: Object.keys(props.data[0]),
        cells(row, col) {
          return {renderer: "customStylesRenderer"}
        } 
      })
      hot.current.getPlugin('Filters').clearConditions();
      hot.current.getPlugin('Filters').filter();
      hot.current.render();
    }
  }, [props.data])

  useEffect(() => {
    hot.current.updateSettings({ height: props.height })
  }, [props.height])

  // set view type (default: 'readonly')
  useEffect(() => {
    if (props.view && views.current.includes(props.view)) {
      if (props.view === "readonly") {
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

export default SelectionHOT;
