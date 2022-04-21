import React, { useState, useRef } from "react";

import SvgButton from "../svgButton/SvgButton.js";

import Phylocanvas from "../phylocanvas/Phylocanvas.js";

function PhylocanvasView() {
  const [tree, setTree] = useState("(A:1)B;")

  const fileInput = useRef(null)
  const reader = useRef(new FileReader())

  async function postData(url = '', data = {}) {
    console.log(url)
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fasta: data,
      })  
    })  
    .then(response => response.text())
    .then(data => setTree(data))
  }   

  const handleFileInput = (e) => {
    let file = e.target.files[0]
    reader.current.readAsText(file)
    reader.current.onloadend = () => {
      // if NWK
      if (file.name.toLowerCase().endsWith(".nwk")) {
        setTree(reader.current.result)
      }
      // if FASTA
      else if (file.name.toLowerCase().endsWith(".fasta")) {
        console.log("fasta start")
        console.log("fasta received")
        let fasta = reader.current.result
        console.log(fasta.substring(0, 20))
        console.log("fasta stop")
        postData("http://10.55.16.53:8888/neighborjoin", fasta);

      }

      // if TSV
      else if (file.name.endsWith(".tsv")) {

        console.log("tsv start")
        // split out fasta and positions
        let tsv = reader.current.result.split("\n")
        let header = tsv.shift().split("\t#SNPcall")[0].split("\t").map((x) => {return x.split("::")[0]})
        let fastaObj = {}
        header.forEach((key) => {fastaObj[key] = []})
        for (let i = 0; i < tsv.length; i++) {
          tsv[i] = tsv[i].split("\t")
          for (let j = 0; j < header.length; j++) {
            fastaObj[header[j]].push(tsv[i][j])
          }
        }

        let fasta = []
        for (let i = 1; i < header.length; i++) {
          fasta.push(">" + header[i])
          fasta.push(fastaObj[header[i]].join(""))
        }
        fasta = fasta.join("\n")

        console.log(fasta.substring(0, 20))
        console.log("tsv stop")
        postData("http://10.55.16.53:8888/neighborjoin", fasta);

      }
    }
  }

  return (
    <div>
      
      <input type="file" ref={fileInput} onChange={handleFileInput} hidden />
      <SvgButton onClick={e => fileInput.current.click()} label="upload txt" drop={true} />

      <Phylocanvas 
        tree = {tree}
      />
    </div>
  )
}

export default PhylocanvasView;
