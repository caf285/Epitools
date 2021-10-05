import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import DemoPhylocanvas from "../demo/DemoPhylocanvas.js";
import DemoLeaflet from "../demo/DemoLeaflet.js";
import DemoPlotly from "../demo/DemoPlotly.js";
import GAS from "../gas/GAS.js";

function Body() {
  return (
    <div className="Body">
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
          <Route exact path="/gas">
            <GAS />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default Body;
