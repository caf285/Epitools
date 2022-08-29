/* eslint-disable react/no-direct-mutation-state */
import React, { useState, useRef, useEffect, useCallback } from "react";
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import './style.css'
import DropZ from "../svgButton/dropZ/DropZ.js";

// Check if value is in sData
const checkSdata = (value, sdata) => {
    //console.log("Checking for:", value)
    //console.log("in:", sdata)
    for (let i = 0; i < sdata?.length; i++) {
        if (sdata[i] === value) {
            return true
        }
    }
    return false
}

function SelectionHOT(props) {
    const hot = useRef();
    const licenseKey = useRef("non-commercial-and-evaluation")
    const [header, setHeader] = useState(false)
    const [data, setData] = useState([{}])
    const [sdata, setSdata] = useState([])
    const [height, setHeight] = useState("100%")
    const [width, setWidth] = useState("auto")
    const views = useRef(["readonly"]);
    var NameColumn = -1


    //console.log("%c HOT: ", "color: teal", hot)

    useEffect(() => {
        console.log("%c sdata: ", "color: pink", sdata);
        checkSdata(0, sdata);
        setNameColumn();
    }, [sdata, checkSdata])

    // initialize table
    useEffect(() => {
        //console.log("initial hot")
        const container = document.getElementById('handsontable');
        hot.current = new Handsontable(container, {
            data,
            colHeaders: header,
            height: height,
            width: width,
            licenseKey: licenseKey.current,
            columnSorting: true,
            filters: true,
            dropdownMenu: ['filter_by_condition', 'filter_action_bar'],
        })
        hot.current.render()
        //console.log("hot:", hot)
    }, [])

    // Highlighting-------------------------
    useEffect(() => {
        hot.current.updateSettings({
            afterOnCellMouseDown: (event, coords, TD) => {
                //console.log("CORDS____: ", coords)
                var row = coords.row
                var column = coords.column
                if (row < 0) {
                    return
                }
                // If set to `false` (default): when cell selection is outside the viewport,
                // Handsontable scrolls the viewport to cell selection's end corner.
                // If set to `true`: when cell selection is outside the viewport,
                // Handsontable doesn't scroll to cell selection's end corner.

                //console.log("Row: ", row)
                //console.log("Column: ", column)
                //console.log("sdata: ", sdata);
                if (!checkSdata(hot.current.getDataAtCell(row, 1), sdata)) {
                    setSdata(psdata => [...psdata, hot.current.getDataAtCell(row, 1)])
                    // set color
                    for (let i = 0; i < hot.current.countCols(); i++) {
                        hot.current.setCellMeta(row, i, 'className', 'MyRow')
                    }
                } else {
                    setSdata(sdata.filter(function (v) {
                        return v !== hot.current.getDataAtCell(row, 1)
                    }))
                    for (let i = 0; i < hot.current.countCols(); i++) {
                        hot.current.setCellMeta(row, i, 'className', '')
                    }

                }
                hot.current.render()
            },
        })
    })

    // Export Table Selection Callback
    useEffect(() => {
        //console.log("Exporting: ", sdata)
        // TODO: this probably will not work and will have the wrong version of sdata
        props.exportTableSelectionCallback(sdata)
        //console.log("%c FINDING COLUMN: ", "color: pink", props.importSelection)
        setNameColumn()
    }, [sdata])

    useEffect(() => {
        if (props.height) { setHeight(props.height) }
        if (props.width) { setWidth(props.width) }
    }, [props.height, props.width])

    //update sdata and table based on new phylo imported data.
    useEffect(() => {

        // cycle through importSelection
        //console.log("%c Got new pylo import: ", "color: pink", props.importSelection)
        setNameColumn()

        for (var k = 0; k < hot.current.countRows(); k++) {

            // if on the list, highlight,
            //console.log("%c Is this on the list? ", 'color: brown', hot.current.getDataAtCell(k, NameColumn), props.importSelection)
            if (isInImport(hot.current.getDataAtCell(k, NameColumn), props.importSelection)) {
                for (let i = 0; i < hot.current.countCols(); i++) {
                    hot.current.setCellMeta(k, i, 'className', 'MyRow')
                }
                //console.log("%c Highlighting:  ", 'color: blue', hot.current.getDataAtCell(k, NameColumn))
            } else {
                // if not on the list clear highlight
                for (var j = 0; j < hot.current.countCols(); j++) {
                    hot.current.setCellMeta(k, j, 'className', '')
                }
                //console.log("%c Clearing Highlighting:  ", 'color: red', hot.current.getDataAtCell(k, NameColumn))
            }

            hot.current.render()

        }
        // make sdata the new list.
        setSdata(props.importSelection)

    }, [props.importSelection])

    // set data
    useEffect(() => {
        if (props.data && props.data.length) {
            setData(props.data)
            setHeader(Object.keys(props.data[0]))
            hot.current.updateSettings({
                colHeaders: Object.keys(props.data[0]),
            })
            hot.current.updateData(props.data)
            hot.current.getPlugin('Filters').clearConditions();
            hot.current.getPlugin('Filters').filter();
            hot.current.render();
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


    // Check if value is within imp
    const isInImport = (val, imp) => {
        for (let i = 0; i < imp.length; i++) {
            if (imp[i] === val) {
                return true
            }

        }
        return false
    }

    // Set which column is the name column
    const setNameColumn = () => {
        var temp = locateColumn("Name")
        //console.log("Setting Name column to : ", temp)
        NameColumn = temp
    }

    // Find a column with a specific name
    const locateColumn = (column) => {
        if (hot.current) {
            for (let i = 0; i < hot.current.countCols(); i++) {
                if (column === hot.current.getColHeader(i))
                    return i
            }
        }

        return -1

    }


    return (
        <div style={{ position: "relative", height: "100%" }}>
            <div id="handsontable" style={{ zIndex: "1" }}></div>
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

export default SelectionHOT;
