
/**
 *
 * Assumption:
 * 1. Students might increase their competence by reviewing high-quality contents more likely than
 * low-quality contents
 *
 * 2. The probability of answering quiz correctly is a function of student's competence
 *
 * 3. For students with average learning ability, getting exposed to 10 instructional
 * contents (video and pageview) will make the student reach to the mastery level
 *
 * 4. Mastery level, by definition, is to reach at 90% probability correct, which is 2.2 on the logit axis
 *
 * 5. High competent students starts at 0.0 logit (50% probability correct), which logically implies
 * (from 3 and 4) that for each exposure to a high-quality content, the logit increases by 0.22
 *
 * 6. Low competent students is half as slow as high competent students, i.e., the logit increase per
 * an exposure to the instructional content is 0.11
 *
 * 7. A single exposure to low-quality content for high-competent students will increase the logit by 0.05
 * (half of high-quality content increase for low-competent students).   The same for low-competent students
 * will be 0.025.
 *
 *
 * Created: Jan 19, 2018 8:09:29 PM
 * @author mazda
 *
 */

import java.io.BufferedWriter;

import java.io.FileWriter;
import java.io.IOException;
import java.util.Random;


public class RafineDataGenerator {

	// .-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
	// User custom fields :: Change accordingly
	// .-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-

	// Number of the students taking the course
	//
	private int NUM_STUDENTS = 100;

	// Ratio of high to low competent students
	//
	private double HIGH_COMPETENT_STUDENT_RATIO = 0.75;

	// The min (inclusive) and max (exclusive) number of transactions per student
	private int MIN_NUM_TRANSACTION = 15;
	private int MAX_NUM_TRANSACTION = 30;

	// Number of different actions (e.g., different videos to watch) in each action category
	//
	private int NUM_VIDEO_ACTION = 20;
	private int NUM_PAGEVIEW_ACTION = 20;
	private int NUM_QUIZ_ACTION = 10;

	// Ratio of high-quality action contents for each type
	//
	private double QUIZ_ACTION_QUALITY_RATIO = 0.70;
	private double PAGEVIEW_ACTION_QUALITY_RATIO = 0.70;
	private double VIDEO_ACTION_QUALITY_RATIO = 0.70;

	// Initial probability of students with high and low competence answering a quiz correctly
	//
	private double INIT_LOGIT_HIGH=-0.85;
	private double INIT_LOGIT_LOW=-1.4;

	private double LOGIT_INCREASE_HIGH_QUALITY_FOR_HIGH_COMPETENT=0.20;
	private double LOGIT_INCREASE_HIGH_QUALITY_FOR_LOW_COMPETENT=0.05;
	private double LOGIT_INCREASE_LOW_QUALITY_FOR_HIGH_COMPETENT=0.03;
	private double LOGIT_INCREASE_LOW_QUALITY_FOR_LOW_COMPETENT=0.001;


	// .-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
	// System fields :: Don't change
	// .-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-

	// The number digits used in the name of an action (e.g., Video007)
	private int NUM_ACTION_INDEX = 4;
	private String INDEX_FILLER = "0000";

	private String HIGH_QUALITY = "High";
	private String LOW_QUALITY = "Low";

	// Probability of answering a quiz correctly for each student
	private double[] competenceLogit = new double[NUM_STUDENTS];

	// File to output the transactions
	private BufferedWriter outputStream;

	// - - - - - - - - - -
	// Constructor
	// - - - - - - - - - -

	public RafineDataGenerator(double a, double b, double c,double d,double e,double f) {
		//this.LOGIT_INCREASE parameters are initialized
		setparameters(a,b,c,d,e,f);
		// this.probabilityCorrect must be initialized
		initializeCompetenceLogit();

	}

	public static void main(String[] argv) {
		//filename is a text filename
		String filename = argv[0];
		double a = Double.parseDouble(argv[1]);
		double b = Double.parseDouble(argv[2]);
		double c = Double.parseDouble(argv[3]);
		double d = Double.parseDouble(argv[4]);
		double e = Double.parseDouble(argv[5]);
		double f = Double.parseDouble(argv[6]);
//
//
		new RafineDataGenerator(a,b,c,d,e,f).run(filename);
		// new RafineDataGenerator().run(filename);

		 System.out.println("parameters set");

	}



	// - - - - - - - - - -
	// Methods
	// - - - - - - - - - -

