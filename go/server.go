package main

import (
  "fmt"
  "net/http"
  "encoding/json"

  // log.Error("log: ", log)
  log "github.com/sirupsen/logrus"

  //import custom treebuilder package
  "./pkg/treebuilder"
)

func neighborjoinHandler(w http.ResponseWriter, r *http.Request) {

  type requestBodyStruct struct {
    Fasta string
  }
  request := requestBodyStruct{}
  err := json.NewDecoder(r.Body).Decode(&request)

  if err != nil {
    fmt.Println(err)
  }
  fmt.Fprintf(w, treebuilder.Neighborjoin(request.Fasta))
}

func testHandler(w http.ResponseWriter, r *http.Request) {

  type requestBodyStruct struct {
    Fasta string
  }
  request := requestBodyStruct{}
  err := json.NewDecoder(r.Body).Decode(&request)

  fmt.Println(err)

  //request.Fasta = "-return"

  fmt.Fprintf(w, treebuilder.Test(request.Fasta))

  // properly format json
  //response, err := json.Marshal(request)
  //if err != nil {
  //  return
  //}

  // encode and print json
  //json.NewEncoder(w).Encode(string(response))

  //treebuilder.Neighborjoin()

}

func main() {

  // handle static directory
  fileServer := http.FileServer(http.Dir("./static"))
  http.Handle("/", fileServer)

  // handle nwk generation
  http.HandleFunc("/neighborjoin", neighborjoinHandler)
  http.HandleFunc("/test", testHandler)

  // spin server at 8888
  fmt.Println("Starting server at port 8888\n")
  if err := http.ListenAndServe(":8888", nil); err != nil {
    log.Fatal(err)
  }
}


