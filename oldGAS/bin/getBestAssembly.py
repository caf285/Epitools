#!/usr/bin/env python3
#==================================================================================================== ( import )
### import
import subprocess
import sys
import os


#============================================================( functions )

def printHelp():
  print('''usage: getAssemblyStats [-h, --help] [<directory name>]

optional arguments:
  -h, --help          show this help message and exit
  [<directory>]  optional working directory

optional argument usage:
  [<directory>]:
      examples:
          getAssemblyStats              <-- uses current working directory
          getAssemblyStats /directory1  <-- uses \'/directory1\' as working directory
''')
  exit()

def getFileList(option = "", DIR = ""):

  # if DIR is empty, then fill DIR with running directory
  if DIR == "":
    DIR = os.getcwd()

  # get and return a file list with designated formatting options
  location = subprocess.Popen("ls " + option + " " + DIR, universal_newlines=True, shell=True, stdout=subprocess.PIPE)
  output = location.stdout.read().strip().split("\n")
  return output

def read(fileName):
  f = open(fileName, 'r')
  file = f.read().strip()
  f.close
  return file

def write(fileName, output):
  f = open(fileName, 'w')
  f.write(output)
  f.close()

#============================================================( main )
def main():

  if "-h" in sys.argv or len(sys.argv) > 1:
    printHelp()
  DIR = os.getcwd()
  print(DIR) 
  fileList = list(filter(lambda x: x.split(".fasta")[-1] == "", os.listdir(DIR)))

  out = ["\t".join(["Sample","Num contigs ","Num contigs >500","N50","Longest contig","Total bases in contigs","GC content","# Ns","# gaps","# degen"])]

  for index in fileList:
    data = list(map(lambda x: "".join(x.split("\n")[1:]), read(index).strip().split(">")[1:]))

    # get base information in fasta file
    sampleName = ".".join(index.split("/")[-1].split(".")[:-1])
    numContigs = len(data)
    numContigsOver500 = len(list(filter(lambda x: len(x) > 500, data)))
    n50 = 0
    a=[]
    c=[]
    g=[]
    t=[]
    n=[]
    baseCount = []
    for line in data:
      a.append(line.count("A"))
      c.append(line.count("C"))
      g.append(line.count("G"))
      t.append(line.count("T"))
      n.append(line.count("N"))
      baseCount.append(sum([a[-1],c[-1],g[-1],t[-1],n[-1]]))
    baseCount.sort()
    for j in range(0,len(baseCount)):
      if j > 0 and sum(baseCount[:j]) > float(sum(baseCount))/float(2):
        n50 = baseCount[j-1]
        break

    # format and write fasta information to output file
    out.append("\t".join([sampleName,str(numContigs),str(numContigsOver500),str(n50),str(baseCount[-1]),str(sum(baseCount)),str("%.2f" % float(float(sum(c)+sum(g))/float(sum(a)+sum(c)+sum(g)+sum(t)+sum(n))*100) + "%%"),str(sum(n)),str(0),str(0)]))

  write("assemblyStats.txt", "\n".join([out[0]] + sorted(out[1:])))

#============================================================( main )
if __name__ == "__main__":
  main()
