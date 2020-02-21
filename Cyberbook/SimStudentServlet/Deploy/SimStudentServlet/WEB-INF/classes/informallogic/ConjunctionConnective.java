package informallogic;

import java.util.Vector;

public class ConjunctionConnective extends MyFeaturePredicate {
	private static final long serialVersionUID = 1L;

	public ConjunctionConnective() {
        //System.out.println("Inside ConjunctionConnective constructor");
		setArity(0);
		setName("conjunction-connective");
		setReturnValueType(TYPE_WORD);
		setArgValueType(new int[] {    });
	}

	@Override
	public String apply(Vector args) {
        //System.out.println("Inside ConjunctionConnective apply");
		return (Constants.PL_AND);
	}
}
