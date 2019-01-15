'''
Created on 2018/03/08

@author: machi
'''
# from StdSuites.Table_Suite import row



if __name__ == '__main__':
    pass

import sys
import csv
import math
"""
1.read the file,
2. convert probavility
2.join page_statevector_prob
3. output
    Version, studentID, Student Prior,Action Type,Action ID,OUTCOME,ActionQuality,previous state,laterstate

INPUTFILE: 1st argument, e.g.RafineCourse2_simulation_3_stud10000_stateRepr.csv
OUTPUFILE : 2nd argument, csvfile
"""
argvs = sys.argv

with open(argvs[2],"w") as output:
    writer = csv.writer(output, lineterminator='\n')
    header = ['Version', 'studentID', 'Student Prior','Action Type','Action ID','OUTCOME','ActionQuality','previous state','laterstate']
    writer.writerow(header)
output.close()



with open(argvs[1],"r") as f:

    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        Previouspage = row[7]
        currentpage = row[8]
        previuousactionHistvector = row[10]
        lateractionHistvector = row[11]
        PreviousProbabilityCorect = row[12]
        laterProbabilityCorrect=row[13]



        """
        -------------------------------------------------------
        You have 2 options of how you convert the probability
        1. To integer from 0 to 9
        2. To dicimal from 0.0 to 1.0 with increment of 0.5
        ---------------------------------------------------------
        """
        #1.convert probability to rank (integer from 0 to 9)
        #previousProbCorrectRank = int(math.floor(float(PreviousProbabilityCorect)*10))
        #laterProbCorrectRank = int(math.floor(float(laterProbabilityCorrect)*10))

        #2.convert probability to rank (double 0.0,0.5,1.0,1.5.....~1.0 increment by 0.5)
        previousProbCorrectRank = round(float(PreviousProbabilityCorect)*2,1)/2*10
        laterProbCorrectRank = round(float(laterProbabilityCorrect)*2,1)/2*10



        PreviousState = Previouspage + "_" +previuousactionHistvector+"_"+str(previousProbCorrectRank)
        LaterState = currentpage + "_" + lateractionHistvector + "_" + str(laterProbCorrectRank)
        with open(argvs[2],"a") as output:
            writer = csv.writer(output, lineterminator='\n')
            outputarray = row[0:7]
            outputarray.append(PreviousState)
            outputarray.append(LaterState)
            writer.writerow(outputarray)
        output.close()
f.close()
