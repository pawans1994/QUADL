

import java.awt.Desktop.Action;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Random;



/*
*Argument: outputfilename(string.csv) version(int)
*/



public class RafineCource {

	//.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
	//User Custom fields :: Change accordingly
	//.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-

	//Number of the students taking the cource
	private int NUM_STUDENTS = 10;

	// Ratio of high to low competent students
	//
	private double HIGH_COMPETENT_STUDENT_RATIO = 0.75;

	//Number of the pages
	//
	private int NUM_PAGES = 3;

	//The min(inclusive ) and max (inclusive) Number of contents students should so  in each page
	//
	private int MIN_NUM_VIDEO_INPAGE= 2;
	private int MAX_NUM_VIDEO_INPAGE = 4;
	private int MIN_NUM_QUIZ_INPAGE = 1;
	private int MAX_NUM_QUIZ_INPAGE = 3;
	


	//The min (inclusive) and max (exclusive)　number of transaction in a page
	private int MIN_NUM_TRANSACTION_INPAGE;
	private int MAX_NUM_TRANSACTION_INPAGE;

	//The min (inclusive) and max (exclusive)　number of transaction in  a whole cource
	private int MIN_NUM_TRANSACTION_ASWHOLE = 10;
	private int MAX_NUM_TRANSACTION_ASWHOLE = 15;

	// Number of different actions (e.g., different videos to watch) in each action category
	private int NUM_VIDEO_ACTION = 20;
	private int NUM_PAGEVIEW_ACTION = 20;
	private int NUM_QUIZ_ACTION = 10;
	private int NUM_HINT_ACTION = NUM_QUIZ_ACTION;

	
	//
	private int NUM_CONTENTS_INPAGE =(NUM_VIDEO_ACTION + NUM_QUIZ_ACTION)/ NUM_PAGES;
	private int NUM_VIDEO_INPAGE = NUM_VIDEO_ACTION / NUM_PAGES;
	private int NUM_QUIZ_INPAGE = NUM_QUIZ_ACTION / NUM_PAGES;

	//The ratio of high-quality action contents for each type
	//
	private double VIDEO_ACTION_QUALITY_RATIO=0.70;
	private double QUIZ_ACTION_QUALITY_RATIO=0.70;
	private double HINT_ACTION_QUALITY_RATIO = 0.70;

	// Initial probability of students with high and low competence answering a quiz correctly
	//
	private double INIT_LOGIT_HIGH=-0.85;
	private double INIT_LOGIT_LOW=-1.4;

	private double LOGIT_INCREASE_HIGH_QUALITY_FOR_HIGH_COMPETENT=0.20;
	private double LOGIT_INCREASE_HIGH_QUALITY_FOR_LOW_COMPETENT=0.15;
	private double LOGIT_INCREASE_LOW_QUALITY_FOR_HIGH_COMPETENT=0.03;
	private double LOGIT_INCREASE_LOW_QUALITY_FOR_LOW_COMPETENT=0.001;
	
	private double LOGIT_INCREASE_QUIZ_FOR_HIGH_COMPETENT;
	private double LOGIT_INCREASE_QUIZ_FOR_LOW_COMPETENT;
	private double LOGIT_INCREASE_VIDEO_HIGH_FOR_HIGH_COMPETENT;
	private double LOGIT_INCREASE_VIDEO_HIGH_FOR_LOW_COMPETENT;
	private double LOGIT_INCREASE_VIDEO_LOW_FOR_HIGH_COMPETENT;
	private double LOGIT_INCREASE_VIDEO_LOW_FOR_LOW_COMPETENT;
	private double LOGIT_INCREASE_HINT_HIGH_FOR_HIGH_COMPETENT;
	private double LOGIT_INCREASE_HINT_HIGH_FOR_LOW_COMPETENT;
	private double LOGIT_INCREASE_HINT_LOW_FOR_HIGH_COMPETENT;
	private double LOGIT_INCREASE_HINT_LOW_FOR_LOW_COMPETENT;
	

	// .-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.--.-.-
	// System fields :: Don't change
	//.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-

	//the number digits used in the name of an action(e.g., video007)
	private int NUM_ACTION_INDEX = 4;
	private String INDEX_FILLER = "0000";

