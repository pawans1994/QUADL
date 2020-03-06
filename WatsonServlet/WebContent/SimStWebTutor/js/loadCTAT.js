var hostname = $(location).attr('protocol');
var myVars = 
 {
 	question_file: "/SimStudentServlet/SimStWebTutor/anyStepOk.brd",
	tutoring_service_communication: "javascript"
 };

function ctatOnload(){
	    var path='<%=getServletContext().getInitParameter("folderPath")%>';

	   	alert(path);
		initTutor(myVars);
		$.ajax({
	             async: true,
	             crossDomain: true,
	             url: hostname+"/SimStudentServlet/serv",
	             method: "POST",
	             dataType: "text",
	             data: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><message><verb>NotePropertySet</verb><properties><MessageType>SetPreferences</MessageType><log_service_url>http:pslc-qa.andrew.cmu.edu/log/server</log_service_url><log_to_remote_server>false</log_to_remote_server><log_to_disk>false</log_to_disk><log_to_disk_directory>.</log_to_disk_directory><user_guid>qa-test</user_guid><problem_name>xxx</problem_name>"+
	            		 "<Argument>-traceLevel 3 -debugCodes miss mt webAuth -ssInteractiveLearning -ssWebAuthoringMode -ssDeletePrFile -ssSearchTimeOutDuration 20000 -ssMaxSearchDepth 3 -ssHintMethod WebAuthoring -ssRuleActivationTestMethod WebAuthoring -ssDontShowAllRaWhenTutored true -ssCacheOracleInquiry  false -ssPackageName APLUS -DssFoilBase=/Users/simstudent/FOIL6 "+
	            		 "-DnoCtatWindow -DappRunType=servlet -DpackageName=APLUS</Argument><question_file>http://localhost:8080/SimStudentServlet/SimStWebTutor/anyStepOk.brd</question_file><class_name>Default Class</class_name><school_name>none</school_name><instructor_name>none</instructor_name><session_id>803da443-b605-3a62-ff2d-85ca5ae1162c</session_id><source_id>PACT_CTAT_HTML5</source_id><sui>undefined</sui><problem_state_status>empty</problem_state_status>"+
	            		 "<back_dir>http://localhost:8080/SimStudentServlet/build/classes</back_dir><back_entry>interaction.SimStTutoringBackend</back_entry></properties></message>",
	             success: function(data) {
		            	       console.log("Response : "+data);
			             	 
		             }
		    
		
		});
}

CTAT.ToolTutor.sendToInterface = function(message) {
	
	if (this.message_handler) {
		if(!message.includes("CorrectAction") && !message.includes("ProblemSummaryResponse")){
		    return this.message_handler.receiveFromTutor(message);
		}			
	} 
	
};

CTAT.ToolTutor.sendToTutor = function(message) {
    if (this.tutor) {
		return this.tutor.receiveFromInterface(message);
	} 
};