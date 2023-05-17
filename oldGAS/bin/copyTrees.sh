if [[ $1 == "-d" ]]; then
  scp /scratch/EPITOOLS/GAS/nasp/trees.js cfrench@jackie.tgen.org:/home/cfrench/GAS/dev/static/newick/js
elif [[ $1 == "-p" ]]; then
  scp /scratch/EPITOOLS/GAS/nasp/trees.js cfrench@jackie.tgen.org:/home/cfrench/GAS/prod/static/newick/js
elif [[ $1 == "-c" && -f /scratch/EPITOOLS/GAS/GAS.csv ]]; then
  scp /scratch/EPITOOLS/GAS/GAS.csv cfrench@jackie.tgen.org:/home/cfrench/GAS/dev/CSV
fi
