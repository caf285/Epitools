import React, {useEffect} from "react";
import Plotly from "plotly.js-dist";

function PlotlyView(props) {

  useEffect(() => {
    Plotly.react('plotly', props.data)
  }, [props.data])

  return (
    <div id="plotly"></div>
  )
}

export default PlotlyView;
