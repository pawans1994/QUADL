#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Han Xiao <artex.xh@gmail.com> <https://hanxiao.github.io>

# NOTE: First install bert-as-service via
# $
# $ pip install bert-serving-server
# $ pip install bert-serving-client
# $

# simple similarity search on FAQ

import numpy as np
from bert_serving.client import BertClient
from termcolor import colored
import csv
from collections import defaultdict

prefix_q = '##### **Q:** '
topk = 1


quizzes = defaultdict(list)
LOs = defaultdict(list)
sentences = defaultdict(list)
unitmodule = set()#set
ansspans = defaultdict(list)
ans_sentences = defaultdict(list)
quiz_ans = defaultdict(list)


with open ('answers_unique.csv') as fp:
    reader = csv.reader(fp,delimiter=',')
    line_count = 0
    for row in reader:
        if line_cout == 0:
            line_cout += 1
        else:
            unit = row[0]
            moduel = row[1]
            key = (unit,module)
            unitmodule.add(key)
            quiz = row[2]
            ans = row[3]
            quizzes[key].append(quiz)
            quiz_ans[quiz].append(ans)
            line_count += 1


with open('tagged_sentences.csv') as fp:
    reader = csv.reader(fp,delimiter=',')
    line_count = 0
    for row in reader:
        if line_count == 0:
            line_count += 1
        else:
            unit =  row[0]
            module = row [1]
            sentence = row[2]
            ans = row[3]
            start = row[4]
            end = row[5]

            key = (unit,module)
            unitmodule.add(key)

            span = (start,end,ans)
            ansspans[sentence].append(span)

            ans_sentences[ans].append(sentence)

            line_count += 1

    # questions = [v.replace(prefix_q, '').strip() for v in fp if v.strip() and v.startswith(prefix_q)]
    # print('%d questions loaded, avg. len of %d' % (len(questions), np.mean([len(d.split()) for d in questions])))


with open('sentence.csv') as fp:
    reader = csv.reader(fp,delimiter=',')
    line_count = 0
    for row in reader:
        if line_count == 0:
            line_count += 1
        else:
            unit =  row[0]
            module = row [1]
            key = (unit,module)
            unitmodule.add(key)
            sentence = row[2]
            sentences[key].append(sentence)
            line_count += 1




print()
for i in sentences.items():
    print(i)

print()

for i in ans_sentences.items():
    print(i)

print()

for i in ansspans.items():
    print(i)

print()



# with BertClient() as bc:
#     for um in unitmodule:
        
#         sen_vecs = bc.encode(sentences[um])
#         lo_vecs = bc.encode(LOs[um])

#         i = 0
#         for lo_vec in lo_vecs:
#             score = np.sum(lo_vec * sen_vecs, axis=1) / np.linalg.norm(sen_vecs, axis=1)
#             topk_idx = np.argsort(score)[::-1][:topk]
#             print('top %d sentences similar to "%s"' % (topk, colored(LOs[um][i], 'green')))
#             for idx in topk_idx:
#                 print('> %s\t%s' % (colored('%.1f' % score[idx], 'cyan'), colored(sentences[um][idx], 'yellow')))
#             i += 1


with BertClient() as bc:
    with open('pivot_sentences.csv','w') as fp:
        wr = csv.writer(fp)
        header = ['unit','module','sentence','quiz_sentence','start','end','answer','score']
        wr.writerow(header)

        for um in unitmodule:
            unit = um[0]
            module = um[1]

            # sen_vecs = bc.encode(sentences[um])
            lo_vecs = bc.encode(quizzes[um])

            i = 0
            for lo_vec in lo_vecs:#for each learnign obejctive

                quiz_sentence = quizzes[um][i]#before embedding of lo_vec 

                # for ans in ans_sentences.keys():

                ans = quiz_ans[quiz_sentence]

                sentences_group_by_ans = [s for s in sentences[um] if s in ans_sentences[ans]]

                print(ans)
                for j in sentences_group_by_ans:
                    print(j)
                print()
                
                sen_vecs = bc.encode(sentences_group_by_ans)

                score = np.sum(lo_vec * sen_vecs, axis=1) / np.linalg.norm(sen_vecs, axis=1)

                #score = [11,15,2,5...]
                print()
                print('score:{0}'.format(score))
                print()

                topk_idx = np.argsort(score)[::-1][:topk]
                #np.argsort(score)[::-1] sort the score in decending order, returns the index of the order, like 1,0,3,2...
                

                print('toqk_idx:{0}'.format(topk_idx))

                for idx in topk_idx:
                    bestscore = score[idx]
                    bestsentence = sentences_group_by_ans[idx]
                
                

                startlist = []
                endlist = []

                for span in ansspans[bestsentence]:
                    answerword = span[2]
                    if answerword == ans:
                        startlist.append(span[0])
                        endlist.append(span[1])

                outputline = [unit,module,bestsentence,quiz_sentence,startlist,endlist,ans,bestscore]

                wr.writerow(outputline)

                i += 1
                
                    




