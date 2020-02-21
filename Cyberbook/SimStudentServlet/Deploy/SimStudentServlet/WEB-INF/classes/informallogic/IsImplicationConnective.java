package informallogic;

import java.util.Vector;

public class IsImplicationConnective extends MyFeaturePredicate {

	public IsImplicationConnective() {
        //System.out.println("Inside IsImplicationConnective constructor");
		setArity(1);
		setName("is-implication-connective");
		setArgValueType(new int[] { TYPE_WORD });
	}

	public String apply(Vector args) {
        //System.out.println("Inside IsImplicationConnective apply");
		String value = ((String) args.get(0)).trim();
		boolean isImplication = (value.equals(Constants.INF_THEN) )
	                             | value.equals(Constants.PL_IMP);
		System.out.println("~~~~~~~~~~~IsImplicationConnective:"+isImplication+"  ");
		return (isImplication) ? "T" : null;
	}
}
