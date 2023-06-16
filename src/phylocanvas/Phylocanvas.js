import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Phylocanvas.css";

import SvgButton from "../svgButton/SvgButton.js";

import PhylocanvasLogic from "./PhylocanvasLogic.js";

function PhylocanvasView(props) {
  // default configurations
  const [nwk, setNwk] = useState("(A:1)B;");
  const [resetTreeBool, setResetTreeBool] = useState(false)

  const defaultType = "rectangular"
  const defaultShowLabels = true
  const defaultAlign = false
  const defaultNodeSize = 12
  const defaultTextSize = 24
  const defaultLineWidth = 2
  const defaultClusterDistance = 2
  const defaultClusterSize = 2

  const [type, setType] = useState(defaultType);
  const [showLabels, setShowLabels] = useState(defaultShowLabels);
  const [align, setAlign] = useState(defaultAlign);
  const [nodeSize, setNodeSize] = useState(defaultNodeSize);
  const [textSize, setTextSize] = useState(defaultTextSize);
  const [lineWidth, setLineWidth] = useState(defaultLineWidth);
  const [clusterDistance, setClusterDistance] = useState(defaultClusterDistance);
  const [clusterSize, setClusterSize] = useState(defaultClusterSize);

  // reset all tree style values
  useEffect(() => {
    if (resetTreeBool) {
      setType(defaultType)
      setShowLabels(defaultShowLabels)
      setAlign(defaultAlign)
      setNodeSize(defaultNodeSize)
      setTextSize(defaultTextSize)
      setLineWidth(defaultLineWidth)
      setClusterDistance(defaultClusterDistance)
      setClusterSize(defaultClusterSize)
      setResetTreeBool(false)
    }
  }, [resetTreeBool])

  // pass nwk to logic component
  useEffect(() => {
    if (props.nwk) {
      setNwk(props.nwk)
    }
  console.log(type)
  }, [props.nwk])

  // stretch orientation for scrollwheel zoom
  const orientationRef = useRef(["both", "horizontal", "vertical"])
  const [stretchOrientation, setStretchOrientation] = useState(orientationRef.current[0])
  const cycleOrientation = useCallback(() => {
    if (["radial", "circular", "diagonal"].includes(type)) {
      setStretchOrientation(orientationRef.current[0])
    } else {
      if (orientationRef.current.indexOf(stretchOrientation) + 1 >= orientationRef.current.length) {
        setStretchOrientation(orientationRef.current[0])
      } else {
        setStretchOrientation(orientationRef.current[orientationRef.current.indexOf(stretchOrientation) + 1])
      }
    }
  }, [stretchOrientation, setStretchOrientation, type])
  useEffect(() => {
    if (["radial", "circular", "diagonal"].includes(type)) {
      cycleOrientation()
    }
  }, [type, cycleOrientation])


  return (
    <div className="Phylocanvas">
      <PhylocanvasLogic
        nwk={nwk}
        height={props.height}
        type={type}
        showLabels={showLabels}
        align={align}
        nodeSize={nodeSize}
        textSize={textSize}
        lineWidth={lineWidth}
        clusterDistance={clusterDistance}
        clusterSize={clusterSize}
        branchesData={props.branchesData}
        branchNameCallback={props.branchNameCallback}
        metadataLabels={props.metadataLabels}
        stretchOrientation={stretchOrientation}
        importSelection={props.importSelection}
        setGetNwk={props.setGetNwk}
        setGetCanvas={props.setGetCanvas}
        exportSelectionCallback={props.exportPhylocanvasSelectionCallback}
        primaryColumn={props.primaryColumn}
        resetTreeBool={resetTreeBool}
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
              <button onClick={() => setClusterSize(clusterSize + 1)}>ClusterSize + 1</button>
              <button onClick={() => setClusterSize(Math.max(clusterSize - 1, 1))}>ClusterSize - 1</button>
            </div>
          }
        />
        <SvgButton
          label="tree options"
          svg="menuContext"
          dropAlign="right"
          drop={
            <div style={{ maxHeight: props.height - 100 }}>
              <h5>Tree Type:</h5>
              <SvgButton key="radial" onClick={() => setType("radial")} svg="treeRadial" label="radial" />
              <SvgButton key="rect" onClick={() => setType("rectangular")} svg="treeRectangular" label="rectangular" />
              <SvgButton key="cir" onClick={() => setType("circular")} svg="treeCircular" label="circular" />
              <SvgButton key="diag" onClick={() => setType("diagonal")} svg="treeDiagonal" label="diagonal" />
              <SvgButton key="hier" onClick={() => setType("hierarchical")} svg="treeHierarchical" label="hierarchical" />
              <h5>Toggle:</h5>
              <SvgButton onClick={() => setShowLabels(!showLabels)} label="labels" />
              <SvgButton onClick={() => setAlign(!align)} label="align" />
              <h5>Style:</h5>
              <SvgButton onClick={() => setTextSize(textSize + 1)} label="text size + 1" />
              <SvgButton onClick={() => setTextSize(Math.max(textSize - 1, 1))} label="text size - 1" />
              <SvgButton onClick={() => setLineWidth(lineWidth + 1)} label="line width + 1" />
              <SvgButton onClick={() => setLineWidth(Math.max(lineWidth - 1, 1))} label="line width - 1" />
              <h5>Other:</h5>
              <SvgButton onClick={() => setResetTreeBool(true)} label="reset tree" />
            </div>
          }
        />
      </div>
      <div style={{ zIndex: "100", position: "absolute", display: "flex", flexFlow:"row", bottom: 0, right: 0 }}>
        <SvgButton
          svg={(type === "hierarchical" && stretchOrientation === "horizontal" ? "vertical" : type === "hierarchical" && stretchOrientation === "vertical" ? "horizontal" : stretchOrientation) + "Scale"}
          onClick={() => cycleOrientation()}
        />
      </div>
    </div>
  )
}

export default PhylocanvasView;
