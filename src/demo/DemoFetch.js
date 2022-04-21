import React, {useEffect, useState} from "react";

function FetchView() {
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
          name: "testName",
          address: "testAddress",
        })
      })
      //const response = await fetch('https://api.npms.io/v2/search?q=react')
      .then(response => response.text())
      //.then(data => setX({ totalReactPackages: data.total }))
      .then(data => setX(data))
    }

    postData("http://10.55.16.53:8888/test");
    //postData("https://pathogen-intelligence.tgen.org/test-go-api");

  }, [])

  return (
    <div>
      {x}
    </div>
  )
}

export default FetchView;
