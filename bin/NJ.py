#!/usr/bin/env python3
import sys

def read():
  f = open(sys.argv[1], 'r')
  file = f.read().strip()
  f.close
  return file

def write(thing):
  f = open("out.txt", 'w')
  f.write(thing)
  f.close()

def adjust(out, node):
  score = 0
  path = []
  while len(out[node]) > 1:
    path.append(node)
    for index in out[node]:
      if index[1] not in path:
        score += index[2]
        path.append(index[1])
        break
    node = path[-1]
  return score

def countNodes(out, node):
  count = 0
  path = [node]
  tempPath = []
  while list(tempPath) != list(path):
    tempPath = list(path)
    for index in path:
      for line in out[index]:
        if line[1] not in path:
          path.append(line[1])
  for index in path:
    if len(out[index]) <= 1:
      count += 1
  return count

def branch(matrix, tree, count):
  d = []
  for h in range(0, len(matrix)):
    d.append([])
    for v in range(0, len(matrix)):
      d[h].append(0)
      if h != v:
        d[h][v] = (len(matrix) - 2) * matrix[h][v] - sum(matrix[h]) - sum(matrix[v])

  best = [d[0][1], 0, 1]
  for i in range(0, len(d)):
    for j in range(i + 1, len(d)):
      if i != j and d[i][j] < best[0]:
        best = [d[i][j], i, j]
  i = best[1]
  j = best[2]

  for k in range(0, len(d[i])):
    if d[i][k] == best[0] and k != j:
      i = k
      break

  for index in d:
    print("  ",index)

  if i == j and j == 0:
    print("omergerrrrd")
    quit()
  return [matrix, i, j, [tree[i], best[0]/2, tree[j], best[0]/2, count]]

def main():
  file = read().split(">")[1:]
  nLeaves = len(file)
  leaves = []
  for i in range(nLeaves):
    file[i] = file[i].split("\n")
    while '' in file[i]:
      file[i].remove('')
    leaves.append(file[i].pop(0))
    file[i] = "".join(file[i])

  print(leaves)
  matrix = []
  for i in range(len(file)):
    print(i,"of",len(file))
    matrix.append([])
    for j in range(len(file)):
      if i == j:
        matrix[i].append(0)
      elif len(matrix) > j and len(matrix[j]) > i:
        print(i,j)
        matrix[i].append(matrix[j][i])
      else:
        total = 0
        for k in range(len(file[i])):
          if file[i][k] != file[j][k]:
            total += 1
        matrix[i].append(total)


  count = len(matrix) -1
  tree = []
  for i in range(0, len(matrix)):
    tree.append(i)
  print(tree)
  out = {}

  for index in matrix:
    print(" ",index)

  while len(matrix) > 2:
    count += 1
    temp = branch(matrix, tree, count)
    matrix = temp[0]
    i = temp[1]
    j = temp[2]

    if temp[3][0] not in out:
      out[temp[3][0]] = []
    if temp[3][2] not in out:
      out[temp[3][2]] = []
    if temp[3][4] not in out:
      out[temp[3][4]] = []

    delta = sum(matrix[i])
    for k in range(0, len(matrix)):
      delta -= matrix[k][j]
    delta /= len(matrix) - 2
    iLimb = (matrix[i][j] + delta) / 2
    jLimb = (matrix[i][j] - delta) / 2

    print(tree, i, j, iLimb, jLimb)

    for h in range(0, len(matrix)):
      if h != i:
        print("====>", i, j, matrix[h][i], matrix[h][j], matrix[i][j])
        matrix[h][i] = (matrix[h][i] + matrix[h][j] - matrix[i][j])/2

    for v in range(0, len(matrix)):
      matrix[i][v] = matrix[v][i]

    for v in range(0, len(matrix)):
      matrix[v].pop(j)

    matrix.pop(j)

    for index in matrix:
      print(" ",index)

    out[temp[3][0]].append([temp[3][0], temp[3][4], iLimb])
    out[temp[3][2]].append([temp[3][2], temp[3][4], jLimb])
    out[temp[3][4]].append([temp[3][4], temp[3][0], iLimb])
    out[temp[3][4]].append([temp[3][4], temp[3][2], jLimb])

    tree[i] = count
    tree.pop(j)

  if tree[0] not in out:
    out[tree[0]] = []
  if tree[1] not in out:
    out[tree[1]] = []
  if count not in out:
    out[count] = []
  out[tree[0]].append([tree[0], tree[1], matrix[0][1]])
  out[tree[1]].append([tree[1], tree[0], matrix[0][1]])

  for index in sorted(out.keys()):
    for value in out[index]:
      value[2] = str(round(value[2], 3)) + "000"
      value[2] = value[2].split(".")[0] + "." + value[2].split(".")[1][:3]
      string = str(value[0]) + "->" + str(value[1]) + ":" + value[2]
      print(string)

#============================================================( run main )
###### runMain
if __name__ == "__main__":
  main()

