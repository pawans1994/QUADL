
import numpy as np
import csv
from collections import defaultdict
from pprint import pprint


answers = defaultdict(list)
sentences = defaultdict(list)
unitmodule = set()
ans_sentences = defaultdict(list)


with open('answers_unique.csv') as fp:
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
            answer = row[3]
            answers[key].append(answer)
            line_count += 1

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



for um in unitmodule:
    for ans in answers[um]:
        sen_with_ans = [s for s in sentences[um] if ans in s]
       
        for sen in sen_with_ans:
            ans_sentences[ans].append(sen)




with open ('tagged_sentences.csv','w') as fp:
    wr = csv.writer(fp)
    header = ['unit','module','sentence','answer','start','end']
    wr.writerow(header)
    for um in unitmodule:
        unit = um[0]
        module = um[1]
        for ans,sentences in ans_sentences.items():
            for sen in sentences:
                start = sen.index(ans) - 1 #ans comes first. when "this is acids" and acides is the answer, start shoud be 7 (index of the space in front of the answer)
                end = start + len(ans)
                outlist = [unit,module,sen,ans,start,end]
                wr.writerow(outlist)
            



