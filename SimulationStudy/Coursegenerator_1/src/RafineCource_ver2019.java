

import java.awt.Desktop.Action;
import java.awt.JobAttributes.DefaultSelectionType;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Random;

import javax.xml.ws.AsyncHandler;



/*
*Argument: outputfilename(string.csv) version(int)
*/



public class RafineCource_ver2019 {

	//.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
	//User Custom fields :: Change accordingly
	//.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-

	//Number of the students taking the cource
	private int NUM_STUDENTS = 1000;

	// Ratio of high to low competent students
	//

	private double STUDENT_RANK0_RATIO;
	private double STUDENT_RANK1_RATIO;
	private double STUDENT_RANK2_RATIO;
	private double STUDENT_RANK3_RATIO;
	private double STUDENT_RANK4_RATIO;


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

	private double QUIZ_ACTION_QUALITY_RATIO=0.70;

	private double VIDEO_RANK0_RATIO;
	private double VIDEO_RANK1_RATIO;
	private double VIDEO_RANK2_RATIO;
	private double VIDEO_RANK3_RATIO;
	private double VIDEO_RANK4_RATIO;

	private double QUIZ_RANK0_RATIO = 0.5;
	private double QUIZ_RANK1_RATIO = 0;
	private double QUIZ_RANK2_RATIO = 0;
	private double QUIZ_RANK3_RATIO = 0;
	private double QUIZ_RANK4_RATIO = 0.5;


	private double HINT_RANK0_RATIO;
	private double HINT_RANK1_RATIO;
	private double HINT_RANK2_RATIO;
	private double HINT_RANK3_RATIO;
	private double HINT_RANK4_RATIO;

//	Random seed to shuffle the assignment of contents on each page
	private int SEED_V;
	private int SEED_Q;


	// Initial probability of students with high and low competence answering a quiz correctly
	//
	private double INIT_LOGIT_HIGH=-0.85;

	private double INIT_LOGIT_HIGHEST = -0.85;
	private double INIT_LOGIT_INTERVAL = 0.1;

	private double LOGIT_INCREASE_CORRECT_HIGHEST=0.20;
	private double LOGIT_INCREASE_CORRECT_FOR_LOW_COMPETENT=0.15;
	private double LOGIT_INCREASE_INCORRECT_HIGHEST=0.03;
	private double LOGIT_INCREASE_INCORRECT_FOR_LOW_COMPETENT=0.001;



	private double LOGIT_INCREASE_HIGHEST;
	private double LOGIT_INCREASE_INTERVAL_RANK;
	private double LOGIT_INCREASE_INTERVAL_COMPETENCY;

	//mean and standard diviaiton(SD)
	//
	private double MEAN_INITIALLOGIT;
	private double SD_INITIALLOGIT;
	private double MEAN_INCREASE;
	private double SD_INCREASE;
	private double MEAN_CORRECT;
	private double SD_CORRECT;
	private double MEAN_INCORRECT;
	private double SD_INCORRECT;

	private double[] STUDENTPOTENTIAL = new double[NUM_STUDENTS];



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

	//Probability of answering a quiz correctly for each student

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

	public RafineCource_ver2019(
			double mean_increase, double sd_increase, double mean_correct,
			double intval_r, double mean_incorrect,
			double mean_initial_logit, double sd_initial_logit,
			int pages, int videos,int quiz,int xact_minPage , int xact_maxPage, int xact_minTotal, int xact_maxTotal,
			double v_r0, double v_r1,double v_r2,double v_r3, double v_r4,
			double h_r0, double h_r1, double h_r2,double h_r3,double h_r4,
			double s_r0, double s_r1, double s_r2,double s_r3,double s_r4,
			int seed_v, int seed_q, int version,
			double sd_correct, double sd_incorrect)
	{

		//this.LOGIT_INCREASE ant INIT_LIGIT parameters are initialized
		setparameters(mean_increase,sd_increase,mean_correct,
				intval_r,mean_incorrect,
				mean_initial_logit,sd_initial_logit,
				pages,videos,quiz,xact_minPage,xact_maxPage, xact_minTotal,xact_maxTotal,
				v_r0,v_r1,v_r2,v_r3, v_r4,
				h_r0, h_r1,h_r2, h_r3, h_r4,
				s_r0,s_r1,s_r2,s_r3,s_r4,
				seed_v,seed_q,sd_correct,sd_incorrect);
		
		
		

		//Create Contents
		createContents();

		// set Contents in pages
		setContentsInpage();

		//set Version
		setVersion(version);


		//this.STUDENTPOTENTILA must be initilized
		setStudentPotential();

		// this.probabilityCorrect must be initialized according to the STUDENTPOTNENTIAL
		initializeCompetenceLogit();


	}



