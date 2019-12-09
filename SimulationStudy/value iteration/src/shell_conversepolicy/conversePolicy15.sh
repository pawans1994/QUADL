for i in {300..319}
do
python conversePolicy.py ../data/300_399/forvalueItr_RafineSim3_$i.csv ./300_399/policy_RafineSim3_$i.csv ./300_399/utility_RafineSim3_$i.csv
done