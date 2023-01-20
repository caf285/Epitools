import React from "react";
import "./Nav.css";

function Footer() {
  return (
    <div className="Nav-footer">
      <div>Epitools</div>
      <div>{new Date().getFullYear()} © All Rights Reserved TGen.</div>
    </div>
  )
}

export default Footer;
