for i in {1550..1599}
do
python conversePolicy.py ../data/1500_1599/forvalueItr_RafineSim3_$i.csv ./1500_1599/policy_RafineSim3_$i.csv ./1500_1599/utility_RafineSim3_$i.csv
done