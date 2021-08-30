import React, { useEffect, useState } from "react";
import Leaflet from "../leaflet/Leaflet.js";

function LeafletView() {
  const [center, setCenter] = useState([35.2, -111.65]);
  const [zoom, setZoom] = useState(6)

  useEffect(() => {
    document.getElementById("demoLeafletXCenter").value = center[0]
    document.getElementById("demoLeafletYCenter").value = center[1]
  }, [])  

  return (
    <div>
      <h1>Leaflet Demo</h1>
      <Leaflet
        center = {center}
        zoom = {zoom}
      />
      <h5>Marker Position:</h5>
      X: <input id="demoLeafletXCenter" onChange={() => {setCenter([document.getElementById("demoLeafletXCenter").value, center[1]])}}></input>
      &emsp;Y: <input id="demoLeafletYCenter" onChange={() => {setCenter([center[0], document.getElementById("demoLeafletYCenter").value])}}></input>
    </div>
  )
}

export default LeafletView;
