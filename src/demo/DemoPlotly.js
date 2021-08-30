import React, {useEffect, useState} from "react";
import Plotly from "../plotly/Plotly.js";

function PlotlyView() {
  const [x, setX] = useState(["data1", "data2"]);
  const [y, setY] = useState([15, 20]);
  const [type, setType] = useState("bar");

  useEffect(() => {
    document.getElementById("demoPlotlyXLabel").value = x[0]
    document.getElementById("demoPlotlyYLabel").value = x[1]
    document.getElementById("demoPlotlyXValue").value = y[0]
    document.getElementById("demoPlotlyYValue").value = y[1]
  }, [])

  return (
    <div>
      <h1>Plotly Demo</h1>
      <Plotly
        data = {
          [
            {
              x: x,
              y: y,
              type: type
            }
          ]
        }
      />
      <h5>Labels:</h5>
      X: <input id="demoPlotlyXLabel" onChange={() => setX([document.getElementById("demoPlotlyXLabel").value, x[1]])}></input>
      &emsp;Y: <input id="demoPlotlyYLabel" onChange={() => setX([x[0], document.getElementById("demoPlotlyYLabel").value])}></input>
      <h5>Data:</h5>
      X: <input id="demoPlotlyXValue" onChange={() => setY([parseInt(document.getElementById("demoPlotlyXValue").value), y[1]])}></input>
      &emsp;Y: <input id="demoPlotlyYValue" onChange={() => setY([y[0], parseInt(document.getElementById("demoPlotlyYValue").value)])}></input>
      <h5>Type:</h5>
      <button onClick={() => setType("bar")}>Bar</button>
      <button onClick={() => setType("scatter")}>Scatter</button>
    </div>
  )
}

export default PlotlyView;
