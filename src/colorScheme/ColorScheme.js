import React, { useEffect } from "react";
import ColorScheme from "color-scheme";
import "./ColorScheme.css";

var scheme = new ColorScheme;
scheme.from_hue(0)
      .scheme('analogic')
      .add_complement(true)
      .distance(1)
      .variation('hard')
      .web_safe(false)

var colors = scheme.colors();

function ColorSchemeView(props) {
  useEffect(() => {
    if (props.setColorScheme) {
      props.setColorScheme(colors)
    }
  }, [])

  return null;
}

export default ColorSchemeView;
