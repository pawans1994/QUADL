import csv

with open('/Users/pawan/Documents/newfile.csv', 'a') as f:
    # print(','.join(['Unit', 'Module', 'Question','Choices','Correct Answer']), file = f)
    writer = csv.writer(f)
    writer.writerow(['Unit', 'Module', 'Question', 'Choices', 'Correct Answer'])
