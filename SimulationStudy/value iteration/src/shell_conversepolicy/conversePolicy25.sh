for i in {500..519}
do
python conversePolicy.py ../data/500_599/forvalueItr_RafineSim3_$i.csv ./500_599/policy_RafineSim3_$i.csv ./500_599/utility_RafineSim3_$i.csv
done