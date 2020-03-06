package servlet;

import java.util.ArrayList;
import java.util.List;

import interaction.SAI;
/**
 * Class to wrap up interface action response preformed by the tutor
 * @author Patrick Nguyen
 *
 */
public class TutorPerformResponse extends InterfaceActionResponse{
	private String trigger;
	private String subtype;
	
	ArrayList<String> hintList=null;
	private String skillname = "";
	
	private String problemName = "";
	
	private int skillCount = 0;
	void setHintMessages(ArrayList hints){this.hintList=hints;}
	
	ArrayList<String> getHintMessages(){return this.hintList;}
	public TutorPerformResponse(){
		setMessageType("InterfaceAction");
	}

	public String getTrigger() {
		return trigger;
	}


	public void setTrigger(String trigger) {
		this.trigger = trigger;
	}


	public String getSubtype() {
		return subtype;
	}


	public void setSubtype(String subtype) {
		this.subtype = subtype;
	}


	String feedbackMessage;
	public void setHint(String hint){	
		this.feedbackMessage=hint;
	}
	
	public String getHint(){return this.feedbackMessage;}
	

	
	
	
	public String toXML(){
		String xml = "<message>";
		xml+=wrapInXML("verb",getVerb());
		xml+="<properties>";
		
		xml+=wrapInXML("MessageType",getMessageType());
		
		SAI sai1 = getSai();
		if (sai1!=null){
			xml+=wrapInXML("Selection",sai1.getSelection());
			xml+=wrapInXML("Action",sai1.getAction());
			xml+=wrapInXML("Input",sai1.getInput());
		}		
		
		if (hintList!=null){
			
			for (String hint: hintList){
				
				xml+=wrapInXML("HintsMessage",wrapInXML("value",hint));
			}
				
		}
		
		if(problemName != null && problemName.length() > 0)
			xml+=wrapInXML("ProblemName",problemName);
		
			
		if(getSkillname().length() > 0){
			xml+=wrapInXML("skillname",getSkillname());
		    xml+= wrapInXML("skillCount",getSkillCount()+"");
		}
		
		xml+=wrapInXML("trigger",getTrigger());
		xml+=wrapInXML("subtype",getSubtype());
		xml+=wrapInXML("transaction_id",getTransactionID());
		
		xml+="</properties>";
		xml+= "</message>";
		return xml;
	}

	public String getSkillname() {
		return skillname;
	}

	public void setSkillname(String skillname) {
		this.skillname = skillname;
	}

	public String getProblemName() {
		return problemName;
	}

	public void setProblemName(String problemName) {
		this.problemName = problemName;
	}

	public int getSkillCount() {
		return skillCount;
	}

	public void setSkillCount(int skillCount) {
		this.skillCount = skillCount;
	}

	
}
