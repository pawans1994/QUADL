'''
Created on 2018/03/08

@author: machi
'''


from __builtin__ import str
from collections import OrderedDict
import sys
import csv
from pprint import pprint
from _csv import writer
from fileinput import filename
import copy
from StdSuites.Table_Suite import row

if __name__ == '__main__':
    pass



'''
Read simulation data
and output the set of previous and Later( page, actionVector,probability Correct)

INPUT file is the simulation data from RafineCource.java(e.g. RafineCource2_simulation_3)

Argument:
1.INPUT file name
2. OUTPUT file name


'''


def isFirstStudent(previousStudentID,studentID):
    if(previousStudentID == studentID):
        return False
    else:
        return True

def initializeactionHistory(actionHistory):
    for key in actionHistory.keys():
        actionHistory[key] = 0
    return actionHistory

def updateactionHistory(actionHistory,actionID):
    newactionHistory = copy.deepcopy(actionHistory)
    newactionHistory[actionID] = 1
    return newactionHistory



def saveTransition(row,previousactionHistory,actionHistory,PreviousProbablityCorrect,laterProbCorrect,filename):
    previousStr=""
    laterStr=""
    for value in previousactionHistory.values():
        previousStr += str(value)

    for value in actionHistory.values():
        laterStr += str(value)

    output = row
    output.append(previousStr)
    output.append(laterStr)
    output.append(PreviousProbablityCorrect)
    output.append(laterProbCorrect)
    with open(filename, 'a') as outputfile:
        writer = csv.writer(outputfile, lineterminator='\n')
        writer.writerow(output)
    print(output)
    outputfile.close()


#     getOutputWriter().writerow(output)



# def getOutputWriter():
#     return self.writer
#
# def setOutputWriter(filename):
#     with open(filename, 'w') as f:
#         self.writer = csv.writer(f, lineterminator='\n')



'''
Prepare the actionHistory(dictionary) in Advance
actionHistory shows the history of the action the student took.(include no  order data)
'''
actionHistory = OrderedDict()
for i in range(1,9):
    actionLabel = "Video000"+str(i)
    actionHistory[actionLabel] = 0
for i in range(1,9):
    actionLabel = "Quiz000"+str(i)
    actionHistory[actionLabel] = 0

pprint(actionHistory)

'''
read transition data (csv file)
main
'''

previousStudentID =""
previousactionHistory = actionHistory
argvs = sys.argv

'''from RafineCource.java
Parameters
INIT_LOGIT_HIGH=-0.85;
INIT_LOGIT_LOW=-1.4;
computed by =1/(1+EXP(-1*X))
'''
initialProbabilityCorrect_high = 0.299432858
initialProbabilityCorrect_low = 0.197816111

PreviousProbablityCorrect = 0


filename = argvs[2]
with open(filename, 'a') as outputfile:
    writer = csv.writer(outputfile, lineterminator='\n')
    header = ['Version','StudentID','Student Prior','Action Type','Action ID','OUTCOME','Action Quality','Previous page','Current page','Later probCorrect',
              'previous action vector','later action vector','previous probCorrect','later probCorrect']
    writer.writerow(header)
outputfile.close()

with open(argvs[1],'r') as f:
    reader = csv.reader(f)
    heder = next(reader)



#     actionVectors =  actionVector()


    for row in reader:
        #row begins from 0

        studentID = row[5]
        actionID = row[70]
        laterProbCorrect = row[9]

        isFirst= isFirstStudent(previousStudentID,studentID)

        if(isFirst):
            actionHistory = initializeactionHistory(actionHistory)
            previousactionHistory = actionHistory
            if(studentPrior == "Good"):
                PreviousProbablityCorrect = initialProbabilityCorrect_high
            elif(studentPrior == "Poor"):
                PreviousProbablityCorrect = initialProbabilityCorrect_low


        """set previous and later actionHistory as actionVectors """

        actionHistory = updateactionHistory(previousactionHistory, actionID)

        print("previous + updated")

        saveTransition(row,previousactionHistory,actionHistory,PreviousProbablityCorrect,laterProbCorrect,filename)



        previousactionHistory = actionHistory
        previousStudentID = studentID
        PreviousProbablityCorrect = laterProbCorrect





    """
    this method doesn't work.(I don't know why)
     print("setprevious")
        actionVectors.setPrevious(actionHistory)
        print(actionVectors.getPreviousStr())

        print("updated")
        actionHistory = updateactionHistory(actionHistory,actionID)

        print("setLater")
        actionVectors.setLater(actionHistory)
        print(actionVectors.getLaterStr())

        print("setprevious")
        actionVectors.setPrevious(actionHistory)
        print(actionVectors.getPreviousStr())

        print("getPreviousagain")
        print(actionVectors.getPreviousStr())
        saveTransition(row,actionVectors)
    """

f.close()
