package interaction;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Vector;

import org.xeustechnologies.jcl.JarClassLoader;
import org.xeustechnologies.jcl.JclObjectFactory;
import org.xeustechnologies.jcl.JclUtils;

import edu.cmu.pact.BehaviorRecorder.Controller.BR_Controller;
import edu.cmu.pact.BehaviorRecorder.ProblemModel.Graph.EdgeData;
import edu.cmu.pact.BehaviorRecorder.ProblemModel.Graph.ProblemNode;
import edu.cmu.pact.Utilities.trace;
import edu.cmu.pact.ctat.model.CtatModeModel;
import edu.cmu.pact.jess.RuleActivationNode;
import edu.cmu.pact.miss.AskHint;
import edu.cmu.pact.miss.Instruction;
import edu.cmu.pact.miss.Sai;
import edu.cmu.pact.miss.SimSt;
import edu.cmu.pact.miss.SimStBackendExternal;
import edu.cmu.pact.miss.PeerLearning.SimStPLE;
import jess.JessException;
import servlet.SimStudentBaseServlet;


/* Toy interface for testing purposes */

public class SimStTutoringBackend extends Backend implements SimStBackendExternal {


	
	/*name for the jess files*/
	private static final String TRAINING_FOLDER="training";
	private static final String PRODUCTION_FILE = "production.pr";
//	private static final String WME_TYPE_FILE = "wmeTypesFlash.clp";
//	private static final String INIT_FILE = "initFlash.clp";
	private static final String WME_TYPE_FILE = "/wmeTypes.clp";
	private static final String INIT_FILE = "/init.wme";
	private static final String WME_STRUCTURE_FILE ="/wmeStructure.txt";
	private static final String RESTORE_INSTRUCTION_FILE="instructions.txt";
	
	private static final Color ENABLED_BACKGROUND_COLOR = new Color(255,255,255);
	private static final Color DISABLED_BACKGROUND_COLOR = new Color(215,215,215);
	private static final Color SELECTED_BORDER_COLOR = new Color(0,0,255);
	private static final Color NORMAL_BORDER_COLOR = new Color(153,153,153);
	private static final Color GIVEN_BORDER_COLOR = new Color(0,0,0);
	private static final int SELECTED_BORDER_WIDTH = 2;
	private static final int NORMAL_BORDER_WIDTH = 1;
	
	
	/*Interface elements used only for tutoring*/
	private static final String YES_BUTTON_NAME="yesButton";
	private static final String NO_BUTTON_NAME="noButton";
	private static final String START_STATE_BUTTON_NAME="startStateButton";
	private static final String NEW_PROBLEM_BUTTON_NAME="newProblemButton";
	private static final String SIMST_COMM_TEXT_AREA="textFieldSS";
	private static final String SKILL_TEXT_AREA="textFieldSkill";
	private static final String SOLVE_PROBLEM_BUTTON_NAME="solveProblemButton";
	private static final String DO_IT_BUTTON_NAME="doNextStepButton";
	private static final String HINT_BUTTON_NAME = "hint";
	private static final String DONE_BUTTON_NAME = "done";
	
	
	/*SimStudent messages*/
	private static final String SIMSTUDENT_STUCK_MSG="I'm stuck.  I don't know what to do next.  Please show me what to do!";
	private static final String SIMSTUDENT_NO_START_STATE_MSG="No problem is entered!";
	private static final String SKILL_NOT_SET_MSG="Please specify the skill";
	private static final String PROBLEM_LEARNED_MSG="Problem learned! Clear the interface and enter a new one.";
	private static final String PROBLEM_NEW_MSG="Enter your problem on the interface and click Start.";
	private static final String STEP_LEARNED_MSG="Step succesfully learned.";
	private static final String STEP_NOT_LEARNED_MSG="Step was NOT learned...";
	private static final String START_STATE_MSG="Start state for problem created.";
	private static final String SIMST_LEARNING_MSG="Trying to learn...";
	private static final String NO_PROBLEM_PROVIDED="No problem is provided. Please enter a problem";
	
	/*SimStudent mode while learning (i.e. waiting for hint, waiting for feedback)*/
	private static final String SS_STATE_ASKS_HINT="AskHint";
	private static final String SS_STATE_ASKS_FEEDBACK="AskFeedback";
	private static final String SS_STATE_WAITING="Waiting";
	private static final String SS_STATE_DOIT="doIt";
	
	/**
	 *  This table contains the simstudent object for each student. Each student is identified by the sessionID 
	 */
	private static HashMap<String,SimSt> sessionTable = new HashMap<String,SimSt>();
	
	

	/*variable to check if done is clicked. This is needed becaue when done is clicked, CTAT lib generates multiple messages in the backend: a) first a done clicked message b) then one message for all the interface elements
	 * that have been updated. We need this to update the studentSAI*/
	boolean isDoneClicked=false;
	void setIsDoneClicked(boolean flag){this.isDoneClicked=flag;}
	boolean getIsDoneClicked(){return this.isDoneClicked;}
	
	
	
	/*variable to hold the current simstudent state. */
	private String simStudentState=SS_STATE_WAITING;
	void setSimStudentState(String state){ this.simStudentState=state;}
	String getSimStudentState(){return this.simStudentState;}
	
	
	
	/*variable to hold if start state is created*/
	private boolean startStateCreated=false;
	private void setStartStateCreated(boolean flag){ startStateCreated=flag;}
	private boolean getStartStateCreated(){return startStateCreated;}

	/*List so we can keep track of all the start state elements*/
	private ArrayList<SAI> startStateElements;
	private void clearStartStateElements(){
		if (startStateElements!=null)
			startStateElements.clear();	
	}
	private ArrayList<SAI> getStartStateElements(){return this.startStateElements;}
	
	
	private void addStartStateElement(SAI sai){
		if (startStateElements==null)
			startStateElements=new ArrayList<SAI>();
		
		if (sai.getSelection().equals(SIMST_COMM_TEXT_AREA)) return;
		
		startStateElements.add(sai);
		
		trace.out("webAuth"," --> Adding start state element " + sai);
		addInterfaceElements(sai);
	}

	
	
	/*hash set to keep track of all the interface elements seen so far. Used to clear the interface elements (because from the backend we have no knowledge about all the interface elements*/
	private HashSet<SAI> interfaceElements;
	private void addInterfaceElements(SAI sai){
		if (interfaceElements==null)
			interfaceElements=new HashSet<SAI>();	
		interfaceElements.add(sai);
	}
	
	private void addInterfaceElements(Sai sai){
		SAI test=new SAI(sai.getS(),sai.getA(),sai.getI());
		addInterfaceElements(test);
	}
	
	/*Hash map to keep track of the foas*/
	HashMap<String, SAI> foas;	//<selection,SAI>
	private void addFoa(SAI sai){
		if (foas==null)
			foas = new HashMap<String, SAI>();
		
		trace.out("webAuth","--> adding foa " + sai);
		foas.put(sai.getFirstSelection(),sai);
	}
	 private void removeFoa(SAI sai){ 
		trace.out("webAuth","--> remove foa " + sai);
		foas.remove(sai.getFirstSelection()); 
	}
	private HashMap<String, SAI> getSelectedFoas(){return this.foas;}
	 
	 
	private static final String SKILL_NOT_SET="skillNotSet";
	/*String to store the skill associated with the current SAI*/
	private String currentSAISkill=SKILL_NOT_SET;
	private void setCurrentSAISkill(String skill){this.currentSAISkill=skill;}
	private String getCurrentSAISkill(){return this.currentSAISkill;}
	private boolean isLastPerformedStepDone(){ return this.getCurrentSAISkill().equalsIgnoreCase("done");}
	
	
	/*SimStudent object*/
	
	SimSt simSt;
	void setSimSt(SimSt ss){this.simSt=ss;}
	SimSt getSimSt(){
		return simSt;
		
	}

	/*BR_Controller object*/
	BR_Controller brController;
	void setBrController(BR_Controller brController){ this.brController=brController;}
	BR_Controller getBrController(){ return this.brController;}
	
	/*The current SAI the author selected when tutoring*/
	private SAI authorSelectedSAI;
	private void setAuthorSelectedSAI(SAI sai){
			this.authorSelectedSAI=sai;
			this.addInterfaceElements(sai);
		}
	
	private SAI getAuthorSelectedSAI(){return this.authorSelectedSAI;}
		
	
	/*Variable to hold the activation list with SimStudent suggestions */
	Collection<RuleActivationNode> simStActivationList;
	
	/*Hashmap to store SimStudent SAI -> correctness. This hash is updated as we go.*/
	HashMap <Sai,String> simStAgendaTurth=null;
	

	
   /*Variable to keep track of the latest SimStudent SAI inquired on the interface*/
   private Sai lastInquiredSAI=null;
   private void setLastInquiredSAI(Sai sai){  this.lastInquiredSAI=sai;}
   private Sai getLastInquiredSAI(){return this.lastInquiredSAI;}
   
