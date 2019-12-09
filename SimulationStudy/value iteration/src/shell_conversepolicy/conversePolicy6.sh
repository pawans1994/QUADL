for i in {120..139}
do
python conversePolicy.py ../data/100_199/forvalueItr_RafineSim3_$i.csv ./100_199/policy_RafineSim3_$i.csv ./100_199/utility_RafineSim3_$i.csv
done