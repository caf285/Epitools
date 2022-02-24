import React, { useEffect, useState, useRef } from "react";

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Chip from '@mui/material/Chip';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function SvgButton(props) {

  let svgList = useRef(
    {
      "blank": "",
      "menuSettings": "m1,12h20z m0,-6h20z m0,12h20z",
      "menuContext": "m1,6h4z m4,0a2,2,0,1,0,4,0a2,2,0,1,0,-4,0z m7,0h9z m9,6h-4z m-4,0a2,2,0,1,0,-4,0a2,2,0,1,0,4,0z m-7,0h-9z m-9,6h8z m8,0a2,2,0,1,0,4,0a2,2,0,1,0,-4,0z m7,0h5z",
      "treeRadial": "m11,12l-10,1zl0,-6zl4,3z m0,-6l-3,-4zl5,-4z m4,9l-1,7zl6,-1z",
      "treeRectangular": "m4,4h14zv13z m0,7h-3z  m6,6h-6zv-6zv4z m0,-6h12z m0,10h9z",
      "treeCircular": "m11,12l3.5,3.5z m-5,0h-5za5,5,0,1,0,8.5,-3.5a5,5,0,1,1,-8.5,3.5z m8.5,-3.5l3.5,-3.5z m-3,-6.5a10,10,0,0,1,0,20a10,10,0,0,0,0,-20z m-8,3.5a10,10,0,0,0,0,13a10,10,0,0,1,0,-13z",
      "treeDiagonal": "m0,12l18,-9zl18,9z m8,-4l10,5z",
      "treeHierarchical": "m19,5v14zh-13z m-7,0v-3z m-6,6v-6zh-4zh6z m6,0v12z m-10,0v9z"
    }
  );

  let [svg, setSvg] = useState(svgList.current["blank"]);
  let [label, setLabel] = useState("");
  let [drop, setDrop] = useState(false);

  useEffect(() => {
    setSvg(svgList.current[props.svg])
    setLabel(props.label)
    setDrop(props.drop)
  }, [])

  function getDrop() {
    if (drop) {
      return (
        props.onClick ? props.onClick : () => {}
      )
    }
    return undefined;
  }

  function getIcon() {
    if (svg) {
      return (
        <SvgIcon>
          <path stroke="dimgray" fill="transparent" strokeWidth="2" strokeLinejoin="round" d={svg}></path>
        </SvgIcon>
      )
    }
    return undefined;
  }

  if (svg && !label && !drop) {
    return (
      <IconButton centerRipple={false} size="small" onClick={props.onClick} sx={{backgroundColor: "#ddd", boxShadow: "-1px 1px 1px rgba(0, 0, 0, .5)", "&:hover": {boxShadow: "-1px 1px 2px rgba(0, 0, 0, .7)", backgroundColor: "#eee"}}}>
        <SvgIcon sx={{height: 16, width: 16}}>
          <path stroke="dimgray" fill="transparent" strokeWidth="2" strokeLinejoin="round" d={svg}></path>
        </SvgIcon>
      </IconButton>
    )
  } else {
    return (
      <Chip
        onClick={props.onClick}
        size="small"
        label={label ? label : undefined}
        deleteIcon=<ArrowDropDownIcon />
        onDelete={getDrop()}
        sx={{backgroundColor: "#ddd", boxShadow: "-1px 1px 1px rgba(0, 0, 0, .5)", "&:hover": {boxShadow: "-1px 1px 2px rgba(0, 0, 0, .7)", backgroundColor: "#eee", cursor: "pointer"}}}
        icon={getIcon()}
        clickable
        disableRipple={false}
        centerRipple={false}
      />
    )
  }
}

export default SvgButton;
