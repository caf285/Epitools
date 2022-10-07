/* eslint-disable react/no-direct-mutation-state */

import React, { useEffect, useState } from "react";
import "./Phylocanvas.css";

import SvgButton from "../svgButton/SvgButton.js";

import PhylocanvasLogic from "./PhylocanvasLogic.js";

function PhylocanvasView(props) {
  const [tree, setTree] = useState("(A:1)B;");
  const [type, setType] = useState("radial");
  const [labels, setLabels] = useState(true);
  const [align, setAlign] = useState(false);
  const [nodeSize] = useState(8);
  const [textSize, setTextSize] = useState(15);
  const [lineWidth, setLineWidth] = useState(2);
  const [clusterDistance, setClusterDistance] = useState(3);
  const [clusterSamples, setClusterSamples] = useState(3);

  //TODO: Load Tree Externally

  useEffect(() => {
    if (props.tree) {
      setTree(props.tree)
    }
  }, [props.tree])

  return (
    <div className="Phylocanvas">
      <PhylocanvasLogic
        tree={tree}
        height={props.height}
        type={type}
        labels={labels}
        align={align}
        nodeSize={nodeSize}
        textSize={textSize}
        lineWidth={lineWidth}
        clusterDistance={clusterDistance}
        clusterSamples={clusterSamples}
        branchesData={props.branchesData}
        branchNameCallback={props.branchNameCallback}
        importSelection={props.importSelection}
        exportSelectionCallback={props.exportPhylocanvasSelectionCallback}
      />
      <div style={{ position: "absolute", display: "flex", flexFlow: "row", top: 0, right: 0}}>
        <SvgButton label="cluster"
          justify="flex-end"
          drop={
            <div style={{ display: "flex", flexFlow: "column" }}>
              <h5>Cluster Detection:</h5>
              <button onClick={() => setClusterDistance(clusterDistance + 1)}>ClusterDistance + 1</button>
              <button onClick={() => setClusterDistance(Math.max(clusterDistance - 1, 1))}>ClusterDistance - 1</button>
              <button onClick={() => setClusterSamples(clusterSamples + 1)}>ClusterSamples + 1</button>
              <button onClick={() => setClusterSamples(Math.max(clusterSamples - 1, 1))}>ClusterSamples - 1</button>
              <h5>Toggle:</h5>
              <button onClick={() => setLabels(!labels)}>Labels</button>
              <button onClick={() => setAlign(!align)}>Align</button>
              <h5>Style:</h5>
              <button onClick={() => setTextSize(textSize + 1)}>Text Size + 1</button>
              <button onClick={() => setTextSize(Math.max(textSize - 1, 1))}>Text Size - 1</button>
              <button onClick={() => setLineWidth(lineWidth + 1)}>Line Width + 1</button>
              <button onClick={() => setLineWidth(Math.max(lineWidth - 1, 1))}>Line Width - 1</button>
            </div>
          }
        />
        <SvgButton label="tree type"
          justify="flex-end"
          drop={
            <div>
              <SvgButton key="radial" onClick={() => setType("radial")} svg="treeRadial" label="radial" />
              <SvgButton key="rect" onClick={() => setType("rectangular")} svg="treeRectangular" label="rectangular" />
              <SvgButton key="cir" onClick={() => setType("circular")} svg="treeCircular" label="circular" />
              <SvgButton key="diag" onClick={() => setType("diagonal")} svg="treeDiagonal" label="diagonal" />
              <SvgButton key="hier" onClick={() => setType("hierarchical")} svg="treeHierarchical" label="hierarchical" />
            </div>
          }
        />
      </div>
      {/*
      <h5>SVG:</h5>
      <SvgButton onClick={() => setType("radial")} svg="treeRadial" />
      <SvgButton onClick={() => setType("rectangular")} svg="treeRectangular" />
      <SvgButton onClick={() => setType("circular")} svg="treeCircular" />
      <SvgButton onClick={() => setType("diagonal")} svg="treeDiagonal" />
      <SvgButton onClick={() => setType("hierarchical")} svg="treeHierarchical" />
      <SvgButton svg="menuSettings" />
      <SvgButton svg="menuContext" />
      <h5>SVG With Label:</h5>
      <SvgButton onClick={() => setType("radial")} svg="treeRadial" label="Radial" />
      <SvgButton onClick={() => setType("rectangular")} svg="treeRectangular" label="Rectangular" />
      <SvgButton onClick={() => setType("circular")} svg="treeCircular" label="Circular" />
      <SvgButton onClick={() => setType("diagonal")} svg="treeDiagonal" label="Diagonal" />
      <SvgButton onClick={() => setType("hierarchical")} svg="treeHierarchical" label="Hierarchical" />
      <SvgButton svg="menuSettings" label="Settings Menu" />
      <SvgButton svg="menuContext" label="Context Menu" />
      <h5>SVG With Drop:</h5>
      <SvgButton onClick={() => setType("radial")} svg="treeRadial" drop={true} />
      <SvgButton onClick={() => setType("rectangular")} svg="treeRectangular" drop={true} />
      <SvgButton onClick={() => setType("circular")} svg="treeCircular" drop={true} />
      <SvgButton onClick={() => setType("diagonal")} svg="treeDiagonal" drop={true} />
      <SvgButton onClick={() => setType("hierarchical")} svg="treeHierarchical" drop={true} />
      <SvgButton svg="menuSettings" drop={true} />
      <SvgButton svg="menuContext" drop={true} />
      <h5>SVG With Both:</h5>
      <SvgButton onClick={() => setType("radial")} svg="treeRadial" label="Radial" drop={true} />
      <SvgButton onClick={() => setType("rectangular")} svg="treeRectangular" label="Rectangular" drop={true} />
      <SvgButton onClick={() => setType("circular")} svg="treeCircular" label="Circular" drop={true} />
      <SvgButton onClick={() => setType("diagonal")} svg="treeDiagonal" label="Diagonal" drop={true} />
      <SvgButton onClick={() => setType("hierarchical")} svg="treeHierarchical" label="Hierarchical" drop={true} />
      <SvgButton svg="menuSettings" label="Settings Menu" drop={true} />
      <SvgButton svg="menuContext" label="Context Menu" drop={true} />
      <h5>No SVG:</h5>
      <SvgButton onClick={() => setType("radial")} label="Radial" drop={true} />
      <SvgButton onClick={() => setType("rectangular")} label="Rectangular" drop={true} />
      <SvgButton onClick={() => setType("circular")} label="Circular" drop={true} />
      <SvgButton onClick={() => setType("diagonal")} label="Diagonal" drop={true} />
      <SvgButton onClick={() => setType("hierarchical")} label="Hierarchical" drop={true} />
      <SvgButton label="Settings Menu" drop={true} />
      <SvgButton label="Context Menu" drop={true} />
      */}
    </div>
  )
}

export default PhylocanvasView;
