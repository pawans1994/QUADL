for i in {440..459}
do
python conversePolicy.py ../data/400_499/forvalueItr_RafineSim3_$i.csv ./400_499/policy_RafineSim3_$i.csv ./400_499/utility_RafineSim3_$i.csv
done