package informallogic;

import java.util.Vector;

public class BiimplicationConnective extends MyFeaturePredicate {
	private static final long serialVersionUID = 1L;

	public BiimplicationConnective() {
        //System.out.println("Inside BiimplicationConnective constructor");
		setArity(0);
		setName("biimplication-connective");
		setReturnValueType(TYPE_WORD);
		setArgValueType(new int[] {  });
	}

	@Override
	public String apply(Vector args) {
        //System.out.println("Inside BiimplicationConnective apply");
		return (Constants.PL_BIIMP);
	}
}
