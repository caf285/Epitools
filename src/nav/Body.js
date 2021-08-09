import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Project1 from "../project1/Project1.js";
import Project2 from "../project2/Project2.js";
import DemoPhylocanvas from "../demo/DemoPhylocanvas.js";
import DemoLeaflet from "../demo/DemoLeaflet.js";
import DemoPlotly from "../demo/DemoPlotly.js";

function Body() {
  return (
    <div className="Body">
      <BrowserRouter basename="/react-epitools">
        <Switch>
          <Route exact path="/">
            <p>default</p>
          </Route>
          <Route exact path="/project1">
            <Project1 />
          </Route>
          <Route exact path="/project2">
            <Project2 />
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
