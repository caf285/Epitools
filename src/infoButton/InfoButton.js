import React, { useEffect, useRef } from "react";
import "./InfoButton.css";

function InfoButton(props) {

  const button = useRef()
  const box = useRef()

  function setBoxHeight(e) {
    box.current.style.top = e.getBoundingClientRect().top + "px"
    box.current.style.left = (e.getBoundingClientRect().left - 5) + "px"
  }

  return (
    <div className="InfoButton">
      <div className="InfoButtonButton" ref={button} onWheel={() => {setTimeout(() => {setBoxHeight(button.current)}, 50)}} onMouseOver={() => {setBoxHeight(button.current)}}>&#9432;</div>
      <div className="InfoButtonTextBox" ref={box}>{props.text}</div>
    </div>
  )
}

export default InfoButton;
