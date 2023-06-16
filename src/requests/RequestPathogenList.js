import React, { useRef, useEffect } from "react";

function RequestPathogenList(props) {
  const host = useRef("https://pathogen-intelligence.tgen.org/go_epitools/")
  const setPathogenTypeList = props.setPathogenTypeList

  // get complete list of all pathogens
  useEffect(() => {
    (async (key = "value", url = "pathogen_list") => {
      if (setPathogenTypeList) {
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
            setPathogenTypeList(data)
          }
        })
        .catch(ERR => window.alert(ERR + ": pathogen_list failed"))
      }
    })()
  }, [setPathogenTypeList])

  return (
    <div></div>
  )
}

export default RequestPathogenList;
