for i in {600..619}
do
python conversePolicy.py ../data/600_699/forvalueItr_RafineSim3_$i.csv ./600_699/policy_RafineSim3_$i.csv ./600_699/utility_RafineSim3_$i.csv
done