	public static void main(String[] argv) {
		String filename = argv[0];
		int version = Integer.parseInt(argv[1]);

		//see setparameters() for each arguments
		double mean_increase = Double.parseDouble(argv[2]);
		double sd_increase = Double.parseDouble(argv[3]);
		double mean_correct = Double.parseDouble(argv[4]);
		double intval_r = Double.parseDouble(argv[5]);
		double mean_incorrect = Double.parseDouble(argv[6]);
		double mean_initial_logit = Double.parseDouble(argv[7]);
		double sd_initial_logit = Double.parseDouble(argv[8]);
		int pages = Integer.parseInt(argv[9]);
		int videos = Integer.parseInt(argv[10]);
		int quiz = Integer.parseInt(argv[11]);
		int xact_minPage = Integer.parseInt(argv[12]);
		int xact_maxPage = Integer.parseInt(argv[13]);
		int xact_minTotal = Integer.parseInt(argv[14]);
		int xact_maxTotal = Integer.parseInt(argv[15]);
		double v_r0 = Double.parseDouble(argv[16]);
		double v_r1 = Double.parseDouble(argv[17]);
		double v_r2 = Double.parseDouble(argv[18]);
		double v_r3 = Double.parseDouble(argv[19]);
		double v_r4 = Double.parseDouble(argv[20]);
		double h_r0 = Double.parseDouble(argv[21]);
		double h_r1 = Double.parseDouble(argv[22]);
		double h_r2 = Double.parseDouble(argv[23]);
		double h_r3 = Double.parseDouble(argv[24]);
		double h_r4 = Double.parseDouble(argv[25]);
		double s_r0 = Double.parseDouble(argv[26]);
		double s_r1 = Double.parseDouble(argv[27]);
		double s_r2 = Double.parseDouble(argv[28]);
		double s_r3 = Double.parseDouble(argv[29]);
		double s_r4 = Double.parseDouble(argv[30]);
		int seed_v = Integer.parseInt(argv[31]);
		int seed_q = Integer.parseInt(argv[32]);
		double sd_correct =  Double.parseDouble(argv[33]);
		double sd_incorrect =  Double.parseDouble(argv[34]);
		

		new RafineCource_ver2019(mean_increase,sd_increase,mean_correct,intval_r,mean_incorrect,mean_initial_logit, sd_initial_logit,
				pages, videos,quiz,xact_minPage,xact_maxPage, xact_minTotal,xact_maxTotal,
				v_r0, v_r1,v_r2, v_r3,v_r4,h_r0, h_r1,h_r2, h_r3,h_r4,s_r0,s_r1,s_r2, s_r3,s_r4,
				seed_v,seed_q,
				version,
				sd_correct,sd_incorrect
				).run(filename);
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
		int pageNumberPrevious = 0;
		int numTransaction = genRandomNum(MIN_NUM_TRANSACTION_ASWHOLE, MAX_NUM_TRANSACTION_ASWHOLE);
		int num = 0;

		this.QuizFailed = false;



		String actionName;


		for(int j = 0; j< numTransaction;j++) {
			num = genRandomNum(99);
//			System.out.println(num);


			if(QuizFailed) {//when quiz answered incorrectly or show hint

				String actionID = this.lastQuizFailed.substring(this.lastQuizFailed.length()-NUM_ACTION_INDEX);

				if(num < 78) {//try same quiz again
					pageNumberPrevious = pageNumber;
					actionName = "Quiz" + actionID;
				}
				else if (78 <= num && num < 98) {//take associated hint
					pageNumberPrevious = pageNumber;
					actionName = "Hint" + actionID;
				}
				else if(98 == num) {//take OTHER quiz
					//page transition or not transition
					pageNumberPrevious = pageNumber;
					pageNumber = selectPage(pageNumber);

					//select action on the page
					int idx = selectIndex(pageNumber);
					actionName = GetActionName(pageNumber, idx);
					while (GetActionType(actionName) != ActionType.QUIZ && actionName == "Quiz" + actionID) {
						idx = selectIndex(pageNumber);
						actionName = GetActionName(pageNumber, idx);
					}
				}
				else {//watch video
					pageNumberPrevious = pageNumber;
					pageNumber = selectPage(pageNumber);
					int idx = selectIndex(pageNumber);
					actionName = GetActionName(pageNumber, idx);
					while (GetActionType(actionName) != ActionType.VIDEO) {
						idx = selectIndex(pageNumber);
						actionName = GetActionName(pageNumber, idx);
					}
				}
			}//if not QUIZFAILED

			else {//when Quiz answered correctly or watched video
				pageNumberPrevious = pageNumber;
				pageNumber = selectPage(pageNumberPrevious);

				int idx = selectIndex(pageNumber);
				actionName = GetActionName(pageNumber, idx);

				if(num < 50) {//watch video
					while (GetActionType(actionName) != ActionType.VIDEO) {
						idx = selectIndex(pageNumber);
						actionName = GetActionName(pageNumber, idx);
					}
				}

				else {//Take Quiz or show Hint
					while (GetActionType(actionName) != ActionType.QUIZ) {
						idx = selectIndex(pageNumber);
						actionName = GetActionName(pageNumber, idx);
					}
					if (num >= 95){//show new hint at 5% of probability
						String actionID = actionName.substring(actionName.length()-NUM_ACTION_INDEX);
						actionName = "Hint" + actionID;

					}
				}
			}//QuizFailed else

			/*
			 * Action is assigned
			 */
			genTransactionInPage(pageNumberPrevious, pageNumber, studentID,actionName);

			this.transactionInPage++;


		}//for numtransaction


	}


