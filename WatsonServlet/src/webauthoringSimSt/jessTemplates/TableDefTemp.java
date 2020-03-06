package webauthoringSimSt.jessTemplates;

public class TableDefTemp implements DefTemplateUI {

	@Override
	public String getDefTemplate() {
		// TODO Auto-generated method stub
		String table = "(deftemplate MAIN::table "+System.lineSeparator()+
				   "	(slot name) "+ System.lineSeparator()+
				   "	(multislot columns))" +System.lineSeparator();

		String column ="(deftemplate MAIN::column "+ System.lineSeparator()+
					"	(slot name) "+ System.lineSeparator()+
					"	(multislot cells) "+System.lineSeparator()+
					"	(slot position) "+ System.lineSeparator()+
					"	(slot description)) "+System.lineSeparator();
		String cell ="(deftemplate MAIN::cell "+ System.lineSeparator()+
				   "	(slot name) "+ System.lineSeparator()+
				   "	(slot value) "+ System.lineSeparator()+
				   "	(slot description) "+ System.lineSeparator()+
				   "	(slot row-number) "+ System.lineSeparator()+
				   "	(slot column-number))"+System.lineSeparator();
		
		return table + column + cell;
	}

	@Override
	public String getAssertion() {
		// TODO Auto-generated method stub
		return "(assert (MAIN::table (name NAME)))";
	}

}
