import csv

with open('../Output_Data/Output Files_QUADL/multiple_choice.csv', 'a', encoding="utf-8-sig") as f:
    # print(','.join(['Unit', 'Module', 'Question','Choices','Correct Answer']), file = f)
    writer = csv.writer(f)
    writer.writerow(['Unit', 'Module', 'Filename', 'Question', 'Choices', 'Correct Answer'])
with open('../Output_Data/Output Files_QUADL/learning_objectives.csv', 'w', newline='', encoding="utf-8-sig") as r:
    writer = csv.writer(r)
    writer.writerow(['Unit','Module', 'Filename','Learning Objectives'])
with open('../Output_Data/Output Files_QUADL/paragraph.csv', 'w', newline='', encoding="utf-8-sig") as r:
    writer = csv.writer(r)
    writer.writerow(['Unit','Module','Filename','Sentences'])
with open('../Output_Data/Output Files_QUADL/fill_in_the_blanks.csv', 'w', newline='', encoding="utf-8-sig") as r:
    writer = csv.writer(r)
    writer.writerow(['Unit', 'Module', 'Filename', 'Question', 'Question ID', 'Blank', 'Choices', 'Correct Answer'])
with open('../Output_Data/Output Files_QUADL/short_answer.csv', 'w', newline='', encoding="utf-8-sig") as r:
    writer = csv.writer(r)
    writer.writerow(['Unit', 'Module', 'Filename','Question', 'Explanation'])




'''
from run import *

parser = Parser(output_directory="/tmp/")
parser.parse_csv(file)
'''


# import os
# import sys
# from run import *
#
#
# parser = Parser(datadir = datadir, output_dir="/tmp")
# parser.parser_all_files()