	private String HIGH_QUALITY = "High";
	private String LOW_QUALITY ="Low";

	// Probability of answering a quiz correctly for each student
	private double[] competenceLogit = new double[NUM_STUDENTS];

	// File to output the transactions
	private BufferedWriter outputStream;

	//  PageContents{pagenumber} -> [number of videos in the page, number of Quiz in the page,  VIDEOIDs, QuizIDs]
	private HashMap<Integer, ArrayList<String>> PAGECONTENTS = new HashMap<>();

	// Number of transactions in a current page
	private int transactionInPage;

	private int VERSION;
	
	//List of contents
	private ArrayList<String> videoList = new ArrayList<String>();
	private ArrayList<String> quizList = new ArrayList<String>();
	
	private boolean QuizFailed = false;
	
	//indicates student's last transaction is whether quiz or not
	private boolean LastAtmtQuiz = false;
	private String lastQuizFailed;
	
	
	

	// 'contentsHistVector' shows what contents the student watched.
	// contentsHistVector{pagenumber} -> 0(not watched) OR 1 (watched)
//	private HashMap<String, Integer> contentsHistVector;



	// - - - - - - - - - -
	// Constructor
	// - - - - - - - - - -

	public RafineCource(
			double a, double b, double c,double d,double e, double f,double g, double h,double i,double j, double k, double l, 
			int m, int n,int o,int p , int q, int r, int s, double t, double u, double v, int version)
	{

		//this.LOGIT_INCREASE ant INIT_LIGIT parameters are initialized
		setparameters(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v);

		//Create Contents
		createContents();
		
		// set Contents in pages
		setContentsInpage();

		//set Version
		setVersion(version);

		// this.probabilityCorrect must be initialized
		initializeCompetenceLogit();


	}



	public static void main(String[] argv) {
		String filename = argv[0];
		int version = Integer.parseInt(argv[1]);
		
		//see setparameters() for each arguments
		double a = Double.parseDouble(argv[2]);
		double b = Double.parseDouble(argv[3]);
		double c = Double.parseDouble(argv[4]);
		double d = Double.parseDouble(argv[5]);
		double e = Double.parseDouble(argv[6]);
		double f = Double.parseDouble(argv[7]);
		double g = Double.parseDouble(argv[8]);
		double h = Double.parseDouble(argv[9]);
		double i = Double.parseDouble(argv[10]);
		double j = Double.parseDouble(argv[11]);
		double k = Double.parseDouble(argv[12]);
		double l = Double.parseDouble(argv[13]);
		int m = Integer.parseInt(argv[14]);
		int n = Integer.parseInt(argv[15]);
		int o = Integer.parseInt(argv[16]);
		int p = Integer.parseInt(argv[17]);
		int q = Integer.parseInt(argv[18]);
		int r = Integer.parseInt(argv[19]);
		int s = Integer.parseInt(argv[20]);
		double t =Double.parseDouble(argv[21]); 
		double u =Double.parseDouble(argv[22]); 
		double v = Double.parseDouble(argv[23]);
		
		
		new RafineCource(a, b, c, d, e, f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,version).run(filename);
	}

	// - - - - - - - - - -
	// Methods
	// - - - - - - - - - -




