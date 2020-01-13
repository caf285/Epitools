#! /usr/bin/env bash

ls -t /scratch/TGenNextGen | head -n 100 | while read dir; do
  find /scratch/TGenNextGen/${dir} -name "*GAS*.fastq.gz"
done
