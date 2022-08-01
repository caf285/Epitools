import React, {useEffect, useState} from "react";

function MySqlView() {
  const [x, setX] = useState("x");

  useEffect(() => {


    // Example POST method implementation:
    async function postData(url = '', data = {}) {
      console.log(url)
      // Default options are marked with *
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: data,
        })
      })
      //const response = await fetch('https://api.npms.io/v2/search?q=react')
      .then(response => response.text())
      //.then(data => setX({ totalReactPackages: data.total }))
      .then(data => setX(data))
    }

    postData("http://10.55.16.53:8888/mysql", ['B', 'TG92140', 'TG92300']);
    //postData("https://pathogen-intelligence.tgen.org/test-go-api");

  }, [])

  return (
    <div>
      {x}
    </div>
  )
}

export default MySqlView;
