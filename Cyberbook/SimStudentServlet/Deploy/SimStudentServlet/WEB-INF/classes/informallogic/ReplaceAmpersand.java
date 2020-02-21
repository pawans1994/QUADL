package informallogic;

import java.util.Vector;

public class ReplaceAmpersand extends MyFeaturePredicate {
	private static final long serialVersionUID = 1L;

	public ReplaceAmpersand() {
		//System.out.println("Inside ReplaceAmpersand constructor");
		setArity(1);
		setName("replace-ampersand");
		setReturnValueType(TYPE_WORD);
		setArgValueType(new int[] { TYPE_WORD });
	}

	@Override
	public String apply(Vector args) {
		//System.out.println("Inside ReplaceAmpersand apply");
		String arg0 = (String)args.get(0);
		return arg0.replaceAll("&", "&amp;");
	}
}
