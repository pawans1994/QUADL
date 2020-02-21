package informallogic;

import java.util.Vector;

public class IsBiimplicationConnective extends MyFeaturePredicate {

	public IsBiimplicationConnective() {
        //System.out.println("Inside IsBiimplicationConnective constructor");
		setArity(1);
		setName("is-biimplication-connective");
		setArgValueType(new int[] { TYPE_WORD });
	}

	public String apply(Vector args) {
        //System.out.println("Inside IsBiimplicationConnective apply");
		String value = ((String) args.get(0)).trim();
		boolean isBiimp = value.equals(Constants.INF_BIIMP) |  value.equals(Constants.PL_BIIMP);
		System.out.println("~~~~~~~~~~~IsBiimplicationConnective: "+isBiimp+"  "+value);
		return (isBiimp ? "T" : null);
	}

}
