import xml.etree.ElementTree as ET
import sys

def parse_csv(filename):

    try:
        option={'A':1,'B':2,'C':3,'D':4,'E':5}
        with open(filename) as open_file:
            tree = ET.parse(open_file)
            for elem in tree.iter():
                if elem.tag=="multiple_choice":
                    mc = []
                    mc.insert(0, ''.join(filename.split("/")[8]))
                    mc.insert(1, ''.join(filename.split("/")[9]))
                    for q in elem.iter():
                        ques = ""
                        choices=""
                        correct_ans=""

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
                    #print(mc)
                    with open("/Users/pawan/Documents/newfile.csv", "a", newline='\n') as fp:
                         mc = [val.replace(',',';') for val in mc]
                         print(','.join(mc), file=fp)

    except ET.ParseError:
        print("Exception occured for"+filename)


if __name__=="__main__":
    parse_csv(sys.argv[1])
