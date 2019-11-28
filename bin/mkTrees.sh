#!/usr/bin/env bash

#====================================================================================================( functions )
function printHelp {
  printf "\noutputs all tree.nwk data into a trees.js file"
  printf "\nusage: mkTrees.sh [ -h ]"
  exit 0
}

#====================================================================================================( main )

#----- check ARGS for help
if [[ $(echo $@ | grep "\-h") ]] ; then
  printHelp
fi

ref=($(ls /scratch/GAS/reference))
allRef=()
mRef=()
for line in ${ref[@]}; do
  if [[ $(echo ${line} | grep "ALL::") ]]; then
    line=${line//ALL::/}
    line=${line//.fasta/}
    allRef=("${allRef[@]}" ${line})
  elif [[ $(echo ${line} | grep "::") ]]; then
    line=${line//.fasta/}
    mRef=("${mRef[@]}" ${line})
  fi
done

echo "var trees = new Object();" > /scratch/GAS/nasp/trees.js
echo >> /scratch/GAS/nasp/trees.js

for all in ${allRef[@]}; do
  echo "trees[\"${all}\"] = new Object();" >> /scratch/GAS/nasp/trees.js
  echo >> /scratch/GAS/nasp/trees.js
  if [[ -d /scratch/GAS/nasp/ALL::${all} ]] && [[ -d /scratch/GAS/nasp/ALL::${all}/matrices ]] && [[ -f /scratch/GAS/nasp/ALL::${all}/matrices/tree.nwk ]]; then
    echo "trees[\"${all}\"][\"ALL\"] = \""`cat /scratch/GAS/nasp/ALL::${all}/matrices/tree.nwk`"\"" >> /scratch/GAS/nasp/trees.js
    echo >> /scratch/GAS/nasp/trees.js
  fi
done

for all in ${allRef[@]}; do
  for m in ${mRef[@]}; do
    if [[ -d /scratch/GAS/nasp/${m}/${all} ]] && [[ -d /scratch/GAS/nasp/${m}/${all}/matrices ]] && [[ -f /scratch/GAS/nasp/${m}/${all}/matrices/tree.nwk ]]; then
      echo "trees[\"${all}\"][\"${m}\"] = \""`cat /scratch/GAS/nasp/${m}/${all}/matrices/tree.nwk`"\"" >> /scratch/GAS/nasp/trees.js
      echo >> /scratch/GAS/nasp/trees.js
    fi
  done
done
