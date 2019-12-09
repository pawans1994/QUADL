# this is a stream line for preparing data to compute converse policy
k=0
for i in {0..299}
do
  n=`expr $i % 100`
  if [ $n -eq 0 ] ; then
    k=$i
    j=`expr $k + 99`
    dir=${i}_${j}
  fi

python stateRepresentation.py ../data/$dir/$1_$i.csv ../data/$dir/stateRep_${1}_${i}.csv

python statejoin.py ../data/$dir/stateRep_${1}_${i}.csv ../data/$dir/stateJoin_${1}_${i}.csv

perl simulation_forvalueiteration_3.pl ../data/$dir/stateJoin_${1}_${i}.csv > ../data/$dir/forvalueItr_${1}_${i}.csv
done
