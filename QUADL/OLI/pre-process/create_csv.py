import csv

with open('/Users/pawan/Documents/multiple_choice.csv', 'a', encoding="utf-8-sig") as f:
    # print(','.join(['Unit', 'Module', 'Question','Choices','Correct Answer']), file = f)
    writer = csv.writer(f)
    writer.writerow(['Unit', 'Module', 'Question', 'Choices', 'Correct Answer'])
with open('/Users/pawan/Documents/learning_objectives.csv', 'w', newline='', encoding="utf-8-sig") as r:
    writer = csv.writer(r)
    writer.writerow(['Unit','Module','Learning Objectives'])
with open('/Users/pawan/Documents/paragraph.csv', 'w', newline='', encoding="utf-8-sig") as r:
    writer = csv.writer(r)
    writer.writerow(['Unit','Module','Sentences'])
with open('/Users/pawan/Documents/fill_in_the_blanks.csv', 'w', newline='', encoding="utf-8-sig") as r:
    writer = csv.writer(r)
    writer.writerow(['Unit', 'Module', 'Question', 'Choices', 'Correct Answer'])
with open('/Users/pawan/Documents/short_answer.csv', 'w', newline='', encoding="utf-8-sig") as r:
    writer = csv.writer(r)
    writer.writerow(['Unit', 'Module', 'Question', 'Explanation'])
