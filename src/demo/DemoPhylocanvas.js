import React, {useEffect} from "react";
import Phylocanvas from "../phylocanvas/Phylocanvas.js";

function PhylocanvasView() {

  useEffect(() => {
    return () => {
    }
  }, [])


  return (
    <Phylocanvas
      tree = "(A:0.3,B:0.2,(C:0.3,D:0.4)E:0.9)F;"
    />
  )
}

export default PhylocanvasView;
