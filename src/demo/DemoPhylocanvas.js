import React, {useEffect, useState} from "react";
import Phylocanvas from "../phylocanvas/Phylocanvas.js";

function PhylocanvasView() {
  const [tree, setTree] = useState("(A:1)B;");
  const [type, setType] = useState("radial");
  const [labels, setLabels] = useState(true);
  const [align, setAlign] = useState(false);
  const [nodeSize, setNodeSize] = useState(10);
  const [textSize, setTextSize] = useState(20);
  const [lineWidth, setLineWidth] = useState(2);

  useEffect(() => {
    setTree("(A:2.5,B:0.2,(C:0.3,D:0.4)E:0.9)F;");
    setType("rectangular");
  }, [])

  return (
    <div>
      <h1>Phylocanvas Demo</h1>
      <Phylocanvas
        tree = {tree}
        type = {type}
        labels = {labels}
        align = {align}
        nodeSize = {nodeSize}
        textSize = {textSize}
        lineWidth = {lineWidth}
      />
      <h5>Type:</h5>
      <button onClick={() => setType("radial")}>Radial</button>
      <button onClick={() => setType("rectangular")}>Rectangular</button>
      <button onClick={() => setType("circular")}>Circular</button>
      <button onClick={() => setType("diagonal")}>Diagonal</button>
      <button onClick={() => setType("hierarchical")}>Hierarchical</button>
      <h5>Toggle:</h5>
      <button onClick={() => setLabels(!labels)}>Labels</button>
      <button onClick={() => setAlign(!align)}>Align</button>
      <h5>Style:</h5>
      <button onClick={() => setNodeSize(nodeSize + 1)}>Node Size + 1</button>
      <button onClick={() => setNodeSize(nodeSize - 1)}>Node Size - 1</button>
      <button onClick={() => setTextSize(textSize + 1)}>Text Size + 1</button>
      <button onClick={() => setTextSize(textSize - 1)}>Text Size - 1</button>
      <button onClick={() => setLineWidth(lineWidth + 1)}>Line Width + 1</button>
      <button onClick={() => setLineWidth(lineWidth - 1)}>Line Width - 1</button>
    </div>
  )
}

export default PhylocanvasView;
