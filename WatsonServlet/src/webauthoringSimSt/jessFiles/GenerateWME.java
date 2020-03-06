package webauthoringSimSt.jessFiles;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import webauthoringSimSt.jessTemplates.DefTemplateUI;
import webauthoringSimSt.jessTemplates.UIFactory;

public class GenerateWME {

	HashMap<String,String> components;
	HashMap<String,String> varMap ;
	webauthoringSimSt.jessTemplates.UIFactory factory;
	boolean table;
	User user;
	int var;
	String bind = "bind ?var";
	
	public GenerateWME(HashMap<String,String> ctatComponents,User user){
		this.factory = new UIFactory();
		this.components = ctatComponents;
		if(!components.containsKey("hint") && !components.containsKey("HINT"))
			components.put("hint", "button");
		if(!components.containsKey("CTATDoneButton"))
			components.put("done", "button");
		this.varMap = new HashMap<String,String>();
		this.user = user;
		this.var = 1;
	}
	
	
	public void generateWMEfile(){
		FileWriter file;
		try {
			file = new FileWriter(user.getParentPath()+File.separator+user.getUserName()+File.separator+user.getTutorName()+File.separator+"init.wme");
			BufferedWriter bw = new BufferedWriter(file);
			writeCTATAssertion(bw);
			bw.write(System.lineSeparator());
			if(table)
				writeTableConfig(bw);
			bw.write(System.lineSeparator());
			bw.write(";;;; Interface configuration"+System.lineSeparator());
			DefTemplateUI problem = factory.getUI("problem");
			String assertion = problem.getAssertion() + " "+varMap.get("problem");
            bw.write("("+bind+var+" "+assertion+"))))");
			
			
			bw.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	}
	

	private void writeTableConfig(BufferedWriter bw) {
		// TODO Auto-generated method stub
		DefTemplateUI ui = factory.getUI("cell");
		for(Map.Entry<String,String> entry : components.entrySet()){
			if(entry.getValue().contains(",")){
				int row = Integer.parseInt(entry.getValue().split(",")[0]);
				int col = Integer.parseInt(entry.getValue().split(",")[1]);
				try {
					bw.write(System.lineSeparator());
					bw.write(";;;; Table configuration for "+entry.getKey());
					bw.write(System.lineSeparator());
					for(int i=0; i<col; i++){
						StringBuilder cellBuilder = new StringBuilder("");
						for(int j=0; j<row; j++){
							String cell = ui.getAssertion();
							cell = cell.replace("NAME",entry.getKey()+"_C"+i+"R"+j);
							cell = cell.replace("ROW", j+"");
							cell = cell.replace("COL", i+"");
							bw.write("("+bind+var+" "+cell+")");
							bw.write(System.lineSeparator());
							cellBuilder.append("?var"+var+" ");
							var++;
						}
						
						 // column 
						 varMap.put(entry.getKey()+"_C", varMap.getOrDefault(entry.getKey()+"_C","")+"?var"+var+" ");
						 DefTemplateUI column = factory.getUI("column");
						 String str = column.getAssertion();
						 str = str.replace("NAME", entry.getKey()+"_Column"+i);
						 str = str.replace("POSITION",i+"");
						 str = str.replace("CELLS", cellBuilder.toString());
						 
						 bw.write("("+bind+var+" "+str+")");
						 bw.write(System.lineSeparator());
						 var++;
						 
					}
					
					// modify the table
					bw.write("(modify "+varMap.get(entry.getKey()) +" (name "+entry.getKey()+")(columns "+varMap.get(entry.getKey()+"_C")+"))");
					bw.write(System.lineSeparator());

					
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}


	public void writeCTATAssertion(BufferedWriter bw){
		try {
			bw.write("(require* wmeTypes \"wmeTypes.clp\")");
			bw.write(System.lineSeparator());
			bw.write(";;;; CTAT components assertions.");
			bw.write(System.lineSeparator());
			StringBuilder varComp = new StringBuilder("");
			String done = "";
			String hint = "";
			for(Map.Entry<String, String> entry : components.entrySet()){
				DefTemplateUI ui = null;
				 if(entry.getValue().contains(",")){
					  ui = factory.getUI("CTATTable");
					  table = true;
				 }
				 else 
					  ui = factory.getUI(entry.getValue());
				 String assertion = ui.getAssertion();
				 assertion = assertion.replace("NAME", entry.getKey());
				 bw.write("("+bind+var+" "+assertion+")");
				 bw.write(System.lineSeparator());
				 if(entry.getKey().equals("done"))
					 done = "?var"+var+" ";
				 else if (entry.getKey().equals("hint"))
					 hint = "?var"+var+" ";
				 else
					varComp.append("?var"+var+" ");
					 
				 varMap.put(entry.getKey(),varMap.getOrDefault(entry.getKey(), "")+"?var"+var+" ");
				 var++;
			}
			
			varMap.put("problem", done+varComp.toString()+hint);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
