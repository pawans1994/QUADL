package Vishnu.MetricTutor;

import java.util.Vector;


public class MultiplyTerm extends MetricFeaturePredicate{
	
	private static final long serialVersionUID = 1L;
	public MultiplyTerm(){
		setArity(2);
		setName("multiply");
	}
	
	public String apply(Vector args){
		String expString1 = (String)args.get(0);
		String expString2 = (String)args.get(1);
		String exprString3 =  String.valueOf(Double.parseDouble(expString1) * Double.parseDouble(expString2));
		
		return exprString3;
	}
	
}


