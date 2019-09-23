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

#----- build trees.js
echo "var trees = new Object();" > /scratch/GAS/nasp/trees.js
echo >> /scratch/GAS/nasp/trees.js
ls "/scratch/GAS/nasp/" | while read line; do
  if [[ -d /scratch/GAS/nasp/${line} ]] && [[ -d /scratch/GAS/nasp/${line}/matrices ]] && [[ -f /scratch/GAS/nasp/${line}/matrices/tree.nwk ]]; then
    echo "trees[\"${line}\"] = \""`cat /scratch/GAS/nasp/${line}/matrices/tree.nwk`"\"" >> /scratch/GAS/nasp/trees.js
    echo >> /scratch/GAS/nasp/trees.js
  fi
done
