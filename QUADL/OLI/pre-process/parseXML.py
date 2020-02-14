import xml.etree.ElementTree as ET
import glob
import os
import csv
from bs4 import BeautifulSoup
ques=[]
path="/Users/pawan/Documents/Project/statistics/content/_u4_probability/_m4_sampling_distributions/x-oli-assessment2/"
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
    for i in range(0,len(directory_list)):
        if "assessment" in directory_list[i]:
            #print(directory_list[i])
    #for path2 in directory_list:
        #if "assessment" in path2:
            #print(path2)
       # if "assessment" in path:
            try:
                for filename in glob.glob(os.path.join(directory_list[i], "*.xml")):
                 #print(filename)
                    with open(filename) as open_file:
                       # print(filename)
                        tree = ET.parse(open_file)
                        for elem in tree.iter():
                            if(elem.tag=="multiple_choice" or elem.tag=="question"):
                                for e in elem.iter():
                                    if(e.tag=="body"):
                                        for q in e.iter():
                                            #if(q.text!="None"):
                                            #writer.writerow([filename.split('/')[7],])
                                            print(filename)
                                            ques.append(q.text)

            except ET.ParseError:
                print("Exception occured for"+filename)

for i in range(0,len(ques)):
    print(ques[i])

        #root = tree.getroot()
      #  for mc in root.iter('input'):
       #     option = mc.findall('./choice')
       #     print(option)

       # for mc in root.findall('input'):
         #   rank = mc.find('choice').text
          #  print(rank)
