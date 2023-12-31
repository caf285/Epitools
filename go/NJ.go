package main

import "fmt"
import "io/ioutil"
import "os"
import "strings"
import "strconv"
import "sync"
import "math"

func printHelp() {
  fmt.Println("\nconverts a FASTA file to neighbor joined NWK tree")
  fmt.Println("usage: NJ [-h] FASTA")
  fmt.Println("\tFASTA:\tfasta file, ie. 'bestsnp.fasta'")
  fmt.Println("example:\n\t./NJ bestsnp.fasta\n")
  os.Exit(0)
}

func sliceSum(s1 []int) (sum int) {
  for i := 0; i < len(s1); i++ {
    sum += s1[i]
  }
  return
}

func hamming(s1 string, s2 string) (distance int) {
  // index by code point, not byte
  r1 := []rune(s1)
  r2 := []rune(s2)

  for i, v := range r1 {
    if r2[i] != v {
      distance += 1
    }
  }
  return
}

func indexList(a int, list []int) bool {
    for _, b := range list {
        if b == a {
            return true
        }
    }
    return false
}

func branch(matrix [][]int, tempTree []int, count int) (b1 int, b2 int){

  b1 = 0
  b2 = 1
  best := (len(matrix) - 2) * matrix[b1][b2] - sliceSum(matrix[b1]) - sliceSum(matrix[b2])

  for i := 0; i < len(matrix); i++ {
    for j := i+1; j < len(matrix); j++ {
      if (len(matrix) - 2) * matrix[i][j] - sliceSum(matrix[i]) - sliceSum(matrix[j]) < best {
        b1 = i
        b2 = j
        best = (len(matrix) - 2) * matrix[b1][b2] - sliceSum(matrix[b1]) - sliceSum(matrix[b2])
      }
    }
  }
  return
}

func getBest(tree map[int]map[int]float64, tempScore float64, tempPath []int, bestScore []float64, bestPath []int) ([]int){
  if tempScore > bestScore[0] {
    bestScore[0] = tempScore
    bestPath = bestPath[:0]
    for i := 0; i < len(tempPath); i ++ {
      bestPath = append(bestPath, tempPath[i])
    }
  }
  for key, _ := range tree[tempPath[len(tempPath) - 1]] {
    if !indexList(key, tempPath) {
      bestPath = getBest(tree, tempScore + tree[tempPath[len(tempPath) - 1]][key], append(tempPath, key), bestScore, bestPath)
    }
  }
  return bestPath
}

func getNewick(names []string, tree map[int]map[int]float64, path []int, score float64) string {
  if path[len(path) - 1] < len(names) && path[len(path) - 1] >= 0 {
    return names[path[len(path) - 1]] + ":" + strconv.FormatFloat(math.Abs(score), 'f', -1, 64)
  } else if score == 0 {
    thing := []string{}
    for index := range tree[path[len(path) - 1]]{
      if ! indexList(index, path) {
  
        thing = append(thing, getNewick(names, tree, append(path, index), tree[path[len(path) - 1]][index]))
      }
    }
    return strings.Join(thing, ",")
  } else {
    thing := []string{}
    for index := range tree[path[len(path) - 1]]{
      if ! indexList(index, path) {
        thing = append(thing, getNewick(names, tree, append(path, index), tree[path[len(path) - 1]][index]))
      }
    }
    return "(" + strings.Join(thing, ",") + "):" + strconv.FormatFloat(math.Abs(score), 'f', -1, 64)
  }
}

