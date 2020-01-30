#!/bin/bash

# while IFS=, read sentence; do
#     echo "$sentence"
# done < neurons_sentences.txt


# data=`cat neurons_sentences.txt`
# echo "$data"


cat ./neurons_sentences.txt | sed -e 's/\./\.\\/g' > output.txt