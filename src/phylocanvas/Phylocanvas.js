import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Phylocanvas.css";

import SvgButton from "../svgButton/SvgButton.js";
import Box from "@mui/material/Box";
import Slider from '@mui/material/Slider';
import Switch from "@mui/material/Switch";

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

  const [type, setType] = useState(defaultType);
  const [showLabels, setShowLabels] = useState(defaultShowLabels);
  const [align, setAlign] = useState(defaultAlign);
  const [nodeSize, setNodeSize] = useState(defaultNodeSize);
  const [textSize, setTextSize] = useState(defaultTextSize);
  const [lineWidth, setLineWidth] = useState(defaultLineWidth);

  // pass nwk to logic component (requires default value and cannot be empty)
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
        clusterDistance={props.clusterDistance}
        clusterSize={props.clusterSize}
        branchesData={props.branchesData}
        branchNameCallback={props.branchNameCallback}
        metadataLabels={props.metadataLabels}
        stretchOrientation={stretchOrientation}
        importSelection={props.importSelection}
        setGetNwk={props.setGetNwk}
        setGetCanvas={props.setGetCanvas}
        setGetCluster={props.setGetCluster}
        exportSelectionCallback={props.exportPhylocanvasSelectionCallback}
        primaryColumn={props.primaryColumn}
        colorScheme={props.colorScheme}
        colorGroup={props.colorGroup}
        resetTreeBool={resetTreeBool}
        setResetTreeBool={setResetTreeBool}
      />
      <div style={{ position: "absolute", display: "flex", flexFlow: "row", top: 0, right: 0, zIndex: 2 }}>
        <SvgButton
          label="tree options"
          svg="menuContext"
          dropAlign="right"
          drop={
            <div style={{ maxHeight: props.height - 60 }}>
              <h5>Toggle:</h5>
              <Box sx={{ paddingLeft: "15px", paddingRight: "15px" }}>
                <div>labels: <Switch checked={showLabels} onChange={() => {setShowLabels(!showLabels)}} /></div>
                <div>align: <Switch checked={align} onChange={() => {setAlign(!align)}} /></div>
              </Box>
              <hr/>
              <h5>Style:</h5>
              <Box sx={{ paddingLeft: "15px", paddingRight: "15px" }}>
                <span>text size: <b>{textSize}</b>px</span>
                <Slider value={textSize} step={2} min={20} max={50} size="small" onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === 'number') {
                    setTextSize(newValue);
                  }
                }} />
                <span>line width: <b>{lineWidth}</b>px</span>
                <Slider value={lineWidth} step={1} min={1} max={10} size="small" onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === 'number') {
                    setLineWidth(newValue);
                  }
                }} />
              </Box>
              <hr/>
              <h5>Tree Type:</h5>
              <Box sx={{ paddingLeft: "15px", paddingRight: "15px" }}>
                <SvgButton key="radial" onClick={() => setType("radial")} svg="treeRadial" label="radial" />
                <SvgButton key="rect" onClick={() => setType("rectangular")} svg="treeRectangular" label="rectangular" />
                <SvgButton key="cir" onClick={() => setType("circular")} svg="treeCircular" label="circular" />
                <SvgButton key="diag" onClick={() => setType("diagonal")} svg="treeDiagonal" label="diagonal" />
                <SvgButton key="hier" onClick={() => setType("hierarchical")} svg="treeHierarchical" label="hierarchical" />
              </Box>
              <hr/>
              <h5>Other:</h5>
              <Box sx={{ paddingLeft: "15px", paddingRight: "15px" }}>
                <SvgButton onClick={() => {
                  setResetTreeBool(true)
                  setType(defaultType)
                  setShowLabels(defaultShowLabels)
                  setAlign(defaultAlign)
                  setNodeSize(defaultNodeSize)
                  setTextSize(defaultTextSize)
                  setLineWidth(defaultLineWidth)
                }} label="reset tree" />
              </Box>
              <div style={{ height: "7px" }} />
            </div>
          }
        />
      </div>
      <div style={{ zIndex: 1, position: "absolute", display: "flex", flexFlow:"row", bottom: 0, right: 0 }}>
        <SvgButton
          svg={(type === "hierarchical" && stretchOrientation === "horizontal" ? "vertical" : type === "hierarchical" && stretchOrientation === "vertical" ? "horizontal" : stretchOrientation) + "Scale"}
          onClick={() => cycleOrientation()}
        />
      </div>
    </div>
  )
}

export default PhylocanvasView;
