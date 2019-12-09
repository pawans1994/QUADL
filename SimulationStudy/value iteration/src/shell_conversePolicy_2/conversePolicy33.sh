for i in {1650..1699}
do
python conversePolicy.py ../data/1600_1699/forvalueItr_RafineSim3_$i.csv ./1600_1699/policy_RafineSim3_$i.csv ./1600_1699/utility_RafineSim3_$i.csv
done