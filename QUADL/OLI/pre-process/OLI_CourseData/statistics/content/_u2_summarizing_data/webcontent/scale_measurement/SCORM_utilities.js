
var makeCallsToDriver	= false;
var PresenterObj;

	
	
	
function Finish()
{
	//SCORM RUSTICI call - unload here
	Unload();
}

/*
	In AICC the result can be the following strings: correct, wrong, unanticipated, neutral
	In SCORM the possible values can be: correct, incorrect, unanticipated, neutral
	
	Map these to the corresponding constants in the RUSTICI SCORM driver
	"incorrect" in SCORM is mapped to the contant INTERACTION_RESULT_WRONG
*/
function ConvertToInteractionResultConstant(token_str)
{
		
	
	var c = token_str.toLowerCase();
	var interactionResult;
	switch(c)
	{
		case "correct": 
			interactionResult = INTERACTION_RESULT_CORRECT;
			break;
			
		case "wrong": 
			interactionResult = INTERACTION_RESULT_WRONG;
			break;
		
		case "unanticipated": 
			interactionResult = INTERACTION_RESULT_UNANTICIPATED;
			break;
		
		case "neutral": 
			interactionResult = INTERACTION_RESULT_NEUTRAL;
			break;
		
		case "incorrect": 
			interactionResult = INTERACTION_RESULT_WRONG;
			break;
		
		default:
			trace("Could not find appropriate token for interaction result! -" + token_str);
	
	}
	
	return interactionResult;
}


