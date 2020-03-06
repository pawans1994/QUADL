package interaction;

import interaction.InterfaceAttribute.Style;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URISyntaxException;
import java.net.URL;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

import org.w3c.dom.Document;
import org.w3c.dom.Node;

import edu.cmu.pact.miss.SimSt;
import interaction.SAI;
import edu.tamu.problemSelectionHeuristics.ProblemSelector;
import jess.JessException;
import servlet.SimStudentBaseServlet;
import servlet.Utilities;
import tracer.*;
import tracer.MTResult.MTResultType;

public class ModelTracerBackend extends Backend {
	 
	MTSolver solver;

	//These properties are set in parseArgument method
	private String folderName;
	//TODO rename to follow coding convention
	private String INIT_FILE;
	private String typeChecker;
	private String inputMatcher;
	private String PRODUCTION_FILE = folderName+"/productionRulesModelTracer.pr";
	private String WME_TYPE_FILE = folderName+"/wmeTypes.clp";
	
	//Tutor 1
	/*private static final String PRODUCTION_FILE = "informallogic/production.pr";
	private static final String WME_TYPE_FILE = "informallogic/wmeTypes.clp";
	private static final String INIT_FILE = "informallogic/if_p_or_q_then_r.wme";
	 */
	
	//Tutor 2
	/*private static final String PRODUCTION_FILE = "digt_1_3/production.pr";
	private static final String WME_TYPE_FILE = "digt_1_3/wmeTypes.clp";
	private static final String INIT_FILE = "digt_1_3/prob1.wme";*/
	
	//Tutor 3
	/*private static final String PRODUCTION_FILE = "rmconnective/production.pr";
	private static final String WME_TYPE_FILE = "rmconnective/wmeTypes.clp";
	private static final String INIT_FILE = "rmconnective/if_not_p_then_q.wme";*/
	
	//Tutor 4
	/*private static final String PRODUCTION_FILE = "pushnegationinward/production.pr";
	private static final String WME_TYPE_FILE = "pushnegationinward/wmeTypes.clp";
	private static final String INIT_FILE = "pushnegationinward/not_not_p_and_q.wme";*/
	
	private static final Color DISABLED_BACKGROUND_COLOR = new Color(215,215,215);
	private static final Color CORRECT_BORDER_COLOR = new Color(19,230,90);
	private static final Color INCORRECT_BORDER_COLOR = new Color(255,0,0);
	private static final Color GIVEN_BORDER_COLOR = new Color(0,0,0);
	private static final int BORDER_WIDTH = 3;

	private static final String HINT_WINDOW_NAME = "hintWin";
	private static final String HINT_BUTTON_NAME = "hint";
	private static final String DONE_BUTTON_NAME = "done";
	
	private HashSet<String> deftemplates = new HashSet<String>();
	private List<SAI> problemSAI = new ArrayList<SAI>();
	
