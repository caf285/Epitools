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

#----- get references & months
ref=($(ls /scratch/EPITOOLS/GAS/reference | grep "::"))
allRef=()
mRef=()
months=()
for line in ${ref[@]}; do
  if [[ $(echo ${line} | grep "ALL::") ]]; then
    line=${line//ALL::/}
    line=${line//.fasta/}
    allRef=("${allRef[@]}" ${line})
  else
    line=${line//.fasta/}
    mRef=("${mRef[@]}" ${line})
  fi
done
for line in $(ls /scratch/EPITOOLS/GAS/tsv); do
  months=(${months[@]} ${line//.tsv/})
done

#----- fill trees
echo "var trees = new Object();" > /scratch/EPITOOLS/GAS/nasp/trees.js
echo >> /scratch/EPITOOLS/GAS/nasp/trees.js

# bestsnp
for nwk in $(echo bestsnp missingdata); do
  echo "trees[\"${nwk}\"] = new Object();" >> /scratch/EPITOOLS/GAS/nasp/trees.js
  echo >> /scratch/EPITOOLS/GAS/nasp/trees.js
  for month in ${months[@]}; do
    # nwk -> month
    echo "trees[\"${nwk}\"][\"${month}\"] = new Object();" >> /scratch/EPITOOLS/GAS/nasp/trees.js
    echo >> /scratch/EPITOOLS/GAS/nasp/trees.js
    for all in ${allRef[@]}; do
      # nwk -> month -> all
      echo "trees[\"${nwk}\"][\"${month}\"][\"${all}\"] = new Object();" >> /scratch/EPITOOLS/GAS/nasp/trees.js
      echo >> /scratch/EPITOOLS/GAS/nasp/trees.js
      # nwk -> month -> all -> 'ALL'
      if [[ -d /scratch/EPITOOLS/GAS/nasp/ALL::${all} ]] && [[ -d /scratch/EPITOOLS/GAS/nasp/ALL::${all}/matrices ]] && [[ -d /scratch/EPITOOLS/GAS/nasp/ALL::${all}/matrices/${month} ]] && [[ -f /scratch/EPITOOLS/GAS/nasp/ALL::${all}/matrices/${month}/${nwk}.nwk ]]; then
        echo "writing ${nwk} ${month} ${all} ALL"
        echo "trees[\"${nwk}\"][\"${month}\"][\"${all}\"][\"ALL\"] = \""$(/scratch/EPITOOLS/GAS/bin/fixTrees.py /scratch/EPITOOLS/GAS/nasp/ALL::${all}/matrices/${month}/${nwk}.nwk)"\";" >> /scratch/EPITOOLS/GAS/nasp/trees.js
        echo >> /scratch/EPITOOLS/GAS/nasp/trees.js
      fi
      # nwk -> month -> all -> m
      for m in ${mRef[@]}; do
        if [[ -d /scratch/EPITOOLS/GAS/nasp/${m}/${all} ]] && [[ -d /scratch/EPITOOLS/GAS/nasp/${m}/${all}/matrices ]] && [[ -d /scratch/EPITOOLS/GAS/nasp/${m}/${all}/matrices/${month} ]] && [[ -f /scratch/EPITOOLS/GAS/nasp/${m}/${all}/matrices/${month}/${nwk}.nwk ]]; then
          echo "writing ${nwk} ${month} ${all} ${m}"
          echo "trees[\"${nwk}\"][\"${month}\"][\"${all}\"][\"${m}\"] = \""$(/scratch/EPITOOLS/GAS/bin/fixTrees.py /scratch/EPITOOLS/GAS/nasp/${m}/${all}/matrices/${month}/${nwk}.nwk)"\";" >> /scratch/EPITOOLS/GAS/nasp/trees.js
          echo >> /scratch/EPITOOLS/GAS/nasp/trees.js
        fi
      done
    done
  done
done
exit 0
