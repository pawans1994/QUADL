/**
 * Created: Jan 19, 2018 8:57:16 PM
 * @author mazda
 *
 */

/**
 * @author mazda
 *
 */



public enum ActionType {

		// Video
		VIDEO ("Video"),
		// PageView
//		PAGE ("Page"),
		// Assessment quiz
		QUIZ ("Quiz"),
		//hint
		HINT ("Hint");

		// - - - - - - - - - -
		// Constructor
		// - - - - - - - - - -

		private String label;

		ActionType (String label) {
			this.label = label;
		}

		// - - - - - - - - - -
		// Getter
		// - - - - - - - - - -

		/**
		 *  Returns a prefix for the action
		 */
		String getLabel() {
			return this.label;
		}

		public static ActionType getTypeByValue(String label)
	    {
	        for(ActionType actionType : values())
	        {
	            if(actionType.getLabel().equals(label))
	            {
	                return actionType;
	            }
	        }
	        throw new IllegalArgumentException("undefined : " + label);
	    }



	}

//	/**
//	 *  Returns a actionType whose label is label.
//	 */
//	public ActionType getType(String label) {
//	    ActionType[] types = ActionType.values();
//	    for (ActionType actiontype : types) {
//	        if (actiontype.getLabel() == label) {
//	            return actiontype;
//	        }
//	    }
//	    return null;
//	}
