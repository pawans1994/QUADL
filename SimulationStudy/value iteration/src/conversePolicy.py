'''
Created on 2017/08/14

@author: machi
'''

from utils import argmax, vector_add, orientations, turn_right, turn_left,argmin
import csv
import sys
from pprint import pprint
from _collections import defaultdict,OrderedDict
#from collections import OrderedDict
import random
from docutils.nodes import transition
from astropy.io.ascii.core import CsvWriter
from xlwt.antlr import ifelse
import re
"""Argument: 1 ${kc}_forvalueiteration.csv, 2 ${kc}_dummy_policy.csv"""
""""""

"""this part is for just read and put the all data to the list(state_data)"""
"""from csvfile"""
argvs = sys.argv
state_data= []

with open(argvs[1],'r') as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        #remove state from Lrank9
        if not re.match('9',row[1]):
            state_data.append(row)
f.close()
# pprint(state_data)


"""
state_data[i][1] = origin state
state_data[i][2] = action
state_data[i][3] = destination state
state_data[i][4] = transition probability
state_data[i][5] = reward
"""



"""this part is for MDPfromdata"""
class MDPFromData:
    def __init__(self,state_data,gamma=.9):
        self.state_data=state_data

        self.reward={}
        self.transition=defaultdict(list)
        self.states = set()
        self.statepairs = set()
        self.actdict=defaultdict(list)
        self.length=len(state_data)
        self.gamma = gamma



    #settransition model. T(origin, action) →　[(probability1, dest1), (probability2, dest2),(prob3, dect3)......]
    def T(self):
        self.transition = defaultdict(list)
        for i in range(self.length):
            self.transition[self.state_data[i][1], self.state_data[i][2]].append([float(self.state_data[i][4]),self.state_data[i][3]])
        return self.transition

#    change Reward fixed by pair of origin and destination state.
    def R(self):
        for i in range(self.length):
            origin_dest=self.state_data[i][1]+"/"+self.state_data[i][3]
            if origin_dest in self.reward:
                continue
            else:
                reward = float(self.state_data[i][5])
                self.reward[origin_dest] = reward

        # pprint(self.reward)
        return self.reward

    def set_state(self):#set of states including terminals.
        for i in range(self.length):
            #origin
            if self.state_data[i][1] not in self.states:
                self.states.add(state_data[i][1])
            #destination
            elif self.state_data[i][3] not in self.states:
                self.states.add(state_data[i][3])
        #print ("State:")
        #pprint (self.states)
        return self.states

    #new method for bkt statecount, state pair of origin and destination
    def set_statepairs(self):#set origin_dest state pair
        for i in range(self.length):
            origin_dest=self.state_data[i][1]+"/"+self.state_data[i][3]
            self.statepairs.add(origin_dest)
        return self.statepairs



    def action(self):#this is a list of action state S can take
        for i in range(self.length):
            key = self.state_data[i][1]
            if self.state_data[i][2] not in self.actdict[key]:
                self.actdict[key].append(state_data[i][2])
        # print("actions:")
        # pprint(self.actdict)
        return self.actdict


"""value iteration"""
def value_iteration_inverse(mdp, epsilon=0.001):
    #Solving an MDP by value iteration. [Figure 17.4]

    states = mdp.set_state()
    #statepair is a pair of origin and destination
    statepairs = mdp.set_statepairs()
    #initialize utility as 0
    #TODO: change key from s to a pair of origin and destination
    U1 = {s: 0 for s in statepairs}
    #U1 = {s: 0 for s in states}
    #print(U1)
    R, T, A, gamma = mdp.R(), mdp.T(), mdp.action(), mdp.gamma
    #print(T)
    #inherited R from Class MDP
    #instance v

    while True:
    #for i in range(100):
        U = U1.copy()
        delta = 0
        #sp is an acnonym for StatePair
        for sp in statepairs:
            # print("\nstate:{}".format(sp))
            temp=0
            expect =[]
            #まずstatepirのパース
            origin_destination = sp.split('/')
            origin = origin_destination[0]
            dest = origin_destination[1]
            if A[dest]:
                for a in A[dest]:
                    # print("action:{}".format(a))
                    temp=0
                    for (p,s1) in T[dest,a]:
                        # print("destofdest:{},probability:{}".format(s1,p))
                        pair = dest+"/"+s1
                        temp += p*U[pair]
                    expect.append(temp)

                # print("expect")
                # print(expect)
                """use minimum value of the expected Utility"""
                U1[sp] = R[sp] + gamma * min(expect)
            else:
                # print("sum")
                # print(expect)
                U1[sp] = R[sp]

            # print("U1")
            # print(U1[sp])

            delta = max(delta, abs(U1[sp] - U[sp]))
        if delta < epsilon * (1 - gamma) / gamma:
            return U


def expected_utility(a, s, U, mdp):
    T = mdp.T()
    sum=0
    """The expected utility of doing a in state s, according to the MDP and U."""
    #print ("T[{0},{1}]:::{2}".format(s,a,T[s,a]))
    for (p,s1) in T[s,a]:
        #print ("(p,s1):{0},{1}".format(p,s1))
        statepair = s+"/"+s1
        sum += p*U[statepair]
        #print ("sum{0}".format(sum))
    #print("Expected Utility:[{0},{1}]: {2}".format(s,a,sum))
    #print("\n")
    #return sum([p * U[s1] for (p, s1) in T[s, a]])
    return sum



def inverse_best_policy(mdp, U):
    """Given an MDP and a utility function U, determine the inverse best policy,
    as a mapping from state to action. (Equation 17.4)"""
    pi = {}
    A = mdp.action()
    A2 = defaultdict(list)
    states = mdp.set_state()
    for s in states:
        # for a in A[s]:
            #make s new actiondict A2 without "Dammy" action
            # if a != "Dammy":
            # A2[s].append(a)
        if A[s]:
            pi[s] = argmin(A[s], key=lambda a: expected_utility(a, s, U, mdp))

        # else:
            # pi[s] = None

    return pi






##instance
test = MDPFromData(state_data)#create instance
T = test.T
#utility = value_iteration(test)
#read the utility from the csv_file


utility = value_iteration_inverse(test)


policy = inverse_best_policy(test,utility)
# pprint (policy)



#write to the csv file
with open(argvs[2],"w") as csv_file:
    writer=csv.writer(csv_file,lineterminator='\n')
    header = ["state","action"];
    writer.writerow(header);
    for key,value in policy.items():
        writer.writerow([key,value])
csv_file.close()
#write Utility of each state
with open(argvs[3],"w") as euoutput:
    writer=csv.writer(euoutput,lineterminator='\n')
    header=["origin/dest","Utility"];
    writer.writerow(header);
    for key,value in utility.items():
        writer.writerow([key,value])
euoutput.close()



"""
for s in states:
            print ("actions:{}".format(A[s]))
            if A[s]:
                a = argmax(A[s], key=lambda a: expected_utility(a, s, U, mdp))
                print ("a:{}".format(a))
                print(pi[s])
                if a != pi[s]:
                    pi[s] = a
                    unchanged = False
            ###

"""