//modified call handler for EI calls
function Captivate_DoExternalInterface()
{
	
	trace("\nRecd EI call:"  + Array.prototype.slice.call(arguments).join(":") );
	
	//Interaction data related vars
	var  interactionID_str, correctResponse_str, weight_int, studentResponse_str, result_str, latency_int, objectiveID_str, descriptionTexts;
	var question_text="";
	
	if(arguments.length <1) {
		trace("Insufficient arguments to EI call");
		return;
	}
	
	
	var strFSCmd = new String(arguments[0]);
	/*This is the value to be set. Type can be an array or a string for now, but no strict cecking is done.
	The repective function handler checks for the expected type*/
	var SetVal = arguments[1];  
	var strErr = "true";
	var retValForSWF = "";
	var lastArg  = arguments[2];
	var application = "";
	var interactionFunc = false;
	
	if(arguments.length > 3)
	{
		application = arguments[3];
	}
	
	trace("Captivate_DoExternalInterface is called with application = [" + application + "]");
	
	if(lastArg && lastArg != "") retValForSWF = lastArg;
	
	trace("Command Recd:"+strFSCmd);
	
	
	// do nothing, if SCORM API is not available
	if (!makeCallsToDriver) 
		{
			trace("Running instance of API not detected in  EI handler. Ignoring call.");
			return;
		}
	
	
	//check if this is an interaction related function - if so, get the individual data strings - this
	//is a temp. soln. till arity in Queue.as is officially increased
	if( strFSCmd.indexOf("Interaction")>-1 && strFSCmd.indexOf("Record")>-1){
	
		trace("Found a record interaction call:" + strFSCmd);
		
		var interaction_arr = SetVal;
		if(interaction_arr.length != 8) trace("ERROR! Wrong number of interaction elements received!");
		
		interactionID_str = interaction_arr[0];
		correctResponse_str = interaction_arr[1];
		weight_int = parseInt(interaction_arr[2]);
		studentResponse_str = interaction_arr[3];
		result_str = ConvertToInteractionResultConstant( interaction_arr[4] );
		latency_int = parseInt(interaction_arr[5]);
		objectiveID_str = interaction_arr[6];
		descriptionTexts = interaction_arr[7];
		//trace 'em all :)
		trace("Interaction Elements:");
		trace(interactionID_str);
		trace(correctResponse_str);
		trace(weight_int);
		trace(studentResponse_str );
		trace(result_str);
		trace(latency_int);
		trace(objectiveID_str);
		trace(descriptionTexts);
		
		if(descriptionTexts)
		{
			question_text = descriptionTexts.questionText;
			trace("Question Text:"+question_text);
		}
		
		interactionFunc = true;
	}
	
	trace("Captivate_DoExternalInterface is called with application = [" + application + "] " + " interactionFunc = " + interactionFunc);
	
	if(!interactionFunc && (application == "") && (strFSCmd != "Start"))
	{
		//this means call that is made is not for interaction-data.(it must be course data ;))
		//now checking for application argument. this would be populated only when called from Presenter.
		//So if this application argument is empty or null, it mean that it is from a different application
		//So DO NOT PROCESS ( this is added for Captivate 6.0 or above movies embedded inside Presenter movie ).
		//ToDo : Check how does presenter movie react to empty string
		return "";
	}
	
	//the API has already been initialized - so shouldn't be initialized again
	//check whether its initialized and revert back
	if(strFSCmd == "Start"){
		
		trace("Fwd:"+"Do nothing!");
		
		strErr 	= makeCallsToDriver;
		if(retValForSWF!="") 
		{
			trace("Start - Trying to call SetScormVariable[Expecting Cp to receive the call]");
			
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			
			trace("Start - Trying to call SetScormVariableForPresenter[Expecting Cp to receive the call]");
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr);

			trace('Both setscormvariables are done...');
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
		
		
	} else
	
	if(strFSCmd == "SetExitSuspendAfterCompleted"){
		
		trace("Fwd:"+"SetExitSuspendAfterCompleted!");
		var lExitSuspendIfCompleted = (SetVal == "true"? true : false );
		EXIT_SUSPEND_IF_COMPLETED = lExitSuspendIfCompleted;
		if(retValForSWF!="") 
		{
			
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
		
		
	} else
	
	if(strFSCmd == "SetExitNormalIfPassed"){
		
		trace("Fwd:"+"SetExitNormalIfPassed!");
		var lExitNormalIfPassed = (SetVal == "true"? true : false );
		EXIT_NORMAL_IF_PASSED  = lExitNormalIfPassed;
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
		
		
	} else
	
	if( strFSCmd == "CommitData"){
		trace("Fwd:"+"CommitData");
		
		strErr = CommitData();
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
		
	} else
	
	if( strFSCmd == "SetReachedEnd"){
		trace("Fwd:"+"SetReachedEnd:"+ SetVal);
		
		strErr = SetReachedEnd();
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	} else
	
	if( strFSCmd == "SetDataChunk"){
		trace("Fwd:"+"SetDataChunk:"+ SetVal);
		
		strErr = SetDataChunk(SetVal);
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);} 
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	} else
	
	
	if( strFSCmd == "SetPassed"){
		trace("Fwd:"+"SetPassed");
		
		strErr = SetPassed();
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	} else 
	
	if( strFSCmd == "SetProgressMeasure"){
		trace("Fwd:"+"SetProgressMeasure"+SetVal);
		
		strErr = SetProgressMeasure(SetVal);
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	} else
	
	if( strFSCmd == "SetFailed"){
		trace("Fwd:"+"SetFailed");
		
		strErr = SetFailed();
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	} else
	
	
	if( strFSCmd == "GetEntryMode"){
		trace("Fwd:"+"GetEntryMode:");
		
		strErr = GetEntryMode(SetVal);
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	} else
	
	
		
	if( strFSCmd == "SetBookmark"){
		trace("Fwd:"+"SetBookmark:"+ SetVal);
		
		strErr = SetBookmark(SetVal);
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	} else
	
	if( strFSCmd == "SetSessionTime"){
		trace("Fwd:"+"SetSessionTime():" +  SetVal);
		
		strErr = SetSessionTime(SetVal);
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	}else
	
	if( strFSCmd == "GetLastError"){
		trace("Fwd:"+"GetLastLMSErrorCode:");
		
		strErr = GetLastLMSErrorCode();
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	} else
	
	
	if( strFSCmd == "GetLastErrorDesc"){
		trace("Fwd:"+"GetLastErrorDesc:");
		
		strErr = GetLastErrorDesc();
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	}else
	

	
	if( strFSCmd == "SetScore"){
		trace("Fwd:"+"SetScore:" + SetVal );
		
		
		//var scores = String(SetVal).split("|");
		var scores = SetVal;
		trace(String(scores));
		strErr = SetScore(scores[0], scores[1], scores[2]);
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	}else 

	if( strFSCmd == "SetPointBasedScore"){
		trace("Fwd:"+"SetPointBasedScore:" + SetVal );
		
		
		//var scores = String(SetVal).split("|");
		var scores = SetVal;
		trace(String(scores));
		strErr = SetPointBasedScore(scores[0], scores[1], scores[2]);
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	}else 

	
	
	if( strFSCmd == "Suspend"){
		trace("Fwd:"+"Suspend:");
		
		strErr = Suspend();
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	} else
	if( strFSCmd == "GetDataChunk"){
		trace("Fwd:"+"GetDataChunk:" );
		
		strErr = GetDataChunk();
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	} else
	
	if( strFSCmd == "ConcedeControl"){
		trace("Fwd:"+"ConcedeControl");
		
		strErr = ConcedeControl();
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
		
	} else
	
	
	if( strFSCmd == "GetBookMark"){
		trace("Fwd:"+"GetBookMark():" );
		
		strErr = GetBookmark();
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	}else
	
	if( strFSCmd == "GetLaunchData"){
		trace("Fwd:"+"GetLaunchData():" );
		
		strErr = GetLaunchData();
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	}else
	
	
	
	
	
	//Interaction set value handlers
	if( strFSCmd == "RecordMultipleChoiceInteraction"){
		trace("Fwd:"+"RecordMultipleChoiceInteraction():" );
		
		
		
		var correctResponse_arr = []
		var studentResponse_arr = []
		
		//get the answer text arrays
		var MCQ_answer_texts  = descriptionTexts.answerTexts;
		
		var split_char_correctResponse ="";
		var split_char_studentResponse ="";
		
		if(correctResponse_str.indexOf(".") > -1) split_char_correctResponse = "." ;
		if(correctResponse_str.indexOf(",") > -1) split_char_correctResponse = "," ;
		
		if(studentResponse_str.indexOf(".") > -1) split_char_studentResponse = "." ;
		if(studentResponse_str.indexOf(",") > -1) split_char_studentResponse = "," ;
		
		
		trace("Split char correct:" + split_char_correctResponse);
		trace("Split char student:" + split_char_studentResponse);
		
		
		if(correctResponse_str != "")
		{
			if(split_char_correctResponse!=""){
				correctResponse_arr = correctResponse_str.split(split_char_correctResponse);
			}
			else{
				correctResponse_arr.push(correctResponse_str);
			}
		}
		else
		{
			correctResponse_arr.push("1");  // send in a dummy value here
		}
		
		if(studentResponse_str != "")
		{
			if(split_char_studentResponse!=""){
				studentResponse_arr = studentResponse_str.split(split_char_studentResponse);
			}
			else{
				studentResponse_arr.push(studentResponse_str);
			}
		}
		else
		{
			studentResponse_arr.push("1");  // send in a dummy value here
		}
		
		
		//create corresponding response identifier objects
		correctResponse_ResponIdent_arr= [];
		studentResponse_ResponIdent_arr= [];
		
		var idx = 0 ;
		
		if(MCQ_answer_texts)
		{
			for(idx = 0 ; idx < correctResponse_arr.length; idx++)  correctResponse_ResponIdent_arr.push(CreateResponseIdentifier(correctResponse_arr[idx], MCQ_answer_texts[correctResponse_arr[idx]]));
			for(idx = 0 ; idx < studentResponse_arr.length; idx++)  studentResponse_ResponIdent_arr.push(CreateResponseIdentifier(studentResponse_arr[idx], MCQ_answer_texts[studentResponse_arr[idx]]));
		}
		else
		{
			for(idx = 0 ; idx < correctResponse_arr.length; idx++)  correctResponse_ResponIdent_arr.push(CreateResponseIdentifier(correctResponse_arr[idx], correctResponse_arr[idx]));
			for(idx = 0 ; idx < studentResponse_arr.length; idx++)  studentResponse_ResponIdent_arr.push(CreateResponseIdentifier(studentResponse_arr[idx], studentResponse_arr[idx] ));
		
		}
		
		
		strErr = RecordMultipleChoiceInteraction(interactionID_str, studentResponse_ResponIdent_arr, result_str, correctResponse_ResponIdent_arr, question_text,  weight_int, latency_int, objectiveID_str);
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	}else
	if( strFSCmd == "RecordTrueFalseInteraction"){
		trace("Fwd:"+"RecordTrueFalseInteraction():" );
		
		var bStudent_response =  (studentResponse_str.search(/TRUE/i) ==0 || studentResponse_str == "T" || studentResponse_str == "t") ? true:false;
		var bCorrect_response =	(correctResponse_str.search(/TRUE/i) ==0 || correctResponse_str == "T" || correctResponse_str == "t") ? true:false;
		
		strErr = RecordTrueFalseInteraction(interactionID_str, bStudent_response, result_str, bCorrect_response, question_text,  weight_int, latency_int, objectiveID_str);
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	}else
	
	if( strFSCmd == "RecordFillInInteraction"){
		trace("Fwd:"+"RecordFillInInteraction():" );
		
		
		strErr = RecordFillInInteraction(interactionID_str, studentResponse_str, result_str, correctResponse_str, question_text,  weight_int, latency_int, objectiveID_str);
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	}else
	
	if( strFSCmd == "RecordMatchingInteraction"){
		trace("Fwd:"+"RecordMatchingInteraction():" );
		
		
		var leftColumnTexts = descriptionTexts.answerTexts.left;
		var rightColumnTexts = descriptionTexts.answerTexts.right;
		
		var correctResponse_MatchingResponses_arr=[];
		var studentResponse_MatchingResponses_arr=[];
		
		var temp_responses_arr = correctResponse_str.split(",");
		var resp_idx = 0;
		var curr_resp, src_target;
		
		for(resp_idx=0; resp_idx < temp_responses_arr.length; ++resp_idx){
			curr_resp = temp_responses_arr[resp_idx];
			src_target = curr_resp.split(".");
			
			var match_temp1  = src_target[0];
			var match_temp2  = src_target[1];
			
			var resp_src = CreateResponseIdentifier(match_temp1, leftColumnTexts[match_temp1]);
			var resp_target = CreateResponseIdentifier(match_temp2, rightColumnTexts[match_temp2]);
			
			//correctResponse_MatchingResponses_arr.push( new MatchingResponse(src_target[0], src_target[1])  );
			correctResponse_MatchingResponses_arr.push( new MatchingResponse(resp_src, resp_target)  );
		}		
		
		temp_responses_arr = studentResponse_str.split(",");
		for(resp_idx=0; resp_idx < temp_responses_arr.length; ++resp_idx){
			curr_resp = temp_responses_arr[resp_idx];
			src_target = curr_resp.split(".");
			
			var match_temp1  = src_target[0];
			var match_temp2  = src_target[1];
			
			var resp_src = CreateResponseIdentifier(match_temp1, leftColumnTexts[match_temp1]);
			var resp_target = CreateResponseIdentifier(match_temp2, rightColumnTexts[match_temp2]);
			
			//studentResponse_MatchingResponses_arr.push( new MatchingResponse(src_target[0], src_target[1])  );
			studentResponse_MatchingResponses_arr.push( new MatchingResponse(resp_src, resp_target)  );
		}		
		
		
		strErr = RecordMatchingInteraction(interactionID_str, studentResponse_MatchingResponses_arr, result_str, correctResponse_MatchingResponses_arr, question_text,  weight_int, latency_int, objectiveID_str);
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	}else
	
	
	if( strFSCmd == "RecordSequencingInteraction"){
		trace("Fwd:"+"RecordSequencingInteraction():" );
		
		
		//strErr = RecordSequencingInteraction(interactionID_str, CreateResponseIdentifier(studentResponse_str.substring(0,1),studentResponse_str), result_str, CreateResponseIdentifier(correctResponse_str.substring(0,1),correctResponse_str), question_text,  weight_int, latency_int, objectiveID_str);
		
		strErr = RecordSequencingInteraction(interactionID_str, CreateResponseIdentifier(studentResponse_str.substring(0,1),descriptionTexts.answerTexts.learner_response), result_str, CreateResponseIdentifier(correctResponse_str.substring(0,1), descriptionTexts.answerTexts.correct_response), question_text,  weight_int, latency_int, objectiveID_str);
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	}else
	
	if( strFSCmd == "RecordLikertInteraction"){
		trace("Fwd:"+"RecordLikertInteraction():" );
		
		
		strErr = RecordLikertInteraction(interactionID_str, CreateResponseIdentifier(studentResponse_str.substring(0,1),studentResponse_str), result_str, CreateResponseIdentifier(correctResponse_str.substring(0,1),correctResponse_str), question_text,  weight_int, latency_int, objectiveID_str);
		
		if(retValForSWF!="") 
		{
			if(PresenterObj.SetScormVariable != null){PresenterObj.SetScormVariable(retValForSWF, strErr);}
			PresenterObj.SetScormVariableForPresenter(retValForSWF, strErr); 
		}
		trace("Setting var in SWF:"+retValForSWF+" = "+strErr);
	}else
	
	trace("This call has not been ported or is not handled yet.");
	return strErr;
}
//This function name should not be changed - scormdriver.js internally calls this. 
			 
function LoadContent(){
	
	trace("LoadContent: Has API loaded and been properly initialized?:"+String(IsLoaded()));
	
	if(!IsLoaded()) {
		trace("Error loading API - Aborting!");
		return;
	}
	else
	{
		makeCallsToDriver = true;
	}
	
	//ShowDebugWindow();
	trace("Exiting Load content...");
	return;
	
}

function OnloadActivities(){


	trace("Inside body. Calling Start() on driver.");
	Start();
	if(IsLoaded()) makeCallsToDriver = true;
	trace("Can make calls to driver?"+ makeCallsToDriver);
			
	loadPrContent();
}

