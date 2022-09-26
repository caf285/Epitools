/* eslint-disable react/no-direct-mutation-state */
import React, { useRef, useState } from "react";
import './style.css'
import * as Papa from "papaparse"


function UploadScreen(props) {
    // eslint-disable-next-line 
    const [nameColumn, setNameColumn] = useState(0)
    const hotFileInput = useRef(null)
    const reader = useRef(new FileReader())

    const handleHOTFileInput = (e) => {
        let file = e.target.files[0]
        reader.current.readAsText(file)
        reader.current.onloadend = () => {
            // if NWK
            if (file.name.toLowerCase().endsWith(".csv")) {
                //console.log(file.name, "IS A CSV!")
                //console.log(reader)
                //console.log(reader.current.result)
                let con = {
                    delimiter: "",	// auto-detect
                    newline: "",	// auto-detect
                    quoteChar: '"',
                    escapeChar: '"',
                    header: false,
                    transformHeader: undefined,
                    dynamicTyping: false,
                    preview: 0,
                    encoding: "",
                    worker: false,
                    comments: false,
                    step: undefined,
                    complete: function (results, parser) {
                        //console.log("Row data:", results.data);
                        //console.log("Row errors:", results.errors);
                        //console.log("Name Column:", nameColumn);
                        //console.log("Objectify: ", objectifyData(results.data, nameColumn))
                        props.setData(objectifyData(results.data, nameColumn))
                        props.setDisplay(false)
                    },
                    error: undefined,
                    download: false,
                    downloadRequestHeaders: undefined,
                    downloadRequestBody: undefined,
                    skipEmptyLines: false,
                    chunk: undefined,
                    chunkSize: undefined,
                    fastMode: undefined,
                    beforeFirstChunk: undefined,
                    withCredentials: undefined,
                    transform: undefined,
                    delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
                }
                Papa.parse(reader.current.result, con)
                //console.log(con)
                //const text = e.target.result;
                //const data = d3.csvParse(text);
                //console.log(JSON.stringify(data));
            }
        }

    }
    // eslint-disable-next-line 
    const getColumnNames = (data: any[][], column: number): string[] => {
        return [];
    }

    const objectifyData = (data: string[][], column: number): object => {
        interface TempObject {
            [key: string]: string
        }
        let res: TempObject[] = []

        // we assume the first row is the headers for the csv.
        for (let i = 1; i < data.length; i++) {

            let temp: TempObject = {}

            for (let j = 0; j < data[i].length; j++) {
                if (j === column) {
                    temp["Name"] = data[i][j]
                } else {
                    temp[data[0][j]] = data[i][j]
                }
            }

            res.push(temp)
        }


        return res


    }


    return (

        <div className={"uploadScreen"}>
            Which column in your CSV contains the name?
            <input type={"number"} id={"nameColumn"} value={nameColumn} onChange={(e) => { setNameColumn(Number(e.target.value)) }}></input>
            <input type="file" accept={".csv"} ref={hotFileInput} onChange={handleHOTFileInput} hidden />
            <button onClick={e => hotFileInput.current.click()}>Upload</button>
            <button onClick={e => props.setDisplay(false)}>Close</button>
        </div >
    )
}

export default UploadScreen;
