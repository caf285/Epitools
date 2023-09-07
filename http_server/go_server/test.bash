#!/bin/bash

PATH=/usr/local/miniconda3/bin/:$PATH
cd /var/www/pathogen-intelligence.tgen.org/epitools/http_server/go_server/
augur ancestral --tree ./temp/test.nwk --alignment ./temp/test.fasta --inference joint --infer-ambiguous --output-node-data ./temp/test.json
