import React, { useEffect, useState } from "react";
import Phylocanvas from "phylocanvas";

function PhylocanvasView(props) {
  const [tee, setTree] = useState(Phylocanvas.createTree('phylocanvas'));

  useEffect(() => {
    tee.load(props.tree);

    return () => {
    }

  }, [])


  return (
    <div>
      <h1>Phylocanvas Quickstart</h1>
      <div id="phylocanvas"></div>
    </div>
  )
}

export default PhylocanvasView;
