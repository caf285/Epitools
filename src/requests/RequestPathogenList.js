import React, { useRef, useEffect } from "react";

function RequestPathogenList(props) {
  const host = useRef("https://pathogen-intelligence.tgen.org/go_epitools/")

  // get complete list of all pathogens
  async function getPathogen(key = "value", url = "pathogen_list") {
    await fetch(host.current + url, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        key: key
      })
    })
    .then(response => {
      if (response.status >= 400) {
        throw new Error(response.status + " " + response.statusText);
      }
      return response.json()
    })
    .then(data => {
      if (data) {
        props.setPathogenTypeList(data)
      }
    })
    .catch(ERR => window.alert(ERR + ": pathogen_list failed"))
  }

  useEffect(() => {
    if (props.setPathogenTypeList) {
      getPathogen()
    }
  }, [])

  return (
    <div></div>
  )
}

export default RequestPathogenList;
