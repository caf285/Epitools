/* eslint-disable react/no-direct-mutation-state */
import React, { useEffect } from "react";
import { Route, Routes, useSearchParams, useNavigate } from "react-router-dom";

import DemoPhylocanvas from "../demo/DemoPhylocanvas.js";
import DemoLeaflet from "../demo/DemoLeaflet.js";
import DemoPlotly from "../demo/DemoPlotly.js";
import DemoMySQL from "../demo/DemoMySQL.js";
import DemoHandsOnTable from "../demo/DemoHandsOnTable.js"
import Epitools from "../gas/Epitools.js";
import "./Nav.css";

function Body(props) {

  const [searchParams, setSearchParams] = useSearchParams();
  //for (let entry of searchParams.entries()) {
  //  console.log(entry)
  //}
  //console.log("pathogen pre-load", searchParams.getAll())
  const navigate = useNavigate()
  //useEffect(() => {
    //setSearchParams({ "answer": 14 })
    //navigate("?", { replace: true });
  //}, [])


  return (
    <div style={{ height: "100%", overflow: "hidden" }} className="Nav-body">
        <Routes>
          <Route exact path="/home" element={
            <Epitools pathogenType = {props.pathogenType}/>
          } />
          <Route exact path="/demo-phylocanvas" element={<DemoPhylocanvas />} />
          <Route exact path="/demo-leaflet" element={<DemoLeaflet />} />
          <Route exact path="/demo-plotly" element={<DemoPlotly />} />
          <Route exact path="/demo-mysql" element={<DemoMySQL />} />
          <Route exact path="/demo-handsontable" element={<DemoHandsOnTable />} />
        </Routes>
    </div>
  )
}

export default Body;
