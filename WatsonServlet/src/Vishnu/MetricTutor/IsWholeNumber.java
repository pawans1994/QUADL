package Vishnu.MetricTutor;

import java.util.Vector;

public class IsWholeNumber extends MetricFeaturePredicate{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public IsWholeNumber(){
		setArity(1);
		setName("isWhole");
		setArgValueType(new int[]{TYPE_NUMBER});
	}
	@Override
	public String apply(Vector arg0) {
		// TODO Auto-generated method stub
		String number = (String)arg0.get(0);
		return !number.contains(".") ? "T" : null;
	}

}
