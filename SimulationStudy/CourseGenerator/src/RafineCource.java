

import java.awt.Desktop.Action;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
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
	private int NUM_STUDENTS = 10000;

	// Ratio of high to low competent students
	//
	private double HIGH_COMPETENT_STUDENT_RATIO = 0.75;

	//Number of the pages
	//
	private int NUM_PAGES = 3;

	//The min(inclusive ) and max (inclusive) Number of contents in each page
	//
	private int MIN_NUM_VIDEO_INPAGE= 2;
	private int MAX_NUM_VIDEO_INPAGE = 4;
	private int MIN_NUM_QUIZ_INPAGE = 1;
	private int MAX_NUM_QUIZ_INPAGE = 3;

	//The min (inclusive) and max (exclusive)　number of transaction in a page
	private int MIN_NUM_TRANSACTION_INPAGE = MIN_NUM_VIDEO_INPAGE + MIN_NUM_QUIZ_INPAGE;
	private int MAX_NUM_TRANSACTION_INPAGE = MAX_NUM_VIDEO_INPAGE + MAX_NUM_QUIZ_INPAGE;

	//The min (inclusive) and max (exclusive)　number of transaction in  a whole cource
	private int MIN_NUM_TRANSACTION_ASWHOLE = 10;
	private int MAX_NUM_TRANSACTION_ASWHOLE = 15;


	//The ratio of high-quality action contents for each type
	//
	private double VIDEO_ACTION_QUALITY_RATIO=0.70;
	private double QUIZ_ACTION_QUALITY_RATIO=0.70;

	// Initial probability of students with high and low competence answering a quiz correctly
	//
	private double INIT_LOGIT_HIGH=-0.85;
	private double INIT_LOGIT_LOW=-1.4;

	private double LOGIT_INCREASE_HIGH_QUALITY_FOR_HIGH_COMPETENT=0.20;
	private double LOGIT_INCREASE_HIGH_QUALITY_FOR_LOW_COMPETENT=0.15;
	private double LOGIT_INCREASE_LOW_QUALITY_FOR_HIGH_COMPETENT=0.03;
	private double LOGIT_INCREASE_LOW_QUALITY_FOR_LOW_COMPETENT=0.001;

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

	// 'contentsHistVector' shows what contents the student watched.
	// contentsHistVector{pagenumber} -> 0(not watched) OR 1 (watched)
//	private HashMap<String, Integer> contentsHistVector;



	// - - - - - - - - - -
	// Constructor
	// - - - - - - - - - -

	public RafineCource(/*double a, double b, double c,double d,double e,double f*/int version) {


		// set Contents in pages
		setContentsInPages();

		//this.LOGIT_INCREASE ant INIT_LIGIT parameters are initialized
//		setparameters(a,b,c,d,e,f);

		setVersion(version);

		// this.probabilityCorrect must be initialized
		initializeCompetenceLogit();


	}



	public static void main(String[] argv) {
		String filename = argv[0];
		int version = Integer.parseInt(argv[1]);
		
		new RafineCource(/*a, b, c, d, e, f*/version).run(filename);
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

		// select which action to take in the current page.
		int index = selectIndex(pageNumber);

		//'actionName' shows a unique ID for the action taken
		String actionName = GetActionName(pageNumber,index);

		// 'actionType' is either {VIDEO|QUIZ}
		ActionType actionType = GetActionType(actionName);

		// 'actionQuality' is either high or low showing the quality of the action taken
		// actionQuality for actions in a policy tend to have high quality
		String actionQuality = lookupActionQuality(actionType,actionName);

		String outcome = "n/a";

		if(actionType == ActionType.QUIZ) {
			// The correctness of the quiz, i.e., outcome, is a function of the student.
			// I.e., a good student is more likely make it correct
			outcome = spinOutcome(studentID);
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

//		int numActions = getNumDifferentActions(actionType);
		int numActions = 8;

		String actionQuality = indexValue < numActions * qualityRatio ? HIGH_QUALITY : LOW_QUALITY;

		return actionQuality;
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
		int index = genRandomNum(2, PAGECONTENTS.get(pagenumber).size());
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
	
	private void createContnets() {
		for(int i = 0; i < NUM_VIDEO_ACTION; i++ ) {
			
			
		}
	}
	
	
	/**
	 *  assign contents(VIDEO|QUIZ) to each page.
	 *  PAGECONTENTS{pagenumber} -> {num_video_inpage,num_quiz_inpage,VIDEOID,VIDEOID,..,QUIZID,QUIZID,....}
	 *  TEMPrally manually assign contents
	 */

	private void setContentsInPages() {

		//Manually put the contents data
		//TODO Randomly assign contents to the pages.
		ArrayList<String> values = new ArrayList<>();
		Collections.addAll(values, new String[]{"3", "2", "Video0001","Video0005","Video0008","Quiz0003","Quiz0005"});
		PAGECONTENTS.put(0, values);


		ArrayList<String> values1=new ArrayList<>();
		Collections.addAll(values1, new String[]{"3","3","Video0002","Video0004","Video0007","Quiz0001","Quiz0002","Quiz0008"});
		PAGECONTENTS.put(1, values1);

		ArrayList<String> values2 =new ArrayList<>();
		Collections.addAll(values2, new String[] {"2","3","Video0003","Video0006","Quiz0004","Quiz0006","Quiz0007"});
		PAGECONTENTS.put(2, values2);


	}
	
	private void setContentsInpages_random() {
		int page = genRandomNum(NUM_PAGES);
		for (allcontnets) {
			
		}
		
		
		
		
		
		
	}

	/**
	 * set this.logit_increase ...parameters
	 */
	public void setparameters(double a, double b, double c,double d,double e, double f,int g, int h,int i,int j, int k, int l, int m, double n,double o ) {
		this.LOGIT_INCREASE_HIGH_QUALITY_FOR_HIGH_COMPETENT = a;
		this.LOGIT_INCREASE_HIGH_QUALITY_FOR_LOW_COMPETENT = b;
		this.LOGIT_INCREASE_LOW_QUALITY_FOR_HIGH_COMPETENT = c;
		this.LOGIT_INCREASE_LOW_QUALITY_FOR_LOW_COMPETENT = d;
		this.INIT_LOGIT_HIGH = e;
		this.INIT_LOGIT_LOW = f;
		this.NUM_PAGES = g;
		this.MIN_NUM_VIDEO_INPAGE = h;
		this.MAX_NUM_VIDEO_INPAGE = i;
		this.MIN_NUM_QUIZ_INPAGE = j;
		this.MAX_NUM_QUIZ_INPAGE = k;
		this.MIN_NUM_TRANSACTION_ASWHOLE = l;
		this.MAX_NUM_TRANSACTION_ASWHOLE = m;
		this.VIDEO_ACTION_QUALITY_RATIO = n;
		this.QUIZ_ACTION_QUALITY_RATIO = o;
	
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

		if (actionQuality.equals(HIGH_QUALITY)) {
			if (isHighCompetentStudent(studentID)) {
				delta = LOGIT_INCREASE_HIGH_QUALITY_FOR_HIGH_COMPETENT;
			} else {
				delta = LOGIT_INCREASE_HIGH_QUALITY_FOR_LOW_COMPETENT;
			}
		} else
			if (isHighCompetentStudent(studentID)) {
				delta = LOGIT_INCREASE_LOW_QUALITY_FOR_HIGH_COMPETENT;
			} else {
				delta = LOGIT_INCREASE_LOW_QUALITY_FOR_LOW_COMPETENT;
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
