package webauthoringSimSt.jessTemplates;

public class TextFieldDefTemp implements DefTemplateUI {

	@Override
	public String getDefTemplate() {
		// TODO Auto-generated method stub
		return "(deftemplate MAIN::textField " + System.lineSeparator()+
				   "	(slot name) "+System.lineSeparator()+	
				   "	(slot value))"+System.lineSeparator();
	}

	@Override
	public String getAssertion() {
		// TODO Auto-generated method stub
		return "(assert (MAIN::textField (name NAME)))";
	}

}
