package Vishnu.APLUS;  // packagename is the package where you put this file.

import java.util.Vector;

import cl.utilities.sm.Expression;
import edu.cmu.pact.miss.userDef.algebra.CLBased;

public class GetSecondNearestIntegerWithoutSign extends CLBased {
    
    private static final long serialVersionUID = 1L;
    
    public GetSecondNearestIntegerWithoutSign()
    {
        setArity(1);
        setName("get-second-nearest-integer-without-sign");
        setReturnValueType(TYPE_ARITH_EXP);
        setArgValueType(new int[]{TYPE_ARITH_EXP});
    }
    
    public String apply(Vector args) 
    {
        String expString = (String)args.get(0);
        
        return TermGrabber.stripSign(TermGrabber.findNthNearestInteger(expString, 1));
    }
}