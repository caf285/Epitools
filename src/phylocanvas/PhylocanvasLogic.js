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

function PhylocanvasView(props) {
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
    function handleResize() {
      
      //setHeight(document.getElementsByClassName("Nav-body")[0].clientHeight)
      let newHeight = Math.max( Math.max( document.documentElement.clientHeight || 0, window.innerHeight || 0) - document.getElementsByClassName("Nav-header")[0].clientHeight * 2, minHeight )
      let newWidth = Math.max( document.documentElement.clientWidth || minWidth, window.innerWidth || minWidth, minWidth)
      //let heightDelta = heightRef.current / newHeight
      //let widthDelta = widthRef.current / newWidth
      setHW([newHeight, newWidth])
      phylocanvas.current.setTreeType(phylocanvas.current.treeType)
      phylocanvas.current.setNodeSize(nodeSizeRef.current);
      phylocanvas.current.setTextSize(textSizeRef.current);
    }
    function initialSize() {
      window.dispatchEvent(new Event('resize')) 
      phylocanvas.current.setTreeType(phylocanvas.current.treeType)
    } 
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", initialSize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", initialSize);
    };
  }, [minHeight, minWidth])

  useEffect(() => {
    phylocanvas.current = Phylocanvas.createTree("phylocanvas")
  }, [])

  useEffect(() => {
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
  }, [props.tree])

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

  return (
    <div style={{height: "100%"}}>
      {/*<div id="phylocanvas" style={{height: heightRef.current + "px", width: "100%", minHeight: minHeight + "px", minWidth: minWidth + "px"}}></div>*/}
      <div id="phylocanvas" style={{height: "100%", width: "100%", minHeight: minHeight + "px", minWidth: minWidth + "px"}}></div>
    </div>
  )
}

export default PhylocanvasView;
