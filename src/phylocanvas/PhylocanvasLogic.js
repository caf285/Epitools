import React, { useEffect, useState, useRef } from "react";
import Phylocanvas, { utils } from "phylocanvas";

import scalebar from "phylocanvas-plugin-scalebar";
import branchLength from "phylocanvas-plugin-branch-length";
import root from "phylocanvas-plugin-root";
import pairwiseOps from "phylocanvas-plugin-pairwise-ops";
import treeStats from "phylocanvas-plugin-tree-stats";
Phylocanvas.plugin(scalebar)
Phylocanvas.plugin(branchLength)
Phylocanvas.plugin(root)
Phylocanvas.plugin(pairwiseOps)
Phylocanvas.plugin(treeStats)

const { getPixelRatio } = utils.canvas;

function PhylocanvasLogic(props) {

  useEffect(() => {
    setHW(props.height, widthRef.current)
    window.dispatchEvent(new Event('resize'))
    if (phylocanvas.current) {
      phylocanvas.current.setTreeType(phylocanvas.current.treeType)
      phylocanvas.current.setNodeSize(nodeSizeRef.current);
      phylocanvas.current.setTextSize(textSizeRef.current);
    }
  }, [props.height])

  let phylocanvas = useRef();
  let minHeight = 100
  let minWidth = 100

  // [height, width]
  let [hw, _setHW] = useState([minHeight, minWidth])
  let heightRef = useRef(hw[0])
  let widthRef = useRef(hw[1])
  let setHW = data => {
    heightRef.current = data[0]
    widthRef.current = data[1]
    _setHW(data)
  }

  // [nodeSize, textSize, lineWidth]
  let [textSize, _setTextSize] = useState(1);
  let textSizeRef = useRef(textSize);
  let setTextSize = data => {
    textSizeRef.current = data;
    _setTextSize(data);
  }
  let [nodeSize, _setNodeSize] = useState(1);
  let nodeSizeRef = useRef(nodeSize);
  let setNodeSize = data => {
    nodeSizeRef.current = data;
    _setNodeSize(data);
  }

  let typeList = useRef(["radial", "rectangular", "circular", "diagonal", "hierarchical"]);

  //TODO: Fix height inheritance problem (relative height to window size without adding to window size for positive feedback loop)

  useEffect(() => {
    function initialSize() {
      window.dispatchEvent(new Event('resize'))
      phylocanvas.current.setTreeType(phylocanvas.current.treeType)
    }
    window.addEventListener("load", initialSize);
    return () => {
      window.removeEventListener("load", initialSize);
    };
  }, [heightRef.current])

  useEffect(() => {
    phylocanvas.current = Phylocanvas.createTree("phylocanvas")
    phylocanvas.current.addListener("click", () => {
      props.exportSelectionCallback(phylocanvas.current.getSelectedNodeIds())
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    //console.log("phylocanvas import:", props.importSelection)
    for (let branch in phylocanvas.current.branches) {
      //console.log("checking for", branch, "in", props.importSelection)
      if (props.importSelection.includes(branch)) {
        phylocanvas.current.branches[branch].selected = true
      } else {
        phylocanvas.current.branches[branch].selected = false
      }
      phylocanvas.current.draw()
    }
    //phylocanvas.current.clearSelect()
  }, [props.importSelection])

  useEffect(() => {
    props.exportSelectionCallback([])
    let oldTree = phylocanvas.current.stringRepresentation
    try {
      phylocanvas.current.load(props.tree)
      phylocanvas.current.setTreeType("rectangular")
    } catch (error) {
      phylocanvas.current.load(oldTree)
    }
    if (props.branchNameCallback) {
      props.branchNameCallback(phylocanvas.current.leaves.map(x => x["id"]))
    }
    // eslint-disable-next-line
  }, [props.tree])

  /*
  TODO: Uncomment this.
  useEffect(() => {
    if (props.branchesData) {
      for (let meta of props.branchesData) {
        console.log("---------meta:", meta)
        console.log(phylocanvas.current.branches[meta.Name])
        phylocanvas.current.branches[meta.Name].clearMetadata()
        phylocanvas.current.branches[meta.Name].appendMetadata(["  Pathogen:", meta.Pathogen].join(' '))
        phylocanvas.current.branches[meta.Name].appendMetadata(["  Facility:", meta.Facility].join(' '))
        phylocanvas.current.branches[meta.Name].appendMetadata(["  Collection:", meta.Collection_date].join(' '))
      }
    }
  }, [props.branchesData])
  */
  useEffect(() => {
    if (typeList.current.includes(props.type)) {
      phylocanvas.current.setTreeType(props.type)
    } else {
      phylocanvas.current.setTreeType("rectangular")
    }
    //setTextSize(props.textSize * getPixelRatio(phylocanvas.current.canvas) / 2);
    phylocanvas.current.setNodeSize(nodeSizeRef.current)
    phylocanvas.current.setTextSize(textSizeRef.current)
    phylocanvas.current.lineWidth = props.lineWidth * getPixelRatio(phylocanvas.current.canvas) / 2
  }, [props.type, props.lineWidth])

  useEffect(() => {
    setNodeSize(props.nodeSize * getPixelRatio(phylocanvas.current.canvas) / 2)
    phylocanvas.current.setNodeSize(nodeSizeRef.current)
  }, [props.nodeSize])

  useEffect(() => {
    setTextSize(props.textSize * getPixelRatio(phylocanvas.current.canvas) / 2);
    phylocanvas.current.setTextSize(textSizeRef.current)
  }, [props.textSize])

  useEffect(() => {
    phylocanvas.current.showLabels = props.labels
    phylocanvas.current.alignLabels = props.align
    phylocanvas.current.lineWidth = props.lineWidth * getPixelRatio(phylocanvas.current.canvas) / 2
    phylocanvas.current.draw()
  }, [props.labels, props.align, props.lineWidth])

  useEffect(() => {
    phylocanvas.current.pairwiseOps.clusterDistance = props.clusterDistance
    phylocanvas.current.pairwiseOps.clusterSamples = props.clusterSamples
    //console.log(phylocanvas.current)
    phylocanvas.current.pairwiseOps.clusterDraw = true
    phylocanvas.current.draw()
  }, [props.clusterDistance, props.clusterSamples])

  useEffect(() => {
    if (props.triggerCanvasCallback && props.triggerCanvasCallback === true) {
      props.exportCanvasCallback(phylocanvas.current.canvas.canvas.toDataURL('image/png'))
    }
  }, [props.triggerCanvasCallback])

  return (
    <div style={{ height: "100%" }}>
      {/*<div id="phylocanvas" style={{height: heightRef.current + "px", width: "100%", minHeight: minHeight + "px", minWidth: minWidth + "px"}}></div>*/}
      <div id="phylocanvas" style={{ height: "100%", width: "100%", minHeight: props.height + "px", minWidth: minWidth + "px" }}></div>
    </div>
  )
}

export default PhylocanvasLogic;
