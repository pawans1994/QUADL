for i in {1350..1399}
do
python conversePolicy.py ../data/1300_1399/forvalueItr_RafineSim3_$i.csv ./1300_1399/policy_RafineSim3_$i.csv ./1300_1399/utility_RafineSim3_$i.csv
done