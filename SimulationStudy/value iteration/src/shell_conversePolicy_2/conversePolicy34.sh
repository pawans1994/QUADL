for i in {1700..1749}
do
python conversePolicy.py ../data/1700_1799/forvalueItr_RafineSim3_$i.csv ./1700_1799/policy_RafineSim3_$i.csv ./1700_1799/utility_RafineSim3_$i.csv
done