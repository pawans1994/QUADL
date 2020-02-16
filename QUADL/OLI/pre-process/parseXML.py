import xml.etree.ElementTree as ET
import glob
import os
import csv
from bs4 import BeautifulSoup
ques=[]
path="/Users/pawan/Documents/Project/statistics/content/_u2_summarizing_data/_m1_examining_distributions/x-oli-assessment2/"
path1 = "/Users/pawan/Documents/Project/statistics/content/"

directory_list=[]
dir_list=[]
for root, dirs, files in os.walk(path1):
    for name in dirs:
        directory_list.append(os.path.join(root, name))
    #for file in files:
        #print(os.path.join(subdir, file))
with open('/Users/pawan/Documents/newfile.csv', 'w', newline='') as r:
    writer = csv.writer(r)
    writer.writerow(['Unit', 'Module', 'Question','Choices','Correct Answer'])

            #print(directory_list[i])
    #for path2 in directory_list:
        #if "assessment" in path2:
            #print(path2)
       # if "assessment" in path:
    try:
        for filename in glob.glob(os.path.join(path, "*.xml")):
         #print(filename)
            with open(filename) as open_file:
               # print(filename)
                tree = ET.parse(open_file)
                root=tree.getroot()
                for elem in tree.iter():
                    i = 0
                    if elem.tag=="multiple_choice":

                        mc = []
                        mc.insert(0, ' '.join(path.split("/")[7]))
                        mc.insert(1, ' '.join(path.split("/")[8]))
                        for q in elem.iter():
                            ques = ""
                            choices=""
                            correct_ans=""

                            if q.tag=="body":
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
                                i=0
                                for e in q.iter():
                                    if(e.text is not None):
                                        choices=choices+str(i)+": "+e.text+"\n"
                                        i+=1
                                if choices and choices not in mc:
                                    mc.insert(3, ' '.join(choices.split()))
                                #print(choices[2:].strip())
                            elif q.tag=="response":
                                #dic={}
                                #print(q.attrib)
                                if(int(q.attrib['score'])>0):
                                    correct_ans=q.attrib['match']
                            if correct_ans and correct_ans not in mc:
                                    mc.insert(4, ' '.join(correct_ans.split()))
                            #print(correct_ans.strip())
                            #m=' '.join(path.split('/')[8])
                            #data=[ques,choices,correct_ans]
                       # print(f'For {i}')

                        print(mc)
                       # i+=1
                            #co=correct_ans
                        with open('/Users/pawan/Documents/newfile.csv', "a") as fp:
                            wr = csv.writer(fp, dialect='excel')
                            wr.writerow(mc)


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