	/**
	 *  select page chage or not
	 */
	private int selectPage(int pageNumber) {


		if(this.transactionInPage < MIN_NUM_TRANSACTION_INPAGE) {
			return pageNumber;
		}

		if (this.transactionInPage >= MIN_NUM_TRANSACTION_INPAGE && this.transactionInPage < MAX_NUM_TRANSACTION_INPAGE) {
			//randomly returns "pagechange"(move other page) OR "pagestill(stay in the same page)"
			//true => pagechange, false- => pagestill

			Boolean move = genRandomBoolean();
			if(move) {
				//Randomly returns page number except for current page number
				pageNumber = genRandomNum(0,NUM_PAGES,pageNumber);
				this.transactionInPage = 0;
			}

		}
		//Students don't do too many contents in the same page.
		else {
			pageNumber = genRandomNum(0,NUM_PAGES,pageNumber);
			this.transactionInPage=0;
		}



		return pageNumber;
	}


	/**
	 * generate transition in the current pagenumber.
	 * @param pagenumber -> current pagenumber
	 * @param studentID -
	 */

	private void genTransactionInPage(int pageNumberPrevious,int pageNumber, int studentID,String actionName) {

		String outcome = "n/a";

		// 'actionType' is either {VIDEO|QUIZ|HINT}
		ActionType actionType = GetActionType(actionName);

		// 'actionQuality' is either high or low showing the quality of the action taken
		// actionQuality for actions in a policy tend to have high quality

		String actionQuality = lookupActionQuality(actionType,actionName);

		if(actionType == ActionType.QUIZ) {
			// The correctness of the quiz, i.e., outcome, is a function of the student.
			// I.e., a good student is more likely make it correct

			outcome = spinOutcome(studentID);
			if(outcome == "INCORRECT") {
				this.QuizFailed = true;
				this.lastQuizFailed = actionName;
			}
			else{
				this.QuizFailed = false;
			}
		}
		else if (actionType == ActionType.HINT) {
			this.QuizFailed = true;
			this.lastQuizFailed = actionName;
		}

		else {//video
			this.QuizFailed = false;
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
		saveAction(studentID,actionType,actionName,probCorrectPrivious,probCorrectLater,pageNumberPrevious,pageNumber,outcome,actionQuality);

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


//		if(actionType == ActionType.QUIZ) {
//			String actionQuality = "n/a";
//			return actionQuality;
//
//		}

		String actionQuality;
		String index = actionName.substring(actionName.length()-NUM_ACTION_INDEX);
		int indexValue = Integer.valueOf(index);

		// The ration of high quality actions in the given actionType
		double[] qualityRatio = getActionQualityRatio(actionType);

		int numActions = getNumDifferentActions(actionType);

		if(indexValue < numActions * qualityRatio[0]) {
			actionQuality = "0";
		}
		else if(indexValue >= numActions * qualityRatio[0] && indexValue < numActions * qualityRatio[1]) {
			actionQuality = "1";
		}
		else if(indexValue >= numActions * qualityRatio[1] && indexValue < numActions * qualityRatio[2]) {
			actionQuality = "2";
		}
		else if(indexValue >= numActions * qualityRatio[2] && indexValue < numActions * qualityRatio[3]) {
			actionQuality = "3";
		}
		else  {
			actionQuality = "4";
		}
		return actionQuality;


	}

	/**
	 * Retrieve number of actions of each ActionType
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
					"Current page" +"," +
//					"Later contentxHistVector" +"," +
					"Previous probCorrect" +"," +
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
	private void saveAction(int studentID, ActionType actionType, String actionName, Double probCorrectPrivious,Double probCorrectLater,Integer pagenumberPrivious,Integer pagenumber,String outcome, String actionQuality) {



		String transaction =
				this.VERSION + "," +
				studentID + "," +
				getStudentPotential(studentID) + "," +
				actionType + "," +
				actionName + "," +
				outcome + "," +
				actionQuality + "," +
				pagenumberPrivious+ "," +
				pagenumber+ "," +
				probCorrectPrivious+ "," +
				probCorrectLater;

//		System.out.println(transaction);
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
			this.competenceLogit[i] = this.STUDENTPOTENTIAL[i]*SD_INITIALLOGIT + MEAN_INITIALLOGIT;
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

//		if you want to fix the order of contents 
//		Collections.shuffle(shuffleVideo,new Random(this.SEED_V));
//		Collections.shuffle(shuffleQuiz,new Random(this.SEED_Q));
		
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
	 * set this.logit_increase ...parameters
	 */
	public void setparameters(
			double mean_increase, double sd_increase, double mean_correct,
			double intval_r, double mean_incorrect,
			double mean_initial_logit, double sd_initial_logit,
			int pages, int videos,int quiz,int xact_minPage , int xact_maxPage, int xact_minTotal, int xact_maxTotal,
			double v_r0, double v_r1,double v_r2,double v_r3, double v_r4,
			double h_r0, double h_r1, double h_r2,double h_r3,double h_r4,
			double s_r0, double s_r1, double s_r2,double s_r3,double s_r4,
			int seed_v, int seed_q,double sd_correct,double sd_incorrect
			)
	{

		this.MEAN_INCREASE =mean_increase;
		this.SD_INCREASE = sd_increase;
		this.MEAN_CORRECT = mean_correct;

		this.LOGIT_INCREASE_INTERVAL_RANK = intval_r;
		this.MEAN_INCORRECT = mean_incorrect;

		this.MEAN_INITIALLOGIT = mean_initial_logit;
		this.SD_INITIALLOGIT = sd_initial_logit;
		this.NUM_PAGES = pages;
		this.NUM_VIDEO_ACTION = videos;
		this.NUM_QUIZ_ACTION = quiz ;
		this.MIN_NUM_TRANSACTION_INPAGE = xact_minPage;
		this.MAX_NUM_TRANSACTION_INPAGE = xact_maxPage;
		this.MIN_NUM_TRANSACTION_ASWHOLE = xact_minTotal;
		this.MAX_NUM_TRANSACTION_ASWHOLE = xact_maxTotal;


		this.VIDEO_RANK0_RATIO = v_r0;
		this.VIDEO_RANK1_RATIO = v_r1;
		this.VIDEO_RANK2_RATIO = v_r2;
		this.VIDEO_RANK3_RATIO = v_r3;
		this.VIDEO_RANK4_RATIO = v_r4;

		this.HINT_RANK0_RATIO = h_r0;
		this.HINT_RANK1_RATIO = h_r1;
		this.HINT_RANK2_RATIO = h_r2;
		this.HINT_RANK3_RATIO = h_r3;
		this.HINT_RANK4_RATIO = h_r4;

		this.STUDENT_RANK0_RATIO = s_r0;
		this.STUDENT_RANK1_RATIO = s_r1;
		this.STUDENT_RANK2_RATIO = s_r2;
		this.STUDENT_RANK3_RATIO = s_r3;
		this.STUDENT_RANK4_RATIO = s_r4;

		//if you want to use the seed change setContetntsinpage()
		this.SEED_V = seed_v;
		this.SEED_Q = seed_q;
		
		this.SD_CORRECT = sd_correct;
		this.SD_INCORRECT = sd_incorrect;

//		double sum = v_r0 + v_r1+v_r3 + v_r4;
//		if(new  BigDecimal("sum")) {
//			System.out.println("Sum of ratio of each video rank must be 1");
//			double sum = v_r0 + v_r1+v_r3 + v_r4;
//			System.out.println(sum);
//			System.exit(0);
//		}
//		if(h_r0 + h_r1 + h_r2 + h_r3+h_r4 != 1.0) {
//			System.out.println("Sum of ratio of each hint rank must be 1");
//			System.exit(0);
//		}
//		if(s_r0 + s_r1 + s_r2 + s_r3+s_r4 != 1.0) {
//			System.out.println("Sum of ratio of each student compentency rank must be 1");
//			System.exit(0);
//		}
//		if(incorct_highest < 0.05) {
//			System.out.println("HIghest LOGIT increase for incorrect should be at least 0.05 ");
//			System.exit(0);
//		}
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


	private double getStudentPotential(int studentID) {

		return this.STUDENTPOTENTIAL[studentID];

	}

	private void setStudentPotential() {
		for(int i =0;i<this.NUM_STUDENTS;i++) {
			double studentPotential = genNumGaussian();
			this.STUDENTPOTENTIAL[i] = studentPotential;
		}


	}

	/**
	 * Update the competenceLogit[] for the student with 'studentID' after
	 * taking an action of the type 'actionType' that has the quality 'actionQuality'.
	 * The 'outcome' shows the correctness of the quiz taken if the actionType is QUIZ
	 */
	private void updateStudentCompetency(int studentID, ActionType actionType, String actionQuality, String outcome) {


		double delta = 0.0;

		double studentPotential = getStudentPotential(studentID);
		int qualityRank = 0;



		if(actionType == ActionType.QUIZ) {

			if(outcome == "CORRECT") {
				delta  = studentPotential* SD_CORRECT + MEAN_CORRECT;

			}
			else {
				delta =  studentPotential* SD_INCORRECT + MEAN_INCORRECT;
			}
			qualityRank = Integer.parseInt(actionQuality);

			delta += studentPotential*SD_INCREASE + MEAN_INCREASE -(qualityRank*LOGIT_INCREASE_INTERVAL_RANK);

		}

		else if(actionType == ActionType.VIDEO){
			qualityRank = Integer.parseInt(actionQuality);
//			System.out.println(actionQuality + "converted to " + qualityRank);

			delta = studentPotential*SD_INCREASE + MEAN_INCREASE -(qualityRank*LOGIT_INCREASE_INTERVAL_RANK);

//			System.out.println(delta);
		}
		else if(actionType == ActionType.HINT) {
			qualityRank = Integer.parseInt(actionQuality);

			delta = studentPotential*SD_INCREASE + MEAN_INCREASE -(qualityRank*LOGIT_INCREASE_INTERVAL_RANK);
		}

		if(delta < 0) {
			delta = 0;
		}

//		System.out.print(delta);
//		System.out.print(" ");
//
//		System.out.print(studentPotential);
//		System.out.print(" ");
//		System.out.print(qualityRank);
//		System.out.print(" ");
//		System.out.print(outcome);
//
//		System.out.println();

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
	private double[] getActionQualityRatio(ActionType actionType) {

		double[] th_list = new double[4];

		switch (actionType) {
		case VIDEO:
			th_list[0] = VIDEO_RANK0_RATIO;
			th_list[1] = th_list[0] + VIDEO_RANK1_RATIO;
			th_list[2] = th_list[1] + VIDEO_RANK2_RATIO;
			th_list[3] = th_list[2] + VIDEO_RANK3_RATIO;

			break;
		case QUIZ:
			th_list[0]  = QUIZ_RANK0_RATIO;
			th_list[1] = th_list[0] + QUIZ_RANK1_RATIO;
			th_list[2] = th_list[1] + QUIZ_RANK2_RATIO;
			th_list[3] = th_list[2] + QUIZ_RANK3_RATIO;
		case HINT:
			th_list[0] = HINT_RANK0_RATIO;
			th_list[1] = th_list[0] + HINT_RANK1_RATIO;
			th_list[2] = th_list[1] + HINT_RANK2_RATIO;
			th_list[3] = th_list[2] + HINT_RANK3_RATIO;
		}

		return th_list;
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
	 * Return randomnumber from normal distribution (mean=0, sd=1)
	 */
	private double genNumGaussian() {
		Random rnd = new Random();
		return rnd.nextGaussian();
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
