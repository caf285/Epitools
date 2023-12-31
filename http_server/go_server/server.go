package main

import (
  // standard i/o
  "fmt"
  "log"
  "encoding/json"
  "io/ioutil"
  "strings"
  "strconv"

  // for args capture
  "os"
  "os/exec"

  // network
  "net/http"
  "database/sql"
  _ "github.com/go-sql-driver/mysql"
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
  fmt.Fprintf(w, Neighborjoin(request.Fasta))
  log.Printf("... done")

}

func mysqlHandler(w http.ResponseWriter, r *http.Request) {

  log.Printf("mySql requested ...")
  type requestBodyStruct struct {
    Query []string
  }

  type gasResultStruct struct {
    Id string
    Sample string
    Subsample NullString
    External NullString
    Pathogen NullString
    Lineage NullString
    Facility NullString
    Location NullString
    Collection_date NullString
    Sequence_date NullString
    Additional_metadata NullString
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
  log.Printf("SELECT id, sample, subsample, external, pathogen, lineage, facility, location, collection_date, sequence_date, additional_metadata FROM epitools.pathogen WHERE sample IN ('" + strings.Join(request.Query, "','") + "')")
  results, err := db.Query("SELECT id, sample, subsample, external, pathogen, lineage, facility, location, collection_date, sequence_date, additional_metadata FROM epitools.pathogen WHERE sample IN ('" + strings.Join(request.Query, "','") + "')")
  if err != nil {
    panic(err.Error()) // proper error handling instead of panic in your app
  }

  var resultsJson []gasResultStruct

  for results.Next() {
    
    result := gasResultStruct{}
    err = results.Scan(&result.Id, &result.Sample, &result.Subsample, &result.External, &result.Pathogen, &result.Lineage, &result.Facility, &result.Location, &result.Collection_date, &result.Sequence_date, &result.Additional_metadata)

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

// build tree from lineage (different from emmHandler) (no date range support)
func lineageHandler(w http.ResponseWriter, r *http.Request) {
  log.Printf("lineage requested ...")
  type requestBodyStruct struct {
    Lineage string
  }

  type pathogenResultStruct struct {
    Id string
    Sample string
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
  //log.Printf("SELECT id, sample FROM epitools.pathogen WHERE (lineage='" + request.Lineage + "' OR lineage LIKE '" + request.Lineage + ".%') AND collection_date > date_sub(now(), interval 4 month)")
  //results, err := db.Query("SELECT id, sample FROM epitools.pathogen WHERE (lineage='" + request.Lineage + "' OR lineage LIKE '" + request.Lineage + ".%') AND collection_date > date_sub(now(), interval 4 month)")
  log.Printf("SELECT id, sample FROM epitools.pathogen WHERE (lineage='" + request.Lineage + "' OR lineage LIKE '" + request.Lineage + ".%')")
  results, err := db.Query("SELECT id, sample FROM epitools.pathogen WHERE (lineage='" + request.Lineage + "' OR lineage LIKE '" + request.Lineage + ".%')")
  if err != nil {
    panic(err.Error()) // proper error handling instead of panic in your app
  }

  resultsCount := 0

  // fill results
  var fasta []string
  for results.Next() {
    resultsCount += 1
    log.Printf(strconv.Itoa(resultsCount))
    result := pathogenResultStruct{}
    err = results.Scan(&result.Id, &result.Sample)
    if err != nil {
      panic(err.Error()) // proper error handling instead of panic in your app
    }

    id := result.Id
    name := result.Sample
    var sequence []byte

    sequenceResults, err := db.Query("SELECT sequence FROM epitools.sequence WHERE sample=" + id)
    if err != nil {
      panic(err.Error()) // proper error handling instead of panic in your app
    }
    for sequenceResults.Next() {
      sequenceResults.Scan(&sequence)
    }
    if (len(sequence) > 0) { // only add sequence if query returns one
      fasta = append(fasta, ">" + name + "\n" + string(sequence) + "\n")
    }

  }
  log.Printf(strconv.Itoa(len(fasta)) + " results with sequences")
  //log.Printf("%v", fasta)

  // transcribe results
  if len(fasta) >= 4 {
    fmt.Fprintln(w, Neighborjoin(strings.Join(fasta, "")))
  }
  log.Printf("... done")
}

// build tree from sample list
func samplesHandler(w http.ResponseWriter, r *http.Request) {
  log.Printf("samples requested ...")
  type requestBodyStruct struct {
    Query []string
  }

  type samplesResultStruct struct {
    Id string
    Sample string
  }

  db, err := sql.Open("mysql", "epitools:epiTools1-2-3-4-5@tcp(127.0.0.1:3306)/epitools")

  // open db
  if err != nil {
      panic(err.Error())
  }   
  defer db.Close()

  request := requestBodyStruct{}
  log.Printf("decode")
  err = json.NewDecoder(r.Body).Decode(&request)
  if err != nil {
    panic(err.Error())
  }

  log.Printf("results")
  log.Printf("SELECT id, sample FROM epitools.pathogen WHERE sample IN ('" + strings.Join(request.Query, "','") + "')")
  results, err := db.Query("SELECT id, sample FROM epitools.pathogen WHERE sample IN ('" + strings.Join(request.Query, "','") + "')")
  if err != nil {
    panic(err.Error()) // proper error handling instead of panic in your app
  }

  var fasta []string
  for results.Next() {

    result := samplesResultStruct{}
    err = results.Scan(&result.Id, &result.Sample)

    if err != nil {
      panic(err.Error()) // proper error handling instead of panic in your app
    }

    var sequence []byte

    sequenceResults, err := db.Query("SELECT sequence FROM epitools.sequence WHERE sample=" + result.Id)
    if err != nil {
      panic(err.Error()) // proper error handling instead of panic in your app
    }
    for sequenceResults.Next() {
      sequenceResults.Scan(&sequence)
    }
    if (len(sequence) > 0) { // only add sequence if query returns one
      fasta = append(fasta, ">" + result.Sample + "\n" + string(sequence) + "\n")
    }

  }
  log.Printf(strconv.Itoa(len(fasta)) + " results with sequences")
  //log.Printf("%v", fasta)

  // transcribe results
  if len(fasta) >= 4 {
    fmt.Fprintln(w, Neighborjoin(strings.Join(fasta, "")))
  }
  log.Printf("... done")
}

/*** get and return Augur Ancestral json ***/
func mutationsHandler(w http.ResponseWriter, r *http.Request) {

  /*cmd, err := exec.Command("pwd").Output()
  testDir, err := os.Getwd()
  test := map[int]string{1:string(cmd), 2:string(testDir)}
  newTest, err := json.Marshal(test)
  fmt.Fprintln(w, string(newTest))
  return*/

  log.Printf("mutations request ...")
  type mutationsBodyStruct struct {
    Nwk string
    Samples []string
  }

  type samplesResultStruct struct {
    Id string
    Sample string
  }

  /* decode request */
  request := mutationsBodyStruct{}
  log.Printf("decode")
  err := json.NewDecoder(r.Body).Decode(&request)
  if err != nil {
    panic(err.Error())
  }

  /* get alignment */
  db, err := sql.Open("mysql", "epitools:epiTools1-2-3-4-5@tcp(127.0.0.1:3306)/epitools")

  log.Printf("results")
  log.Printf("SELECT id, sample FROM epitools.pathogen WHERE sample IN ('" + strings.Join(request.Samples, "','") + "')")
  results, err := db.Query("SELECT id, sample FROM epitools.pathogen WHERE sample IN ('" + strings.Join(request.Samples, "','") + "')")
  if err != nil {
    panic(err.Error()) // proper error handling instead of panic in your app
  }

  var fasta []string
  for results.Next() {

    result := samplesResultStruct{}
    err = results.Scan(&result.Id, &result.Sample)

    if err != nil {
      panic(err.Error()) // proper error handling instead of panic in your app
    }

    var sequence []byte

    sequenceResults, err := db.Query("SELECT sequence FROM epitools.sequence WHERE sample=" + result.Id)
    if err != nil {
      panic(err.Error()) // proper error handling instead of panic in your app
    }
    for sequenceResults.Next() {
      sequenceResults.Scan(&sequence)
    }
    if (len(sequence) > 0) { // only add sequence if query returns one
      fasta = append(fasta, ">" + result.Sample + "\n" + string(sequence) + "\n")
    }

  }
  log.Printf(strconv.Itoa(len(fasta)) + " results with sequences")

  /* write request to file */
  dir := "/var/www/pathogen-intelligence.tgen.org/epitools/http_server/go_server/temp/"
  //dir, err := os.Getwd()
  //if err != nil {
  //  panic(err.Error())
  //}
  //dir += "/temp/"
  err = os.WriteFile(dir + "test.nwk", []byte(request.Nwk), 0644)
  if err != nil {
    panic(err.Error())
  }
  err = os.WriteFile(dir + "test.fasta", []byte(strings.Join(fasta, "")), 0644)
  if err != nil {
    panic(err.Error())
  }

  _, err = exec.Command("/var/www/pathogen-intelligence.tgen.org/epitools/http_server/go_server/test.bash").Output()
  

  resultsJson, err := ioutil.ReadFile(dir + "test.json")
  if err != nil {
    panic(err.Error())
  }

  var newJson interface{}

  left := strings.Index(string(resultsJson), "\"nodes\":")
  right := strings.Index(string(resultsJson), "\"reference\":")
  right = strings.LastIndex(string(resultsJson[:right]), ",")
  log.Printf(string(strconv.Itoa(left)), strconv.Itoa(right))

  var adjustedJson []byte
  adjustedJson = append(adjustedJson, '{')
  adjustedJson = append(adjustedJson, string(resultsJson[left:right])...)
  adjustedJson = append(adjustedJson, '}')
  err = json.Unmarshal(adjustedJson, &newJson)
  if err != nil {
    panic(err.Error())
  }

  outputJson, err := json.Marshal(newJson)
  if err != nil {
    panic(err.Error())
  }

  fmt.Fprintln(w, string(outputJson))
  log.Printf("... done")
}

// build tree from lineage (emm-type specific) (date range support)
func emmHandler(w http.ResponseWriter, r *http.Request) {
  log.Printf("lineage requested ...")
  type requestBodyStruct struct {
    Lineage string
    Date1 string
    Date2 string
  }

  type pathogenResultStruct struct {
    Id string
    Sample string
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
  log.Printf("SELECT id, sample FROM epitools.pathogen WHERE lineage='" + request.Lineage + "' AND collection_date BETWEEN '" + request.Date1 + "' AND '" + request.Date2 + "'")
  results, err := db.Query("SELECT id, sample FROM epitools.pathogen WHERE lineage='" + request.Lineage + "' AND collection_date BETWEEN '" + request.Date1 + "' AND '" + request.Date2 + "'")
  //log.Printf("SELECT id, sample FROM epitools.pathogen WHERE (lineage='" + request.Lineage + "' OR lineage LIKE '" + request.Lineage + ".%')")
  //results, err := db.Query("SELECT id, sample FROM epitools.pathogen WHERE (lineage='" + request.Lineage + "' OR lineage LIKE '" + request.Lineage + ".%')")
  if err != nil {
    panic(err.Error()) // proper error handling instead of panic in your app
  }

  resultsCount := 0

  // fill results
  var fasta []string
  for results.Next() {
    resultsCount += 1
    log.Printf(strconv.Itoa(resultsCount))
    result := pathogenResultStruct{}
    err = results.Scan(&result.Id, &result.Sample)
    if err != nil {
      panic(err.Error()) // proper error handling instead of panic in your app
    }

    id := result.Id
    name := result.Sample
    var sequence []byte

    sequenceResults, err := db.Query("SELECT sequence FROM epitools.sequence WHERE sample=" + id)
    if err != nil {
      panic(err.Error()) // proper error handling instead of panic in your app
    }
    for sequenceResults.Next() {
      sequenceResults.Scan(&sequence)
    }
    if (len(sequence) > 0) { // only add sequence if query returns one
      fasta = append(fasta, ">" + name + "\n" + string(sequence) + "\n")
    }

  }
  log.Printf(strconv.Itoa(len(fasta)) + " results with sequences")
  //log.Printf("%v", fasta)

  // transcribe results
  if len(fasta) >= 4 {
    fmt.Fprintln(w, Neighborjoin(strings.Join(fasta, "")))
  }
  log.Printf("... done")
}

// get complete pathogen table for external download
func pathogenHandler(w http.ResponseWriter, r *http.Request) {
  log.Printf("pathogen table requested ...")
  type requestBodyStruct struct {
    Key string
  }

  type gasResultStruct struct {
    SequenceId NullString
    SequenceSample NullString
    SequenceReference NullString
    Id string
    Sample string
    Subsample NullString
    External NullString
    Pathogen NullString
    Lineage NullString
    Facility NullString
    Location NullString
    Collection_date NullString
    Sequence_date NullString
    Additional_metadata NullString
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
    log.Printf("results")
    log.Printf("SELECT sequence.id as 'sequenceId', sequence.sample as 'sequenceSample', pathogen.id, pathogen.sample, pathogen.subsample, pathogen.external, pathogen.pathogen, pathogen.lineage, pathogen.facility, pathogen.location, pathogen.collection_date, pathogen.sequence_date, pathogen.additional_metadata FROM epitools.sequence RIGHT JOIN epitools.pathogen on sequence.sample=pathogen.id")
    //results, err := db.Query("SELECT * FROM epitools.pathogen")
    results, err := db.Query("SELECT sequence.id as 'sequenceId', sequence.sample as 'sequenceSample', sequence.reference as 'sequenceReference', pathogen.id, pathogen.sample, pathogen.subsample, pathogen.external, pathogen.pathogen, pathogen.lineage, pathogen.facility, pathogen.location, pathogen.collection_date, pathogen.sequence_date, pathogen.additional_metadata FROM epitools.sequence RIGHT JOIN epitools.pathogen on sequence.sample=pathogen.id")
    if err != nil {
      panic(err.Error()) // proper error handling instead of panic in your app
    }

    var resultsJson []gasResultStruct

    for results.Next() {
    
      result := gasResultStruct{}
      err = results.Scan(&result.SequenceId, &result.SequenceSample, &result.SequenceReference, &result.Id, &result.Sample, &result.Subsample, &result.External, &result.Pathogen, &result.Lineage, &result.Facility, &result.Location, &result.Collection_date, &result.Sequence_date, &result.Additional_metadata)

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
  }
  log.Printf("... done")
}

// return query of lineages and lineage counts from a pathogen and left and right date range
func dateRangeHandler(w http.ResponseWriter, r *http.Request) {
  log.Printf("pathogen table requested ...")
  type requestBodyStruct struct {
    Pathogen string
    Date1 string
    Date2 string
  }

  type dateRangeResultStruct struct {
    Lineage NullString
    Count int
  }

  db, err := sql.Open("mysql", "epitools:epiTools1-2-3-4-5@tcp(127.0.0.1:3306)/epitools")
  if err != nil {
    panic(err.Error())
  }   
  defer db.Close()

  request := requestBodyStruct{}
  log.Printf("decode")
  err = json.NewDecoder(r.Body).Decode(&request)
  if err != nil {
    panic(err.Error())
  }

  log.Printf("date1:", request.Date1)
  log.Printf("date2:", request.Date2)

  log.Printf("results")
  log.Printf("SELECT lineage, count(lineage) AS 'count' FROM epitools.pathogen WHERE pathogen='" + request.Pathogen + "' AND collection_date BETWEEN '" + request.Date1 + "' AND '" + request.Date2 + "' AND id IN (SELECT sample FROM epitools.sequence WHERE sample=epitools.pathogen.id) GROUP BY lineage")
  //results, err := db.Query("SELECT * FROM epitools.pathogen")
  results, err := db.Query("SELECT lineage, count(lineage) AS 'count' FROM epitools.pathogen WHERE pathogen='" + request.Pathogen + "' AND collection_date BETWEEN '" + request.Date1 + "' AND '" + request.Date2 + "' AND id IN (SELECT sample FROM epitools.sequence WHERE sample=epitools.pathogen.id) GROUP BY lineage")
  if err != nil {
    panic(err.Error()) // proper error handling instead of panic in your app
  }

  var resultsJson []dateRangeResultStruct

  for results.Next() {
    
    result := dateRangeResultStruct{}
    err = results.Scan(&result.Lineage, &result.Count)

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

func main() {

  // handle static directory
  //fileServer := http.FileServer(http.Dir("./static"))
  //http.Handle("/", fileServer)

  // handle requests
  http.HandleFunc("/neighborjoin", neighborjoinHandler)
  http.HandleFunc("/mysql", mysqlHandler)
  http.HandleFunc("/lineage", lineageHandler)
  http.HandleFunc("/samples", samplesHandler)
  http.HandleFunc("/mutations", mutationsHandler)
  http.HandleFunc("/emm", emmHandler)
  http.HandleFunc("/pathogen", pathogenHandler)
  http.HandleFunc("/dateRange", dateRangeHandler)

  // spin server at argv[1] or 8888
  var (
    port int
    err error
  )
  if len(os.Args) >= 2 {
    port, err = strconv.Atoi(os.Args[1])
    if err != nil {
      port = 8888
    }
  } else {
    port = 8888
  }
  fmt.Println("Starting server at port " + strconv.Itoa(port) + "\n")
  if err := http.ListenAndServe(":" + strconv.Itoa(port), nil); err != nil {
    panic(err.Error())
  }
}


