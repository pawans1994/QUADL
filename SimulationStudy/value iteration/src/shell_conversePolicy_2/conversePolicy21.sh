for i in {1050..1099}
do
python conversePolicy.py ../data/1000_1099/forvalueItr_RafineSim3_$i.csv ./1000_1099/policy_RafineSim3_$i.csv ./1000_1099/utility_RafineSim3_$i.csv
done