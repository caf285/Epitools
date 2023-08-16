import React, { useRef, useEffect } from "react";

function RequestPathogenList(props) {
  const host = useRef("https://pathogen-intelligence.tgen.org/go_epitools/")
  const setPathogenList = props.setPathogenList

  // get complete list of all pathogens
  useEffect(() => {
    (async (key = "value", url = "pathogen_list") => {
      if (setPathogenList) {
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
            setPathogenList(data)
          }
        })
        .catch(ERR => window.alert(ERR + ": pathogen_list failed"))
      }
    })()
  }, [setPathogenList])

  return (
    <div></div>
  )
}

export default RequestPathogenList;
