for i in {800..819}
do
python conversePolicy.py ../data/800_899/forvalueItr_RafineSim3_$i.csv ./800_899/policy_RafineSim3_$i.csv ./800_899/utility_RafineSim3_$i.csv
done