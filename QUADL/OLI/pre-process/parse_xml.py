import xml.etree.ElementTree as ET
import sys
import re
import nltk
import csv
def parse_csv(filename):

    try:
        option={'A':1,'B':2,'C':3,'D':4,'E':5}
        with open(filename) as open_file:
            tree = ET.parse(open_file)
            root=tree.getroot()
            for elem in tree.iter():
                for t in root.findall('.//'):
                    if t.tag=='fill_in_the_blank':
                        type_ques='f_i_b'
                    elif t.tag == 'short_answer':
                        type_ques = 's_a'
                    elif t.tag == 'multiple_choice':
                        type_ques = 'm_c'
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
                                    with open('/Users/pawan/Documents/paragraph.csv','a') as fp:
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
                            with open('/Users/pawan/Documents/paragraph.csv', 'a') as fp:
                                wr = csv.writer(fp, dialect='excel')
                                text_list = []
                                text_list.append(unit)
                                text_list.append(module)
                                for s in range(0, len(new_text) - 1):
                                    text_list.append(new_text[s])
                                    wr.writerow(text_list)
                                    text_list.pop()
                            break
                if elem.tag=="question":

                    mc = []
                    mc.insert(0, ''.join(filename.split("/")[8]))
                    mc.insert(1, ''.join(filename.split("/")[9]))
                    for q in elem.iter():
                        ques = ""
                        choices=""
                        if q.tag=="body":
                            if q.text is not None:
                                ques=ques+q.text
                            for e in q.findall('.//'):
                                if e.text is not None:
                                    ques=ques+e.text
                            if ques and ques not in mc:
                                 mc.insert(2, ' '.join(ques.split()))
                        elif q.tag=="multiple_choice":
                            i=0
                            ch = {}
                            for e in q.iter():
                                if(e.text is not None):
                                    choices=choices+str(i)+": "+e.text+"\n"
                                    if 'value' in e.attrib:
                                        ch[e.attrib['value']] = ' '.join(e.text.split())
                                    i+=1
                            if choices and choices not in mc:
                                mc.insert(3, ' '.join(choices.split()))
                        elif q.tag=="fill_in_the_blank":
                            option = q.attrib['id']
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
                            answer_text = ""
                            if type_ques == 'm_c':
                                if 'score' in q.attrib:
                                    if (int(q.attrib['score']) > 0):
                                        correct_ans = q.attrib['match']
                                        correct_choice=correct_ans.split(',')
                                        for cc in correct_choice:
                                            if cc in ch:
                                                answer_text = answer_text + ch[cc]+"\n"
                                if answer_text is not None and answer_text not in mc:
                                    mc.insert(4, ' '.join(answer_text.split()))
                            elif type_ques == 'f_i_b':
                                if 'score' in q.attrib:
                                    option=q.attrib['input']
                                    answer_text=answer_text+q.attrib['name']+"\n"
                                    answer_text=option+": "+answer_text
                                    if len(mc)==5:
                                        mc[4]=mc[4]+answer_text
                                    else:
                                        mc.insert(4, answer_text)
                        elif q.tag =='explanation':
                            if type_ques =='s_a':
                                for sub_tag in q.iter():
                                    if sub_tag.text is not None and sub_tag.tail is not None:
                                        answer_text=answer_text+sub_tag.text+sub_tag.tail
                            mc.insert(4, ' '.join(answer_text.split()))
                    for i in range (0,len(mc)-1):
                        if not mc[i]:
                            mc.remove(mc[i])
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
                            ch = []
                            for e in q.iter():
                                if(e.text is not None):
                                    choices=choices+str(i)+": "+e.text+"\n"
                                    ch.append(e.text)
                                    i+=1
                            if choices is not None and choices not in mc:
                                mc.insert(3, ' '.join(choices.split()))
                        elif q.tag=="response":
                            answer_text=""
                            if(int(q.attrib['score'])>0):
                                correct_ans=q.attrib['match']
                                answer_text = answer_text+ch[option[str(correct_ans)]]
                            if answer_text is not None and answer_text not in mc:
                                mc.insert(4, ' '.join(answer_text.split()))
                    for i in range(0,len(mc)-1):
                        if not mc[i]:
                            mc.remove(mc[i])
                    if len(mc)>2:
                        with open("/Users/pawan/Documents/multiple_choice.csv", "a", newline='\n') as fp:
                             mc = [val.replace(',',';') for val in mc]
                             print(','.join(mc), file=fp)
                elif elem.tag == "objectives":
                    lo = []
                    lo.insert(0, ''.join(filename.split("/")[8]))
                    lo.insert(1, ''.join(filename.split("/")[9]))
                    for obj in elem.iter():
                        ob = ""
                        if obj.tag == "objective":
                            ob=ob+obj.text+'\n'
                            lo.append(' '.join(ob.split()))
                            with open("/Users/pawan/Documents/learning_objectives.csv", "a", newline='\n') as fp:
                                lo = [val.replace(',', ';') for val in lo]
                                print(','.join(lo), file=fp)
                            lo.pop()

    except ET.ParseError:
        print("Exception occured for"+filename)


if __name__=="__main__":
    parse_csv(sys.argv[1])
