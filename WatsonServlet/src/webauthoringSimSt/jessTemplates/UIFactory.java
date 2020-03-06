package webauthoringSimSt.jessTemplates;

public class UIFactory {
	public DefTemplateUI getUI(String component){
		if(component == null || component.length() == 0)
			return null;
		else if(component.equalsIgnoreCase("problem"))
			return new ProblemDefTemp ();
		else if(component.toLowerCase().contains("button"))
			return new ButtonDefTemp();
		else if(component.contains("CTATTable"))
			return new TableDefTemp(); 
		else if(component.equalsIgnoreCase("cell"))
			return new CellDefTemp();
		else if(component.equalsIgnoreCase("CTATTextInput"))
			return new TextFieldDefTemp();
		else if(component.equalsIgnoreCase("column"))
			return new ColumnDefTemp();
		return null;
		
	}
}