   /*Variable to hold the last correct SimStudent SAI that the author said is correct*/
   private Sai correctInquiredSAI=null;
   private void setCorrectInquiredSAI(Sai sai){ this.correctInquiredSAI=sai; }
   private Sai getCorrectInquiredSAI(){return this.correctInquiredSAI;}
   
   String serlvetTrainingFolder=null;
   
   /*variable to hold if we are in interactive learning mode until problem is solved*/
   private boolean interactiveLearningMode=false;
   void setInteractiveLearningMode(boolean flag){this.interactiveLearningMode=flag;}
   private boolean getInteractiveLearningMode(){return this.interactiveLearningMode;}
   
   
   boolean loadingInstructions=false;
   void setIsLoadingInstructions(boolean flag){this.loadingInstructions=flag;}
   boolean isLoadingInstructions(){return this.loadingInstructions;}
   

	ArrayList<String> ctatArgumentList=null;
	HashMap<String,Object> simstLookup = new HashMap<String,Object>();
	
	
	public Object getSimStObject(){
		Object simst = simstLookup.get(super.getSession());
		return simst;
	}
	private Object current;
	
	private HashMap<String,List<SAI>> problemBank = new HashMap<String,List<SAI>>();
	private HashMap<String,List<String>> problemSkill = new HashMap<String,List<String>>();
	
	private HashMap<Sai,Vector>  currentFOAList = new HashMap<Sai,Vector>();
	private HashMap<Sai, String> currentRuleList = new HashMap<Sai, String>();
	
	/*************************************************
	 * Constructor and backend related methods
	 ************************************************/
	
	/**
	 * Constructor of the back-end. Creates the brController and SimSt objects.
	 */
	public SimStTutoringBackend(String[] argV) {
		super(argV);
		System.out.println(" Inside SimStTutoring Backend");
		/*parse the arguments*/
		parseArgument(argV);	
		String[] args=ctatArgumentList.toArray(new String[ctatArgumentList.size()]);
		
		
		JarClassLoader jcl = new JarClassLoader();
		
		jcl.add(SimStudentBaseServlet.watsonFolder);
		
		//jcl.add(SimStudentBaseServlet.jarFolder+"/cl");
		jcl.add(SimStudentBaseServlet.jarFolder+"/jess.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/ctat.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/cl_common.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/communication.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/editor.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/grant.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/jzlib.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/LMS.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/LMSfiledata.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/resources.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/thirdparty/webeq35.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/thirdparty/TableLayout.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/TT.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/tutors.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/ui.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/utilities.jar");
		jcl.add(SimStudentBaseServlet.jarFolder+"/cl/XPlauncher.jar");
		
		
        jcl.getCurrentLoader().setOrder(1);
		JclObjectFactory factory = JclObjectFactory.getInstance();
		String ctatURL = "edu.cmu.pact.BehaviorRecorder.Controller.CTAT_Launcher";
		Object obj = args;
		Object ctatObj = factory.create(jcl, ctatURL, obj);
		try {
				
			//setBrController(ctat.getFocusedController);
			Object brController = ctatObj.getClass().getMethod("getFocusedController").invoke(ctatObj);
			//setBrController();
		    Object ctatModeModel = brController.getClass().getMethod("getCtatModeModel").invoke(brController);
		    ctatModeModel.getClass().getMethod("setMode", String.class).invoke(ctatModeModel,CtatModeModel.SIMULATED_STUDENT_MODE );
	 		//getBrController().getCtatModeModel().setMode(CtatModeModel.SIMULATED_STUDENT_MODE);

			Object missController = brController.getClass().getMethod("getMissController").invoke(brController);
			
			Object simst = missController.getClass().getMethod("getSimSt").invoke(missController);
			
			//brController.getMissController().addSimStWebAuthoringBackend(this);

			Object ssinteractiveLearning = factory.create(jcl, "edu.cmu.pact.miss.SimStInteractiveLearning",simst);
			simst.getClass().getMethod("setSsInteractiveLearning", ssinteractiveLearning.getClass()).invoke(simst,ssinteractiveLearning);
			Object simstMissController = simst.getClass().getMethod("getMissController").invoke(simst);
			simstMissController.getClass().getMethod("autoLoadInstructions").invoke(simstMissController);
			setIsLoadingInstructions(false);
			System.out.println(" TYPE CHECKER ## "+simst.getClass().getMethod("getTypeChecker").invoke(simst));
			current = simst;
			
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} /*catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
		
		
		
		
        /* CTAT_Launcher ctat = (CTAT_Launcher)JclUtils.shallowClone(ctatObj);
 		setBrController(ctat.getFocusedController());
 		getBrController().getCtatModeModel().setMode(CtatModeModel.SIMULATED_STUDENT_MODE);
		SimSt simst=getBrController().getMissController().getSimSt();
		brController.getMissController().addSimStWebAuthoringBackend(this);
		simst.setSsInteractiveLearning(new SimStInteractiveLearning(simst));
		simst.getMissController().autoLoadInstructions();
		setIsLoadingInstructions(false);
		System.out.println(" SimSt : "+simst+"  "+super.getSession());
		simstLookup.put(super.getSession(),simst);
		System.out.println(" TYPE CHECKER ## "+simst.getProjectDirectory());
		System.out.println(" ClassLoader : "+jcl.getCurrentLoader());
 		/*Ctat initialization specifics*/
		
		
		/*JarClassLoader jcl = new JarClassLoader();
		jcl.add("ctat.jar");
		jcl.getCurrentLoader().setOrder(1);
		
		JclbjectFactory factory = JclObjectFactory.getInstance();
		String ctat = "edu.cmu.pact.BehaviorRecorder.Controller.CTAT_Launcher";
		
		
		factory.create(jcl, ctat, args, args.getClass());*/
		
		/*CTAT_Launcher launch = new CTAT_Launcher(args);
		setBrController(launch.getFocusedController());
		
		getBrController().getCtatModeModel().setMode(CtatModeModel.SIMULATED_STUDENT_MODE);
				
		simSt=getBrController().getMissController().getSimSt();		
		brController.getMissController().addSimStWebAuthoringBackend(this);
		simSt.setSsInteractiveLearning(new SimStInteractiveLearning(simSt));
		
		//experimental code, this will go away
		/*try {
			serlvetTrainingFolder=getTrainingFolder(INIT_FILE);
			copyFiles1();
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/

	
		/*load instructions from previous session*/
		/*setIsLoadingInstructions(true);
		simSt.getMissController().autoLoadInstructions();
		setIsLoadingInstructions(false);*/
		
	}
	
	
	public void setsimstSession(String session){
		simstLookup.put(session, current);
	}
	
	
	
	/**
	 * Method to copy a file from user folder to the training folder
	 * @param filename
	 */
	private void copyFiles1(){	
		copyFileToSimStudentFolder(INIT_FILE);
		copyFileToSimStudentFolder(WME_TYPE_FILE);
		copyFileToSimStudentFolder("UserDefSymbols.class");
		copyFileToSimStudentFolder(WME_STRUCTURE_FILE);
	}
	
	
	private void copyFileToSimStudentFolder(String filename){
		String target=System.getProperty("user.dir")+"/"+filename;
		
	 	Path FROM = Paths.get(serlvetTrainingFolder+"/"+TRAINING_FOLDER+"/"+filename);
	    Path TO = Paths.get(target);
	    System.out.println(" From : "+FROM.toAbsolutePath()+"  To : "+TO.toAbsolutePath());
	    
	    //overwrite existing file, if exists
	    CopyOption[] options = new CopyOption[]{
	      StandardCopyOption.REPLACE_EXISTING
	    }; 
	    try {
			Files.copy(FROM, TO, options);
		} catch (IOException e) {

		}
		
	}
	
	
	
	
	/**
	 * Method to copy a file from user folder to the training folder
	 * @param filename
	 */
	private void copyFile(String filename){
		String source=System.getProperty("user.dir")+"/"+filename;
	 	Path FROM = Paths.get(source);
	    Path TO = Paths.get(serlvetTrainingFolder+"/"+filename);
	    
	    try {
			Files.delete(TO);
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			//e1.printStackTrace();
		}
	    
	    //overwrite existing file, if exists
	    CopyOption[] options = new CopyOption[]{
	      StandardCopyOption.REPLACE_EXISTING
	    }; 
	    try {
			Files.copy(FROM, TO, options);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
		}
	}
	
	
	
