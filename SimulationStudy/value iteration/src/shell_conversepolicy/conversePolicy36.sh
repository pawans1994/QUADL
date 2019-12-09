for i in {720..739}
do
python conversePolicy.py ../data/700_799/forvalueItr_RafineSim3_$i.csv ./700_799/policy_RafineSim3_$i.csv ./700_799/utility_RafineSim3_$i.csv
done