for i in {1750..1799}
do
python conversePolicy.py ../data/1700_1799/forvalueItr_RafineSim3_$i.csv ./1700_1799/policy_RafineSim3_$i.csv ./1700_1799/utility_RafineSim3_$i.csv
done