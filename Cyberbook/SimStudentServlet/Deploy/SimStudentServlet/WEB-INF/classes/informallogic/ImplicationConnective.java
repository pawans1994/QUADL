package informallogic;

import java.util.Vector;

public class ImplicationConnective extends MyFeaturePredicate {
	private static final long serialVersionUID = 1L;

	public ImplicationConnective() {
        //System.out.println("Inside ImplicationConnective constructor");
		setArity(0);
		setName("implication-connective");
		setReturnValueType(TYPE_WORD);
		setArgValueType(new int[] {    });
	}

	@Override
	public String apply(Vector args) {
        //System.out.println("Inside ImplicationConnective apply");
		return (Constants.PL_IMP);
	}
}
