import React, {useEffect, useState} from "react";
import Handsontable from "../handsontable/Handsontable.js";

function HandsOnTableView() {
  const [data, setData] = useState([[]])
  const [header, setHeader] = useState([])

  useEffect(() => {
    setData([
      ['2019', 10, 11, 12, 13],
      ['2020', 20, 11, 14, 13],
      ['2021', 30, 15, 12, 13]
    ])

    setHeader(["year", "car1", "car2", "car3", "car4"])
  }, [])

  return (
    <Handsontable
      data = {data}
      header = {header}
    />
  )
}

export default HandsOnTableView;
