import React from "react";
import "./InfoButton.css";

function InfoButton(props) {
  return (
    <div className="InfoButton">
      <div className="InfoButtonButton">&#9432;</div>
      <div className="InfoButtonTextBox">{props.text}</div>
    </div>
  )
}

export default InfoButton;
