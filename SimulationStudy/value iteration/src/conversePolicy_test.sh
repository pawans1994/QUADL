# this is a shcell script for computing converse policy


dir=200_299
for i in {120..139}
do

# python conversePolicy.py ../data/$dir/forvalueItr_${1}_${i}.csv ./$dir/policy_${1}_${i}.csv ./$dir/utility_${1}_${i}.csv
echo ${i}next

done
