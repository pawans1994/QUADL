for i in {950..999}
do
python conversePolicy.py ../data/900_999/forvalueItr_RafineSim3_$i.csv ./900_999/policy_RafineSim3_$i.csv ./900_999/utility_RafineSim3_$i.csv
done