import xml.etree.ElementTree as ET
import sys
import re
import nltk
import csv
import time

def parse_csv(filename):
    try:
        #option = {'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5}
        with open(filename) as open_file:
            tree = ET.parse(open_file)
            root=tree.getroot()
            print(filename)
            for elem in tree.iter():
                if elem.tag=="workbook_page":
                    unit=''.join(filename.split("/")[8])
                    module = ''.join(filename.split("/")[9])
                    for i in elem.iter():
                        if i.tag=="body":
                            it = 0
                            for j in i.iter():
                                para = ""
                                if j.tag=="tr":
                                    table_row=[unit,module,filename]
                                    for k in j.iter():
                                        if k.text is not None:
                                            para=para+k.text+" "
                                            stri=' '.join(para.split())
                                    table_row.append(stri)
                                    with open('//Output_Data/Output Files_QUADL/paragraph.csv', 'a', encoding="utf-8-sig") as fp:
                                        wr=csv.writer(fp,dialect='excel')
                                        wr.writerow(table_row)
                                        table_row.pop()
                            stri = ""
                            for tags in i.findall('.//'):
                                i = 0
                                if tags.text and tags.tail:
                                    stri = stri + tags.text + tags.tail
                            text = re.sub('\s+', ' ', stri)
                            new_text = nltk.sent_tokenize(text)
                            with open('//Output_Data/Output Files_QUADL/paragraph.csv', 'a', encoding="utf-8-sig") as fp:
                                wr = csv.writer(fp, dialect='excel')
                                text_list = []
                                text_list.append(unit)
                                text_list.append(module)
                                text_list.append(filename)
                                for s in range(0, len(new_text) - 1):
                                    text_list.append(new_text[s])
                                    wr.writerow(text_list)
                                    text_list.pop()
                    continue
                if elem.tag=="question":
                    type_ques = 'nv'
                    accessTime = f'{time.time() :.20n}'
                    all_tags = elem.findall('.//')
                    for all_tags in elem.findall('.//'):
                        if all_tags.tag == 'multiple_choice':
                            type_ques = 'mc'
                            break
                        elif all_tags.tag == 'fill_in_the_blank':
                            type_ques = 'fib'
                            break
                        elif all_tags.tag == 'short_answer':
                            type_ques = 's_a'
                            break
                    mc=[]
                    mc.insert(0, ''.join(filename.split("/")[8]))
                    mc.insert(1, ''.join(filename.split("/")[9]))
                    mc.insert(2,filename)
                    if type_ques == 'mc':
                        ch = {}
                        correct_ans = ""
                        for q in elem.iter():

                            ques = ""
                            choices = ""

                            answer_text = ""
                            if q.tag == 'body':
                                # print(filename)
                                ques = ''
                                if q.text is not None:
                                    ques = ques + q.text
                                for e in q.findall('.//'):
                                    if e.text is not None or e.tail is not None:
                                        ques = ques + str(e.text) + str(e.tail)
                                final_ques = ques.replace('None', '')
                                if final_ques and final_ques not in mc:
                                    mc.insert(3, ' '.join(final_ques.split()))
                            elif q.tag == "multiple_choice":
                                for e in q.iter():
                                    if e.tag == 'choice':
                                        choice = e.attrib['value']
                                        #ch[choice] = ' '.join(' '.join([et.text + et.tail for et in e.iter()]).split())
                                        choice_text = ""
                                        for et in e.iter():
                                            if et.text is not None:
                                                choice_text = choice_text + str(et.text)
                                            if et.tail is not None:
                                                choice_text = choice_text + str(et.tail)
                                        ch[choice] = ' '.join(choice_text.split())
                                mc.insert(4, ch)
                            elif q.tag == "response":
                                if 'score' in q.attrib:
                                    if (int(q.attrib['score']) > 0):
                                        correct_ans = q.attrib['match']
                                        # print(correct_ans)
                                        correct_choice = correct_ans.split(',')
                                        for cc in correct_choice:
                                            #print(filename)
                                            answer_text = answer_text + ch[cc] + "\n"
                                        mc.insert(5, answer_text)
                        # print(mc)
                        with open(f'//Output_Data/Output Files_QUADL/multiple_choice.csv', "a",
                                  encoding="utf-8-sig") as fp:
                            wr = csv.writer(fp, dialect='excel')
                            wr.writerow(mc)
                    elif type_ques == 'fib':
                        option_val = {}
                        response_val = {}
                        correct_resp = []

                        for q in elem.iter():

                            ques = ""
                            choices = ""
                            correct_ans = ""
                            answer_text = ""
                            if q.tag == 'body':
                                ques = ''
                                question={}
                                if q.text is not None:
                                    ques = ques + q.text
                                for e in q.findall('.//'):
                                    if e.tag == 'input_ref':
                                        e.text = f'_________({e.attrib["input"]})'
                                        ET.tostring(e)
                                for e in q.findall('.//'):
                                    if e.text is not None or e.tail is not None:
                                        ques = ques + str(e.text) + str(e.tail)
                                final_ques = ques.replace('None', '')
                                if final_ques and final_ques not in mc:
                                    mc.insert(3, ' '.join(final_ques.split()))
                            elif q.tag == 'fill_in_the_blank':
                                option_val[q.attrib['id']] = {}
                                blank_id = q.attrib['id']
                                for e in q.iter():

                                    if e.tag == 'choice':
                                        fib_choice_text = ""
                                        for et in e.iter():
                                            if et.text is not None:
                                                fib_choice_text = fib_choice_text + str(et.text)
                                            if et.tail is not None:
                                                fib_choice_text = fib_choice_text + str(et.text)
                                        option_val[q.attrib['id']][e.attrib['value']] = ' '.join(fib_choice_text.split())
                            elif q.tag == 'response':

                                if 'score' in q.attrib and int(q.attrib['score'])>0:
                                    if 'input' in q.attrib:
                                        option=q.attrib['input']
                                        if option in option_val:
                                            response_val[option] = option_val[option][q.attrib['match']]
                                        else:
                                            response_val[q.attrib['input']]=q.attrib['match']
                                    else:
                                        option=q.attrib['match']
                                        flag=0
                                        for v in option_val.values():
                                            if option in v:
                                                response_val[blank_id]=v[option]
                                                flag=1
                                                break
                                        if flag==0:
                                            response_val[q.attrib['input']] = q.attrib['match']
                        correct_resp.append(response_val)
                        mc.insert(4, accessTime[11:])
                        for k, v in correct_resp[0].items():
                            mc.insert(5, k)
                            if k in option_val:
                                mc.insert(6, option_val[k])
                            else:
                                mc.insert(6, 'No Options')
                            mc.insert(7, v)
                            with open(f'//Output_Data/Output Files_QUADL/fill_in_the_blanks.csv',
                                      "a",
                                      encoding="utf-8-sig") as fp:
                                wr = csv.writer(fp, dialect='excel')
                                wr.writerow(mc)
                            mc.pop(7)
                            mc.pop(6)
                            mc.pop(5)

                    elif type_ques == 's_a':
                        explain = ""
                        for q in elem.iter():
                            if q.tag == 'body':
                                ques = ''
                                if q.text is not None:
                                    ques = ques + q.text
                                for e in q.findall('.//'):
                                    if e.tag == 'input_ref':
                                        e.text = f'_________({e.attrib["input"]})'
                                        ET.tostring(e)
                                for e in q.findall('.//'):
                                    if e.text is not None or e.tail is not None:
                                        ques = ques + str(e.text) + str(e.tail)
                                final_ques = ques.replace('None', '')
                                if final_ques and final_ques not in mc:
                                    mc.insert(3, ' '.join(final_ques.split()))

                            elif q.tag == 'explanation':
                                if q.text is not None or q.tail is not None:
                                    explain = explain + str(q.text) + str(q.tail)
                                for et in q.findall('.//'):
                                    if et.text is not None and et.tail is not None:
                                        explain = explain + ' '.join(' '.join([et.text + et.tail]).split())
                        mc.insert(4, ' '.join(explain.split()))
                        with open(f'//Output_Data/Output Files_QUADL/short_answer.csv', "a",
                                  encoding="utf-8-sig") as fp:
                            wr = csv.writer(fp, dialect='excel')
                            wr.writerow(mc)
                    continue
                if elem.tag=="multiple_choice":
                    mc = []
                    ques = ""
                    choices = {}
                    correct_ans = []
                    mc.insert(0, ''.join(filename.split("/")[8]))
                    mc.insert(1, ''.join(filename.split("/")[9]))
                    mc.insert(2,filename)
                    for q in elem.iter():
                        if q.tag=="body":
                            for e in q.findall('.//'):
                                if e.text is not None:
                                    ques = ques + str(e.text)
                                if e.tail is not None:
                                    ques = ques + str(e.tail)
                            if ques and ques not in mc:
                                 mc.insert(3, ' '.join(ques.split()))
                        elif q.tag=="input":
                            for f in q.iter():
                                if f.tag == 'choice':
                                    choices_option = ' '.join(
                                        ' '.join([str(et.text) + str(et.tail) for et in f.iter()]).split())
                                    choices[f.attrib['value']] = choices_option.replace('None', '')
                            mc.insert(4, choices)
                        elif q.tag=="response":
                            correct_response = re.sub('[^._,a-zA-Z0-9 \n\.]', '', q.attrib['match'])
                            correct_response_list = correct_response.split(',')
                            for cr in correct_response_list:
                                if choices[cr] not in correct_ans:
                                    correct_ans.append(choices[cr])
                    mc.insert(5, correct_ans)
                    with open("//Output_Data/Output Files_QUADL/multiple_choice.csv", "a", newline='\n', encoding="utf-8-sig") as fp:
                         wr=csv.writer(fp, dialect='excel')
                         wr.writerow(mc)

                    continue

                elif elem.tag == "objectives":
                    lo = []
                    lo.insert(0, ''.join(filename.split("/")[8]))
                    lo.insert(1, ''.join(filename.split("/")[9]))
                    lo.insert(2,filename)
                    for obj in elem.iter():
                        ob = ""
                        if obj.tag == "objective":
                            ob=ob+obj.text+'\n'
                            lo.append(' '.join(ob.split()))
                            with open("//Output_Data/Output Files_QUADL/learning_objectives.csv", "a", newline='\n', encoding="utf-8-sig") as fp:
                                lo = [val.replace(',', ';') for val in lo]
                                print(','.join(lo), file=fp)
                            lo.pop()
                    continue


    except ET.ParseError:
        print("Exception occured for"+filename)





if __name__=="__main__":
    parse_csv(sys.argv[1])
