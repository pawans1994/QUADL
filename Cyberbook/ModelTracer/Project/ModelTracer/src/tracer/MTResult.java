package tracer;

/**
 * Class to represent the result of an attempt to trace a sai in the
 * model tracer.
 * @author Alex Xiao
 *
 */

public class MTResult {

	public enum MTResultType {
	    CORRECT {
	    	public String toString() {
	    		return "Correct";
	    	}
	    }, INCORRECT {
	    	public String toString() {
	    		return "Incorrect";
	    	}
	    }, BUGGY {
	    	public String toString() {
	    		return "Buggy";
	    	}
	    }, UNAVAILABLE {
	    	public String toString() {
	    		return "Unavailable";
	    	}
	    }
	}

	private String message;
	private MTResultType type;
	private String ruleFired;

	public MTResult(MTResultType type, String message) {
		this.message = message;
		this.type = type;
	}
	
	public MTResult(MTResultType type, String message,String ruleFired) {
		super();
		this.message = message;
		this.type = type;
		this.ruleFired = ruleFired;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public MTResultType getType() {
		return type;
	}

	public void setType(MTResultType type) {
		this.type = type;
	}
	
	public String toString() {
		return "Type: " + this.type + "   Message: " + this.message;
	}

	public String getRuleFired() {
		return ruleFired;
	}

	public void setRuleFired(String ruleFired) {
		this.ruleFired = ruleFired;
	}

	
}
