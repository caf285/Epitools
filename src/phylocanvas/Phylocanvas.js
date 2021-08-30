import React, { useEffect, useRef } from "react";
import Phylocanvas from "phylocanvas";
import scalebar from "phylocanvas-plugin-scalebar";
import branchLength from "phylocanvas-plugin-branch-length";
Phylocanvas.plugin(scalebar)
Phylocanvas.plugin(branchLength)

function PhylocanvasView(props) {
  let phylocanvas = useRef();
  let typeList = useRef(["radial", "rectangular", "circular", "diagonal", "hierarchical"])

  useEffect(() => {
    phylocanvas.current = Phylocanvas.createTree("phylocanvas")
  }, [])

  useEffect(() => {
    phylocanvas.current.load(props.tree)
  }, [props.tree])

  useEffect(() => {
    if (typeList.current.includes(props.type)) {
      phylocanvas.current.setTreeType(props.type)
    } else {
      phylocanvas.current.setTreeType("circular")
    }
  }, [props.type])

  useEffect(() => {
    phylocanvas.current.showLabels = props.labels
    phylocanvas.current.alignLabels = props.align
    phylocanvas.current.setNodeSize(props.nodeSize)
    phylocanvas.current.setTextSize(props.textSize)
    phylocanvas.current.lineWidth = props.lineWidth
    phylocanvas.current.draw()
  }, [props.type, props.labels, props.align, props.nodeSize, props.textSize, props.lineWidth])

  return (
    <div id="phylocanvas"></div>
  )
}

export default PhylocanvasView;
