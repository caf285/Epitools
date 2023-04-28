package main

import (
  "fmt"
  "log"
  "encoding/json"

  "net/http"
  "database/sql"
  _ "github.com/go-sql-driver/mysql"
)

func GetPathogenTypeList(w http.ResponseWriter, r *http.Request) {
  log.Printf("pathogen list ...")
  type requestBodyStruct struct {
    Key string
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

  if request.Key == "value" {
    var resultsJson []string

    log.Printf("results")
    log.Printf("SELECT DISTINCT pathogen FROM epitools.pathogen")
    results, err := db.Query("SELECT DISTINCT pathogen FROM epitools.pathogen")
    if err != nil {
      panic(err.Error()) // proper error handling instead of panic in your app
    }

    for results.Next() {
      var result string
      results.Scan(&result)
      resultsJson = append(resultsJson, result)
    }

    jsonData, err := json.Marshal(resultsJson)
    if err != nil {
      log.Println(err)
    }
    fmt.Fprintln(w, string(jsonData))
  }
  log.Printf("... done")
}
