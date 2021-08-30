import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import DemoPhylocanvas from "../demo/DemoPhylocanvas.js";
import DemoLeaflet from "../demo/DemoLeaflet.js";
import DemoPlotly from "../demo/DemoPlotly.js";

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
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default Body;
