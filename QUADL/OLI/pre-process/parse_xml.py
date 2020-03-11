import xml.etree.ElementTree as ET
import sys
import re
import nltk
import csv
import time

def parse_csv(filename):
    try:
        option = {'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5}
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
                                    table_row=[unit,module]
                                    for k in j.iter():
                                        if k.text is not None:
                                            para=para+k.text+" "
                                            stri=' '.join(para.split())
                                    table_row.append(stri)
                                    with open('/Users/pawan/PycharmProjects/QUADL/Output Files_QUADL/paragraph.csv','a', encoding="utf-8-sig") as fp:
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
                            with open('/Users/pawan/PycharmProjects/QUADL/Output Files_QUADL/paragraph.csv', 'a', encoding="utf-8-sig") as fp:
                                wr = csv.writer(fp, dialect='excel')
                                text_list = []
                                text_list.append(unit)
                                text_list.append(module)
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
                                    mc.insert(2, ' '.join(final_ques.split()))
                            elif q.tag == "multiple_choice":
                                for e in q.iter():
                                    if e.tag == 'choice':
                                        choice = e.attrib['value']
                                        #ch[choice] = ' '.join(' '.join([et.text + et.tail for et in e.iter()]).split())
                                        for et in e.iter():
                                            if et.text is not None or et.tail is not None:
                                                ch[choice] = ' '.join(' '.join([str(et.text) + str(et.tail)]).split())
                                mc.insert(3, ch)
                            elif q.tag == "response":
                                if 'score' in q.attrib:
                                    if (int(q.attrib['score']) > 0):
                                        correct_ans = q.attrib['match']
                                        # print(correct_ans)
                                        correct_choice = correct_ans.split(',')
                                        for cc in correct_choice:
                                            #print(filename)
                                            answer_text = answer_text + ch[cc] + "\n"
                                        mc.insert(4, answer_text)
                        # print(mc)
                        with open(f'/Users/pawan/PycharmProjects/QUADL/Output Files_QUADL/multiple_choice.csv', "a",
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
                                    mc.insert(2, ' '.join(final_ques.split()))
                            elif q.tag == 'fill_in_the_blank':
                                option_val[q.attrib['id']] = {}
                                for e in q.iter():

                                    if e.tag == 'choice':
                                        option_val[q.attrib['id']][e.attrib['value']] = ' '.join(
                                            ' '.join([et.text + et.tail for et in e.iter()]).split())
                            elif q.tag == 'response':

                                if 'score' in q.attrib:
                                    option = q.attrib['input']
                                    if option in option_val:
                                        response_val[option] = option_val[option][q.attrib['match']]
                                    else:
                                        response_val[q.attrib['input']]=q.attrib['match']
                        correct_resp.append(response_val)
                        mc.insert(3, accessTime[11:])
                        for k, v in correct_resp[0].items():
                            mc.insert(4, k)
                            if k in option_val:
                                mc.insert(5, option_val[k])
                            else:
                                mc.insert(5, 'No Options')
                            mc.insert(6, v)
                            with open(f'/Users/pawan/PycharmProjects/QUADL/Output Files_QUADL/fill_in_the_blanks.csv',
                                      "a",
                                      encoding="utf-8-sig") as fp:
                                wr = csv.writer(fp, dialect='excel')
                                wr.writerow(mc)
                            mc.pop(6)
                            mc.pop(5)
                            mc.pop(4)

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
                                    mc.insert(2, ' '.join(final_ques.split()))

                            elif q.tag == 'explanation':
                                if q.text is not None or q.tail is not None:
                                    explain = explain + str(q.text) + str(q.tail)
                                for et in q.findall('.//'):
                                    if et.text is not None and et.tail is not None:
                                        explain = explain + ' '.join(' '.join([et.text + et.tail]).split())
                        mc.insert(3, ' '.join(explain.split()))
                        with open(f'/Users/pawan/PycharmProjects/QUADL/Output Files_QUADL/short_answer.csv', "a",
                                  encoding="utf-8-sig") as fp:
                            wr = csv.writer(fp, dialect='excel')
                            wr.writerow(mc)
                    continue


                if elem.tag=="multiple_choice":
                    mc = []
                    mc.insert(0, ''.join(filename.split("/")[8]))
                    mc.insert(1, ''.join(filename.split("/")[9]))
                    for q in elem.iter():
                        ques = ""
                        choices=""

                        if q.tag=="body":
                            for e in q.iter():
                                if(e.text is not None and e.text!="\\*"):
                                    ques=ques+e.text
                            if ques and ques not in mc:
                                 mc.insert(2, ' '.join(ques.split()))
                        elif q.tag=="input":
                            i=0
                            ch_mc = []
                            for e in q.iter():
                                if(e.text is not None):
                                    choices=choices+str(i)+": "+e.text+"\n"
                                    ch_mc.append(e.text)
                                    i+=1
                            if choices is not None and choices not in mc:
                                mc.insert(3, ' '.join(choices.split()))
                        elif q.tag=="response":
                            answer_text=""
                            if(int(q.attrib['score'])>0):
                                correct_ans=q.attrib['match']
                                answer_text = answer_text+ch_mc[option[str(correct_ans)]]
                            if answer_text is not None and answer_text not in mc:
                                mc.insert(4, ' '.join(answer_text.split()))
                    for i in range(0,len(mc)-1):
                        if not mc[i]:
                            mc.remove(mc[i])
                    if len(mc)>2:
                        with open("/Users/pawan/PycharmProjects/QUADL/Output Files_QUADL/multiple_choice.csv", "a", newline='\n', encoding="utf-8-sig") as fp:
                             mc = [val.replace(',',';') for val in mc]
                             print(','.join(mc), file=fp)

                    continue

                elif elem.tag == "objectives":
                    lo = []
                    lo.insert(0, ''.join(filename.split("/")[8]))
                    lo.insert(1, ''.join(filename.split("/")[9]))
                    for obj in elem.iter():
                        ob = ""
                        if obj.tag == "objective":
                            ob=ob+obj.text+'\n'
                            lo.append(' '.join(ob.split()))
                            with open("/Users/pawan/PycharmProjects/QUADL/Output Files_QUADL/learning_objectives.csv", "a", newline='\n', encoding="utf-8-sig") as fp:
                                lo = [val.replace(',', ';') for val in lo]
                                print(','.join(lo), file=fp)
                            lo.pop()
                    continue


    except ET.ParseError:
        print("Exception occured for"+filename)





if __name__=="__main__":
    parse_csv(sys.argv[1])


