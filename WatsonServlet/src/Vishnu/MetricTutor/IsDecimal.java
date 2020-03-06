package Vishnu.MetricTutor;

import java.util.Vector;

public class IsDecimal extends MetricFeaturePredicate {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public IsDecimal(){
		setArity(1);
		setName("isDecimal");
		setArgValueType(new int[]{TYPE_NUMBER});
	}
	
	@Override
	public String apply(Vector arg0) {
		// TODO Auto-generated method stub
		String number = (String)arg0.get(0);
		return number.contains(".") ? "T" : null;
	}

}
