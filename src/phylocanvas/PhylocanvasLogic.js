import React, { useEffect, useState, useRef, useCallback } from "react";
import Phylocanvas, { utils } from "phylocanvas";

import scalebar from "phylocanvas-plugin-scalebar";
import branchLength from "phylocanvas-plugin-branch-length";
import enhancedBranchLabels from "phylocanvas-plugin-enhanced-branch-labels";
import root from "phylocanvas-plugin-root";
import pairwiseOps from "phylocanvas-plugin-pairwise-ops";
import treeStats from "phylocanvas-plugin-tree-stats";
import stretchOrientation from "phylocanvas-plugin-stretch-orientation";
Phylocanvas.plugin(scalebar)
Phylocanvas.plugin(branchLength)
//Phylocanvas.plugin(enhancedBranchLabels)
Phylocanvas.plugin(root)
Phylocanvas.plugin(pairwiseOps)
Phylocanvas.plugin(treeStats)
Phylocanvas.plugin(stretchOrientation)

const { getPixelRatio } = utils.canvas;

function PhylocanvasLogic(props) {
  // destructure props
  const nwk = props.nwk
  const clusterDistance = props.clusterDistance
  const clusterSize = props.clusterSize
  const lineWidth = props.lineWidth
  const setGetNwk = props.setGetNwk
  const setGetCanvas = props.setGetCanvas
  const setGetCluster = props.setGetCluster
  const exportSelectionCallback = props.exportSelectionCallback
  const importSelection = props.importSelection
  const branchNameCallback = props.branchNameCallback
  const branchesData = props.branchesData
  const primaryColumn = props.primaryColumn
  const metadataLabels = props.metadataLabels

  const containerRef = useRef()
  const phylocanvas = useRef();
  const typeList = useRef(["radial", "rectangular", "circular", "diagonal", "hierarchical"]);

  useEffect(() => {
    if (phylocanvas.current) {
      phylocanvas.current.resizeToContainer()
      phylocanvas.current.fitInPanel()
      phylocanvas.current.draw()
    }
    //window.dispatchEvent(new Event('resize'))
    console.log(props.height)
    console.log(phylocanvas.current)
  }, [props.height])

  // set data getters on component load (fills all callbacks for retrieving dynamic data)
  useEffect(() => {
    if (setGetNwk) {
      setGetNwk(() => () => {
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
    if (setGetCanvas) {
      setGetCanvas(() => () => {
        return phylocanvas.current.canvas.canvas;
      })
    }
  }, [setGetNwk, setGetCanvas])

  // color branches on scheme/group change
  // leafStyle only supports ['lineWidth', 'strokeStyle', 'fillStyle']
  // labelStyle only supports ['colour', 'format', 'textSize', 'font']
  const colorPhylocanvas = useCallback(() => {
    if (phylocanvas.current) {
      console.log(phylocanvas.current)
      if (props.colorScheme && props.colorGroup) {
        // reset all non colored nodes to empty style
        for (let leaf of Object.keys(phylocanvas.current.branches).filter(branch => phylocanvas.current.branches[branch].leaf == true && ![].concat(...props.colorGroup).includes(branch))) {
          phylocanvas.current.branches[leaf].setDisplay({ leafStyle: {} })
          phylocanvas.current.branches[leaf].setDisplay({ labelStyle: {} })
        }
        for (let i = 0; i < props.colorGroup.length; i++) {
          for (let j = 0; j < props.colorGroup[i].length; j++) {
            phylocanvas.current.branches[props.colorGroup[i][j]].setDisplay({ leafStyle: { strokeStyle: "#" + props.colorScheme[i % props.colorScheme.length], fillStyle: "#" + props.colorScheme[i % props.colorScheme.length] } })
            phylocanvas.current.branches[props.colorGroup[i][j]].setDisplay({ labelStyle: { colour: "#" + props.colorScheme[i % props.colorScheme.length] } })
          }
        }
        //console.log("phylocanvasColors:", props.colorScheme, props.colorGroup)
      }
      phylocanvas.current.draw()
    }
  }, [props.colorScheme, props.colorGroup])
  useEffect(() => {
    colorPhylocanvas()
  }, [colorPhylocanvas, props.colorScheme, props.colorGroup])

  // load tree on component load and add listener for click action to export selected ids
  useEffect(() => {
    phylocanvas.current = Phylocanvas.createTree(containerRef.current)
    phylocanvas.current.addListener("click", () => {
      checkSelectionCallback(phylocanvas.current.leaves.map(leaf => leaf.id))
      exportSelectionCallback(phylocanvas.current.getSelectedNodeIds())
    })
  }, [exportSelectionCallback])

  // select all branches from handsontable selection import
  const checkSelectionCallback = useCallback((branches) => {
    if (branches && branches.length > 0) {
      let branchParents = []
      for (let branch of branches) {
        if (phylocanvas.current.branches[branch].parent) {
          branchParents.push(phylocanvas.current.branches[branch].parent.id)
        }
        if (phylocanvas.current.branches[branch].children.length > 0) {
          phylocanvas.current.branches[branch].selected = false
          if (phylocanvas.current.branches[branch].children.filter(child => !child.selected).length === 0) {
            phylocanvas.current.branches[branch].selected = true
          }
        }
      }
      checkSelectionCallback(branchParents)
    }
    if (phylocanvas.current.maxBranchLength > 0) {
      phylocanvas.current.draw()
    }
  }, [])

  useEffect(() => {
    for (let branch in phylocanvas.current.branches) {
      if (importSelection.includes(branch)) {
        phylocanvas.current.branches[branch].selected = true
      } else {
        phylocanvas.current.branches[branch].selected = false
      }
    }
    checkSelectionCallback(phylocanvas.current.leaves.map(leaf => leaf.id))
  }, [importSelection])

  useEffect(() => {
    phylocanvas.current.load(nwk)
    exportSelectionCallback([])
    if (branchNameCallback) {
      branchNameCallback(phylocanvas.current.leaves.map(x => x["id"]))
    }
  }, [nwk])

  // return branch names on nwk change so names can be queried
  const resetTreeCallback = useCallback(() => {
    if (props.resetTreeBool) {
      for (let branch in phylocanvas.current.branches) {
        phylocanvas.current.branches[branch].selected = false
      }
      exportSelectionCallback([])
      phylocanvas.current.fitInPanel()
      phylocanvas.current.draw()
      props.setResetTreeBool(false)
    }
  }, [exportSelectionCallback, props.resetTreeBool])

  // update and redraw tree when treeType, lineWidth, text/label size changes
  useEffect(() => {
    if (typeList.current.includes(props.type)) {
      phylocanvas.current.setTreeType(props.type)
    } else {
      phylocanvas.current.setTreeType("rectangular")
    }
    phylocanvas.current.setTextSize(props.textSize)
    phylocanvas.current.lineWidth = props.lineWidth * getPixelRatio(phylocanvas.current.canvas) / 2
  }, [props.type])
  useEffect(() => {
    phylocanvas.current.lineWidth = props.lineWidth * getPixelRatio(phylocanvas.current.canvas) / 2
  }, [props.lineWidth])
  useEffect(() => {
    phylocanvas.current.setNodeSize(props.nodeSize)
  }, [props.nodeSize])
  useEffect(() => {
    phylocanvas.current.setTextSize(props.textSize)
    if (props.resetTreeBool) {
      resetTreeCallback()
    }
  }, [props.textSize, resetTreeCallback])
  useEffect(() => {
    phylocanvas.current.showLabels = props.showLabels
    phylocanvas.current.alignLabels = props.align
    phylocanvas.current.lineWidth = props.lineWidth * getPixelRatio(phylocanvas.current.canvas) / 2
    phylocanvas.current.draw()
  }, [props.showLabels, props.align, props.lineWidth])

  // for orientation of phylocanvas stretch, horizontal, vertical, or both
  useEffect(() => {
    phylocanvas.current.stretchOrientation.orientation = props.stretchOrientation
  }, [props.stretchOrientation])

  // append metadata to each branch label
  const appendMetadataCallback = useCallback(() => {
    //console.log("primary column", props.primaryColumn)
    //console.log(phylocanvas.current.branches)
    //console.log(Object.keys(phylocanvas.current.branches))
    if (branchesData && branchesData.length >= 1) {
      //console.log(props.branchesData[0][Object.keys(branchesData[0])[primaryColumn]])
    }
    if (phylocanvas.current.treeStats) {
      for (let i in branchesData) {
        if (Object.keys(phylocanvas.current.branches).includes(branchesData[i][Object.keys(branchesData[i])[primaryColumn]])) {
          let additionalMetadata = [phylocanvas.current.branches[branchesData[i][Object.keys(branchesData[i])[primaryColumn]]]["id"]]
          phylocanvas.current.branches[branchesData[i][Object.keys(branchesData[i])[primaryColumn]]].clearMetadata()
          for (let j in metadataLabels) {
            additionalMetadata.push(branchesData[i][metadataLabels[j]])
            phylocanvas.current.branches[branchesData[i][Object.keys(branchesData[i])[primaryColumn]]].appendMetadata(branchesData[i][metadataLabels[j]])
          }
          phylocanvas.current.branches[branchesData[i][Object.keys(branchesData[i])[primaryColumn]]]["label"] = additionalMetadata.join("_")
        }
        phylocanvas.current.draw()
      }
    }
    //console.log(phylocanvas.current)
  }, [metadataLabels, branchesData, primaryColumn])
  useEffect(() => {
    appendMetadataCallback()
  }, [metadataLabels, appendMetadataCallback])


  //  update cluster parameters and link pairwiseOps functions to phylocanvas callback
  useEffect(() => {
    phylocanvas.current.pairwiseOps.clusterDistance = clusterDistance
    phylocanvas.current.pairwiseOps.clusterSize = clusterSize
  }, [clusterDistance, clusterSize])

  useEffect(() => {
    if (setGetCluster) {
      setGetCluster(() => () => phylocanvas.current.pairwiseOps.buildCluster)
    }
  }, [setGetCluster])

  return (
    <div ref={containerRef} style={{ height: "100%", width: "100%" }}></div>
  )
}

export default PhylocanvasLogic;
