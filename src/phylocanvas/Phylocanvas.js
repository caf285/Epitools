import React, { useEffect, useRef } from "react";
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
  let typeList = useRef(["radial", "rectangular", "circular", "diagonal", "hierarchical"])

  useEffect(() => {
    phylocanvas.current = Phylocanvas.createTree("phylocanvas")
    console.log(phylocanvas.current)
  }, [])

  useEffect(() => {
    phylocanvas.current.load(props.tree)
  }, [props.tree])

  useEffect(() => {
    if (typeList.current.includes(props.type)) {
      phylocanvas.current.setTreeType(props.type)
    } else {
      phylocanvas.current.setTreeType("rectangular")
    }
    phylocanvas.current.setNodeSize(props.nodeSize * getPixelRatio(phylocanvas.current.canvas) / 2)
    phylocanvas.current.setTextSize(props.textSize * getPixelRatio(phylocanvas.current.canvas) / 2)
    phylocanvas.current.lineWidth = props.lineWidth * getPixelRatio(phylocanvas.current.canvas) / 2
  }, [props.type])

  useEffect(() => {
    phylocanvas.current.setNodeSize(props.nodeSize * getPixelRatio(phylocanvas.current.canvas) / 2)
  }, [props.nodeSize])

  useEffect(() => {
    phylocanvas.current.setTextSize(props.textSize * getPixelRatio(phylocanvas.current.canvas) / 2)
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
    console.log(phylocanvas.current)
    phylocanvas.current.pairwiseOps.clusterDraw = true
    phylocanvas.current.draw()
  }, [props.clusterDistance, props.clusterSamples])

  return (
    <div id="phylocanvas"></div>
  )
}

export default PhylocanvasView;
