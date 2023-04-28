/* eslint-disable react/no-direct-mutation-state */
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import DemoPhylocanvas from "../demo/DemoPhylocanvas.js";
import DemoLeaflet from "../demo/DemoLeaflet.js";
import DemoPlotly from "../demo/DemoPlotly.js";
import DemoMySQL from "../demo/DemoMySQL.js";
import DemoHandsOnTable from "../demo/DemoHandsOnTable.js"
import GAS from "../gas/GAS.js";
import Epitools from "../gas/Epitools.js";
import "./Nav.css";

function Body(props) {
  return (
    <div style={{ height: "100%", overflow: "hidden" }} className="Nav-body">
      <BrowserRouter basename="/epitools">
        <Switch>
          <Route exact path="/home">
            <GAS />
          </Route>
          <Route exact path="/epitools">
            <Epitools
              pathogenType = {props.pathogenType}
            />
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
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default Body;
