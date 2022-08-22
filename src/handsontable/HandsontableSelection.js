
/* eslint-disable react/no-direct-mutation-state */
import React, { useState, useRef, useEffect } from "react";

function HandsontableSelection(props) {

  console.log("%c PROPS: ", "color: Purple", props)

  function updateDataObjectArray(id, obj) {
    var index = dataRef.current.findIndex(x => x.id === id);
    props.updateFunction(settings)
    if (index === -1) {
      console.log("ERROR updating Data Object Array: ", id)
    }
    // handle error
    else
      setData(
        [
          ...dataRef.current.slice(0, index),
          obj,
          ...dataRef.current.slice(index + 1)
        ]
      );
  }

  var settings = {
    afterChange: function (source, changes) {
      if (changes === 'edit') {
        console.log('row: ' + source[0][0]);
        console.log('col: ' + source[0][1]);
        console.log('old value: ' + source[0][2]);
        console.log('new value: ' + source[0][3])
      }
    },
    columns: [
      { data: "Id" },
      { data: "Name" },
      { data: "Sample" },
      { data: "Subsample" },
      { data: "External" },
      { data: "Pathogen" },
      { data: "Lineage" },
      { data: "Collection_date" },
      { data: "Facility" },
      { data: "File" },
      { data: "Reference" },
      { data: "Sequence_date" },
      {
        data: "selected",
        type: 'checkbox'
      }
    ]
  }


  const [data, setData] = useState([{}])
  const dataRef = useRef(data)
  useEffect(() => {
    dataRef.current = data
  }, [data])

  /*
    All data imported/exported should use this format. If a header dictionary is necessary, for
    passing highlighting/color information back to handsontable, this can be added later.
    example data:
      [
        {Id: "13645", Name: "A", Sample: "TG77142", ... },
        {Id: "89937", Name: "TGen-CoV-AZ-Tiled-TG1386228", Sample: "TG1386228", ...}
      ]
  */

  ///// ADD CHECK BOXES TO TABLE
  /*
    When props.data in parent changes, it is basically initializing a new table with fresh data.
    Variable "data" should be a list of dictionaries. To each dictionary you can add a checkbox.
    Each checkbox can have an "onChange" action linking them to the "checkBoxAction" function
    below.
  */


  useEffect(() => {
    setData(props.data)

    if (props.data.length > 1) {


      // add checkboxes to "data.current" here
      console.log("%c Start setting check boxes", "color: Orange")
      console.log("%c PROPS: ", "color: Orange", settings)
      for (var i = 0; i <= dataRef.current.length - 1; i++) {
        console.log("HERE: ", i, " ", dataRef.current[i])
        var tmp = dataRef.current[i]
        tmp.selected = false
        updateDataObjectArray(i, tmp)
        console.log("HERE: ", i, " ", dataRef.current[i])

      }

      if (props.updateDataCallback) {
        props.updateDataCallback(dataRef.current)
      }
    }
  }, [props.data])


  ///// IMPORT SELECTION
  /*
    Selected lines will be in the same format as initial data; a list of dictionaries. Find and
    highlight all lines by updating the variable "data", before pushing changes via the update
    data callback.
  */
  useEffect(() => {

    // use "props.importSelection" add/remove highlighting/checks to "dataRef.current" here

    if (props.updateDataCallback) {
      props.updateDataCallback(dataRef.current)
    }
  }, [props.importSelection])


  ///// EXPORT SELECTION
  /*
    If any boxes are checked or unchecked, get a list of all checked boxes and return them in the
    export table selection callback. Should be the same format of a list of dictionaries.
  */
  const checkBoxAction = (e) => {

    // update "dataRef.current" with proper highlights here

    props.updateDataCallback(dataRef.current)

    // get list of checked boxes for export here

    if (props.exportTableSelectionCallback) {
      props.exportTableSelectionCallback([{}])
    }
  }

  return (
    <div></div>
  )
}

export default HandsontableSelection;
