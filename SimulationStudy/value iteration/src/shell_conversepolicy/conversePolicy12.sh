for i in {240..259}
do
python conversePolicy.py ../data/200_299/forvalueItr_RafineSim3_$i.csv ./200_299/policy_RafineSim3_$i.csv ./200_299/utility_RafineSim3_$i.csv
done