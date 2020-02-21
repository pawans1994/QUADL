package informallogic;

import java.util.Vector;

public class DisjunctionConnective extends MyFeaturePredicate {
	private static final long serialVersionUID = 1L;

	public DisjunctionConnective() {
        //System.out.println("Inside DisjunctionConnective constructor");
		setArity(0);
		setName("disjunction-connective");
		setReturnValueType(TYPE_WORD);
		setArgValueType(new int[] {    });
	}

	@Override
	public String apply(Vector args) {
        //System.out.println("Inside DisjunctionConnective apply");
		return (Constants.PL_OR);
	}
}
