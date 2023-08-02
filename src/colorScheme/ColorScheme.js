import React, { useEffect } from "react";
import ColorScheme from "color-scheme";
import "./ColorScheme.css";

var scheme = new ColorScheme;
scheme.from_hue(250)
      .scheme('analogic')
      .add_complement(true)
      .distance(1)
      .variation('default')
      .web_safe(false)

var colors = scheme.colors();

function ColorSchemeView(props) {
  useEffect(() => {
    if (props.setColorScheme) {
      //props.setColorScheme(colors)
      props.setColorScheme(["4285f4", "ea4335", "fbbc04", "34a853"].concat(["1a3561", "5d1a15", "466b01", "144321"], ["b3cefa", "f6b3ae", "fdeab3", "addcba"], colors))
    }
    
  }, [])

  return null;
}

export default ColorSchemeView;
