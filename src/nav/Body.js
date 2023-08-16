import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import DemoPhylocanvas from "../demo/DemoPhylocanvas.js";
import DemoLeaflet from "../demo/DemoLeaflet.js";
import DemoPlotly from "../demo/DemoPlotly.js";
import DemoMySQL from "../demo/DemoMySQL.js";
import DemoHandsOnTable from "../demo/DemoHandsOnTable.js"
import Epitools from "../epitools/Epitools.js";
import "./Nav.css";

function Body(props) {

  //console.log("pathogen pre-load", searchParams.getAll("pathogen"))
  useEffect(() => {
    //searchParams.set("answer", 42)
    //searchParams.append( "pathogen", "sars" )
    //searchParams.set( "pathogen", "gas" )
    //setSearchParams(searchParams)
    //console.log(searchParams)
    //navigate("?pathogen=test", { replace: true });
  }, [])


  return (
    <div style={{ height: "100%", overflow: "hidden" }} className="Nav-body">
        <Routes>
          <Route exact path="/home" element={
            <Epitools
              pathogenList = {props.pathogenList}
              searchParams = {props.searchParams}
              setSearchParams = {props.setSearchParams}
            />
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