	public void run(String filename) {
		// Open output file
		openOutputFile(filename);

		for (int studentID = 0; studentID < NUM_STUDENTS; studentID++) {

			//initialize this.contentsHistVector
//			initializecontentsHistVector();

			//initialize this,transactionInpage
			transactionInPage =0;



			genTransaction(studentID);

		}

		try {
			getOutputStream().close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Simulate a transaction and save it into the log file
	 */
	private void genTransaction(int studentID) {

		int pageNumber = 0;
		int pageNumberPrevious;
		int numTransaction = genRandomNum(MIN_NUM_TRANSACTION_ASWHOLE, MAX_NUM_TRANSACTION_ASWHOLE);
		this.QuizFailed = false;

		for(int j = 0; j< numTransaction;j++) {

			//when the student open the page, his/her transaction in that page must more than MIN_NUM_TRANSACTION_INPAGE
			if(transactionInPage < MIN_NUM_TRANSACTION_INPAGE) {
				pageNumberPrevious = pageNumber;
				genTransactionInPage(pageNumberPrevious,pageNumber,studentID);

			}

			else if (transactionInPage >= MIN_NUM_TRANSACTION_INPAGE && transactionInPage < MAX_NUM_TRANSACTION_INPAGE) {

				//randomly returns "pagechange"(move other page) OR "pagestill(stay in the same page)"
				//true => pagechange, false- => pagestill
				Boolean move = genRandomBoolean();
				if(move) {
					//Randomly returns page number except for current page number
					pageNumberPrevious = pageNumber;
					pageNumber = genRandomNum(0,NUM_PAGES,pageNumber);
					transactionInPage = 0;
				}
				else {
					pageNumberPrevious = pageNumber;
				}
				genTransactionInPage(pageNumberPrevious,pageNumber,studentID);

			}
			//Students don't do too many contents in the same page.
			else {
				pageNumberPrevious = pageNumber;
				pageNumber = genRandomNum(0,NUM_PAGES,pageNumber);
				transactionInPage=0;
				genTransactionInPage(pageNumberPrevious,pageNumber,studentID);

			}

		}

	}
	
	
	/**
	 * generate transition in the current pagenumber.
	 * @param pagenumber -> current pagenumber
	 * @param studentID -
	 */

	private void genTransactionInPage(int pageNumberPrevious,int pageNumber, int studentID) {

		transactionInPage++;
		
		String outcome = "n/a";
		
		String actionName = "n/a";
		
		//when student failed the quiz in the previous transaction
		if(this.QuizFailed) {
			//generate Hint transaction only
			//take same quiz until they answer correctly
			if(this.LastAtmtQuiz) {
				String quizID = this.lastQuizFailed.substring(this.lastQuizFailed.length()-NUM_ACTION_INDEX);
				actionName = "Hint" + quizID;
			}
			//else his last atmpt was Hint, try quiz again
			else {
				actionName = this.lastQuizFailed;
			}
		}
		//when student didn't failed to answer the quiz
		else{
			// select which action to take in the current page.
			int index = selectIndex(pageNumber);
			
			//'actionName' shows a unique ID for the action taken
			actionName = GetActionName(pageNumber,index);
		}
		
		/*
		 * Action is assigned
		 */
		
		// 'actionType' is either {VIDEO|QUIZ|HINT}
		ActionType actionType = GetActionType(actionName);

		// 'actionQuality' is either high or low showing the quality of the action taken
		// actionQuality for actions in a policy tend to have high quality
		String actionQuality = lookupActionQuality(actionType,actionName);
		
		if(actionType == ActionType.QUIZ) {
			this.LastAtmtQuiz = true;
			// The correctness of the quiz, i.e., outcome, is a function of the student.
			// I.e., a good student is more likely make it correct
			outcome = spinOutcome(studentID);
			if(outcome == "INCORRECT") {
				this.QuizFailed = true;
				this.lastQuizFailed = actionName;
			}
			else {
				this.QuizFailed = false;
			}
		}
		else {
			this.LastAtmtQuiz = false;
		}

		
		
		
		// update data which contents the student watched .
		// contentsHistVector{ID}=0 --> contentsHistVector{ID}=1
//		ContentsVector contentsVector = updateVector(actionName);

		double probCorrectPrivious = probabilityCorrect(studentID);

		// The student might have learned from the action taken hence increased competence
		updateStudentCompetency(studentID,actionType,actionQuality,outcome);

		//
		double probCorrectLater = probabilityCorrect(studentID);


		// Output an action transaction to the file
		saveAction(studentID,actionType,actionName,/*probCorrectPrivious,*/probCorrectLater,/*contentsVector,*/pageNumberPrevious,pageNumber,outcome,actionQuality);
		transactionInPage++;

	}

	/**
	 *
	 * @param actionName
	 * @return
	 */
//	private ContentsVector updateVector(String actionName) {
//
//		HashMap<String, Integer> previous = contentsHistVector;
//		contentsHistVector.put(actionName, 1);
//		ContentsVector contentsVector = new ContentsVector(previous, contentsHistVector);
//		return contentsVector;
//
//
//	}

	/**
	 *  Return a stochastic correctness of answering a quiz for a given student.
	 *  The ration of high to low competent students is given a priori.
	 *  The ration of answering a quiz correctly for high and low competent student is akso given.
	 *
	 */
	private String spinOutcome(int studentID) {

		double probabilityCorrect = probabilityCorrect(studentID);
		int chance = genRandomNum(100);

		String outcome  = (chance < 100 * probabilityCorrect) ? "CORRECT" : "INCORRECT";
		return outcome;
	}

	/**
	 *  A ratio of the high-quality action content to the low-quality is given for each type of action
	 *  This method returns the quality of the given 'actionName' (e.g., Quiz023')
	 */
	private String lookupActionQuality(ActionType actionType, String actionName) {

		String index = actionName.substring(actionName.length()-NUM_ACTION_INDEX);
		int indexValue = Integer.valueOf(index);

		// The ration of high quality actions in the given actionType
		double qualityRatio = getActionQualityRatio(actionType);

		int numActions = getNumDifferentActions(actionType);

		String actionQuality = indexValue < numActions * qualityRatio ? HIGH_QUALITY : LOW_QUALITY;

		return actionQuality;
	}

	/**
	 * Retrive number of actions of each ActionType
	 */
	private int getNumDifferentActions(ActionType actionType) {
		int numActions;
		if(actionType == ActionType.QUIZ || actionType == ActionType.HINT) {
			numActions = NUM_QUIZ_ACTION;
		}
		else {
			numActions = NUM_VIDEO_ACTION;
		}
		return numActions;
	}

	private ActionType GetActionType(String actionName) {

		String actiontypelabel = actionName.substring(0, actionName.length()-NUM_ACTION_INDEX);
//		ActionType actionType = ActionType.valueOf(actiontypelabel);
		ActionType actionType = ActionType.getTypeByValue(actiontypelabel);
		return actionType;

	}


	private String GetActionName(int pageNumber,int index) {

		String actionName = PAGECONTENTS.get(pageNumber).get(index);

		return actionName;


	}

	private int selectIndex(int pagenumber) {
		
		int index = genRandomNum(PAGECONTENTS.get(pagenumber).size());
	
		
		return index;

	}



	// . - . - . - . - . - . - . - . - . - . - . - . - . - . -
	// Saving to the file
	//
	//. - . - . - . - . - . - . - . - . - . - . - . - . - . -

	/**
	 * @param string
	 */
	private void openOutputFile(String outputFileName) {

		try {
			setOutputStream(new BufferedWriter(new FileWriter(outputFileName)));

			String header = "Version" + ","+
					"StudentID" + "," +
					"Student Prior" + "," +
					"Action Type" + "," +
					"Action ID" + "," +
					"OUTCOME" + "," +
					"Action Quality" + "," +
					"Previous page" +"," +
//					"Previous contentsHistVector" +"," +
//					"Previous probCorrect" +"," +
					"Current page" +"," +
//					"Later contentxHistVector" +"," +
					"Later probCorrect" +"\n";

			getOutputStream().write(header);

		} catch (IOException e) {
			e.printStackTrace();
		}


	}

	/**
	 * @param studentID
	 * @param actionType
	 * @param actionName
	 * @param outcome
	 * @param actionQuality
	 */
	private void saveAction(int studentID, ActionType actionType, String actionName, /*Double probCorrectPrivious,*/ Double probCorrectLater,/*ContentsVector contentsVector,*/Integer pagenumberPrivious,Integer pagenumber,String outcome, String actionQuality) {
		String transaction = VERSION + "," +
				studentID + "," +
				(isHighCompetentStudent(studentID) ? "Good" : "Poor") + "," +
				actionType + "," +
				actionName + "," +
				outcome + "," +
				actionQuality + "," +
				pagenumberPrivious+ "," +
//				contentsVector.previous+ "," +
//				probCorrectPrivious+ "," +
				pagenumber+ "," +
//				contentsVector.later+ "," +
				probCorrectLater;

		System.out.println(transaction);
		try {
			getOutputStream().write(transaction + "\n");
		} catch (IOException e) {
			e.printStackTrace();
		}

	}


	// - - - - - - - - - -
	// Helper methods
	// - - - - - - - - - -


	/**
	 *  set version data
	 */

	private void setVersion(int version) {
		VERSION = version;
	}
	/**
	 *  Initialize this.probabilityCorrect
	 */
	private void initializeCompetenceLogit() {

		for (int i = 0; i < NUM_STUDENTS; i++) {
			this.competenceLogit[i] = isHighCompetentStudent(i) ? INIT_LOGIT_HIGH : INIT_LOGIT_LOW;
		}
	}

	/**
	 * Initialize contentsHistVector to 0 (not watched)
	 */
//	private void initializecontentsHistVector() {
//
//		for(int i=1;i<9;i++) {
//			String tmpIndex = INDEX_FILLER + i;
//			String index = tmpIndex.substring(tmpIndex.length()-NUM_ACTION_INDEX,tmpIndex.length());
//
//			String actionstr = "VIDEO";
//			contentsHistVector.put(actionstr+index, 0);
//			actionstr = "QUIZ";
//			contentsHistVector.put(actionstr+index, 0);
//
//		}
//	}
	
	/**
	 * List all actions 
	 */
	
	private void createContents() {  
		for(int i = 0; i < NUM_VIDEO_ACTION; i++ ) {
			int j = i+1;
			String index = String.format("%04d",j);
			String action = "Video" +  index;
			this.videoList.add(action);
		}
		for(int i = 0 ; i < NUM_QUIZ_ACTION; i++) {
			int j = i+1;
			String index = String.format("%04d",j);
			String action = "Quiz" +  index;
			this.quizList.add(action);
		}
		
		System.out.println(this.videoList);
		System.out.println(this.quizList);
	}
	
	
	/**
	 *  assign contents(VIDEO|QUIZ) to each page.
	 *  PAGECONTENTS{pagenumber} -> {num_video_inpage,num_quiz_inpage,VIDEOID,VIDEOID,..,QUIZID,QUIZID,....}
	 *  TEMPrally manually assign contents
	 */

//	private void setContentsInPages() {
//
//		//Manually put the contents data
//		//TODO Randomly assign contents to the pages.
//		ArrayList<String> values = new ArrayList<>();
//		Collections.addAll(values, new String[]{"3", "2", "Video0001","Video0005","Video0008","Quiz0003","Quiz0005"});
//		PAGECONTENTS.put(0, values);
//
//
//		ArrayList<String> values1=new ArrayList<>();
//		Collections.addAll(values1, new String[]{"3","3","Video0002","Video0004","Video0007","Quiz0001","Quiz0002","Quiz0008"});
//		PAGECONTENTS.put(1, values1);
//
//		ArrayList<String> values2 =new ArrayList<>();
//		Collections.addAll(values2, new String[] {"2","3","Video0003","Video0006","Quiz0004","Quiz0006","Quiz0007"});
//		PAGECONTENTS.put(2, values2);
//
//
//	}
	
	/*
	 * set Quiz and Video to each page
	 */
	private void setContentsInpage() {
		int numVideoInPage = this.NUM_VIDEO_ACTION / this.NUM_PAGES;
		int numQuizinPage =  this.NUM_QUIZ_ACTION / this.NUM_PAGES;
		
		ArrayList<String> contentsList = new ArrayList<>();
		ArrayList<String> shuffleVideo = this.videoList;
		ArrayList<String> shuffleQuiz = this.quizList;
		
		Collections.shuffle(shuffleVideo);
		Collections.shuffle(shuffleQuiz);
		
	
		for(int page = 0 ; page< NUM_PAGES;page++) {
			ArrayList<String> empty = new ArrayList<String>();
			this.PAGECONTENTS.put(page,empty);
			
			for(int j = (page*numVideoInPage) ; j < (page*numVideoInPage) + numVideoInPage ; j++) {
//				contentsList.add(shuffleVideo.get(j));
//				
				this.PAGECONTENTS.get(page).add(shuffleVideo.get(j));
//				this.PAGECONTENTS.put(page, shuffleVideo.get(j));
				
			}
			for(int j = (page*numQuizinPage); j < (page*numQuizinPage)+numQuizinPage ; j++) {
//				contentsList.add(shuffleQuiz.get(j));
				this.PAGECONTENTS.get(page).add(shuffleQuiz.get(j));
				
			}
			System.out.println(page);
			
		}
		
		System.out.println(this.PAGECONTENTS);
		
	}
	
	/**
	 * deep copy method
	 */
	public ArrayList<String> copy(ArrayList<String> contentsList){
		try {
			ArrayList<String> deepCopy = new ArrayList<String>();
		    for (Object obj : contentsList)
		       deepCopy.add(obj.clone());
		    return deepCopy;
		}catch (CloneNotSupportedException e ){
			return null;
			}
      }

	/**
	 * set this.logit_increase ...parameters
	 */
	public void setparameters(
			double a, double b, double c,double d,double e, double f,double g, double h,double i,double j, double k, double l, 
			int m, int n,int o,int p , int q, int r, int s, double t, double u, double v) 
	{
		this.LOGIT_INCREASE_QUIZ_FOR_HIGH_COMPETENT = a;
		this.LOGIT_INCREASE_QUIZ_FOR_LOW_COMPETENT = b ;
		this.LOGIT_INCREASE_VIDEO_HIGH_FOR_HIGH_COMPETENT = c ;
		this.LOGIT_INCREASE_VIDEO_HIGH_FOR_LOW_COMPETENT = d;
		this.LOGIT_INCREASE_VIDEO_LOW_FOR_HIGH_COMPETENT = e;
		this.LOGIT_INCREASE_VIDEO_LOW_FOR_LOW_COMPETENT = f;
		this.LOGIT_INCREASE_HINT_HIGH_FOR_HIGH_COMPETENT = g;
		this.LOGIT_INCREASE_HINT_HIGH_FOR_LOW_COMPETENT = h;
		this.LOGIT_INCREASE_HINT_LOW_FOR_HIGH_COMPETENT = i;
		this.LOGIT_INCREASE_HINT_LOW_FOR_LOW_COMPETENT = j;
		this.INIT_LOGIT_HIGH = k;
		this.INIT_LOGIT_LOW = l;
		this.NUM_PAGES = m;
		this.NUM_VIDEO_ACTION = n;
		this.NUM_QUIZ_ACTION = o ;
		this.MIN_NUM_TRANSACTION_INPAGE = p;
		this.MAX_NUM_TRANSACTION_INPAGE = q;
		this.MIN_NUM_TRANSACTION_ASWHOLE = r;
		this.MAX_NUM_TRANSACTION_ASWHOLE = s;
		this.VIDEO_ACTION_QUALITY_RATIO = t;
		this.HINT_ACTION_QUALITY_RATIO = u;
		this.QUIZ_ACTION_QUALITY_RATIO = v;
		
		if(this.NUM_VIDEO_ACTION % this.NUM_PAGES != 0 || this.NUM_QUIZ_ACTION % this.NUM_PAGES != 0) {
			System.out.println("Parameter Error. Num video and Quiz should be devided by numPages ");
			System.exit(0);
		}
//		if(this.MIN_NUM_TRANSACTION_ASWHOLE < this.MIN_NUM_TRANSACTION_INPAGE * this.NUM_PAGES) {
//			System.out.println("minimum number of transaction through a course must be bigger than or equal to the nimimub number of transaction in a page ");
//			System.exit(0);
//		}
//		if(this.MAX_NUM_TRANSACTION_ASWHOLE > this.MAX_NUM_TRANSACTION_INPAGE * this.NUM_PAGES) {
//			System.out.println("Max number of transaction through a course must be  ");
//		}
		System.out.println(this.INIT_LOGIT_HIGH);
	}



	/**
	 *  Returns, based on pre-defined ration of high competent students, if the given 'studentID' is
	 *  for a high-competent student.  We assume that the first n students are high competent students.
	 */
	private boolean isHighCompetentStudent(int studentID) {
		return studentID < NUM_STUDENTS * HIGH_COMPETENT_STUDENT_RATIO;
	}

	/**
	 * Update the competenceLogit[] for the student with 'studentID' after
	 * taking an action of the type 'actionType' that has the quality 'actionQuality'.
	 * The 'outcome' shows the correctness of the quiz taken if the actionType is QUIZ
	 */
	private void updateStudentCompetency(int studentID, ActionType actionType, String actionQuality, String outcome) {


		double delta = 0.0;
		
		if(actionType == ActionType.QUIZ) {
			if (isHighCompetentStudent(studentID)) {
				delta = LOGIT_INCREASE_QUIZ_FOR_HIGH_COMPETENT;
			} else {
				delta = LOGIT_INCREASE_QUIZ_FOR_LOW_COMPETENT;
			}
		}
		else if(actionType == ActionType.VIDEO){
			if (actionQuality.equals(HIGH_QUALITY)) {
				if (isHighCompetentStudent(studentID)) {
					delta = LOGIT_INCREASE_VIDEO_HIGH_FOR_HIGH_COMPETENT;
				} else {
					delta = LOGIT_INCREASE_VIDEO_HIGH_FOR_LOW_COMPETENT;
				}
			} else
				if (isHighCompetentStudent(studentID)) {
					delta = LOGIT_INCREASE_VIDEO_LOW_FOR_HIGH_COMPETENT;
				} else {
					delta = LOGIT_INCREASE_VIDEO_LOW_FOR_LOW_COMPETENT;
				}
		}
		else if(actionType == ActionType.HINT) {
			if (actionQuality.equals(HIGH_QUALITY)) {
				if (isHighCompetentStudent(studentID)) {
					delta = LOGIT_INCREASE_HINT_HIGH_FOR_HIGH_COMPETENT;
				} else {
					delta = LOGIT_INCREASE_HINT_HIGH_FOR_LOW_COMPETENT;
				}
			} else
				if (isHighCompetentStudent(studentID)) {
					delta = LOGIT_INCREASE_HINT_LOW_FOR_HIGH_COMPETENT;
				} else {
					delta = LOGIT_INCREASE_HINT_LOW_FOR_LOW_COMPETENT;
				}
		}
		this.competenceLogit[studentID] += delta;
	}

	/**
	 *  Returns the probability of answering a quiz correctly for a student with the given competence logit
	 *  using the Sigmoid model
	 */
	private double probabilityCorrect(int studentID) {

		double logit = this.competenceLogit[studentID];
		return 1 / (1 + Math.exp(-1 * logit));
	}

	/**
	 *  The ratio of high-quality action content (e.g., video) to the low-quality is given a priori.
	 *
	 */
	private double getActionQualityRatio(ActionType actionType) {

		double actionQualityRatio = 0.0;

		switch (actionType) {
		case VIDEO:
			actionQualityRatio = VIDEO_ACTION_QUALITY_RATIO;
			break;
		case QUIZ:
			actionQualityRatio = QUIZ_ACTION_QUALITY_RATIO;
		case HINT:
			actionQualityRatio = HINT_ACTION_QUALITY_RATIO;
		}

		return actionQualityRatio;
	}

	/**
	 *  Randomly returns an int between 0 (inclusive) to 'max' exclusive
	 */
	private int genRandomNum(int max) {
		Random rand = new Random();
		return rand.nextInt(max);
	}

	private int genRandomNum(int min, int max) {

		int rand = Integer.MIN_VALUE;

		while (rand < min) {
			rand = genRandomNum(max);
		}

		return rand;
	}

	/**
	 * Randomly return int except for 'target'
	 */
	private int genRandomNum(int min,int max,int target) {
		int rand = genRandomNum(min,max);
//		int rand = Integer.MIN_VALUE;

		while(rand == target) {
			rand = genRandomNum(min, max);
		}
		return rand;

	}

	/**
	 *  Randomly returns true OR false
	 *
	 */

	private boolean genRandomBoolean() {
		  Random random = new Random();
		  return random.nextBoolean();

	}





	// - - - - - - - - - -
	// Getter & Setter
	// - - - - - - - - - -

	private BufferedWriter getOutputStream() {

		return this.outputStream;
	}

	private void setOutputStream(BufferedWriter bufferedWriter) {
		this.outputStream = bufferedWriter;

	}


}
