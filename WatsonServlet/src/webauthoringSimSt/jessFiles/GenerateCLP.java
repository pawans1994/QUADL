package webauthoringSimSt.jessFiles;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Stack;

import webauthoringSimSt.jessTemplates.DefTemplateUI;
import webauthoringSimSt.jessTemplates.UIFactory;

public class GenerateCLP {
	
	HashSet<String> components; 
	ArrayList<String> hierachyWME = new ArrayList<String>();
	ArrayList<String> terminalWME = new ArrayList<String>();
    Stack<String> stk = new Stack<String>();
    User user;

	StringBuilder def = new StringBuilder("");

	public GenerateCLP(HashSet<String> component, User user){
		this.components = component;
	    this.components.add("problem");
	    if(!this.components.contains("CTATDoneButton"))
	    	this.components.add("button");
	    this.user = user;
	}
 

	public void generateCLPFile(){
	 Iterator<String> it = components.iterator();
	 UIFactory factory = new UIFactory();
	 FileWriter file;
	try {
		file = new FileWriter(user.getParentPath()+File.separator+user.getUserName()+File.separator+user.getTutorName()+File.separator+"wmeTypes.clp");
		System.out.println(" Path : "+user.getParentPath()+File.separator+user.getUserName()+File.separator+user.getTutorName()+File.separator);
		BufferedWriter bw = new BufferedWriter(file);
		 
		 while(it.hasNext()){
			 String component = it.next();
			 System.out.println(" Component : "+component);
			 DefTemplateUI ui = factory.getUI(component);
			 def.append(ui.getDefTemplate());
			 bw.write(ui.getDefTemplate());
		 }
		 bw.write("\n");
		 bw.write("(provide wmeTypes)");
		 bw.close();
		 classifyWME();
		 generateWMEStructure();
	} catch (IOException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	 
   }
	
	
	public void classifyWME(){
		System.out.println(def);
		String template = def.toString();
		String[] parsedStr = template.split("\\s+");
		
		for(int i=0; i<parsedStr.length; i++){
		    if(parsedStr[i].contains("::")){
		    	if(!stk.isEmpty())
		    		terminalWME.add(stk.pop());
		    	stk.push(parsedStr[i]);
		    }
		    else if(parsedStr[i].contains("multislot") && !parsedStr[i+1].contains("subgoals"))
		    	hierachyWME.add(stk.pop()+" "+parsedStr[i+1].replace(")",""));
		}
		
		if(!stk.isEmpty())
			terminalWME.add(stk.pop());
	}
	
	public void generateWMEStructure(){
		 FileWriter file;
			try {
				file = new FileWriter(user.getParentPath()+File.separator+user.getUserName()+File.separator+user.getTutorName()+File.separator+"wmeStructure.txt");
				BufferedWriter bw = new BufferedWriter(file);
				 
				addElements(bw,hierachyWME);
				addElements(bw,terminalWME);
				

				 bw.close();
	        }catch (IOException e) {
	         	// TODO Auto-generated catch block
		        e.printStackTrace();
	        }
   }
	public void addElements(BufferedWriter bw, ArrayList<String> list){
		
			try {
				  for(int i=0; i<list.size(); i++)
				     bw.write(list.get(i)+System.lineSeparator());
				  bw.write("------------");
				  bw.newLine();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	}
	

	
}
