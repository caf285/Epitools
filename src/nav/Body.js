import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Project1 from "../project1/Project1.js";
import Project2 from "../project2/Project2.js";

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
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default Body;
