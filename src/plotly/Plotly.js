import React, {useEffect} from "react";
import Plotly from "plotly.js-dist";

function PlotlyView() {

  useEffect(() => {
    var data = [
      {
        x: ['data1', 'data2', 'data3'],
        y: [20, 14, 23],
        type: 'bar'
      }
    ];
    Plotly.newPlot('plotly', data);

    return () => {
    }
  }, [])

  return (
    <div>
      <h1>Plotly Quickstart</h1>
      <div id="plotly"></div>
    </div>
  )
}

export default PlotlyView;
