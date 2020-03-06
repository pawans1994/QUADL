/**
 * Describe class UserDefSymbols here.
 *
 *
 * Created: Tue May 31 00:31:29 2005
 *
 * @author <a href="mailto:Noboru.Matsuda@cs.cmu.edu">Noboru Matsuda</a>
 * @version 1.0
 */
package Vishnu.MetricTutor;

import jess.*;
import edu.cmu.pact.jess.*;
import edu.cmu.pact.miss.userDef.algebra.*;
import edu.cmu.pact.miss.userDef.topological.*;
import edu.cmu.pact.miss.userDef.topological.table.*;

public class UserDefSymbols implements Userpackage {

    /**
     * Creates a new <code>UserDefSymbols</code> instance.
     *
     */
    public UserDefSymbols() {
    }

    // Implementation of jess.Userpackage

    /**
     * Describe <code>add</code> method here.
     *
     * @param rete a <code>Rete</code> value
     */
    public final void add(final Rete rete) {


	// Feature predicates
	//
    	rete.addUserfunction(new IsDecimal());
    	rete.addUserfunction(new IsWholeNumber());
	//
	// Operators
	//
    	rete.addUserfunction(new CopyTerm());
    	rete.addUserfunction(new MultiplyTerm());
	
    }
}
