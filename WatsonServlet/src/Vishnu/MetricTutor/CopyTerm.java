package Vishnu.MetricTutor;

import java.util.Vector;


public class CopyTerm extends MetricFeaturePredicate{
	
	private static final long serialVersionUID = 1L;
	public CopyTerm(){
		setArity(1);
		setName("copy");
	}
	
	public String apply(Vector args){
		System.out.println(" Inside Copy : "+(String)args.get(0));
		return (String)args.get(0);
	}
	
}


