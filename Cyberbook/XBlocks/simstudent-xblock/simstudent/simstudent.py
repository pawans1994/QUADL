"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblock.fields import Integer, Scope, String


class SimStudentXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    

    href = String(help="URL for SimStudent HTML rendring",
                  default="",
                  scope=Scope.content)

    display_name = String(help="Name of the component in the edxPlatform",
			  default="Watson Tutor",
                          scope=Scope.settings)

    name = String(help="Name of the brd file to run",
                    default="if_p_or_q_then_r.brd",
                    scope=Scope.content)


    host = String(help="Ip Address or the domain name of the host",
                    default="localhost",
                    scope=Scope.content)


    port = String(help="Port where the SimStudentServlet is running",
                    default="8080",
                    scope=Scope.content)

    folder_name = String(help="Name of the folder containing the bundle",
                    default="informallogic",
                    scope=Scope.content)

    problem_name = String(help="Name of the problem file (wme)",
                    default="if_p_or_q_then_r",
                    scope=Scope.content)

    value_type_checker_name = String(help="Class containing the valueTypeChecker",
                    default="informallogic.MyFeaturePredicate.valueTypeChecker",
                    scope=Scope.content)

    backend_name = String(help="Backend Class to use",
                    default="interaction.ModelTracerBackend",
                    scope=Scope.content)

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the SimStudentXBlock, shown to students
        when viewing courses.
        """
        html = self.resource_string("static/html/simstudent.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/simstudent.css"))
        frag.add_javascript(self.resource_string("static/js/src/simstudent.js"))
        frag.initialize_js('SimStudentXBlock')
        return frag


    def studio_view(self, context=None):
        """
        The primary view of the simstudentXBlock, shown to students
        when viewing courses.
        """
        html = self.resource_string("static/html/simstudent_edit.html")
        frag = Fragment(html.format(self=self))
        frag.add_javascript(self.resource_string("static/js/src/simstudent_edit.js"))
        frag.initialize_js('simstudentXBlock')
        return frag


    @XBlock.json_handler
    def save_simstudent(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        self.href = data['href']
        self.host = data['host']
        self.port = data['port']
        self.name = data['name']
        self.folder_name = data['folder_name']
        self.problem_name = data['problem_name']
        self.value_type_checker_name = data['value_type_checker_name']
        self.backend_name = data['backend_name']




    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("SimStudentXBlock",
             """<simstudent/>
             """),
            ("Multiple SimStudentXBlock",
             """<vertical_demo>
                <simstudent/>
                <simstudent/>
                <simstudent/>
                </vertical_demo>
             """),
        ]
