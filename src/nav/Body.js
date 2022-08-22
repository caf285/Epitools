/* eslint-disable react/no-direct-mutation-state */

import React, { useEffect, useState, useRef } from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import DemoPhylocanvas from "../demo/DemoPhylocanvas.js";
import DemoLeaflet from "../demo/DemoLeaflet.js";
import DemoPlotly from "../demo/DemoPlotly.js";
import DemoMySQL from "../demo/DemoMySQL.js";
import DemoHandsOnTable from "../demo/DemoHandsOnTable.js"
import GAS from "../gas/GAS.js";

function Body() {
  let [height, setHeight] = useState(0);
  let ref = useRef();

  useEffect(() => {
    setHeight(ref.current.clientHeight)
    function handleResize() {
      setHeight(ref.current.clientHeight)
      //console.log(ref.current.clientHeight)
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  return (
    <div style={{ height: "100%", overflow: "hidden" }} ref={ref} className="Nav-body">
      {/*height*/}
      <BrowserRouter basename="/epitools">
        <Switch>
          <Route exact path="/">
            <p>default</p>
          </Route>
          <Route exact path="/demo-phylocanvas">
            <DemoPhylocanvas />
          </Route>
          <Route exact path="/demo-leaflet">
            <DemoLeaflet />
          </Route>
          <Route exact path="/demo-plotly">
            <DemoPlotly />
          </Route>
          <Route exact path="/demo-mysql">
            <DemoMySQL />
          </Route>
          <Route exact path="/demo-handsontable">
            <DemoHandsOnTable />
          </Route>
          <Route exact path="/gas">
            <GAS />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default Body;
