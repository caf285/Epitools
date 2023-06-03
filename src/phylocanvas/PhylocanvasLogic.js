import React, { useEffect, useState, useRef } from "react";
import Phylocanvas, { utils } from "phylocanvas";

import scalebar from "phylocanvas-plugin-scalebar";
import branchLength from "phylocanvas-plugin-branch-length";
import root from "phylocanvas-plugin-root";
import pairwiseOps from "phylocanvas-plugin-pairwise-ops";
import treeStats from "phylocanvas-plugin-tree-stats";
import stretchOrientation from "phylocanvas-plugin-stretch-orientation";
Phylocanvas.plugin(scalebar)
Phylocanvas.plugin(branchLength)
Phylocanvas.plugin(root)
Phylocanvas.plugin(pairwiseOps)
Phylocanvas.plugin(treeStats)
Phylocanvas.plugin(stretchOrientation)

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

  useEffect(() => {
    // set data getters on component load
    if (props.setGetNwk) {
      props.setGetNwk(() => () => {
        // get nwk string
        let treeString = phylocanvas.current.stringRepresentation
        // append leaf labels to nwk string
        for (let leaf of phylocanvas.current.leaves) {
          let label = leaf.label
          for (let character of ["(", ")", ":", ";", " "]) {
            label = label.replaceAll(character, "_")
          }   
          treeString = treeString.replace(leaf.id, label)
        }
        // export nwk string
        return treeString
      })
    }
    if (props.setGetCanvas) {
      props.setGetCanvas(() => () => {
        return phylocanvas.current.canvas.canvas;
      })
    }
  }, [])

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

  // load tree on component load and add listener for click action to export selected ids
  useEffect(() => {
    phylocanvas.current = Phylocanvas.createTree("phylocanvas")
    phylocanvas.current.addListener("click", () => {
      props.exportSelectionCallback(phylocanvas.current.getSelectedNodeIds())
    })
  }, [])

  // select all branches from handsontable selection import
  useEffect(() => {
    for (let branch in phylocanvas.current.branches) {
      if (props.importSelection.includes(branch)) {
        phylocanvas.current.branches[branch].selected = true
      } else {
        phylocanvas.current.branches[branch].selected = false
      }
      phylocanvas.current.draw()
    }
  }, [props.importSelection])

  // return branch names on nwk change so names can be queried
  useEffect(() => {
    props.exportSelectionCallback([])
    let oldTree = phylocanvas.current.stringRepresentation
    try {
      phylocanvas.current.load(props.nwk)
      phylocanvas.current.setTreeType("rectangular")
    } catch (error) {
      phylocanvas.current.load(oldTree)
    }
    phylocanvas.current.setNodeSize(nodeSizeRef.current)
    phylocanvas.current.setTextSize(textSizeRef.current)
    phylocanvas.current.lineWidth = props.lineWidth * getPixelRatio(phylocanvas.current.canvas) / 2
    console.log(phylocanvas.current)
    if (props.branchNameCallback) {
      props.branchNameCallback(phylocanvas.current.leaves.map(x => x["id"]))
    }
  }, [props.nwk])

  // update and redraw tree when treeType, lineWidth, text/label size changes
  useEffect(() => {
    if (typeList.current.includes(props.type)) {
      phylocanvas.current.setTreeType(props.type)
    } else {
      phylocanvas.current.setTreeType("rectangular")
    }
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

  // update and redraw when cluster size/distance changes
  /*
    TODO: Highlighting clusters is overwritten by appended metadata. Multiple clusters next to eachother are
    also ambiguous. Update in phylocanvas pairwise ops plugin.
  */
  useEffect(() => {
    if (phylocanvas.current.pairwiseOps) {
      phylocanvas.current.pairwiseOps.clusterDistance = props.clusterDistance
      phylocanvas.current.pairwiseOps.clusterSamples = props.clusterSamples
      phylocanvas.current.pairwiseOps.clusterDraw = true
      phylocanvas.current.draw()
    }
  }, [props.clusterDistance, props.clusterSamples])

  // for orientation of phylocanvas stretch, horizontal, vertical, or both
  useEffect(() => {
    phylocanvas.current.stretchOrientation.orientation = props.stretchOrientation
  }, [props.stretchOrientation])

  // append metadata to each branch label
  useEffect(() => {
    console.log("primary column", props.primaryColumn)
    console.log(phylocanvas.current.branches)
    console.log(Object.keys(phylocanvas.current.branches))
    if (props.branchesData && props.branchesData.length >= 1) {
      console.log(props.branchesData[0][Object.keys(props.branchesData[0])[props.primaryColumn]])
    }
    if (phylocanvas.current.treeStats) {
      for (let i in props.branchesData) {

        if (Object.keys(phylocanvas.current.branches).includes(props.branchesData[i][Object.keys(props.branchesData[i])[props.primaryColumn]])) {
          let additionalMetadata = [phylocanvas.current.branches[props.branchesData[i][Object.keys(props.branchesData[i])[props.primaryColumn]]]["id"]]
          phylocanvas.current.branches[props.branchesData[i][Object.keys(props.branchesData[i])[props.primaryColumn]]].clearMetadata()
          for (let j in props.metadataLabels) {
            additionalMetadata.push(props.branchesData[i][props.metadataLabels[j]])
            phylocanvas.current.branches[props.branchesData[i][Object.keys(props.branchesData[i])[props.primaryColumn]]].appendMetadata(props.branchesData[i][props.metadataLabels[j]])
          }
          phylocanvas.current.branches[props.branchesData[i][Object.keys(props.branchesData[i])[props.primaryColumn]]]["label"] = additionalMetadata.join("_")
        }
        phylocanvas.current.draw()
      }
    }
  }, [props.metadataLabels])

  return (
    <div style={{ height: "100%" }}>
      {/*<div id="phylocanvas" style={{height: heightRef.current + "px", width: "100%", minHeight: minHeight + "px", minWidth: minWidth + "px"}}></div>*/}
      <div id="phylocanvas" style={{ height: "100%", width: "100%", minHeight: props.height + "px", minWidth: minWidth + "px" }}></div>
    </div>
  )
}

export default PhylocanvasLogic;
