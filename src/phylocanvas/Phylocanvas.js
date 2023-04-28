import React, { useEffect, useState, useRef } from "react";
import "./Phylocanvas.css";

import SvgButton from "../svgButton/SvgButton.js";

import PhylocanvasLogic from "./PhylocanvasLogic.js";

function PhylocanvasView(props) {
  // default configurations
  const [nwk, setNwk] = useState("(A:1)B;");
  const [type, setType] = useState("rectangular");
  const [labels, setLabels] = useState(true);
  const [align, setAlign] = useState(false);
  const [nodeSize] = useState(12);
  const [textSize, setTextSize] = useState(24);
  const [lineWidth, setLineWidth] = useState(2);
  const [clusterDistance, setClusterDistance] = useState(4);
  const [clusterSamples, setClusterSamples] = useState(3);

  // pass nwk to logic component
  useEffect(() => {
    if (props.nwk) {
      setNwk(props.nwk)
    }
  }, [props.nwk])

  // stretch orientation for scrollwheel zoom
  const orientationRef = useRef(["both", "horizontal", "vertical"])
  const [stretchOrientation, setStretchOrientation] = useState(orientationRef.current[0])
  function cycleOrientation() {
    if (["radial", "circular", "diagonal"].includes(type)) {
      setStretchOrientation(orientationRef.current[0])
    } else {
      if (orientationRef.current.indexOf(stretchOrientation) + 1 >= orientationRef.current.length) {
        setStretchOrientation(orientationRef.current[0])
      } else {
        setStretchOrientation(orientationRef.current[orientationRef.current.indexOf(stretchOrientation) + 1])
      }
    }
  }
  useEffect(() => {
    if (["radial", "circular", "diagonal"].includes(type)) {
      cycleOrientation()
    }
  }, [type])


  return (
    <div className="Phylocanvas">
      <PhylocanvasLogic
        nwk={nwk}
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
        metadataLabels={props.metadataLabels}
        stretchOrientation={stretchOrientation}
        importSelection={props.importSelection}
        getTree={props.getTree}
        exportSelectionCallback={props.exportPhylocanvasSelectionCallback}
        exportCanvasCallback={props.exportCanvasCallback}
        triggerCanvasCallback={props.triggerCanvasCallback}
      />
      <div style={{ position: "absolute", display: "flex", flexFlow: "row", top: 0, right: 0 }}>
        <SvgButton
          label="cluster"
          dropAlign="right"
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
        <SvgButton
          label="tree type"
          svg="treeRectangular"
          dropAlign="right"
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
      <div style={{ position: "absolute", display: "flex", flexFlow:"row", bottom: 0, right: 0 }}>
        <SvgButton
          svg={(type == "hierarchical" && stretchOrientation == "horizontal" ? "vertical" : type == "hierarchical" && stretchOrientation == "vertical" ? "horizontal" : stretchOrientation) + "Scale"}
          onClick={() => cycleOrientation()}
        />
      </div>
    </div>
  )
}

export default PhylocanvasView;
