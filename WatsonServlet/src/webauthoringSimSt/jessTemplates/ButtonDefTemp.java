package webauthoringSimSt.jessTemplates;

public class ButtonDefTemp implements DefTemplateUI {

	@Override
	public String getDefTemplate() {
		return  "(deftemplate MAIN::button "+ System.lineSeparator()+
				   "	(slot name) "+System.lineSeparator()+	
				   "	(slot value))"+System.lineSeparator();
	}

	@Override
	public String getAssertion() {
		// TODO Auto-generated method stub
		return "(assert (MAIN::button (name NAME)))";
	}

}
