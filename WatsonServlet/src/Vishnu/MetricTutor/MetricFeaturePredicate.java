package Vishnu.MetricTutor;

import edu.cmu.pact.miss.FeaturePredicate;

public abstract class MetricFeaturePredicate extends FeaturePredicate{
	 /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public static final int TYPE_NUMBER = 11;
	public static final int TYPE_DECIMAL = 12;
	
	
	private static boolean isDecimal(String input){
		return input.contains(".");
	}
	
	public static Integer valueTypeCheckerMetricTutor(String value){
		int type;
		if(isDecimal(value))
			type = TYPE_DECIMAL;
		else
			type = TYPE_NUMBER;
		
		return new Integer(type);
	}

}


