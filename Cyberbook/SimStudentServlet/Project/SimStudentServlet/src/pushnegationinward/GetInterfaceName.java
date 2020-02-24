package pushnegationinward;

import java.util.Vector;

public class GetInterfaceName extends MyFeaturePredicate {
	private static final long serialVersionUID = 1L;

	public GetInterfaceName() {
		setArity(1);
		setName("get-interface-name");
		setReturnValueType(TYPE_PROPERTY);
		setArgValueType(new int[] {TYPE_PROPERTY});
	}

	@Override
	public String apply(Vector args) {
		System.out.println("~~~UI: "+Constants.INTERFACE_NAME.get((String) args.get(0)));
		return Constants.INTERFACE_NAME.get((String) args.get(0));
	}
}