	public void run(String filename) {

		// Open output file
		openOutputFile(filename);

		for (int studentID = 0; studentID < NUM_STUDENTS; studentID++) {

			int numTransaction = genRandomNum(MIN_NUM_TRANSACTION, MAX_NUM_TRANSACTION);
			for (int i = 0; i < numTransaction; i++) {
				genTransaction(studentID);
			}
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

		// 'actionType' is either {VIDEO|PAGEVIEW|QUIZ}
		ActionType actionType = spinActionType();
		// 'action' shows a unique ID for the action taken
		String actionName = spinAction(actionType);
		// 'actionQuality' is either high or low showing the quality of the action taken
		// actionQuality for actions in a policy tend to have high quality
		String actionQuality = lookupActionQuality(actionType, actionName);

		String outcome = "n/a";
		if (actionType == ActionType.QUIZ) {
			// The correctness of the quiz, i.e., outcome, is a function of the student.
			// I.e., a good student is more likely make it correct
			outcome = spinOutcome(studentID);
		}

		// Output an action transaction to the file
		saveAction(studentID, actionType, actionName, outcome, actionQuality);

		// The student might have learned from the action taken hence increased competence
		updateStudentCompetency(studentID, actionType, actionQuality, outcome);
	}

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
	 *  Randomly returns a name of the action in the category of actionType.
	 *  The name consists of actionType (e.g., "Quiz") followed by a three-digits number (e.g., "003")
	 */
	private String spinAction(ActionType actionType) {

		int diceFace = genRandomNum(getNumDifferentActions(actionType));
		String tmpIndex = INDEX_FILLER + diceFace;
		String index = tmpIndex.substring(tmpIndex.length()-NUM_ACTION_INDEX, tmpIndex.length());

		String actionStr = actionType.getLabel();

		return actionStr + index;
	}

	/**
	 *  Randomly returns an actionType based on the given distribution of action type
	 */
	private ActionType spinActionType() {

		int diceFace = genRandomNum(ActionType.values().length);
		return ActionType.values()[diceFace];
	}

	// . - . - . - . - . - . - . - . - . - . - . - . - . - . -
	// Saving to the file
	//
	//

	/**
	 * @param string
	 */
	private void openOutputFile(String outputFileName) {

		try {
			setOutputStream(new BufferedWriter(new FileWriter(outputFileName)));

			String header = "StudentID" + "\t" +
					"Student Prior" + "\t" +
					"Action Type" + "\t" +
					"Action ID" + "\t" +
					"OUTCOME" + "\t" +
					"Action Quality" + "\t" +
					"Prob Correct" + "\n";

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
	private void saveAction(int studentID, ActionType actionType, String actionName, String outcome, String actionQuality) {

		String transaction = studentID + "\t" +
				(isHighCompetentStudent(studentID) ? "Good" : "Poor") + "\t" +
				actionType + "\t" +
				actionName + "\t" +
				outcome + "\t" +
				actionQuality + "\t" +
				probabilityCorrect(studentID);

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
	 *  Initialize this.probabilityCorrect
	 */
	private void initializeCompetenceLogit() {

		for (int i = 0; i < NUM_STUDENTS; i++) {
			this.competenceLogit[i] = isHighCompetentStudent(i) ? INIT_LOGIT_HIGH : INIT_LOGIT_LOW;
		}
	}

	/*
	 * set this.logit_increase ...parameters
	 */
	public void setparameters(double a, double b, double c,double d,double e, double f) {
		this.LOGIT_INCREASE_HIGH_QUALITY_FOR_HIGH_COMPETENT = a;
		this.LOGIT_INCREASE_HIGH_QUALITY_FOR_LOW_COMPETENT = b;
		this.LOGIT_INCREASE_LOW_QUALITY_FOR_HIGH_COMPETENT = c;
		this.LOGIT_INCREASE_LOW_QUALITY_FOR_LOW_COMPETENT = d;
		this.INIT_LOGIT_HIGH = e;
		this.INIT_LOGIT_LOW = f;
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
		case PAGE:
			actionQualityRatio = PAGEVIEW_ACTION_QUALITY_RATIO;
			break;
		case QUIZ:
			actionQualityRatio = QUIZ_ACTION_QUALITY_RATIO;
		}

		return actionQualityRatio;
	}

	/**
	 *  Returns a pre-defined number of different actions within the given actionType
	 */
	private int getNumDifferentActions(ActionType actionType) {

		int numActions = 0;

		switch (actionType) {
		case VIDEO:
			numActions = NUM_VIDEO_ACTION;
			break;
		case PAGE:
			numActions = NUM_PAGEVIEW_ACTION;
			break;
		case QUIZ:
			numActions = NUM_QUIZ_ACTION;
		}

		return numActions;
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
