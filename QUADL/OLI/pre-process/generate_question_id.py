import csv
import os

counter=[]
i=-1

with open('/Users/pawan/PycharmProjects/QUADL/Sample Output/Fill_In_The_Blank.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerow(['Unit', 'Module', 'Question', 'Question ID', 'Blank', 'Choices', 'Correct Answer'])

f1 = open ("/Users/pawan/PycharmProjects/QUADL/Output Files_QUADL/fill_in_the_blanks.csv","r")

with open('/Users/pawan/PycharmProjects/QUADL/Output Files_QUADL/Fill_In_The_Blank.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerow(['Unit', 'Module', 'Question', 'Question ID', 'Blank', 'Choices', 'Correct Answer'])
    with open('/Users/pawan/PycharmProjects/QUADL/Output Files_QUADL/fill_in_the_blanks.csv','r') as csvfile:
        header = next(csv.reader(csvfile))
        reader = csv.reader(csvfile, delimiter=',')
        for row in reader:
            question=row[2]
            if question not in counter:
                i = i + 1
                counter.append(question)
                row[3] = i
            else:
                row[3]=i
            writer.writerow(row)
os.remove('/Users/pawan/PycharmProjects/QUADL/Output Files_QUADL/fill_in_the_blanks.csv')
f1.close()