	/* Modified by Shruti - added a parameter to invoke the parseArguments method
	* before the production rules file, wme files, and the UserDefSymbols are loaded.
	* This helps in setting the value type checker 
	* before loading the user-defined feature-predicate classes during runtime.
	*/
	public ModelTracerBackend(String[] argV){
		super(argV);
		System.out.println("inside MTB(String[]) "+this.typeChecker);
		try {
			boolean exist = jessFileExists(PRODUCTION_FILE);
			if (!exist || (exist && !compareVersion())) {
				System.out.println("production file does not exist");
				createProductionFile();
			}
			
			if (!jessFileExists(WME_TYPE_FILE)) {
				System.out.println("wmetype file does not exist");
				createTypeFile();
			}
			
			if (!jessFileExists(INIT_FILE)) {
				System.out.println("init file does not exist");
				createInitFile();
			}
			
			System.out.println(INIT_FILE);
			System.out.println(PRODUCTION_FILE);
			System.out.println(WME_TYPE_FILE);
		    this.solver = new MTSolver(INIT_FILE, WME_TYPE_FILE, PRODUCTION_FILE);
			
			this.solver.logProductionRules = false;
			this.solver.logMessages = false;
			if(this.getInputMatcher() != null && this.getInputMatcher().length() > 0)
				this.solver.setInputMatcher(this.getInputMatcher());
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	private boolean compareVersion(){
		File productionRuleFile = new File(readFromClassPath(folderName+"/productionRules.pr").getFile());
		Date modifiedDate = new Date(productionRuleFile.lastModified());
		BufferedReader br = null;
		File lastModifiedDate = new File(readFromClassPath(folderName+"/lastModified.txt").getFile());
		String date = "";
		try {
			br = new BufferedReader(new FileReader(lastModifiedDate));
			date = br.readLine();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally{
			if(br != null)
				try {
					br.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		}
		return date.equals(modifiedDate.toString());
	}
	private void createProductionFile() throws IOException {
		File file = new File(readFromClassPath(folderName+"/productionRules.pr").getFile());
		BufferedReader br = new BufferedReader(new FileReader(file));
		List<String> lines = new ArrayList<String>();
		String line = "";
		
		while((line=br.readLine()) != null){
			lines.add(line);
			if(line.contains("modify") && line.contains("done TRUE"))
				lines.add("(construct-message \"[ Click done button ]\")");
		}
		br.close();
		
		transformLines(lines);
		
		File productionFile = new File(SimStudentBaseServlet.watsonFolder+"/"+PRODUCTION_FILE);
		BufferedWriter bw = new BufferedWriter(new FileWriter(productionFile));
		
		for(int i=0; i<lines.size(); i++){
				bw.write(lines.get(i));
				if(i != lines.size()-1)
					bw.write("\n");
		}
		bw.close();
		
		File lastModified = new File(SimStudentBaseServlet.watsonFolder+"/"+folderName+"/lastModified.txt");
		BufferedWriter bw1 = new BufferedWriter(new FileWriter(lastModified));
		Date lastModifiedDate = new Date(file.lastModified());
		
		bw1.write(lastModifiedDate.toString());
		bw1.close();
	}
	
	private void transformLines(List<String> productionRulesLines){
		String line = "";
		String constructMessage = "(construct-message \"[ Enter \" ?input \" in the highlighted yellow box,\" ?selection \"]\")";
		String constructMessageDone = "(construct-message \"[ Click done button ]\")";
		String predictAlgebra = "predict-algebra-input";
		String modelTrace = "model-trace-input";
		
		for(int i=0; i<productionRulesLines.size(); i++){
			line = productionRulesLines.get(i);
			if(line.contains(predictAlgebra))
				productionRulesLines.set(i,line.replaceAll(predictAlgebra,modelTrace));
			else if(line.contains("construct-message")){
				String previousLine = productionRulesLines.get(i-1);
				if(previousLine.contains("done"))
					productionRulesLines.set(i-1,constructMessageDone);
				else
					productionRulesLines.set(i-1,constructMessage);
				productionRulesLines.set(i,previousLine);
			}
		}
	}
	
	private void createTypeFile() throws IOException {
		PrintWriter w = new PrintWriter(WME_TYPE_FILE);
		
		String endTag = "</jessDeftemplates>";
		for (String wme : this.getWME()) {
			Document d = Utilities.loadXMLFromString(wme.substring(0, wme.indexOf(endTag) + endTag.length()));
			if (d != null) {
				Node value = d.getFirstChild().getFirstChild().getFirstChild();
				String deftemplate = value.getNodeValue();
				if (!deftemplates.contains(deftemplate)) {
					w.println(deftemplate);
					deftemplates.add(deftemplate);
				}
			}
			
		}
		w.close();
	}
	
	private void createInitFile() throws IOException {
		PrintWriter w = new PrintWriter(INIT_FILE);
		
		String startTag = "<jessInstances>";
		String endTag = "</jessInstances>";
		for (String wme : this.getWME()) {
			Document d = Utilities.loadXMLFromString(wme.substring(wme.indexOf(startTag), wme.indexOf(endTag) + endTag.length()));
			if (d != null) {
				Node value = d.getFirstChild().getFirstChild().getFirstChild();
				w.println(value.getNodeValue());
			}
			
		}
		w.close();
	}
	
	private boolean jessFileExists(String filename) throws URISyntaxException {
		boolean existsInClassPath = true;
		boolean existsInCurrentPath = true;
		
		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
		URL url = classLoader.getResource(filename);
		// url is null if can't find resource
		if (url != null) {
			File f = new File(url.toURI().getPath());
			existsInClassPath = f.exists() && !f.isDirectory();
		} else {
			existsInClassPath = false;
		}
		
		File f = new File(filename);
		existsInCurrentPath = f.exists() && !f.isDirectory();
		
		return existsInClassPath || existsInCurrentPath;
	}
	
	private URL readFromClassPath(String fileName){
		return this.getClass().getClassLoader().getResource(fileName);
	}
	
	@Override
	public void processInterfaceEvent(InterfaceEvent ie) {
		// TODO Auto-generated method stub
		//This is done to match the typeChecker with the method that is intended.
		SimSt.setTypeChecker(typeChecker);
		System.out.println("SimSt typechecker: "+SimSt.getTypeChecker());
		SAI sai=ie.getEvent();
		
		
		
		switch(ie.getType()){
		case SAI:
			processSAI(sai,ie.getTransactionID());
			break;
		}
	}
	
	private void processSAI(SAI sai,String transactionID) {
		System.out.println("in processSAI: "+sai.getFirstAction());
		String action = sai.getFirstAction();//action performed on interface
		if(action.equals("UpdateTextArea") || action.equals("UpdateTextField")){//text area typed into
			processUpdateTextArea(sai,transactionID);
		}else if(action.equals("ButtonPressed")){//button is pressed
			processButtonPressed(sai,transactionID);
		}
		else if(action.equals("UpdateWorkingMemory")){
			updateWorkingMemory(sai,transactionID);
		}
	}
	
	private void updateWorkingMemory(SAI sai, String transactionID){
		this.solver.modifyWithSAI(makeTracerSai(sai));
		try {
			this.solver.printFacts();
		} catch (JessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private void processUpdateTextArea(SAI sai,String transactionID) {
		MTSAI mtsai = makeTracerSai(sai);
		try {
			String selection = sai.getFirstSelection();
			if (selection != null) {
				System.out.println("inside selection -->"+this.solver);
				// this should never happen, but right now there is a weird behavior where
				// moving away from a textbox causes an updatetextarea sai, so we have to
				// avoid considering the same sai twice by checking if the textbox is enabled,
				// or else the tutor will not function properly
				InterfaceAttribute at = getComponent(selection);
				if (at != null && at.getIsEnabled()) {
					System.out.println("Sending sai to solver.....:::: " + mtsai);
					System.out.println("Solver: "+solver);
					MTResult result = this.solver.sendSAI(mtsai);
					System.out.println("MTResult: "+result.getType());
					this.solver.printFacts();
					java.util.Date date= new java.util.Date();
					System.out.println("LogPatch: [User : " + userID +"],[ProblemInfo:"+this.problemName+"],[Session:"+this.getSession()+"],[TransID:"+ transactionID+"],[SAI:"+sai.getFirstSelection()+","+sai.getFirstAction()+","+sai.getFirstInput()+"],[Result:"+result.getType()+"],[EventTime:"+new Timestamp(date.getTime())+"]");
					switch (result.getType()) {
					case CORRECT:
						
						setCorrect(getComponent(sai.getFirstSelection()));
						//reset hint
						ArrayList<String> emptyMsg=new ArrayList<String>();
						emptyMsg.add("    ");
						this.sendHintMessage(emptyMsg);
						this.sendSkillMessage(result.getRuleFired());
						break;
					case INCORRECT:
						setIncorrect(getComponent(sai.getFirstSelection()));
						this.sendSkillMessage(result.getRuleFired());

						break;
					case BUGGY:
						
							
						setIncorrect(getComponent(sai.getFirstSelection()));
						//set the hint message
						ArrayList<String> hintMsg = new ArrayList<String>();
						hintMsg.add(result.getMessage());
						this.sendHintMessage(hintMsg);
						this.sendSkillMessage(result.getRuleFired());
						break;
					case UNAVAILABLE:
						System.out.println("Unavailable!");
						// tracer can be unavailable if currently processing hint/sai request
						break;
					default:
						System.out.println("Unexpected result type: " + result.getType());
						break;
					}
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		
	}
	
	private void sendHintWindowMessage(String message) {
		formatHintWindow();
		sendSAI(new SAI(HINT_WINDOW_NAME, "UpdateTextArea", message));
	}
	
	private void formatHintWindow() {
		InterfaceAttribute ia = getComponent(HINT_WINDOW_NAME);
		ia.setFontSize(12);
		ia.setIsEnabled(false);
		modifyInterface(ia);
	}
	
	private void processButtonPressed(SAI sai,String transactionID) {
		try {
			if (sai.getFirstSelection().equals(HINT_BUTTON_NAME)) {
				ArrayList<String> result = this.solver.getHint();
				String hintStringForLog="";
				if (result!=null)
					
					for (String temp:result)
						hintStringForLog+=temp;
					java.util.Date date= new java.util.Date();
					System.out.println("LogPatch: [User : " + userID +"],[ProblemInfo:"+this.problemName+"],[Session:"+this.getSession()+"],[TransID:"+ transactionID+"],[SAI:"+sai.getFirstSelection()+","+sai.getFirstAction()+","+sai.getFirstInput()+"],[Result:"+hintStringForLog+"],[EventTime:"+new Timestamp(date.getTime())+"]");
					this.sendHintMessage(result);
					this.sendSkillMessage(this.solver.recentRuleFired);
					
				} 
			 else if (sai.getFirstSelection().equals(DONE_BUTTON_NAME)){
				MTResult result = this.solver.sendSAI(makeTracerSai(sai));
				if(result.getType() == MTResultType.CORRECT) {
						java.util.Date date= new java.util.Date();
						System.out.println("LogPatch: [User : " + userID +"],[ProblemInfo:"+this.problemName+"],[Session:"+this.getSession()+"],[TransID:"+ transactionID+"],[SAI:"+sai.getFirstSelection()+","+sai.getFirstAction()+","+sai.getFirstInput()+"],[Result:Correct],[EventTime:"+new Timestamp(date.getTime())+"]");

						setCorrect(getComponent(sai.getFirstSelection()));							
						this.sendSkillMessage(result.getRuleFired());
						ArrayList<String> doneMsg = new ArrayList<String>();
						doneMsg.add("Congratulations, you finished!");
						this.sendHintMessage(doneMsg);
						disableHintButton(getComponent(HINT_BUTTON_NAME));
                        disableInterfaceElements();
				}
				else if (result.getType() == MTResultType.INCORRECT)
				{	
					java.util.Date date= new java.util.Date();
					System.out.println("LogPatch: [User : " + userID +"],[ProblemInfo:"+this.problemName+"],[Session:"+this.getSession()+"],[TransID:"+ transactionID+"],[SAI:"+sai.getFirstSelection()+","+sai.getFirstAction()+","+sai.getFirstInput()+"],[Result:Incorrect],[EventTime:"+new Timestamp(date.getTime())+"]");

					setIncorrect(getComponent(sai.getFirstSelection()));
					this.sendSkillMessage(result.getRuleFired());
				}
			}
			else if(sai.getFirstSelection().equals("ResetWorkingMemory")){
					 resetWM();
					 enableInterfaceElements();
				}
			/*else if(sai.getFirstSelection().equalsIgnoreCase("initializeProblem")){
				
				enableInterfaceElements();
				resetWM();
				for(SAI psai : this.problemSAI){
					if(!psai.getFirstSelection().equalsIgnoreCase("problemIndex"))
						this.solver.modifyWithSAI(makeTracerSai(psai));
				}
				try {
					this.solver.printFacts();
				} catch (JessException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}*/
			else {
				// do nothing
				System.out.println("unknown button!");
			}
			
		} catch (JessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/*private void getProblem(String criteria, String studentID){
		System.out.println(" Calling the Problem Selector " );
		ProblemSelector ps = new ProblemSelector();
		//System.out.println(" Criteria : "+criteria+" Student ID : "+studentID+" FolderName : "+folderName);
		List<edu.tamu.entity.SAI> problemList = ps.getProblem(criteria,studentID,folderName);
		//System.out.println( " Problem : "+problemList);
		if(problemList.size() == 0){
			ArrayList<String> doneMsg = new ArrayList<String>();
			doneMsg.add("Congratulations, you have mastered all the skills");
			this.sendHintMessage(doneMsg);
		}
		else {
			this.problemSAI = convertSAI(problemList);
			System.out.println(" Problem SAI : "+problemSAI.size());
			for(SAI sai : this.problemSAI)
				sendSAI(sai);
		}	
	}
	
	private List<SAI> convertSAI(List<edu.tamu.entity.SAI> problemList){
		List<SAI> problemName = new ArrayList<SAI>();
		
		
		for(int i=0; i<problemList.size(); i++)
			problemName.add(new SAI(problemList.get(i).getSelection(),problemList.get(i).getAction(),problemList.get(i).getInput()));
		
		return problemName;
	}*/
	
	
	private void enableInterfaceElements(){
		List<InterfaceAttribute>  tmp = new ArrayList<InterfaceAttribute>(); 
		for (InterfaceAttribute ia : this.getComponentList())
		{
			ia.setIsEnabled(true);
			ia.setBackgroundColor(GIVEN_BORDER_COLOR);
			tmp.add(ia);
		}
		
		for (InterfaceAttribute ia : tmp)
			modifyInterface(ia);
	}
	private void disableInterfaceElements() {
		List<InterfaceAttribute>  tmp = new ArrayList<InterfaceAttribute>(); //this is to aviod concurrent modification of components
		for (InterfaceAttribute ia : this.getComponentList())
		{
			ia.setIsEnabled(false);
			ia.setBackgroundColor(DISABLED_BACKGROUND_COLOR);
			tmp.add(ia);
		}
		
		for (InterfaceAttribute ia : tmp)
			modifyInterface(ia);
		
	}

	private void disableHintButton(InterfaceAttribute ia){
		ia.setIsEnabled(false);
		ia.setBackgroundColor(DISABLED_BACKGROUND_COLOR);
		modifyInterface(ia);
	}
	private void setCorrect(InterfaceAttribute ia) {
		ia.setBorderColor(CORRECT_BORDER_COLOR);
		ia.setBorderWidth(3);
		if (ia.getName().equals(DONE_BUTTON_NAME))
		    ia.setBorderStyle(Style.SOLID);
		ia.setIsEnabled(false);
		ia.setBackgroundColor(DISABLED_BACKGROUND_COLOR);
		modifyInterface(ia);
	}
	 
	private void setGiven(InterfaceAttribute ia) {
		ia.setBorderColor(GIVEN_BORDER_COLOR);
		ia.setBackgroundColor(DISABLED_BACKGROUND_COLOR);
		ia.setIsEnabled(false);
		ia.setBorderWidth(BORDER_WIDTH);
		modifyInterface(ia);
	}
	
	private void setIncorrect(InterfaceAttribute ia) {
		ia.setBorderColor(INCORRECT_BORDER_COLOR);
		ia.setBorderStyle(Style.SOLID);
		ia.setBorderWidth(3);
		modifyInterface(ia);
	}
	
	/**
	 * Use this method to convert servlet sai to model tracer's sai
	 * @param sai SAI to convert to tracer's version of sai
	 * @return
	 */
	private MTSAI makeTracerSai(SAI sai) {
		return new MTSAI(formatSelection(sai.getFirstSelection()), sai.getFirstAction(), sai.getFirstInput());
	}
	
	// for some reason, brd generated jess deftemplates use _ in the names
	// while the ctat components use . in their names
	// this is a temporary fix
	private String formatSelection(String selection) {
		return selection.replace('.', '_');
	}
	
	/**
	 * Initial sai's found in the brd are used to initialize the working memory
	 */
	@Override
	public void initializeInterfaceAttribute(InterfaceAttribute im) {
		try{
			
		
		/*for (SAI sai : this.initialSAIs) {
			String selection = sai.getFirstSelection();
			//System.out.println(selection + " and interface is " + im.getName());
			if (selection != null && selection.equals(im.getName())) {
				this.initialSAIs.remove(sai);
				sendSAI(sai);
			//	System.out.println("			sai input is " + sai.getSelection() + " and " + sai.getInput());
				this.solver.modifyWithSAI(makeTracerSai(sai));
				setGiven(im);			
				break;
			}
		}
		*/

		
		SAI sai=this.initialSAIsHash.get(im.getName());
		if (sai==null){ //interface element is not in the initial hash 
			//System.out.println("Not being able to get..." + im.getName());
		}
		else{
		//	this.initialSAIs.remove(sai);
			this.initialSAIsHash.remove(im.getName());
			//this.solver.printFacts();
			sendSAI(sai);
			this.solver.modifyWithSAI(makeTracerSai(sai));
			//System.out.println("After modifying facts : ");
			this.solver.printFacts();
			setGiven(im);	
			//System.out.println("found " + sai.getFirstSelection());
			
		}
		
		}
		catch(Exception e){
			e.printStackTrace();
		}
		
		
	}
	
	private void resetWM(){
		//System.out.println(" Clearing the memory and loading init file");
		this.solver.resetWM(this.INIT_FILE,this.WME_TYPE_FILE,this.PRODUCTION_FILE);
		/*try {
			System.out.println(" Facts after reloading the memory");
			this.solver.printFacts();
			System.out.println(" End of display");
		} catch (JessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
	}

	/**
	 * This method parses the array of arguments received from the servlet configuration 
	 * and extracts the TypeChecker if specified.
	 * @param String[] argV
	 * @return void
	 * @author SHRUTI
	 */
	@Override
	public void parseArgument(String[] argV) {
		try{
			for(String arg: argV){
				if(arg.contains("ssTypeChecker")){
					String[] typeChecker = arg.split(" ");
					if(typeChecker!=null && typeChecker.length==2){
						System.out.println("Inside ModelTracerBackend - setTypeChecker argument is "+typeChecker[1]);
						SimSt.setTypeChecker(typeChecker[1]);
						this.typeChecker = typeChecker[1];
						System.out.println("type checker has been set to ->"+SimSt.getTypeChecker());
					}
				}
				if(arg.contains("folder")){
					String[] folder = arg.split(" ");
					if(folder!=null && folder.length==2){
						System.out.println("folder argument is "+folder[1]);
						folderName = folder[1];
					}
				}
				if(arg.contains("problem")){
					String[] problem = arg.split(" ");
					if(problem!=null && problem.length==2){
						System.out.println("problem argument is "+problem[1]);
						//do something with problem name - set the init wme file name
						INIT_FILE = folderName+"/"+problem[1]+".wme";
					}
				}
			   if(arg.contains("ssInputMatcher")){
				   String[] inputMatcher = arg.split(" ");
				   System.out.println(" Arg : "+arg);
				   if(inputMatcher != null && inputMatcher.length==2){
					   this.inputMatcher = inputMatcher[1];
					   System.out.println(" Input Matcher : "+this.inputMatcher);
				   }
			   }
			}
			if(typeChecker == null){
				//type checker is set to default if not specified in the argument
				 typeChecker = "edu.cmu.pact.miss.FeaturePredicate.valueTypeForAlgebra";
			}
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public String getFolderName() {
		return folderName;
	}

	public void setFolderName(String folderName) {
		this.folderName = folderName;
	}

	public String getInputMatcher() {
		return inputMatcher;
	}

	public void setInputMatcher(String inputMatcher) {
		this.inputMatcher = inputMatcher;
	}

	/*public String getProductionFile() {
		return productionFile;
	}

	public void setProductionFile(String productionFile) {
		this.productionFile = productionFile;
	}

	public String getWmeTypeFile() {
		return wmeTypeFile;
	}

	public void setWmeTypeFile(String wmeTypeFile) {
		this.wmeTypeFile = wmeTypeFile;
	}

	public String getInitFile() {
		return initFile;
	}

	public void setInitFile(String initFile) {
		this.initFile = initFile;
	}*/
}