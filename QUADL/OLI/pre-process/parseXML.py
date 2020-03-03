import xml.etree.ElementTree as ET
import glob
import os
import csv
import re
import ssl
import lxml
#import nltk

from collections import namedtuple

import nltk
import pandas as pd

from bs4 import BeautifulSoup
ques=[]
path="/Users/pawan/Documents/Project/statistics/content/_u2_summarizing_data/_m2_examining_relationships/x-oli-inline-assessment/"
path1 = "/Users/pawan/Documents/Project/statistics/content/"

directory_list=[]
dir_list=[]
for root, dirs, files in os.walk(path1):
    for name in dirs:
        directory_list.append(os.path.join(root, name))
    #for file in files:
        #print(os.path.join(subdir, file))
with open('/Users/pawan/Documents/multiple_choice.csv', 'w', newline='') as r:
    writer = csv.writer(r)
    writer.writerow(['Unit', 'Module', 'Question','Choices','Correct Answer'])
with open('/Users/pawan/Documents/learning_objectives.csv', 'w', newline='') as r:
    writer = csv.writer(r)
    writer.writerow(['Unit','Module','Learning Objectives'])
with open('/Users/pawan/Documents/paragraph.csv', 'w', newline='') as r:
    writer = csv.writer(r)
    writer.writerow(['Unit', 'Module', 'Paragraph'])
with open('/Users/pawan/Documents/fill_in_the_blanks.csv', 'w', newline='') as r:
    writer = csv.writer(r)
    writer.writerow(['Unit', 'Module', 'Question', 'Choices', 'Correct Answer'])
with open('/Users/pawan/Documents/short_answer.csv', 'w', newline='') as r:
    writer = csv.writer(r)
    writer.writerow(['Unit', 'Module', 'Question', 'Explanation'])
            #print(directory_list[i])
    #for path2 in directory_list:
        #if "assessment" in path2:
            #print(path2)
       # if "assessment" in path:
