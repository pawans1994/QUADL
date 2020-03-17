"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources

from django.template import Template, Context
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblock.fields import Integer, Scope, String, List, Boolean

import MySQLdb
import datetime
import time

class CheckboxXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    count = Integer(
        default=0, scope=Scope.user_state,
        help="A simple counter, to show something happening",
    )

    display_name = String(default='Checkbox Question')
    block_name = String(default='Checkbox Question')
    #editable_fields = ('title', 'question', 'choices', 'correct_choice', 'hint')
    
    ip = String(default="172.21.0.6")

    title = String(
        display_name='Problem title:',
        default='Enter a problem title here',
        scope=Scope.content, help='Problem name'
    )
    
    problemId = String(
        display_name='default problem id',
        default='Enter a problem id here',
        scope=Scope.content, help='Problem Name for DataShop'
    )
    
    question = String(
        display_name='Question:',
        default='Enter a question here',
        scope=Scope.content, help='Question statement'
    )
    choices = List(
        display_name='Choices',
        default=['Item_1', 'Item_2', 'Item_3', 'Item_4'],
        scope=Scope.content, help='Items for Checkbox Question'
    )
    correct_choice = String(
        display_name='Correct Choice',
        default="2,3", scope=Scope.content,
        help='Index of correct choice among given choices. For example if the second item and third items is correct, enter 2,3'
    )
    hint = String(
        display_name='Hint',
        default='Try hard!|Think again!|The last hint message is the answer for this question.', 
        scope=Scope.content, 
        help='Hint for the User'
    )
    kc = String(
        display_name='KC ()',
        default='DEFAULT',
        scope=Scope.content
    )

    user_choice = String(scope=Scope.user_state, help='Index of choice selected by User')
    correct = Boolean(default=False, scope=Scope.user_state, help='User selection is correct or not')
    row1 = String(scope=Scope.user_state)
    #This 'attempt' attribute is for 'attempts' column
    attempts = Integer(default=0, scope=Scope.user_state)
    hint_numbers = Integer(default=0, scope=Scope.user_state)
    # When student refresh the page, countTimes will increase one
    count_times = Integer(default=0, scope=Scope.user_state)
    hasBeenSent = String(default = "false", scope = Scope.user_state)
    pastel_student_id = String(scope=Scope.user_state)
    setBorderColor = Integer(default=0, scope=Scope.content, help='Help studio view to see if there is any skillname missing')

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the CheckboxXBlock, shown to students
        when viewing courses.
        """

        if context is None:
            context = {}
        
        context.update({'self': self})

        html = Template(self.resource_string("static/html/checkbox.html")).render(Context(context))
        frag = Fragment(html)
        frag.add_css(self.resource_string("static/css/checkbox.css"))
        frag.add_javascript(self.resource_string("static/js/src/checkbox.js"))
        frag.initialize_js('CheckboxXBlockInitView')
        xblock_obj = self.scope_ids.usage_id
        xblock_id= (str(xblock_obj.course_key) + '+type@' + str(xblock_obj.block_type) + '+block@' + str(xblock_obj.block_id)).replace("course", "block")
        return frag


    def studio_view(self, context=None):
        """
        The primary view of the simstudentXBlock, shown to students
        when viewing courses.
         """
        if context is None:
            context = {}

        context.update({'self': self})
        
        html = Template(self.resource_string("static/html/checkbox_edit.html")).render(Context(context))
        frag = Fragment(html)
        frag.add_javascript(self.resource_string("static/js/src/checkbox_edit.js"))
        frag.initialize_js('CheckboxXBlockInitStudio')
        """
        frag = Fragment()
        frag.add_content(render_template("static/html/mcqs_edit.html",{'self': self, 'context': context}))
        frag.add_javascript(self.resource_string("static/js/src/mcqs_edit.js"))
        frag.initialize_js('McqsXBlockInitStudio')
        """
        return frag


    #This method help us to find module_id for our XBlock
    def get_module_id(self, student_id, xblock_id, hintCount, clicktype):
        print('*' + student_id + '*')
        print('*' + xblock_id + '*')
        print('*' + clicktype + '*')
        try:
            db = MySQLdb.connect(self.ip, "root", "", "edxapp")
            db.autocommit(True)
            cursor = db.cursor()
            sql = """select * from edxapp.courseware_studentmodule where student_id=""" + student_id + """ and module_id='""" + xblock_id + """'"""
            cursor.execute(sql)
            student_module_id = cursor.fetchone()
            print(student_module_id[0])
            
        except:
            import traceback
            traceback.print_exc()
            db.rollback()
            print("Database has been rollback!!!")
        finally:
            cursor.close()
            db.close()
        self.insert_user_activities(student_module_id[0], hintCount, clicktype)
        return "Done"

    #This method help us to store the user activities in OpenEdx database:
    def insert_user_activities(self, student_module_id, hintCount, clicktype):
        # first, collect all the information
        correct_map = '"correct_map":{"mcqs_id":{"hint":"'+ self.hint + '", "hintmode": "click", "correctness":"'+ str(self.correct) + '", "msg": "'+ self.hint.split('|')[int(hintCount)] + '", "answervarible": null, "npoints": null, "queuestate": null}}'
        input_state = '"mcqs_input_state": {}'
        ts = time.time()
        timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
        last_submission_time = '"last_submission_time": "' + timestamp + '"'
        attempts = '"attempts":'+ str(self.attempts) + ''
        seed = '"seed": 1'
        done = '"done": true' 
        
        student_answers = '"student_answers":{"mcqs_answers":"' + str(self.user_choice) + '"}'
        input = ''
        item_group = self.user_choice.replace(',', '')
        for index in range (len(item_group) - 1):
            if index != len(item_group) - 1:
                input = input + self.choices[int(item_group[index])] + ','
            else:
                input = input + self.choices[int(item_group[index])]
        print(input)
        if clicktype == 'checkbutton':
            question_related = '"question_details":{"display_name":"' + self.display_name + '", "problem name":"' + self.title + '", "problemId": "' + self.problemId + '", "question": "' + self.question + '", "choices": "' + ' '.join(self.choices) + '", "user_choice":"' + self.user_choice + '", "kc": "' + self.kc + '", "time zone": "US/Central", "student response type": "ATTEMPT", "student response subtype": "N/A", "tutor response type": "RESULT","tutor response subtype": "N/A", "level": "N/A", "problem view": "1", "step name": "N/A", "attemp at step": "' + str(self.attempts) + '", "selection": "' + self.user_choice + '", "Action": "Checkbox", "input": "' + input + '", "feedback text": "' + self.hint.split('|')[int(hintCount)] + '", "feedback classification": "N/A", "help level": "' + str(self.hint_numbers) + '", "total number hints": "' + str(len(self.hint.split('|'))) + '", "condition name": "N/A", "condition type": "N/A", "kc category": "N/A", "school": "N/A", "class": "N/A", "cf": "N/A"}'
        else:
            question_related = '"question_details":{"display_name":"' + self.display_name + '", "problem name":"' + self.title + '", "problemId": "' + self.problemId + '", "question": "' + self.question + '", "choices": "' + ' '.join(self.choices) + '", "user_choice":"' + str(self.user_choice) + '", "kc": "' + self.kc + '", "time zone": "US/Central", "student response type": "HINT_REQUEST", "student response subtype": "N/A", "tutor response type": "HINT_MSG","tutor response subtype": "N/A", "level": "N/A", "problem view": "1", "step name": "N/A", "attemp at step": "' + str(self.attempts) + '", "selection": "", "Action": "", "input": "", "feedback text": "' + self.hint.split('|')[int(hintCount)] + '", "feedback classification": "N/A", "help level": "' + str(self.hint_numbers) + '", "total number hints": "' + str(len(self.hint.split('|'))) + '", "condition name": "N/A", "condition type": "N/A", "kc category": "N/A", "school": "N/A", "class": "N/A", "cf": "N/A"}'
        
        # for state column
        state = '{' + correct_map + ',' + input_state + ',' + last_submission_time + ',' + attempts + ',' + seed + ',' + done + ',' + student_answers + ',' + question_related +  '}'
        
        
        # Mysql database access here:
        
        db = MySQLdb.connect(self.ip, "root", "", "edxapp_csmh");
        cursor = db.cursor();
        sql = """INSERT INTO edxapp_csmh.coursewarehistoryextended_studentmodulehistoryextended(state, created, student_module_id)
         VALUES ('""" + state + """','""" + timestamp + """', '""" + str(student_module_id) + """')"""
        
        try:
            cursor.execute(sql)
            db.commit()
        except:
            db.rollback()
        finally:
            db.close()
        
        print(state)
        
    @XBlock.json_handler
    def get_status_when_refresh(self, data, suffix=''):
        return {"countTimes": self.count_times, "correctness": self.correct, "userChoice": self.user_choice, "hasBeenSent":self.hasBeenSent}
    
    @XBlock.json_handler
    def set_status_when_refresh(self, data, suffix=''):
        self.user_choice = str(data.get('userChoice'))
        self.count_times = self.count_times + 1
        self.hasBeenSent = str(data.get('hasBeenSent'))

    #Get anonymous student id
    @XBlock.json_handler
    def get_student_id(self, data, suffix=''):
        # created, state, grade, max_grade, id, student_module_id
        #5c58c732aba1b9e2e708a00c3b243de7
        
        #1. base on the anony student id, we find the user_id attribute from edxapp.student_anonymoususerid
        
        print(str(data.get('type')))
        ts = time.time()
        timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
        hintCount = int(data.get('hintCount'))
        print(hintCount)
        
        
        xblock_obj = self.scope_ids.usage_id
        xblock_id= (str(xblock_obj.course_key) + '+type@' + str(xblock_obj.block_type) + '+block@' + str(xblock_obj.block_id)).replace("course", "block")
        student_id = int(self.runtime.user_id)

        if xblock_id == "" or student_id == 0:
            try:
                db = MySQLdb.connect(self.ip, "root", "", "edxapp")
                db.autocommit(True)
                cursor = db.cursor()
                sql = """select * from edxapp.student_anonymoususerid where anonymous_user_id='""" + self.runtime.anonymous_student_id + """'"""
                cursor.execute(sql)
                row = cursor.fetchone()
                
                #2. base on the student_id and xblock id we can find the student_module_id
                # table: edxapp.courseware_studentmodule
                student_id = str(row[3])

                #self.scopr_ids.usage_id: {'block_type': u'mcqs', 'block_id': u'3b74606022e047539c790c57a056c61d', 'course_key': CourseLocator(u'University1', u'Ts1', u'2014_T1', None, None)}

                print(xblock_id)

                #print-result: 
                # block-v1:University1+Ts1+2014_T1+type@mcqs+block@0947a6a6dff34756ad4d130753cfdd60
                # block-v1:University1+Ts1+2014_T1+type@mcqs+block@0947a6a6dff34756ad4d130753cfdd60
            except:
                import traceback
                traceback.print_exc()
                db.rollback()
                print("Database has beeen rollback!!!")
            finally:
                cursor.close()
                db.close()
                time.sleep(1)
                # invoke the get_module_id method
        self.get_module_id(str(student_id), str(xblock_id), str(hintCount), str(data.get('type')))
        
        return {'user': student_id , 'xblock_id': xblock_id, "type":str(data.get('type')), "count":str(hintCount)} 
        
        
    @XBlock.json_handler
    def check_answer(self, data, suffix=''):
        """
        Check answer for submitted response
        """
        self.attempts = self.attempts+1
        response = dict(correct=False)

        #ans = (data.get('ans')).encode('utf-8', 'ignore')
        ans = data.get('ans')
        print(ans)
        # store user response
        self.user_choice = ans
        
        print(ans == self.correct_choice)
        if ans == self.correct_choice:
            self.correct = True
            response['correct'] = True
        else:
            self.correct = False
            response['correct_choice'] = self.correct_choice
         
        
        return response
    
    @XBlock.json_handler
    def get_question_name(self, data, suffix=''):
        """
        get question name as a hint id 
        """
        return {'response': self.question}
    
    @XBlock.json_handler
    def update_question(self, data, suffix=''):
        """
        Update all the fields:
        """    
        self.display_name=data['problemTitle']
        self.problemId=data['problemId']
        self.question=data['question']
        self.choices=data['choices']
        self.correct_choice=data['correct']
        self.hint=data['hint']
        self.kc=data['kc']
        
        
        return {'result': 'success'}

    @XBlock.json_handler
    def get_hint(self, data, suffix=''):
        """
        Give hint for the question
        """
        self.hint_numbers = self.hint_numbers + 1
        response = dict(hint=self.hint)

        return {'response': self.hint}

    @XBlock.json_handler
    def change_name(self, data, suffix=''):
        """
        Change display_name for the questions
        """
        self.display_name = String(data.get('title'));
        
        return display_name
    
    @XBlock.json_handler
    def get_default_data(self, data, suffix=''):
        """
        when mcqs_edit page is on load, get all the default data from here
        """
        
        return {'display_name': self.display_name, 'title': self.title, 'problemId': self.problemId, 'kc': self.kc, 'question': self.question, 'choices': self.choices, 'correct_choice': self.correct_choice, 'hint': self.hint}
        
    @XBlock.json_handler
    def get_xblock_id(self, data, suffix=''):
        xblock_obj = self.scope_ids.usage_id
        xblock_id= (str(xblock_obj.course_key) + '+type@' + str(xblock_obj.block_type) + '+block@' + str(xblock_obj.block_id)).replace("course", "block")
        return {"xblock_id": xblock_id, "xblock_code": str(xblock_obj.block_id).replace("course", "block") }
   


    @XBlock.json_handler
    def get_border_color(self, data, suffix=''):
        # start to save the XBlock related information in the database:
        db = MySQLdb.connect(self.ip, "root", "", "edxapp_csmh", charset='utf8');
        cursor = db.cursor();
        
        course_id = str(self.scope_ids.usage_id.course_key)
        skillname = self.kc
        #for select the same course to see if there is any other xblock type have the same id
        sql2 = """SELECT * FROM edxapp_csmh.export_course_content_and_skill_validation WHERE type_of_xblock = "TextParagraph" AND course_id = %s AND lower(skillname) = lower(%s)"""
        try:
            cursor.execute(sql2, (course_id, skillname))
            result1 = cursor.fetchone()
            if not cursor.rowcount:
                print("No any other xblocks have the same skillname")
                HtmlSetBorderColor = 0
            else:
                print("Found xblock with the same skillname.")
                HtmlSetBorderColor = 1
        except Exception as e:
            print("I am getting error when inserting - assessment.")
            print(e)
            db.rollback()
        finally:
            db.close()
        return {"setBorderColor": HtmlSetBorderColor}




    #for skill mapping
    @XBlock.json_handler
    def module_skillname_saved(self, data, suffix=''):
        
        
        skillname = str(self.kc)
        xblock_id = str(self.scope_ids.usage_id)
        url = str(data.get('location_id'))
        paragraph_id = str(self.scope_ids.usage_id.block_id).replace("course", "block")
        # if we want to use <jump_to_id> method then we need to know the course_id and paragraph_id. Format: /jump_to_id/location_id#paragraph_id
        # now we are using full url link instead.
        course_id = str(self.scope_ids.usage_id.course_key)
        #full_url = str(data.get('full_url'))[:-1] + "#" + paragraph_id
        #start saving it in the database, target table: skill_mapping
        location_id = course_id + "$" + url + "$" + paragraph_id
        db = MySQLdb.connect(self.ip, "root", "", "edxapp_csmh", charset='utf8');
        cursor = db.cursor();
        sql = """INSERT INTO edxapp_csmh.module_skillname(xblock_id, type, skillname, location) VALUES (%s, %s, %s, %s)"""

        try:
            cursor.execute(sql,(xblock_id, "checkbox", skillname, location_id))
            db.commit()
                
            print("Skillname has been saved in module_skillname table.")
        except Exception as e:
            print(e)
            db.rollback()
                
            print("Database rollback!")
            return {"result": "There has been a rollback while inserting"}
        
        sql1 = """select * from edxapp_csmh.module_skillname where id = (select max(id) from edxapp_csmh.module_skillname where type='text' and lower(skillname)=lower(%s) and id< (select id from edxapp_csmh.module_skillname where xblock_id=%s));"""
        
        sql2 = """INSERT INTO edxapp_csmh.skill_mapping(assessment_id, location) VALUES (%s, %s)"""
        try: 
            cursor.execute(sql1, (skillname, xblock_id))
            match_result = cursor.fetchone()
            db.commit()
            if not cursor.rowcount:
                print("No results found")
                return {"result": "No results found."}
        except Exception as e:
            print(e)
            db.rollback()
            print("this skillname didn't have any paragraph match.")
            return {"exception": "this skillname didn't have any paragraph match." }
        try:
            cursor.execute(sql2, (xblock_id, match_result[4]))
            db.commit()
            print("get location matching after the skillname saved.")
        except Exception as ep:
            print(ep)
            db.rollback()
            print("this skillname didn't have any paragraph match.")
        finally:
            db.close()
        
        return {"skillname": skillname, "xblock_id": xblock_id, "location_id": url, "paragraph_id": paragraph_id, "course_id": course_id, "max_id": match_result[0], "matching_location": match_result[4], "type": match_result[2], "xblock_id": match_result[1]}
    


    #for skill mapping
    @XBlock.json_handler
    def get_skill_mapping(self, data, suffix=''):
        
            
        # We don't recognize this key
        #start saving it in the database, target table: skill_mapping
        db = MySQLdb.connect(self.ip, "root", "", "edxapp_csmh", charset='utf8');
        cursor = db.cursor();
        sql = """SELECT location from edxapp_csmh.skill_mapping where assessment_id = '%s';"""
        
        try:
            cursor.execute(sql % str(self.scope_ids.usage_id))
            result = cursor.fetchone()
            if not cursor.rowcount:
                print("No results found")
                return {"result": "No results found."}
            url = result[0].split("$")
            course_id = url[0]
            location_id = url[1]
            paragraph_id = url[2]
            print("Got skill name from DB.", skillname)
        except Exception as e:
            print(e)
            db.rollback()
            print("Database rollback!")
        finally:
            db.close()
        
        return {'course_id': course_id, "location_id": location_id, "paragraph_id": paragraph_id}




    #For problem hiding
    @XBlock.json_handler
    def get_pastel_student_id(self, data, suffix=''):
        if self.pastel_student_id == '' or self.pastel_student_id is None:
            db = MySQLdb.connect(self.ip, "root", "", "edxapp", charset='utf8');
            cursor = db.cursor();
            username = ""
            email = ""

            sql = """SELECT * FROM edxapp.auth_user where id = %s"""

            try:
                cursor.execute(sql ,(str(self.runtime.user_id)))
                result = cursor.fetchone()
                if not cursor.rowcount:
                    print("No any results(auth_student) found.")
                    return
                username = str(result[4])
                email = str(result[7])
                print("Get username and email from DB: ", str(result[4]) + ", " + str(result[7]))

                db.commit()
            except Exception as e:
                print(e)
                db.rollback()
            finally:
                db.close()

            db1 = MySQLdb.connect(self.ip, "root", "", "edxapp_csmh", charset='utf8');
            cursor1 = db1.cursor();
            
            sql1 = """SELECT * FROM edxapp_csmh.pastel where name = %s and email = %s"""
            try:
                if email != "":
                    cursor1.execute(sql1, (str(username), str(email)))
                    result1 = cursor1.fetchone()
                    if not cursor1.rowcount:
                        print("No any results(pastel_student_id) found.")
                        return
                    print("Get pastel_student_id from DB: ", str(result1[3]))
                    self.pastel_student_id = str(result1[3])
                    db1.commit()
            except Exception as e:
                print(e)
                db1.rollback()
            finally:
                db1.close()
            
        return {'pastel_student_id': self.pastel_student_id, 'hasBeenSent': self.hasBeenSent}
    

    #Problem Hiding    
    @XBlock.json_handler
    def get_studentId_and_skillname(self, data, suffix=''):
        return {"student_id": str(self.pastel_student_id), "skillname": self.kc, "question_id": self.problemId, "correctness": self.correct, "course" : str(self.scope_ids.usage_id.course_key)}


    #Problem Hiding
    @XBlock.json_handler
    def get_probability(self, data, suffix=''):
        db = MySQLdb.connect(self.ip, "root", "", "edxapp_csmh", charset='utf8');
        cursor = db.cursor();
        sql = """SELECT * FROM edxapp_csmh.temporary_probability where lower(skillname) = lower(%s) and student_pastel_id = %s order by id DESC limit 1;"""

        try:
            cursor.execute(sql ,(str(data.get('skillname')), str(data.get('student_id'))))
            result = cursor.fetchone()
            if not cursor.rowcount:
                print("No any results(get_probability) found.")
            
            return {'probability': str(result[5])}

            db.commit()
        except Exception as e:
            print(e)
            db.rollback()
        finally:
            db.close()


    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("CheckboxXBlock",
             """<checkbox/>
             """),
            ("Multiple CheckboxXBlock",
             """<vertical_demo>
                <checkbox/>
                <checkbox/>
                <checkbox/>
                </vertical_demo>
             """),
        ]
