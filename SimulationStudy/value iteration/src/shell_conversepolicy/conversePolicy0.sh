for i in {0..19}
do
python conversePolicy.py ../data/0_99/forvalueItr_RafineSim3_$i.csv ./0_99/policy_RafineSim3_$i.csv ./0_99/utility_RafineSim3_$i.csv
done