	private String getTrainingFolder(String filename) throws URISyntaxException {
		boolean existsInClassPath = true;
		boolean existsInCurrentPath = true;
		
		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
		URL url = classLoader.getResource(filename);
		
		// url is null if can't find resource
		if (url != null) {
			File f = new File(url.toURI().getPath());
			String absolutePath=f.getAbsolutePath();
			
			String filePath = absolutePath.
				    substring(0,absolutePath.lastIndexOf(File.separator));
			return filePath;
		
		} else {
			return null;
		}
		
	
	}
	
	
	
	@Override
	public void initializeInterfaceAttribute(InterfaceAttribute im) {

	}


	@Override
	public void parseArgument(String[] argV) {
		// TODO Auto-generated method stub
		ctatArgumentList=new ArrayList<>();
		
		/*loop that just converts the arguments to the format CTAT wants them (i.e. adds - before ss, traceLebel, debugLevel etc*/
		for(String arg: argV){
			String[] tmp = arg.split(" ");	
			for (int i=0; i<tmp.length ; i++){
				String tmp1="";	
				if (tmp[i].startsWith("ss") || tmp[i].startsWith("traceLevel") || tmp[i].startsWith("debug") || tmp[i].startsWith("Dss")  || tmp[i].startsWith("DnoCtatWindow") || tmp[i].startsWith("DappRunType") || tmp[i].startsWith("DprojectDir")) 
						tmp1="-"+tmp[i];
				else 
						tmp1=tmp[i];
				//System.out.println("  --> " + tmp1);
				ctatArgumentList.add(tmp1);
			}
		}
				
	}
	/**
	 * Utility method containing the command line arguments necessary to properly create the BR_Controller and SimStudent. 
	 * @return
	 */
	private String[] ssCommandLineArguments(){
		//String[] args={"-traceLevel","3","-debugCodes","miss","ss","webAuth","-ssInteractiveLearning","-ssWebAuthoringMode","-ssDeletePrFile","-ssSearchTimeOutDuration","20000","-ssProjectDir","/training/","-ssMaxSearchDepth","3","-ssHintMethod","WebAuthoring","-ssRuleActivationTestMethod","WebAuthoring","-ssDontShowAllRaWhenTutored","true","-ssCacheOracleInquiry", "false","-ssPackageName","training","-DssFoilBase=/Users/simstudent/FOIL6","-DnoCtatWindow"};		
		String[] args={"-traceLevel","3","-debugCodes","miss","webAuth","-ssInteractiveLearning","-ssWebAuthoringMode","-ssDeletePrFile","-ssSearchTimeOutDuration","20000","-ssMaxSearchDepth","3","-ssHintMethod","WebAuthoring","-ssRuleActivationTestMethod","WebAuthoring","-ssDontShowAllRaWhenTutored","true","-ssCacheOracleInquiry", "false","-ssPackageName","training","-DssFoilBase=/Users/simstudent/FOIL6","-DnoCtatWindow"};		
		//"-ssProjectDir","/training/",
		//"-ssProjectDir","/Applications/Eclipse/Eclipse.app/Contents/MacOS/",
		//"-ssProjectDir","/SimStudentServlet/WEB-INF/classes", 
		return args;
	}
	
	
	
	
	
