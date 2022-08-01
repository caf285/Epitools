package main

import (
  // standard i/o
  "fmt"
  "log"
  "encoding/json"
  "strings"

  // network
  "net/http"
  "database/sql"
  _ "github.com/go-sql-driver/mysql"

  // custom packages
  "./go_pkgs/treebuilder"
)

type NullString struct {
  sql.NullString
}

func (s NullString) MarshalJSON() ([]byte, error) {
    if s.Valid {
        return json.Marshal(s.String)
    }
    return []byte(`null`), nil
}


func neighborjoinHandler(w http.ResponseWriter, r *http.Request) {

  log.Printf("neighborjoin requested ...")
  type requestBodyStruct struct {
    Fasta string
  }
  request := requestBodyStruct{}
  err := json.NewDecoder(r.Body).Decode(&request)
  if err != nil {
    panic(err.Error())
  }
  log.Printf("building tree ...")
  log.Printf(request.Fasta)
  fmt.Fprintf(w, treebuilder.Neighborjoin(request.Fasta))
  log.Printf("... done")

}

func mysqlHandler(w http.ResponseWriter, r *http.Request) {

  log.Printf("mySql requested ...")
  type requestBodyStruct struct {
    Query []string
  }

  type gasResultStruct struct {
    Id string
    Name string
    Sample NullString
    Subsample NullString
    External NullString
    Pathogen NullString
    Lineage NullString
    Facility NullString
    Collection_date NullString
    Sequence_date string
    File string
    Reference NullString
  }

    db, err := sql.Open("mysql", "epitools:epiTools1-2-3-4-5@tcp(127.0.0.1:3306)/epitools")

    // if there is an error opening the connection, handle it
    if err != nil {
        panic(err.Error())
    }   

    // defer the close till after the main function has finished
    // executing
    defer db.Close()

  request := requestBodyStruct{}
  log.Printf("decode")
  err = json.NewDecoder(r.Body).Decode(&request)
  if err != nil {
    panic(err.Error())
  }

  

  log.Printf("results")
  log.Printf("SELECT * FROM epitools.pathogen WHERE name IN ('" + strings.Join(request.Query, "','") + "')")
  results, err := db.Query("SELECT * FROM epitools.pathogen WHERE name IN ('" + strings.Join(request.Query, "','") + "')")
  if err != nil {
    panic(err.Error()) // proper error handling instead of panic in your app
  }

  var resultsJson []gasResultStruct

  for results.Next() {
    
    result := gasResultStruct{}
    err = results.Scan(&result.Id, &result.Name, &result.Sample, &result.Subsample, &result.External, &result.Pathogen, &result.Lineage, &result.Facility, &result.Collection_date, &result.Sequence_date, &result.File, &result.Reference)

    if err != nil {
      panic(err.Error()) // proper error handling instead of panic in your app
    }


    resultsJson = append(resultsJson, result)
    
  }

  jsonData, err := json.Marshal(resultsJson)
  if err != nil {
    log.Println(err)
  }
  fmt.Fprintln(w, string(jsonData))

  log.Printf("... done")

}

func lineageHandler(w http.ResponseWriter, r *http.Request) {
  log.Printf("lineage requested ...")
  type requestBodyStruct struct {
    Lineage string
  }

  type pathogenResultStruct struct {
    Id string
    Name string
  }

  // open db
  db, err := sql.Open("mysql", "epitools:epiTools1-2-3-4-5@tcp(127.0.0.1:3306)/epitools")
  if err != nil {
      panic(err.Error())
  }   
  defer db.Close()

  // decode request
  request := requestBodyStruct{}
  log.Printf("decode")
  err = json.NewDecoder(r.Body).Decode(&request)
  if err != nil {
    panic(err.Error())
  }

  // db results
  log.Printf("results")
  log.Printf("SELECT id, name FROM epitools.pathogen WHERE (lineage='" + request.Lineage + "' OR lineage LIKE '" + request.Lineage + ".%') AND (collection_date > date_sub(now(), interval 2 month) OR sequence_date > date_sub(now(), interval 1 month))")
  results, err := db.Query("SELECT id, name FROM epitools.pathogen WHERE (lineage='" + request.Lineage + "' OR lineage LIKE '" + request.Lineage + ".%') AND (collection_date > date_sub(now(), interval 2 month) OR sequence_date > date_sub(now(), interval 1 month))")
  if err != nil {
    panic(err.Error()) // proper error handling instead of panic in your app
  }

  // fill results
  var fasta []string
  for results.Next() {
    result := pathogenResultStruct{}
    err = results.Scan(&result.Id, &result.Name)
    if err != nil {
      panic(err.Error()) // proper error handling instead of panic in your app
    }

    id := result.Id
    name := result.Name
    var sequence []byte

    sequenceResults, err := db.Query("SELECT sequence FROM epitools.sequence WHERE sample=" + id)
    if err != nil {
      panic(err.Error()) // proper error handling instead of panic in your app
    }
    for sequenceResults.Next() {
      sequenceResults.Scan(&sequence)
    }
    fasta = append(fasta, ">" + name + "\n" + string(sequence) + "\n", "")

  }

  // transcribe results
  if len(fasta) >= 4 {
    fmt.Fprintln(w, treebuilder.Neighborjoin(strings.Join(fasta, "")))
  }
  log.Printf("... done")
}

func main() {

  // handle static directory
  //fileServer := http.FileServer(http.Dir("./static"))
  //http.Handle("/", fileServer)

  // handle requests
  http.HandleFunc("/neighborjoin", neighborjoinHandler)
  http.HandleFunc("/mysql", mysqlHandler)
  http.HandleFunc("/lineage", lineageHandler)

  // spin server at 8888
  fmt.Println("Starting server at port 8888\n")
  if err := http.ListenAndServe(":8888", nil); err != nil {
    panic(err.Error())
  }
}