try:
    option = {'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5}
    for filename in glob.glob(os.path.join(path, "*.xml")):
        #print(filename)
        with open(filename) as open_file:
           # print(filename)
            tree = ET.parse(open_file)
            root=tree.getroot()
            '''for tags in tree.findall('.//'):
                if tags.text is not None and tags.tail is not None:
                    str=tags.text+tags.tail
                    print(' '.join(str.split()))'''

            for elem in tree.iter():
                #type_ques = 'm_c'
                for t in root.findall('.//'):
                    if t.tag=='fill_in_the_blank':
                        type_ques='f_i_b'
                    elif t.tag == 'short_answer':
                        type_ques = 's_a'
                    elif t.tag == 'multiple_choice':
                        type_ques = 'm_c'
                if elem.tag=="workbook_page":
                    #print(p.text)
                    unit=''.join(path.split("/")[7])
                    module = ''.join(path.split("/")[8])
                    print(unit)
                    print(module)
                    for i in elem.iter():
                        if i.tag=="body":
                            it = 0
                            for j in i.iter():
                                str = ""
                                if j.tag=="tr":
                                    table_row=[unit,module]
                                    for k in j.iter():
                                        if k.text is not None:
                                            str=str+k.text+" "
                                            stri=' '.join(str.split())
                                    table_row.append(stri)
                                    with open('/Users/pawan/Documents/paragraph.csv','a') as fp:
                                        wr=csv.writer(fp,dialect='excel')
                                        wr.writerow(table_row)
                                        table_row.pop()

                                    #it+=1
                           # new_text=[]
                            stri=""
                            for tags in i.findall('.//'):
                                #stri=""
                                i=0
                                if tags.text and tags.tail:
                                    stri = stri +tags.text + tags.tail
                            text=re.sub('\s+',' ',stri)
                            #new_text=re.findall(r'(?<!\d)\.(?!\d) | \.(?!\d)',text)
                            new_text=nltk.sent_tokenize(text)
                            with open('/Users/pawan/Documents/paragraph.csv','a') as fp:
                                wr=csv.writer(fp,dialect='excel')
                                text_list=[]
                                text_list.append(unit)
                                text_list.append(module)
                                for s in range(0,len(new_text)-1):
                                    text_list.append(new_text[s])
                                    wr.writerow(text_list)
                                    text_list.pop()
                            break
                if elem.tag=="question":

                    mc = []
                    mc.insert(0, ''.join(path.split("/")[7]))
                    mc.insert(1, ''.join(path.split("/")[8]))
                    for q in elem.iter():
                        ques = ""
                        choices=""
                        correct_ans=""

                        if q.tag=="body":
                            #print("Inside Body")
                            #j=0
                            # for e in q.findall('.//'):
                            #     print(e.text)
                            # for e in q.iter():
                            #     if(e.text is not None and e.text!="\\*"):

                            #         ques=ques+e.text
                            #for e in q.iter():
                            if q.text is not None:
                                ques=ques+q.text
                            for e in q.findall('.//'):
                                if e.text is not None:
                                    ques=ques+e.text
                            print(ques)
                            if ques and ques not in mc:
                                 mc.insert(2, ' '.join(ques.split()))
                               # print(f'{j}:{e.text}')
                                #j+=1
                            #print(ques.strip())
                            #j+=1
                        elif q.tag=="multiple_choice":
                            #print("Inside Input")
                            i=0
                            ch = {}
                            for e in q.iter():
                                if(e.text is not None):
                                    choices=choices+str(i)+": "+e.text+"\n"
                                    if 'value' in e.attrib:
                                        #print(e.attrib['value'])
                                        ch[e.attrib['value']] = ' '.join(e.text.split())
                                    i+=1
                            #print(ch)
                            #print(choices)
                            if choices and choices not in mc:
                                mc.insert(3, ' '.join(choices.split()))
                            #print(choices[2:].strip())
                        elif q.tag=="fill_in_the_blank":
                            option = q.attrib['id']
                            print(option)
                            for e in q.iter():
                                if e.text is not None:
                                    choices=choices+e.text+"\n"
                            choices = option+": "+choices
                            if choices and choices not in mc:
                                if len(mc) == 4:
                                    mc[3] = mc[3] + choices
                                else:
                                    mc.insert(3, choices)
                        elif q.tag=="response":
                            #print("Inside Response")
                            answer_text = ""
                            if type_ques == 'm_c':
                                #print(filename)
                                if 'score' in q.attrib:
                                    if (int(q.attrib['score']) > 0):
                                        correct_ans = q.attrib['match']
                                        #print(correct_ans)
                                        correct_choice=correct_ans.split(',')
                                        #print(correct_choice)
                                        for cc in correct_choice:
                                            if cc in ch:
                                                answer_text = answer_text + ch[cc]+"\n"
                                #print(f'Answer is{answer_text}')
                                #print(answer_text)
                                if answer_text is not None and answer_text not in mc:
                                    #print(answer_text)
                                    mc.insert(4, ' '.join(answer_text.split()))
                            elif type_ques == 'f_i_b':
                                if 'score' in q.attrib:
                                    option=q.attrib['input']
                                    answer_text=answer_text+q.attrib['name']+"\n"
                                    answer_text=option+": "+answer_text
                                    print(answer_text)
                                    if len(mc)==5:
                                        mc[4]=mc[4]+answer_text
                                    else:
                                        mc.insert(4, answer_text)
                                print(mc)
                        elif q.tag =='explanation':
                            print("Inside SA")
                            if type_ques =='s_a':
                                for sub_tag in q.iter():
                                    if sub_tag.text is not None and sub_tag.tail is not None:
                                        answer_text=answer_text+sub_tag.text+sub_tag.tail
                            print(answer_text)
                            mc.insert(4, ' '.join(answer_text.split()))


                        #print(correct_ans.strip())
                        #m=' '.join(path.split('/')[8])
                        #data=[ques,choices,correct_ans]
                   # print(f'For {i}')
                    for i in range (0,len(mc)-1):
                        if not mc[i]:
                            mc.remove(mc[i])
                    #print(mc[4])
                   # i+=1
                        #co=correct_ans
                    if type_ques=='m_c':
                        with open('/Users/pawan/Documents/multiple_choice.csv', "a") as fp:
                            wr = csv.writer(fp, dialect='excel')
                            wr.writerow(mc)
                    elif type_ques == 'f_i_b':
                        with open('/Users/pawan/Documents/fill_in_the_blanks.csv', "a") as fp:
                            wr = csv.writer(fp, dialect='excel')
                            wr.writerow(mc)
                    elif type_ques=='s_a':
                        with open('/Users/pawan/Documents/short_answer.csv', "a") as fp:
                            wr = csv.writer(fp, dialect='excel')
                            wr.writerow(mc)
                if elem.tag=="multiple_choice":

                    mc = []
                    mc.insert(0, ''.join(path.split("/")[7]))
                    mc.insert(1, ''.join(path.split("/")[8]))
                    for q in elem.iter():
                        ques = ""
                        choices=""
                        correct_ans=""

                        if q.tag=="body":
                            print("Inside Body")
                            #j=0

                            for e in q.iter():
                                if(e.text is not None and e.text!="\\*"):
                                    ques=ques+e.text
                            if ques and ques not in mc:
                                 mc.insert(2, ' '.join(ques.split()))
                               # print(f'{j}:{e.text}')
                                #j+=1
                            #print(ques.strip())
                            #j+=1
                        elif q.tag=="input":
                            print("Inside Input")
                            i=0
                            ch = []
                            for e in q.iter():
                                if(e.text is not None):
                                    choices=choices+str(i)+": "+e.text+"\n"
                                    ch.append(e.text)
                                    i+=1
                            if choices and choices not in mc:
                                mc.insert(3, ' '.join(choices.split()))
                            #print(choices[2:].strip())
                        elif q.tag=="response":
                            print("Inside Response")
                            answer_text = ""
                            if (int(q.attrib['score']) > 0):
                                correct_ans = q.attrib['match']
                                answer_text = answer_text + ch[option[str(correct_ans)]]
                                #print(f'Answer is{answer_text}')
                            if answer_text is not None and answer_text not in mc:
                                #print(answer_text)
                                mc.insert(3, ' '.join(answer_text.split()))


                        #print(correct_ans.strip())
                        #m=' '.join(path.split('/')[8])
                        #data=[ques,choices,correct_ans]
                   # print(f'For {i}')
                    for i in range (0,len(mc)-1):
                        if not mc[i]:
                            mc.remove(mc[i])
                    #print(mc[4])
                   # i+=1
                        #co=correct_ans
                    with open('/Users/pawan/Documents/newfile.csv', "a") as fp:
                        wr = csv.writer(fp, dialect='excel')
                        wr.writerow(mc)

                elif elem.tag == "objectives":
                    lo = []
                    print("Inside Obj")
                    lo.insert(0, ''.join(path.split("/")[7]))
                    lo.insert(1, ''.join(path.split("/")[8]))
                    for obj in elem.iter():
                        ob = ""
                        if obj.tag == "objective":
                            ob=ob+obj.text+'\n'
                            lo.append(' '.join(ob.split()))
                    #lo.insert(3,' '.join(ob.split()))
                    #print(lo)
                            with open('/Users/pawan/Documents/learning_objectives.csv',"a") as fp:
                                wr=csv.writer(fp,dialect='excel')
                                wr.writerow(lo)
                            lo.pop()


                                #if(len(dic)!=0):
                                  #  print(dic['match'])
                                #if len(res.attrib)>0 and int(res.attrib["score"]) > 0:
                                  #  print(res.attrib["match"])
                   #i=0
                    #for e in elem.iter():
                      #  print(f' {i} : {e.text}')
                       # i=i+1'''
except ET.ParseError:
    print("Exception occured for"+filename)

#for i in range(0,len(ques)):
    #print(ques[i])

        #root = tree.getroot()
      #  for mc in root.iter('input'):
       #     option = mc.findall('./choice')
       #     print(option)

       # for mc in root.findall('input'):
         #   rank = mc.find('choice').text
          #  print(rank)