	/*************************************************
	 * Event handling related methods
	 ************************************************/
	
	
	/**
	 * Overridden event listener that catches events from the interface 
	 */
	@Override
	public void processInterfaceEvent(InterfaceEvent ie) {
		
		// TODO Auto-generated method stub
		//this.setSimSt(sessionTable.get(super.getSession()));

		switch(ie.getType()){
		case SAI:
			processSAI(ie.getEvent());
			break;
		case DOUBLE_CLICK:
			processDoubleClick(ie.getEvent());
			break;
		}
	}
	
	
	/**
	 * Method that controls what happens if an SAI event happens on the interface 
	 * @param sai
	 */
	private void processSAI(SAI sai) {
		System.out.println("**********");
		System.out.println(sai.getFirstSelection() + " " + sai.getFirstAction() + " " + sai.getFirstInput());
		System.out.println("**********");
		
		String action = sai.getFirstAction();//action performed on interface
		if(action.equals("UpdateTextArea") || action.equals("UpdateTextField")){//text area typed into
			processUpdateTextArea(sai);
		}else if(action.equals("ButtonPressed")){//button is pressed
			processButtonClick(sai);
		}
	}

	
	/**
	 * Lower-level method that controls what happens if a button is clicked on the interface
	 * @param sai
	 */
	private void processButtonClick(SAI sai){
		trace.out("webAuth"," --> processButtonClick with " + sai.getFirstSelection() + " " + sai.getFirstAction() +  " " + sai.getFirstInput());
		
		try {
			String selection = sai.getFirstSelection();
			if (selection != null) {
				//InterfaceAttribute at = getComponent(selection);
				if (selection.equals(YES_BUTTON_NAME)){
					Object dontShowAllRAObject = getSimStObject().getClass().getMethod("dontShowAllRA").invoke(getSimStObject());
					System.out.println(" Show ? "+dontShowAllRAObject.toString());
					boolean dontShowAllRA = (dontShowAllRAObject.toString().equals("true")) ? true : false;
					trace.out("webAuth","******** Yes clicked.., setting " + lastInquiredSAI + " to " +  EdgeData.CORRECT_ACTION + " and dontShowAllRA is " +dontShowAllRA /*+getSimSt().dontShowAllRA()*/);
					simStAgendaTurth.put(lastInquiredSAI, EdgeData.CORRECT_ACTION);
					setCorrectInquiredSAI(lastInquiredSAI);
					lastInquiredSAI=null;
					inquiryNextSAI(dontShowAllRA);
					
					
				}
				else if (selection.equals(NO_BUTTON_NAME)){
					trace.out("webAuth","******** No clicked.., setting " + lastInquiredSAI + " to " +  EdgeData.CLT_ERROR_ACTION+ " and dontShowAllRA is "/*+getSimSt().dontShowAllRA()*/);
					simStAgendaTurth.put(lastInquiredSAI, EdgeData.CLT_ERROR_ACTION);
					displaySAI(lastInquiredSAI.getS(),lastInquiredSAI.getA(),"");
					lastInquiredSAI=null;
					inquiryNextSAI(false);
					
					
				}
				else if (selection.equals(START_STATE_BUTTON_NAME)){			
						if (getStartStateElements()!=null && getStartStateElements().isEmpty() || getStartStateElements()== null){
							System.out.println(" No problem provided !");
							sendSimStudentMessageToInterface(NO_PROBLEM_PROVIDED);
							return;
						}
							
						
						//disableStartStateElements();
						this.setStartStateCreated(true);
					
						trace.out("webAuth","******** Starting a new problem...");
						/*prepare SimStudent to work on problem*/
						Object quizMode = getInteractiveLearning(getSimStObject()).getClass().getMethod("isTakingQuiz").invoke(getInteractiveLearning(getSimStObject()));
						System.out.println(" QuizMode : "+quizMode.toString());
						
						if(quizMode.equals(Boolean.TRUE)){
							
							System.out.println(" In the quiz Mode");
							// To set the platform for starting a new problem 
							String problemName = createProblemNameForQuiz();
							Vector solutionList = (Vector) SimStTakingQuiz(problemName);
							List<SAI> problemsai = new ArrayList<SAI>();
							
							for(int i=0; i<solutionList.size(); i++){
								Object problemNode = solutionList.get(i);
								Object EdgeData = problemNode.getClass().getMethod("getEdgeData").invoke(problemNode);
								Object ruleName = EdgeData.getClass().getMethod("getRuleNames").invoke(EdgeData);
								System.out.println(" Rules : "+ruleName);
								Object selectionSimSt = problemNode.getClass().getMethod("getSelection").invoke(problemNode);
								Object inputSimSt  = problemNode.getClass().getMethod("getInput").invoke(problemNode);
								displaySAI(selectionSimSt.toString(), "UpdateTextArea",inputSimSt.toString());
							}
							
							for (int i = 0; i < getStartStateElements().size(); i++) {
								SAI questionsai = getStartStateElements().get(i);  
								if (!questionsai.getFirstSelection().equals(SIMST_COMM_TEXT_AREA) && !questionsai.getFirstSelection().equals(SKILL_TEXT_AREA)){
										problemsai.add(questionsai);
								}
							}
							

							problemBank.put(problemName, problemsai);
								//System.out.println(solutionList.get(i));
							Object nullGraph = null;
							Object problemGraph = getInteractiveLearning(getSimStObject()).getClass().getMethod("getQuizGraph").invoke(getInteractiveLearning(getSimStObject()));
							getInteractiveLearning(getSimStObject()).getClass().getMethod("setQuizGraph",problemGraph.getClass()).invoke(getInteractiveLearning(getSimStObject()),nullGraph);
							
							Object SimStRete = getSimStObject().getClass().getMethod("getSsRete").invoke(getSimStObject());
							
							Object rulesIterator = SimStRete.getClass().getMethod("listDefrules").invoke(SimStRete);
							Iterator it = (Iterator)rulesIterator;
							List<String> skills = new ArrayList<String>();
							String problem = new String(problemName);
							sendProblemMessage(problem.replaceAll("=",","));

							System.out.println(" Rules iterator ");
							while(it.hasNext()){
								String rule = it.next().toString().split("::")[1];
								sendSkillMessage(rule,1);
								skills.add(rule);

							}
							problemSkill.put(problemName, skills);


						}
						else {
							prepareSimStudentForProblem(createProblemName());
							this.sendSimStudentMessageToInterface(START_STATE_MSG + createProblemNameForQuiz());
						}
					
				}
				else if (selection.equals(DONE_BUTTON_NAME)){
							
					this.setAuthorSelectedSAI(sai);
					isDoneClicked=true;
					
				}
				else if (selection.equals(SOLVE_PROBLEM_BUTTON_NAME)){
					this.setInteractiveLearningMode(true);
					simStNextStepInteractiveLearning();
					
				}
				else if (selection.equals(DO_IT_BUTTON_NAME)){
					//TO make this work, also go to processUpdateTextArea and change SS_STATE_WAITING to SS_STATE_DOIT
					/*if (this.getSelectedFoas()!=null && !this.getSelectedFoas().isEmpty() && this.getAuthorSelectedSAI()!=null){
						this.setSimStudentState(this.SS_STATE_DOIT);
						this.sendSimStudentMessageToInterface(this.SKILL_NOT_SET_MSG);
					}
					else {
						this.sendSimStudentMessageToInterface("Do stuff man");
					}
					*/
					
					/*Ask Simstudent to do the next step*/
					//this.setInteractiveLearningMode(true);
					if(!this.getInteractiveLearningMode())
						this.setInteractiveLearningMode(true);
					simStNextStepInteractiveLearning();
				}
				else if (selection.equals(NEW_PROBLEM_BUTTON_NAME)){	
									
					this.sendSimStudentMessageToInterface("Please wait....");
					setInteractiveLearningMode(false);
					this.setStartStateCreated(false);
					this.clearStartStateElements();
					this.resetSkill();
					trace.out("webAuth","******** Reseting BR controller...");
					
					//getBrController().getUniversalToolProxy().resetStartStateModel();
					
					
					Object simstObject = getSimStObject();
					Object brControllerObject = simstObject.getClass().getMethod("getBrController").invoke(simstObject);
					
					Object universalProxy = brControllerObject.getClass().getMethod("getUniversalToolProxy").invoke(brControllerObject);
					universalProxy.getClass().getMethod("resetStartStateModel").invoke(universalProxy);
					
					brControllerObject.getClass().getMethod("startNewProblem",Boolean.class).invoke(brControllerObject, false);
					Object interactiveLearningObject = simstObject.getClass().getMethod("getSsInteractiveLearning").invoke(simstObject);
					Class ProblemNodeClass = Class.forName("edu.cmu.pact.BehaviorRecorder.ProblemModel.Graph.ProblemNode", true, getSimStObject().getClass().getClassLoader());
					interactiveLearningObject.getClass().getMethod("setCurrentNode",ProblemNodeClass).invoke(interactiveLearningObject, new Object[]{null});
					this.clearInterface();
					this.sendSimStudentMessageToInterface(PROBLEM_NEW_MSG);
					
					/*simSt.getBrController().startNewProblem(false);
					this.getSimSt().getSsInteractiveLearning().setCurrentNode(null);
					this.clearInterface();
					this.sendSimStudentMessageToInterface(PROBLEM_NEW_MSG);*/

				}
				else if(selection.equals("QuizMode")){
					
					getSimStObject().getClass().getMethod("setDontShowAllRA",boolean.class).invoke(getSimStObject(),new Object[]{true});
					getSimStObject().getClass().getMethod("setIlSignalNegative", boolean.class).invoke(getSimStObject(), new Object[]{false});
					getSimStObject().getClass().getMethod("setIlSignalPositive", boolean.class).invoke(getSimStObject(),new Object[] {false});

					Object gradingMethod = getSimStObject().getClass().getMethod("getQuizGradingMethod").invoke(getSimStObject());
					getSimStObject().getClass().getMethod("setRuleActivationTestMethod", String.class).invoke(getSimStObject(), gradingMethod);
					getInteractiveLearning(getSimStObject()).getClass().getMethod("setTakingQuiz", boolean.class).invoke(getInteractiveLearning(getSimStObject()),new Object[]{true});		
					/**
					 *  If the Problem Bank exist then get the skills, problem from the problem bank
					 *  else then get the skills from the rete 
					 */
					Object directory = getSimStObject().getClass().getMethod("getProjectDirectory").invoke(getSimStObject());
					File file = new File(directory.toString()+"/problemBank.txt");
					HashMap<String,Integer> skillCount = new HashMap<String,Integer>();
					
					if(file != null && file.exists()){
						BufferedReader br = new BufferedReader(new FileReader(file));
						String line;
						
						while((line=br.readLine()) != null){
							String[] parts = line.split("::");
							String[] sais = parts[0].split(",");
							String[] skillList = parts[1].split(",");
							StringBuilder problemName = new StringBuilder("");
							List<SAI> saiList = new ArrayList<SAI>();
							
							for(int i=0; i<sais.length-2; i=i+3){
								if(problemName.length() != 0)
								    problemName.append(",");
									problemName.append(sais[i+2]);
								 saiList.add(new SAI(sais[i], sais[i+1], sais[i+2]));
							}
							 
							
							// send the question and the SAI 
							sendProblemMessage(problemName.toString());
							
							for(int i=0; i<saiList.size(); i++)
								displaySAI(saiList.get(i).getFirstSelection(), saiList.get(i).getFirstAction(), saiList.get(i).getFirstInput());
							
							// get the steps from the simstudent
							String problemNameForQuiz = problemName.toString().replace(',', '=');
							Vector steps = (Vector) SimStTakingQuiz(problemNameForQuiz);
							
							for(int i=0; i<steps.size(); i++){
								Object problemNode = steps.get(i);
								Object selectionSimSt = problemNode.getClass().getMethod("getSelection").invoke(problemNode);
								Object inputSimSt  = problemNode.getClass().getMethod("getInput").invoke(problemNode);
								displaySAI(selectionSimSt.toString(), "UpdateTextField",inputSimSt.toString());
							}
							
							Object nullGraph = null;
							Object problemGraph = getInteractiveLearning(getSimStObject()).getClass().getMethod("getQuizGraph").invoke(getInteractiveLearning(getSimStObject()));
							getInteractiveLearning(getSimStObject()).getClass().getMethod("setQuizGraph",problemGraph.getClass()).invoke(getInteractiveLearning(getSimStObject()),nullGraph);
							
							// cumulative count of skills
							for(String s : skillList){
								if(!skillCount.containsKey(s))
									skillCount.put(s, 0);
								skillCount.put(s, skillCount.get(s)+1);
							}
						}
						br.close();
						// send the skill count 
						for(Map.Entry<String,Integer> entry : skillCount.entrySet()){
							sendSkillMessage(entry.getKey(), entry.getValue());
						}
					}
					else{
						Method reteMethod = getSimStObject().getClass().getDeclaredMethod("getSsRete");
						Object rete = reteMethod.invoke(getSimStObject());
						
						Method loadJessMethod = rete.getClass().getDeclaredMethod("loadJessFile",String.class);
						loadJessMethod.setAccessible(true);
						loadJessMethod.invoke(rete,"wmeTypes.clp");
						loadJessMethod.invoke(rete,"init.wme");
						loadJessMethod.invoke(rete,"productionRules.pr");
				
						Object rulesIterator = rete.getClass().getMethod("listDefrules").invoke(rete);
						Iterator it = (Iterator)rulesIterator;
						
						System.out.println(" Rules iterator ");
						while(it.hasNext()){
							String rule = it.next().toString().split("::")[1];
							sendSkillMessage(rule,0);

						}
					}
					
					
				
				}
				else if(selection.equals("closetutor")){
					getBrController(getSimStObject()).getClass().getMethod("closeStudentInterface").invoke(getBrController(getSimStObject()));
					getBrController(getSimStObject()).getClass().getMethod("closeApplication",boolean.class).invoke(getBrController(getSimStObject()), new Object[]{true});
					simstLookup.remove(super.getSession());
				}
				else if(selection.equals("saveProblemBank")){
					Object directory = getSimStObject().getClass().getMethod("getProjectDirectory").invoke(getSimStObject());
					FileWriter file = new FileWriter(directory.toString()+"/problemBank.txt",true);
					BufferedWriter bw = new BufferedWriter(file);
					
					for(Map.Entry<String, List<SAI>> entry : problemBank.entrySet()){
						for(int i=0; i<entry.getValue().size(); i++){
							SAI problemsai = entry.getValue().get(i);
							//System.out.println(" selection : "+sai.getFirstSelection()+" action  : "+sai.getFirstAction()+" input : "+sai.getFirstInput());
							bw.append(problemsai.getFirstSelection()+","+problemsai.getFirstAction()+","+problemsai.getFirstInput());
							if(i != entry.getValue().size()-1)
								bw.append(",");
						}
						
						List<String> skills = problemSkill.get(entry.getKey());
						
						bw.append("::");
						for(int i=0; i<skills.size(); i++){
							//System.out.println(skills.get(i));
							bw.append(skills.get(i));
							if(i != skills.size()-1)
								bw.append(',');
						}
						
						bw.newLine();
					}
					
					bw.close();
				}
				

			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}	
	
	
	
	
	/**
	 * Method called when a text area is updated
	 * Note: update is signaled by pressing "Enter" on the interface
	 * @param sai
	 */
	private void processUpdateTextArea(SAI sai) {
		trace.out("webAuth"," --> processUpdateTextArea with " + sai);
		trace.out("webAuth"," --> current state is  " + this.getSimStudentState());
		trace.out("webAuth"," --> startState started is  " + this.getStartStateCreated());
		trace.out("webAuth"," --> currentSkill is  " + this.getCurrentSAISkill());
		
		try {
			String selection = sai.getFirstSelection();
			if (selection != null) {

				
				sendSAItoCTAT(sai);
				
				InterfaceAttribute at = getComponent(selection);
				System.out.println(" Attribute is :  "+at);
				if (at != null && at.getIsEnabled()) {
					trace.out("webAuth"," --> We are here");
					
					/*If start state is not created, then just gather whatever student enters into start state elements*/	
					if (this.getStartStateCreated()==false && sai.getFirstSelection()!=SIMST_COMM_TEXT_AREA){
						trace.out("webAuth"," --> Adding start state element  " + sai);
						System.out.println(" Adding start state element ");
						addStartStateElement(sai);
					}	
					else { /*If start state is created, then depending on what student enters then either save skill or student SAI*/
						
						if (sai.getFirstSelection().equals(SKILL_TEXT_AREA)){
							this.setCurrentSAISkill(sai.getFirstInput());
						}
						else{
							if (!isDoneClicked)
								setAuthorSelectedSAI(sai);
						}
					}
							
					System.out.println( getStartStateCreated()+"  "+getSimStudentState()+"  "+this.getCurrentSAISkill());
					if (getStartStateCreated() && (getSimStudentState().equals(SS_STATE_ASKS_HINT) || getSimStudentState().equals(SS_STATE_WAITING)) && !getCurrentSAISkill().equals(SKILL_NOT_SET)){ /*While waiting for hint, a step is demonstrated*/
			
							/*inform SimStudent about the FOA's and also clear the FOA's from here*/
							this.passFoasToSimSt();
							
							this.sendSimStudentMessageToInterface(SIMST_LEARNING_MSG);
							
							Object currentNodeObject = getInteractiveLearning(getSimStObject()).getClass().getMethod("getCurrentNode").invoke(getInteractiveLearning(getSimStObject()));
							Object problemModel = getBrController(getSimStObject()).getClass().getMethod("getProblemModel").invoke(getBrController(getSimStObject()));
							Object startState = problemModel.getClass().getMethod("getStartNode").invoke(problemModel);
							
							if(currentNodeObject == null){
								getInteractiveLearning(getSimStObject()).getClass().getMethod("setCurrentNode",startState.getClass()).invoke(getInteractiveLearning(getSimStObject()),startState);
								currentNodeObject = getInteractiveLearning(getSimStObject()).getClass().getMethod("getCurrentNode").invoke(getInteractiveLearning(getSimStObject()));

							}
							   
							  Class problemNodeClass= Class.forName("edu.cmu.pact.BehaviorRecorder.ProblemModel.Graph.ProblemNode", true, getSimStObject().getClass().getClassLoader());

							  Object interactiveLearning = getInteractiveLearning(getSimStObject());
							  interactiveLearning.getClass().getMethod("setSelection",String.class).invoke(interactiveLearning,this.getAuthorSelectedSAI().getFirstSelection());
							  interactiveLearning.getClass().getMethod("setAction",String.class).invoke(interactiveLearning,this.getAuthorSelectedSAI().getFirstAction());
							  interactiveLearning.getClass().getMethod("setInput",String.class).invoke(interactiveLearning,this.getAuthorSelectedSAI().getFirstInput());
							  interactiveLearning.getClass().getMethod("setSkillname",String.class).invoke(interactiveLearning,this.getCurrentSAISkill());


							  
							  Object nextNodeObject = interactiveLearning.getClass().getMethod("askWhatToDoNext", problemNodeClass).invoke(interactiveLearning,currentNodeObject);
							  
							  if(nextNodeObject == null){
								  Object askHint = interactiveLearning.getClass().getMethod("getHint").invoke(interactiveLearning);
								  Object problemNode = askHint.getClass().getMethod("getNode").invoke(askHint);
								  Object badInstruction = getSimStObject().getClass().getMethod("lookupInstructionWithNode", problemNode.getClass()).invoke(getSimStObject(), problemNode);
								  getSimStObject().getClass().getMethod("deleteBadInstruction", badInstruction.getClass()).invoke(getSimStObject(), badInstruction);
							  }
							  else{
								  interactiveLearning.getClass().getMethod("setCurrentNode", problemNodeClass).invoke(interactiveLearning,nextNodeObject);
							  }
							  
							  
							  boolean areWeDone = updateInterfaceAfterSimStudentStep((nextNodeObject!= null));
							  
		
							  if (!isLoadingInstructions() && nextNodeObject != null){
								  getMissController(getSimStObject()).getClass().getMethod("autoSaveInstructions").invoke(getMissController(getSimStObject()));
							  }
							  
							  
							 // if (simSt.getSsInteractiveLearning().getCurrentNode()==null)
							  	//simSt.getSsInteractiveLearning().setCurrentNode(simSt.getBrController().getProblemModel().getStartNode());
								
								
							  
							/*call askWhatToDoNext, which will invoke the oracle we have defined & make SimStudent learn whatever the oracle says.*/
							
							
							
							/*ProblemNode nextNode=simSt.getSsInteractiveLearning().askWhatToDoNext(this.simSt.getSsInteractiveLearning().getCurrentNode());
							this.getSimSt().getSsInteractiveLearning().setCurrentNode(nextNode);
						  				
							/*Update the interface if rule has been learned or not*/
							//boolean areWeDone=updateInterfaceAfterSimStudentStep((nextNode!=null));
							
							/*Autosave instructions so we can later resume*/
							/*if (!isLoadingInstructions())
								simSt.getMissController().autoSaveInstructions();*/
							
							
							if (nextNodeObject != null && !areWeDone && getInteractiveLearningMode() && !getIsDoneClicked() ){
										simStNextStepInteractiveLearning();
							}
						
							
						
							
					}
					else if (this.getStartStateCreated() && ( getSimStudentState().equals(SS_STATE_ASKS_HINT) || getSimStudentState().equals(SS_STATE_WAITING)) && getCurrentSAISkill().equals(SKILL_NOT_SET)){
						this.sendSimStudentMessageToInterface(SKILL_NOT_SET_MSG);
						//this.disableInterfaceElement(SKILL_TEXT_AREA, false); 	
					}
			
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		

	}
	
	/**
	 * When user double clicks an element, then border is toggled
	 * @param sai
	 */
	public void processDoubleClick(SAI sai){
		if (this.getStartStateCreated()){
			this.toggleFoa(sai,true);	
			this.sendSimStudentMessageToInterface("A focus of attention has been selected! ");
		}
		
	}
	
	
	
	
	
	
	
	/*************************************************
	 * SimStudent related methods 
	 ************************************************/
	
	/**
	 * Method invoked by SimStudent to ask if an SAI is correct.	
	 */
	@Override
	public String inquireRAWebAuthoring(String selection, String input, String action, ProblemNode problemNode, String problemName) {
		
		 /* Create the Oracle*/
	     InquiryWebAuthoring webAuthoringOracle = new InquiryWebAuthoring(simStAgendaTurth);
	     String returnValue = webAuthoringOracle.isCorrectStep(selection, action, input) ? EdgeData.CORRECT_ACTION : EdgeData.UNTRACEABLE_ERROR;
   

		return returnValue;
	}
	
	/**
	 * Method called when SimStudent gets stuck. Responsible for creating the AskHintWebAuthoring object that actually creates the hint.
	 */
	@Override
	public AskHint askForHintWebAuthoring(BR_Controller controller, ProblemNode problemNode) {
		
		/*Construct the Hint Object and send it back to simStudent*/
		AskHint hint = new AskHintWebAuthoring(brController,problemNode, this.getCurrentSAISkill(),this.getAuthorSelectedSAI());
		/*update SimStudent working memory with SAI */
		try {
			getSimStObject().getClass().getMethod("updateSimStWorkingMemoryDirectly",String.class,String.class,String.class).invoke(getSimStObject(),getAuthorSelectedSAI().getFirstSelection(), getAuthorSelectedSAI().getFirstAction(), getAuthorSelectedSAI().getFirstInput());
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		//simSt.updateSimStWorkingMemoryDirectly(getAuthorSelectedSAI().getFirstSelection(), getAuthorSelectedSAI().getFirstAction(), getAuthorSelectedSAI().getFirstInput());
		
		return hint;
	}

	
	/**
	 * Method to prepare SimStudent for learning. 
	 * 1. It initializes the working memory
	 * 2. It creates the interactive learning object
	 * 3. It creates start state on problem. 
	 * @param problem
	 * @throws JessException
	 */
	void prepareSimStudentForProblem(String problem) throws JessException{
				
			//this.setSimSt(sessionTable.get(super.getSession()));
		  
			try {
				 // Object problemNode = getProblemNodeObject();
				  Class problemNode= Class.forName("edu.cmu.pact.BehaviorRecorder.ProblemModel.Graph.ProblemNode", true, getSimStObject().getClass().getClassLoader());

				  Object interactiveLearning = getInteractiveLearning(getSimStObject());
				  interactiveLearning.getClass().getMethod("setCurrentNode", problemNode).invoke(interactiveLearning,new Object[]{null});
			   	  System.out.println(" The problem name : "+problem);
			   	  getInteractiveLearning(getSimStObject()).getClass().getMethod("createStartStateOnProblem",String.class).invoke(getInteractiveLearning(getSimStObject()), problem);
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (NoSuchMethodException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	   		//this.getSimSt().getSsInteractiveLearning().setCurrentNode(null);   		
 catch (ClassNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	   		
			/*Create the SimStInteractive learning object*/
			
			//simSt.getSsInteractiveLearning().ssInteractiveLearningOnProblem("3x=4");

			/*Create start state based on problem*/			
	   		//System.out.println(" The problem name : "+problem);
			//simSt.getSsInteractiveLearning().createStartStateOnProblem(problem);
			
	}
	
	
	/**
	 * Method that passes foas to SimStudent
	 */
	public void passFoasToSimSt(){
		
		trace.out("webAuth","Passing foas to SimStudent...: " +  foas);
			
		for (SAI foa : getSelectedFoas().values()){
			try {
				getSimStObject().getClass().getMethod("addFoaString", String.class).invoke(getSimStObject(),foa.getFirstSelection());
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (NoSuchMethodException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			//this.getSimSt().addFoaString(foa.getFirstSelection());
			toggleFoa(foa,false);
		}
		
		getSelectedFoas().clear();
	
	}
	
	
	/**
	 * Method use to pass the SAI to the CTAT Comm Message Handling (necessary for MT to work)
	 * @param sai
	 */
	private void sendSAItoCTAT(SAI sai){
		
			/*MessageObject mo = MessageObject.create("InterfaceAction");
		    mo.setVerb("NotePropertySet");
		    mo.setSelection(sai.getFirstSelection());
		    mo.setAction(sai.getFirstAction());
		    mo.setInput(sai.getFirstInput());    
		    mo.setTransactionId(MessageObject.makeTransactionId());	
		    this.getBrController().getUniversalToolProxy().sendMessage(mo);	  */  
		    
		    try {
		    	Class messageObjectClass = Class.forName("edu.cmu.pact.ctat.MessageObject",true, getSimStObject().getClass().getClassLoader());
				Constructor constructor = messageObjectClass.getDeclaredConstructor();
				constructor.setAccessible(true);
				Object messageObject1 = constructor.newInstance();
			
				Object messageObject = messageObject1.getClass().getMethod("create", String.class).invoke(messageObject1, "InterfaceAction");
				messageObject.getClass().getMethod("setVerb", String.class).invoke(messageObject, "NotePropertySet");
				messageObject.getClass().getMethod("setSelection", String.class).invoke(messageObject, sai.getFirstSelection());
				messageObject.getClass().getMethod("setAction", String.class).invoke(messageObject, sai.getFirstAction());
				messageObject.getClass().getMethod("setInput", String.class).invoke(messageObject, sai.getFirstInput());
				messageObject.getClass().getMethod("setTransactionId", String.class).invoke(messageObject,messageObject.getClass().getMethod("makeTransactionId").invoke(messageObject));
				Object UniversalProxy = getBrController(getSimStObject()).getClass().getMethod("getUniversalToolProxy").invoke(getBrController(getSimStObject()));
				UniversalProxy.getClass().getMethod("sendMessage", messageObject.getClass()).invoke(UniversalProxy,messageObject);

		   
		    } catch (IllegalAccessException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (IllegalArgumentException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (InvocationTargetException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (NoSuchMethodException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (SecurityException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (ClassNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InstantiationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		    
	}
	
	
	/*************************************************
	 * Utility methods related with SimStudent training
	 ************************************************/
	
	
	public ArrayList<Sai> convertRuleActivationListToSAI(Collection<RuleActivationNode> activList){
		ArrayList<Sai> saiList = new ArrayList<Sai>();
		
		
		/*convert them into an Sai list*/
		Iterator iterator = activList.iterator();
		while(iterator.hasNext()){
			Object activationNode = iterator.next();
			try {
				String selection = (String) activationNode.getClass().getMethod("getActualSelection").invoke(activationNode);
				String action =  (String) activationNode.getClass().getMethod("getActualAction").invoke(activationNode);
				String input = (String) activationNode.getClass().getMethod("getActualInput").invoke(activationNode);
				String rule = (String) activationNode.getClass().getMethod("getName").invoke(activationNode);
				Vector foas = (Vector) activationNode.getClass().getMethod("getRuleFoas").invoke(activationNode);
				
				Sai sai = new Sai(selection, action , input);
				saiList.add(sai);
				
				currentFOAList.put(sai, foas);
				currentRuleList.put(sai, rule);
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (NoSuchMethodException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			
		}
		/*for (RuleActivationNode ran : activList) {
			Sai sai = new Sai(ran.getActualSelection(), ran.getActualAction(), ran.getActualInput());
			saiList.add(sai);
		}*/
		
	
		return saiList;
	
	}
	
	
	 /**
	    * Method that iterates through all SimStudent suggestions and displays them so author can select if they are correct or not. 
	    * @param doNext if true, this means that we no longer need to check for rule activations.
	 * @throws SecurityException 
	 * @throws NoSuchMethodException 
	 * @throws InvocationTargetException 
	 * @throws IllegalArgumentException 
	 * @throws IllegalAccessException 
	    */
	   public void inquiryNextSAI(boolean doNext) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException{
			boolean saiDisplayed=false;
			

			if (!doNext){
				
			
			for (Entry<Sai, String> entry : simStAgendaTurth.entrySet()) {
			    Sai key = entry.getKey();
			    String value = entry.getValue();
			    
			    addInterfaceElements(key);
			    
			    
			    if (value.equals("Unknown")){
			    	displaySimStudentSuggestion(key);
			    	saiDisplayed=true;
			    	simStAgendaTurth.put(key, "TBA");
			    	
			    	this.setLastInquiredSAI(key);
			    	break;
			    }    
			}
					
				/*if we have displayed an  SAI then don't proceed. At this point author will click yes or no so just return. We will get back here on the next Sai inquiry (which is after author clicks yes or no)*/
				if (saiDisplayed)	return;
			}
			
			/*ok all SAI's have been displayed so go and call the insepctAgendaRuleActivation to inform SimStudent about the author decisions*/
			
			Object currentNodeObject = getProblemNodeObject();
			Class inquiryWebAuthoringOracleClass;
			try {
				inquiryWebAuthoringOracleClass = Class.forName("edu.cmu.pact.miss.jess.InquiryWebAuthoring", true, getSimStObject().getClass().getClassLoader());
				Class saiClass = Class.forName("edu.cmu.pact.miss.Sai", true, getSimStObject().getClass().getClassLoader());
				HashMap<Object,Object> map = new HashMap<Object,Object>();
				
				for(Map.Entry<Sai,String> entry : simStAgendaTurth.entrySet()){
					Object saiObject = saiClass.getConstructor(String.class,String.class,String.class).newInstance(new Object[]{entry.getKey().getS(),entry.getKey().getA(),entry.getKey().getI()});
					map.put(saiObject, entry.getValue());
				}
				
				Object inquiryWebAuthoringObject = inquiryWebAuthoringOracleClass.getConstructor(inquiryWebAuthoringOracleClass.getConstructors()[0].getParameterTypes()).newInstance(map);
				getSimStObject().getClass().getMethod("setInquiryWebAuthoring", inquiryWebAuthoringOracleClass).invoke(getSimStObject(), inquiryWebAuthoringObject);

			} catch (ClassNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InstantiationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			Object nextCurrentNodeObject = getInteractiveLearning(getSimStObject()).getClass().getMethod("inspectAgendaRuleActivations", currentNodeObject.getClass(),Collection.class).invoke(getInteractiveLearning(getSimStObject()), currentNodeObject,simStActivationList);
					
			
			//ProblemNode nextCurrentNode = simSt.getSsInteractiveLearning().inspectAgendaRuleActivations(simSt.getSsInteractiveLearning().currentNode,simStActivationList);
			
			boolean isDoneState=false;
			if (/*nextCurrentNode*/nextCurrentNodeObject!=null){
				/*if we are author clicked at least one yes on SimStudent suggestion*/
				if (getCorrectInquiredSAI()!=null){
					displaySAI(getCorrectInquiredSAI().getS(), getCorrectInquiredSAI().getA(), getCorrectInquiredSAI().getI());
					isDoneState=getCorrectInquiredSAI().getS().equalsIgnoreCase("done")?true:false;
					this.setCorrectInquiredSAI(null);
				}
					
				//this.getSimSt().getSsInteractiveLearning().setCurrentNode(nextCurrentNode);
				getInteractiveLearning(getSimStObject()).getClass().getMethod("setCurrentNode", nextCurrentNodeObject.getClass()).invoke(getInteractiveLearning(getSimStObject()), nextCurrentNodeObject);
				updateInterfaceAfterSimStudentStep(true);
				
				/*This step is learned, so run interactive learning on next step*/
				if (!isDoneState && getInteractiveLearningMode())
					simStNextStepInteractiveLearning();
				else if (isDoneState)
					sendSimStudentMessageToInterface(PROBLEM_LEARNED_MSG);
				else
					sendSimStudentMessageToInterface(STEP_LEARNED_MSG);
				
				if (!isLoadingInstructions())
					//smSt.getMissController().autoSaveInstructions();
				getMissController(getSimStObject()).getClass().getMethod("autoSaveInstructions").invoke(getMissController(getSimStObject()));
				
			}
			else { /*If we are here author clicked no to all SimStudent suggestions and SimStudent got stuck*/
				//this.getSimSt().clearCurrentFoA();
				getSimStObject().getClass().getMethod("clearCurrentFoA").invoke(getSimStObject());
				this.sendSimStudentMessageToInterface(SIMSTUDENT_STUCK_MSG);
				this.setSimStudentState(SS_STATE_ASKS_HINT);
			}
		
		}
	   
	   
	/**
	 * Utility method to display an SAI to the interface.	
	 * @param sai
	 * @throws SecurityException 
	 * @throws NoSuchMethodException 
	 * @throws InvocationTargetException 
	 * @throws IllegalArgumentException 
	 * @throws IllegalAccessException 
	 */
	public void displaySimStudentSuggestion(Sai sai) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException{
		
		SAI test=new SAI(sai.getS(), sai.getA(), sai.getI());
		sendSAI(test);
		try {

			Class RuleActivationNodeClass = Class.forName("edu.cmu.pact.jess.RuleActivationNode", true, getSimStObject().getClass().getClassLoader());
			System.out.println(RuleActivationNodeClass.getClassLoader());
			Object[] paramters = new Object[4];
			paramters[0] = sai.getS();
			paramters[1] = sai.getA();
			paramters[2] = sai.getI();
			paramters[3] = null;

			Object msgObject = getSimStObject().getClass().getMethod("generateQueryMessage",String.class, String.class, String.class, RuleActivationNodeClass).invoke(getSimStObject(),paramters);
			System.out.println(msgObject);
			Object[] message = (Object[]) msgObject;
			//String[] message=simSt.generateQueryMessage(sai.getS(), sai.getA(), sai.getI(), null);
			String msg = "";
	       	for(int i=0;i<message.length;i++)
	       		msg += message[i]+" ";
			this.sendSimStudentMessageToInterface(msg);

		
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
			
	}
	
	
	/**
	 * Method to create the problem Name
	 */
	private String createProblemName(){
		String name="";
		for (int i = 0; i < getStartStateElements().size(); i++) {
			SAI sai = getStartStateElements().get(i);  
			if (!sai.getFirstSelection().equals(SIMST_COMM_TEXT_AREA) && !sai.getFirstSelection().equals(SKILL_TEXT_AREA))
				name+=sai.getFirstInput();
		}
		
		trace.out("webAuth","--> startStateElements are " + getStartStateElements());
		trace.out("webAuth","--> name created is " + name);
		return name;
	}
		
	private String createProblemNameForQuiz(){
		String name="";
		for (int i = 0; i < getStartStateElements().size(); i++) {
			SAI sai = getStartStateElements().get(i);  
			if (!sai.getFirstSelection().equals(SIMST_COMM_TEXT_AREA) && !sai.getFirstSelection().equals(SKILL_TEXT_AREA)){
				if(name.length() == 0)
					name+= sai.getFirstInput();
				else
					name+= "=" + sai.getFirstInput();
			}
			    System.out.println("name");
		}
		
		trace.out("webAuth","--> startStateElements are " + getStartStateElements());
		trace.out("webAuth","--> name created is " + name);
		return name;
	}
	/**
	 * Method that updates interface based on SimStudnet learned a step
	 * @return returns true if last action was done
	 */
	private boolean updateInterfaceAfterSimStudentStep(boolean ruleLearned){
		/*Ok SimStudent learned the step so clear the currentFoA*/
		try{
			getSimStObject().getClass().getMethod("clearCurrentFoA").invoke(getSimStObject());
			//this.getSimSt().clearCurrentFoA();
		}
		catch (Exception ex){}
		setIsDoneClicked(false);
		boolean returnValue=false;
		if (!this.isLastPerformedStepDone()){
			//this.copyFile(SimSt.PRODUCTION_RULE_FILE);
			sendSimStudentMessageToInterface((ruleLearned)?STEP_LEARNED_MSG:STEP_NOT_LEARNED_MSG);
			setSimStudentState(SS_STATE_WAITING);
			returnValue=false;
		}	
		else{
			setStartStateCreated(false);
			sendSimStudentMessageToInterface(PROBLEM_LEARNED_MSG);
			clearStartStateElements();
			returnValue=true;
		
		}
		
		this.resetSkill();
		//if rule was not learned, remove whatever author entered.
		if (!ruleLearned) this.displaySAI(this.getAuthorSelectedSAI().getFirstSelection(), this.getAuthorSelectedSAI().getFirstAction(), "");
		
		return returnValue;
		
	}
	
	void simStNextStepInteractiveLearning(){
		
		
		//System.out.println(" I'm : "+simSt.getPackageName());
		/*Get Rule Activation for the next step*/
		
	    try {
			Object currentNodeObject = getInteractiveLearning(getSimStObject()).getClass().getMethod("getCurrentNode").invoke(getInteractiveLearning(getSimStObject()));
			if(currentNodeObject == null){
				Object problemModel = getBrController(getSimStObject()).getClass().getMethod("getProblemModel").invoke(getBrController(getSimStObject()));
				Object startNode = problemModel.getClass().getMethod("getStartNode").invoke(problemModel);
				getInteractiveLearning(getSimStObject()).getClass().getMethod("setCurrentNode",startNode.getClass()).invoke(getInteractiveLearning(getSimStObject()),startNode);
				currentNodeObject = getInteractiveLearning(getSimStObject()).getClass().getMethod("getCurrentNode").invoke(getInteractiveLearning(getSimStObject()));
			}
		   Object activationList = getInteractiveLearning(getSimStObject()).getClass().getMethod("getActivations", currentNodeObject.getClass()).invoke(getInteractiveLearning(getSimStObject()), currentNodeObject);
		   System.out.println(" activation List : "+activationList);
           this.simStActivationList = (Collection<RuleActivationNode>) JclUtils.shallowClone(activationList);
         
         /*System.out.println(this.simStActivationList.getClass().getClassLoader());
         System.out.println(" New update");
         for(RuleActivationNode ran : this.simStActivationList)
        	 System.out.println(ran.getActualSelection());*/
         
	    } catch (IllegalAccessException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IllegalArgumentException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (InvocationTargetException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (NoSuchMethodException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (SecurityException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
	    
		
		//if (simSt.getSsInteractiveLearning().getCurrentNode()==null)
			//simSt.getSsInteractiveLearning().setCurrentNode(simSt.getBrController().getProblemModel().getStartNode());
			
		//this.simStActivationList=simSt.getSsInteractiveLearning().getActivations(simSt.getSsInteractiveLearning().currentNode);
		
		
		
		if (simStActivationList.isEmpty()){ /*SimStudent is stuck and waits for hint*/
			System.out.println("SimStudent is struck ! ");
			this.setSimStudentState(SS_STATE_ASKS_HINT);
			this.sendSimStudentMessageToInterface(SIMSTUDENT_STUCK_MSG);
		}
		else {		/*SimStudent makes a suggestion and returns an SAI*/
			this.setSimStudentState(SS_STATE_ASKS_FEEDBACK);
						
			
			ArrayList<Sai> simStudentSai=this.convertRuleActivationListToSAI(this.simStActivationList);
			
			for(Map.Entry<Sai, String> entry : currentRuleList.entrySet()){
				Sai key = entry.getKey();
				Vector foas = currentFOAList.get(key);
		    	String rule = currentRuleList.get(key);
		    	
		    	
		    	if(rule.contains("&"))
		    		rule = rule.substring(0, rule.indexOf("&")) + "(" + rule.substring(rule.indexOf("&")+1) + ")";
		    	
		    	displaySAI(rule+"$"+key.getS(), "UpdateTextField", key.getI());
		    	displaySAI("FOA", "UpdateTextField", foas.toString());
			}
			
			currentFOAList.clear();
			currentRuleList.clear();
	
			 trace.out("webAuth","**** Activations received from SimStudent: " + simStActivationList);
			 trace.out("webAuth","**** SAI's received from SimStudent: " + simStudentSai);
			
			/*populate the simStAgendaTruth that will hold whatever author believes about SAI (correct / incorrect)*/
			 if (simStAgendaTurth==null) simStAgendaTurth=new HashMap <Sai,String>();
			 
			 simStAgendaTurth.clear();
			 
			 for (Sai tempSai: simStudentSai){
				 simStAgendaTurth.put(tempSai,"Unknown");
			 }
			 
			 trace.out("webAuth","Initial simStAgendaTruth : " + simStAgendaTurth);
						 
			 
			 /*ask about the first SAI*/
			 try {
				inquiryNextSAI(false);
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (NoSuchMethodException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
				 
		}
	}
	

	/**
	 * Utility method to display a text on the SimStudent communication textarea on the interface
	 */
	private void resetSkill(){
		this.setCurrentSAISkill(SKILL_NOT_SET);
		this.displaySAI(SKILL_TEXT_AREA,"UpdateTextArea","");
		//this.disableInterfaceElement(SKILL_TEXT_AREA, true); 	
	}

	
	
	
	
	
	/*************************************************
	 * Utility methods related with the Web Interface
	 ************************************************/
	
	/**
	 * Method to clear the start state elements 
	 */
	private void clearInterface(){
				
		for (SAI sai : interfaceElements) {
			InterfaceAttribute at = getComponent(sai.getFirstSelection());
			if (at!=null) this.clearElement(at);	
			displaySAI(sai.getFirstSelection(),sai.getFirstAction(),"");
		}
		
		displaySAI(SKILL_TEXT_AREA,"UpdateTextArea","");

		
	}


	private void displaySAI(String selection, String action, String input){
		SAI test1=new SAI(selection,action,input);
		sendSAI(test1);
		
	}
	
	/**
	 * Utility method to display a text on the SimStudent communication textarea on the interface
	 * @param text : a string with the text to be displayed
	 */
	private void sendSimStudentMessageToInterface(String message){
		displaySAI(SIMST_COMM_TEXT_AREA,"UpdateTextArea",message);	
	}

	
	
	/**
	 * Method to re-enable an interface element
	 * @param ia
	 */
	private void clearElement(InterfaceAttribute ia) {
		ia.setBackgroundColor(ENABLED_BACKGROUND_COLOR);
		ia.setIsEnabled(true);
		modifyInterface(ia);
	}

	/**
	 * Method for disabling an interface element
	 * @param ia
	 */
	private void disableElement(InterfaceAttribute ia) {
		ia.setBackgroundColor(DISABLED_BACKGROUND_COLOR);
		ia.setIsEnabled(false);
		modifyInterface(ia);
	}

	/**
	 * Method for disabling an interface element
	 * @param ia
	 */
	private void enableElement(InterfaceAttribute ia) {
		ia.setBackgroundColor(ENABLED_BACKGROUND_COLOR);
		ia.setIsEnabled(true);
		modifyInterface(ia);
	}

	
	/**
	 * Method to disable the start state elements once start state is clicked
	 */
	private void disableStartStateElements(){
		for (int i = 0; i < getStartStateElements().size(); i++) {
			SAI sai = getStartStateElements().get(i);    
			InterfaceAttribute at = getComponent(sai.getFirstSelection());
			if (at!=null) this.disableElement(at);

		}
	}
	
	/**
	 * Method to disable the start state elements once start state is clicked
	 * @param element the element to be disabled / enabled
	 * @param flag 
	 */
	private void disableInterfaceElement(String element,boolean flag){
	 
			InterfaceAttribute at = getComponent(element);
			
			if (at!=null){
				if (flag) this.disableElement(at) ;
				else this.enableElement(at);
			}
	}
	
	/**
	 * High level mehtod called when an interface element is double-clicked.
	 * @param sai
	 * @param affectHash boolean to control if the hash containing the foas should be affected
	 */
	private void toggleFoa(SAI sai, boolean affectHash){
		
		if (getSelectedFoas()==null){

			InterfaceAttribute at = getComponent(sai.getFirstSelection());
			setBorder(at,true);
			if (affectHash) addFoa(sai);
		}
		else if (!foas.containsKey(sai.getFirstSelection())){

			InterfaceAttribute at = getComponent(sai.getFirstSelection());
			setBorder(at,true);
			if (affectHash) addFoa(sai);
		}
		else {
			
			InterfaceAttribute at = getComponent(sai.getFirstSelection());
			setBorder(at,false);
			if (affectHash) removeFoa(sai);
		}
	}

	
	
	/**
	 * Method that sets/un-sets the border of an element
	 * @param ia
	 * @param flag for setting/un-setting the border
	 */
	private void setBorder(InterfaceAttribute ia, boolean flag) {
		if (flag){
			
			ia.setBorderColor(SELECTED_BORDER_COLOR);
			ia.setBorderWidth(SELECTED_BORDER_WIDTH);
			modifyInterface(ia);
		}
		else{
			ia.setBorderColor(NORMAL_BORDER_COLOR);
			ia.setBorderWidth(NORMAL_BORDER_WIDTH);
			modifyInterface(ia);
		}

	}
	
	
	public void sendSkillMessage(String skill, int count){
		super.sendSkillMessage(skill,count);
	}
	
	public void sendProblemMessage(String problem){
		super.sendProblemMessage(problem);
	}
	
  Object getBrController(Object simStObject){
	  Object brControllerObject = null;
	try {
		brControllerObject = simStObject.getClass().getMethod("getBrController").invoke(simStObject);
	} catch (IllegalAccessException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (IllegalArgumentException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (InvocationTargetException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (NoSuchMethodException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (SecurityException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	  return brControllerObject;
   }
  
   Object getInteractiveLearning(Object simStObject){
	   Object interactiveLearning = null;
	   try {
		interactiveLearning = simStObject.getClass().getMethod("getSsInteractiveLearning").invoke(simStObject);
	} catch (IllegalAccessException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (IllegalArgumentException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (InvocationTargetException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (NoSuchMethodException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (SecurityException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	   return interactiveLearning;
   }
	
	Object getMissController(Object simstObject){
		Object missControllerObject = null;
		
		 try {
			 missControllerObject = simstObject.getClass().getMethod("getMissController").invoke(simstObject);
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (NoSuchMethodException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		
		return missControllerObject;
	}
	
	Object getProblemNodeObject(){
		Object problemNodeObject = null;
		try {
			problemNodeObject = getInteractiveLearning(getSimStObject()).getClass().getMethod("getCurrentNode").invoke(getInteractiveLearning(getSimStObject()));
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return problemNodeObject;
	}
	
	
	
	Object SimStTakingQuiz(String problem){
		Object solution = null;
		try {
			getBrController(getSimStObject()).getClass().getMethod("startNewProblem").invoke(getBrController(getSimStObject()));
			getInteractiveLearning(getSimStObject()).getClass().getMethod("createStartStateQuizProblem",String.class).invoke(getInteractiveLearning(getSimStObject()),problem);
			getInteractiveLearning(getSimStObject()).getClass().getMethod("startQuizProblem").invoke(getInteractiveLearning(getSimStObject()));
			Object problemGraph = getInteractiveLearning(getSimStObject()).getClass().getMethod("getQuizGraph").invoke(getInteractiveLearning(getSimStObject()));
			Object startNode = problemGraph.getClass().getMethod("getStartNode").invoke(problemGraph);
			solution = startNode.getClass().getMethod("findSolutionPath").invoke(startNode);
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return solution;
	}
}





