import React, { useEffect, useState, useRef } from "react";
import "./SvgButton.css";

import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Chip from '@mui/material/Chip';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function SvgButton(props) {
  const [visibility, setVisibility] = useState("none");

  // svg button canvas is 20x20 pixels
  let svgList = useRef(
    {
      "blank": "",
      "menuSettings": "m1,12h20z m0,-6h20z m0,12h20z",
      "menuContext": "m1,6h4z m4,0a2,2,0,1,0,4,0a2,2,0,1,0,-4,0z m7,0h9z m9,6h-4z m-4,0a2,2,0,1,0,-4,0a2,2,0,1,0,4,0z m-7,0h-9z m-9,6h8z m8,0a2,2,0,1,0,4,0a2,2,0,1,0,-4,0z m7,0h5z",
      "treeRadial": "m11,12l-10,1zl0,-6zl4,3z m0,-6l-3,-4zl5,-4z m4,9l-1,7zl6,-1z",
      "treeRectangular": "m4,4h14zv13z m0,7h-3z  m6,6h-6zv-6zv4z m0,-6h12z m0,10h9z",
      "treeCircular": "m11,12l3.5,3.5z m-5,0h-5za5,5,0,1,0,8.5,-3.5a5,5,0,1,1,-8.5,3.5z m8.5,-3.5l3.5,-3.5z m-3,-6.5a10,10,0,0,1,0,20a10,10,0,0,0,0,-20z m-8,3.5a10,10,0,0,0,0,13a10,10,0,0,1,0,-13z",
      "treeDiagonal": "m0,12l18,-9zl18,9z m8,-4l10,5z",
      "treeHierarchical": "m19,5v14zh-13z m-7,0v-3z m-6,6v-6zh-4zh6z m6,0v12z m-10,0v9z",
      "horizontalScale": "m0,12l4,3l0,-6l-4,3z m9,0a3,3,0,0,0,6,0a3,3,0,0,0,-6,0z m15,0l-4,3l0,-6l4,3z",
      "verticalScale": "m12,0l3,4l-6,0l3,-4z m0,9a3,3,0,0,0,0,6a3,3,0,0,0,0,-6z m0,15l3,-4l-6,0l3,4z",
      "bothScale": "m0,12l4,3l0,-6l-4,3z m9,0a3,3,0,0,0,6,0a3,3,0,0,0,-6,0z m15,0l-4,3l0,-6l4,3z   m-12,-12l3,4l-6,0l3,-4z  m0,24l3,-4l-6,0l3,4z"
    }
  );

  let [svg, setSvg] = useState(svgList.current["blank"]);
  let [label, setLabel] = useState("");

  useEffect(() => {
    setSvg(svgList.current[props.svg])
    setLabel(props.label)
  }, [props.svg, props.label])

  function getDrop() {
    if (props.drop) {
      return (
        props.onClick ? props.onClick : props.drop ? () => {
            if (visibility === "flex") {
              setVisibility("none")
            } else {
              setVisibility("flex")
            }
          } : () => {}
      )
    }
    return undefined;
  }

  function getIcon() {
    if (props.svg) {
      return (
          <SvgIcon sx={{height: 17, width: 17}}>
            <path stroke="dimgray" fill="dimgray" strokeWidth="2" d={svg}></path>
          </SvgIcon>
      )
    }
    return undefined;
  }

  if (props.svg && !props.label && !props.drop) {
    return (
      <div className="SvgButton">
        <IconButton centerRipple={false} size="small" onClick={props.onClick} sx={{width: "25px", height: "24px", backgroundColor: "#ddd", boxShadow: "-1px 1px 1px rgba(0, 0, 0, .5)", "&:hover": {boxShadow: "-1px 1px 2px rgba(0, 0, 0, .7)", backgroundColor: "#eee"}}}>
          <SvgIcon sx={{height: 17, width: 17}}>
            <path stroke="dimgray" fill="dimgray" strokeWidth="2" d={svg}></path>
          </SvgIcon>
        </IconButton>
      </div>
    )
  } else {
    return (
      <div className="SvgButton" onMouseLeave={() => {setVisibility("none")}}>
        <Chip
          onClick={props.onClick ? props.onClick : props.drop ? () => {
            if (visibility === "flex") {
              setVisibility("none")
            } else {
              setVisibility("flex")
            }
          } : () => {}}
          size="small"
          label={label ? label : undefined}
          deleteIcon=<ArrowDropDownIcon />
          onDelete={getDrop()}
          sx={{zIndex: "100", backgroundColor: "#ddd", boxShadow: "-1px 1px 1px rgba(0, 0, 0, .5)", "&:hover": {boxShadow: "-1px 1px 2px rgba(0, 0, 0, .7)", backgroundColor: "#eee", cursor: "pointer"}}}
          icon={getIcon()}
          clickable
          disableRipple={false}
          centerRipple={false}
        />
        <div onMouseLeave={() => {setVisibility("none")}} style={{ display: visibility, alignSelf: props.dropAlign && props.dropAlign.toLowerCase() === "right" ? "flex-end" : "flex-start" }}>
          <div style={props.dropAlign && props.dropAlign.toLowerCase() === "right" ? { transform: "translateX(-100%)", zIndex: "101", position: "absolute", minWidth: "200px" } : { zIndex: "101", position: "absolute", minWidth: "200px" }}>
            <div style={{ position: "relative" }}>
              <div className="DropZ" style={(props.maxHeight) ? { maxHeight: props.maxHeight } : {}}>
                {props.drop}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SvgButton;
