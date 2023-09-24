import { useEffect, useCallback } from "react";
import ColorScheme from "color-scheme";
import "./ColorScheme.css";

var scheme = new ColorScheme();
scheme.from_hue(250)
      .scheme('analogic')
      .add_complement(true)
      .distance(1)
      .variation('default')
      .web_safe(false)

var colors = scheme.colors();

function ColorSchemeView(props) {
  const setColorScheme = props.setColorScheme

  const setParentColorScheme = useCallback(() => {
    // colors = ["4285f4", "ea4335", "fbbc04", "34a853"].concat(colors)
    colors = ["C62828", "5C6BC0", "43A047", "FFEB3B", "BA68C8", "00838F", "8D6E63", "607D8B"]
    let altColors = colors
    let scale = 90
    let lighterColors = {}
    let darkerColors = {}
    for (let rgb of colors) {
      let r = parseInt(rgb.slice(0, 2), 16),
          g = parseInt(rgb.slice(2, 4), 16),
          b = parseInt(rgb.slice(4, 6), 16)
      for (let i = 1; i < 3; i++) {
        if (!Object.keys(lighterColors).includes(String(i))) {
          lighterColors[i] = []
        }
        if (!Object.keys(darkerColors).includes(String(i))) {
          darkerColors[i] = []
        }
        lighterColors[i].push(Math.min(255, r + scale * i).toString(16).padStart(2, '0') + Math.min(255, g + scale * i).toString(16).padStart(2, '0') + Math.min(255, b + scale * i).toString(16).padStart(2, '0'))
        darkerColors[i].push(Math.max(0, r - scale * i).toString(16).padStart(2, '0') + Math.max(0, g - scale * i).toString(16).padStart(2, '0') + Math.max(0, b - scale * i).toString(16).padStart(2, '0'))
      }
    }
    for (let i of Object.keys(lighterColors)) {
      altColors = altColors.concat(lighterColors[i])
      altColors = altColors.concat(darkerColors[i])
    }
    let newColorScheme = []
    for (let rgb of altColors) {
      let r = parseInt(rgb.slice(0, 2), 16),
          g = parseInt(rgb.slice(2, 4), 16),
          b = parseInt(rgb.slice(4, 6), 16),
          hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
      if (50 < hsp && hsp < 230) {
        newColorScheme.push({rgb: rgb, hsp: hsp})
        //console.log(rgb, r,g,b,hsp)
      }
    }
    if (setColorScheme) {
      setColorScheme(newColorScheme)
    }
  }, [setColorScheme])

  useEffect(() => {
    setParentColorScheme()
  }, [setParentColorScheme])

  return null;
}

export default ColorSchemeView;