func main() {
  // read fasta
  var fileName string
  if len(os.Args) <= 1 {
    printHelp()
  } else {
    for i := range os.Args[:1] {
      if os.Args[i] == string("-h") {
        printHelp()
      }
    }
    fileName = os.Args[1]
  }
  f, err := ioutil.ReadFile(fileName)
  if err != nil {
    fmt.Println()
    fmt.Println(err)
    printHelp()
  }
  DIR := strings.Join(strings.Split(fileName, "/")[:len(strings.Split(fileName, "/"))-1], "/")
  fileName = strings.Split(fileName, "/")[len(strings.Split(fileName, "/")) - 1]
  fileName = strings.Split(fileName, ".fasta")[0]
  newick := DIR + "/" + fileName + ".nwk"
  fasta := strings.Split(string(f), ">")[1:]
  names := []string{}

  // hash fasta
  for i := 0; i < len(fasta); i++ {
    names = append(names, strings.Split(fasta[i], "\n")[0])
    fasta[i] = strings.Join(strings.Split(fasta[i], "\n")[1:], "")
  }

  // mk matrix
  matrix := make([][]int, len(names))
  for i := 0; i < len(names); i++ {
    matrix[i] = make([]int, len(names))
    matrix[i][i] = 0
  }

  // build matrix
  var wg sync.WaitGroup
  for i := 0; i < len(names); i++ {
    for j := 0; j < len(names); j++ {
      wg.Add(1)
      go func(i int, j int) {
        defer wg.Done()
        matrix[i][j] = hamming(fasta[i], fasta[j])
      }(i, j)
    }
    //fmt.Println(i, len(names))
  }
  wg.Wait()

  // mirror matrix
  for i := 0; i < len(names); i++ {
    for j := i+1; j < len(names); j++ {
      wg.Add(1)
      go func(i int, j int) {
        defer wg.Done()
        matrix[j][i] = matrix[i][j]
      }(i, j)
    }
  }
  wg.Wait()

  // prep tempTree
  count := len(names) - 1
  tempTree := []int{}
  var tree map[int]map[int]float64
  tree = make(map[int]map[int]float64)
  for i := 0; i < len(names); i++ {
    tempTree = append(tempTree, i)
    tree[i] = make(map[int]float64)
  }

  //out := []string{}

  // reduce matrix / build tree
  for i := 0; i < len(names) - 2; i++ {
    count ++
    h, v := branch(matrix, tempTree, count)

    delta := 0
    for index := range matrix {
      delta += matrix[h][index]
    }
    for index := range matrix {
      delta -= matrix[index][v]
    }
    delta /= (len(matrix) - 2)

    // distance between tempTree[h] and count
    hLimb := (float64(matrix[h][v]) + float64(delta)) / 2

    // distance between tempTree[v] and count
    vLimb := (float64(matrix[h][v]) - float64(delta)) / 2

    // update matrix COLUMN h
    for index := range matrix {
      if index != h {
        matrix[index][h] = (matrix[index][h] + matrix[index][v] - matrix[h][v]) / 2
      }
    }

    // update matrix ROW h
    for index := range matrix {
      matrix[h][index] = matrix[index][h]
    }

    // remove COLUMN and ROW v
    for index := range matrix {
      matrix[index] = append(matrix[index][:v], matrix[index][v+1:]...)
    }
    matrix = append(matrix[:v], matrix[v+1:]...)

    // update h, remove v from tempTree
    tree[count] = make(map[int]float64)
    tree[count][tempTree[h]] = hLimb
    tree[count][tempTree[v]] = vLimb
    tree[tempTree[h]][count] = hLimb
    tree[tempTree[v]][count] = vLimb
    

    tempTree[h] = count
    tempTree = append(tempTree[:v], tempTree[v+1:]...)

    // getbest
  }
  tree[count + 1] = make(map[int]float64)
  //tree[count + 1][tempTree[0]] = float64(matrix[0][1]) / 2
  //tree[count + 1][tempTree[1]] = float64(matrix[0][1]) / 2
  //tree[tempTree[0]][count + 1] = float64(matrix[0][1]) / 2
  //tree[tempTree[1]][count + 1] = float64(matrix[0][1]) / 2
  tree[tempTree[0]][tempTree[1]] = float64(matrix[0][1])
  tree[tempTree[1]][tempTree[0]] = float64(matrix[0][1])

  // get nodes with longest path
  bestScore := []float64{0}
  bestPath := []int{}
  for i := 0; i < len(names); i++ {

    bestPath = getBest(tree, 0, []int{i}, bestScore, bestPath)
  }

  // get midpoint location and root at midpoint
  bestScore[0] -= bestScore[0] / 2
  tree[-1] = make(map[int]float64)
  for i := 0; i < len(bestPath) - 1; i++ {
    if bestScore[0] - tree[bestPath[i]][bestPath[i + 1]] < 0 {
      tree[-1][bestPath[i]] = bestScore[0]
      tree[-1][bestPath[i + 1]] = -(bestScore[0] - tree[bestPath[i]][bestPath[i + 1]])
      delete(tree[bestPath[i]], bestPath[i + 1])
      delete(tree[bestPath[i + 1]], bestPath[i])
      break
    }
    bestScore[0] -= tree[bestPath[i]][bestPath[i + 1]]
  }

  // print nwk
  path := []int{-1}
  out := "(" + getNewick(names, tree, path, 0) + "):0;"

  outFile, err := os.Create(newick)
  if err != nil {
    fmt.Println(err)
    return
  }
  _, err = outFile.WriteString(out)
  if err != nil {
    fmt.Println(err)
    outFile.Close()
    return
  }

  os.Exit(0)

}
















