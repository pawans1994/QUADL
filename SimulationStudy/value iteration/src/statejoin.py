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
# In this code, pageID is not included in state model.

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

PREVIOUS_ACTIONHIST_COLUMN=11
LATER_ACTIONHITST_COLUMN=12
PREVIOUS_PROBCORCT_COLUMN=9
LATER_PROBCORCT_COLUMN=10


with open(argvs[1],"r") as f:

    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        previousActionHist = row[PREVIOUS_ACTIONHIST_COLUMN]
        laterActionHist = row[LATER_ACTIONHITST_COLUMN]
        previousProbCorect = row[PREVIOUS_PROBCORCT_COLUMN]
        laterProbCorrect=row[LATER_PROBCORCT_COLUMN]



        """
        -------------------------------------------------------
        You have 2 options of how you convert the probability
        1. To integer from 0 to 9
        2. To dicimal from 0.0 to 1.0 with increment of 0.5
        ---------------------------------------------------------
        """
        #1.convert probability to rank (integer from 0 to 9)
        #previousProbCorrectRank = int(math.floor(float(previousProbCorect)*10))
        #laterProbCorrectRank = int(math.floor(float(laterProbCorrect)*10))

        #2.convert probability to rank (double 0.0,0.5,1.0,1.5.....~1.0 increment by 0.5)
        previousProbCorrectRank = round(float(previousProbCorect)*2,1)/2*10
        laterProbCorrectRank = round(float(laterProbCorrect)*2,1)/2*10



        PreviousState = previousActionHist+"_"+str(previousProbCorrectRank)
        LaterState = laterActionHist + "_" + str(laterProbCorrectRank)
        with open(argvs[2],"a") as output:
            writer = csv.writer(output, lineterminator='\n')
            outputarray = row[0:7]# copy data from input file
            outputarray.append(PreviousState)
            outputarray.append(LaterState)
            writer.writerow(outputarray)
        output.close()
f.close()
