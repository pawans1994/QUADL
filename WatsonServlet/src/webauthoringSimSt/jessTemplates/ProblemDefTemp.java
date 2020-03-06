package webauthoringSimSt.jessTemplates;

public class ProblemDefTemp implements DefTemplateUI {

	@Override
	public String getDefTemplate() {
		// TODO Auto-generated method stub
		String def = "(deftemplate MAIN::problem "+System.lineSeparator()+
					 "	(slot name) "+ System.lineSeparator()+
					 "	(multislot interface-elements) "+ System.lineSeparator()+
					 "	(multislot subgoals) "+ System.lineSeparator()+
					 "	(slot done) "+ System.lineSeparator()+
					 "	(slot description)) "+System.lineSeparator();
		
		return def;
	}

	@Override
	public String getAssertion() {
		// TODO Auto-generated method stub
		return "(assert (MAIN::problem (name problem) (interface-elements";
	}
	
	

}
