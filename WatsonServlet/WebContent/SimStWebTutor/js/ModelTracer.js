/**
 * 
 */
var hostname = location.protocol + "//" + location.hostname
		+ (location.port ? ':' + location.port : '');
var username = "";
var tutorname = "";
var probselection = "";
var parentUrl = document.referrer;
var problemIndex = -1;
var studentID = "";
var sessionID;
var previousStep; // This tells whether the previous action was hint request.
// If so then the
// this is a HashTable ( component, value entered by the student)
// var stepCorrectness; // this is a Hashtable ( component, correctness of the
// value entered by the student)
// var stepAttempts; // this is a Hashtable (component, no of attempts made by
// student on that component)

var Lvalue = true;
var stepCount;
var attempts;
var correctness;
var stepValue;
var mastery = false;
var hintEnabled;
var len;
var kc;
var question;
var problemList;
var problemListLen;
var typechecker;
var inputmatcher;
var date = new Date();
var abbrs = {
	"EST" : 'US/Eastern',
	"EDT" : 'US/Eastern',
	"CST" : 'US/Central',
	"CDT" : 'US/Central',
	"MST" : 'US/Mountain',
	"MDT" : 'US/Mountain',
	"PST" : 'US/Pacific',
	"PDT" : 'US/Pacific',
};
var timezone = getTimeZone();
var part1 = "<div class='modal' role='dialog' id='confirm'> "
		+ "<div class='modal-dialog'><div class='modal-content'><div class='modal-body'><p id='doneMessage'>";

var part2 = "</p></div><div class='modal-footer'>"
		+ "<button type='button' id='doneOKButton' class='btn btn-success' data-dismiss='modal'>OK</button>"
		+ "</div></div> </div></div>";

var practiceCompletion = "Congratulations! You have completed this practice.";
var problemCompletion = "Congratulations! You finished this problem. Let’s try another one. Click OK to work on the next problem.";
var masteryReachedYetWant2Practice = "You have already completed this practice. If you want to practice more, Click OK to work on another problem";
var wheelSpinning = "Congratulations! You have completed the problem. It looks like you need more practice, I would recommend you to review study materials again. Click OK button below and follow the link"
var askToReviewResource = "I would recommend you to review study material again. Click OK button below and follow the link."
var askToPracticeAgain = "I encourage you to practice more. Click OK button to begin";

var problemSelectorURL = "https://mocha.education.tamu.edu:8443/ProblemSelector/";
var alpURL = "https://kona.education.tamu.edu:2401/ALP";

window.addEventListener('message', function(event) {

	if (parentUrl.indexOf(event.origin) > -1) {
		username = event.data.username;
		tutorname = event.data.tutorname;
		probselection = event.data.probselection;
		studentID = event.data.studentID;
		typechecker = event.data.typechecker;
		inputmatcher = event.data.inputmatcher;
		hintEnabled = event.data.hintoptions;
		kc = event.data.kc;
		initializeModelTracer();
		if (hintEnabled != "enable")
			$("#hintWindow").css("display", "none");
		checkPreviousState();
	} else {
		console.log("Someone is hacking our code");
		return;
	}
});

$(document).ready(function() {
	buildPopUp();
	parent.postMessage("getArguments", "*");
})

function initializeModelTracer() {

	// Need to send ssTypeChecker parameter to the tutor
	sessionID = generateSessionID();
	console.log("initializing Model Tracer " + username + " T " + tutorname
			+ " Checker " + typechecker);
	$
			.ajax(
					{
						async : false,
						crossDomain : true,
						url : hostname + "/SimStudentServlet/serv",
						method : "POST",
						dataType : "text",
						data : "<?xml version=\"1.0\" encoding=\"UTF-8\"?><message><verb>NotePropertySet</verb><properties><MessageType>SetPreferences</MessageType><log_service_url>http:pslc-qa.andrew.cmu.edu/log/server</log_service_url><log_to_remote_server>false</log_to_remote_server><log_to_disk>false</log_to_disk><log_to_disk_directory>.</log_to_disk_directory><user_guid>qa-test</user_guid><problem_name>xxx</problem_name>"
								+ "<Argument>-traceOn -folder "
								+ username
								+ "/"
								+ tutorname
								+ " -problem init "
								+ "-ssTypeChecker "
								+ typechecker
								+ " "
								+ inputmatcher
								+ " </Argument><class_name>Default Class</class_name><school_name>none</school_name><instructor_name>none</instructor_name><session_id>"
								+ sessionID
								+ "</session_id><source_id>PACT_CTAT_HTML5</source_id><sui>undefined</sui><problem_state_status>empty</problem_state_status>"
								+ "<back_dir>http://localhost:8080/SimStudentServlet/build/classes</back_dir><back_entry>interaction.ModelTracerBackend</back_entry></properties></message>",
						success : function(data) {
							console.log("Response MTT : " + data);
						},
						error : function(xhr, options, error) {
							console.log("Error in MTT initialize " + xhr.status
									+ " message " + error);
						}

					}).done(readXML);
}
function readXML() {
	console.log("readXML");
	return $.ajax(
			{
				crossDomain : true,
				async : false,
				type : "GET",
				url : hostname + "/interface/" + username + "/" + tutorname
						+ "/interface.xml",
				dataType : "xml",
				success : function(data) {
					$(data).find('MessageBundle message').each(function() {
						$(this).find('session_id').text(sessionID);
					})
					xml = (new XMLSerializer()).serializeToString(data);

				},
				error : function(xhr, options, error) {
					console.log("Error in reading XML " + xhr.status
							+ " message " + error);
				}
			}).done(sendMessageToSimSt);
}

function sendMessageToSimSt() {

	$.ajax({
		async : false,
		crossDomain : true,
		url : hostname + "/SimStudentServlet/serv",
		method : "POST",
		dataType : "text",
		data : xml,
		success : function(data) {
			console.log("Response : " + data);
		},
		error : function(xhr, options, error) {
			console.log("Message from SimSt " + xhr.status + " message "
					+ error);
		}
	});
}

function requestNewProblem() {
	console.log(" Requesting new Problem : " + username + " tutorname : "
			+ tutorname);
	$
			.ajax({
				async : false,
				crossDomain : true,
				url : hostname + "/ProblemSelector/getProblem?criteria="
						+ probselection + "&studentID=" + studentID
						+ "&folder=" + username + "," + tutorname + "&mastery="
						+ mastery,
				method : "GET",
				dataType : "text",
				success : function(data) {
					if (data === "[]") {
						$("#doneMessage").html(masteryReachedYetWant2Practice);
						$("#confirm").show();
						mastery = true;
						// update the status in the database
						// updateStatus("mastery");
						// Log when mastery is reached
						// HINT', 'problem_view','_question',
						// '_attempts','_correctness',
						// '_selection', '_action','_input', '_feedback',
						// '_help_level', kc,'Mastery reached', '_CfResult'
						/*
						 * createLogJSON('HINT_REQUEST', 0, 'N/A', 'N/A',
						 * 'UNGRADED', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', kc,
						 * 'Mastery reached', 'N/A');
						 */
					} else {
						$(".CTATTextInput :input").attr("disabled", false);
						var jsonData = jQuery.parseJSON(data);
						len = true;
						stepCount = 1;
						attempts = new Object();
						correctness = new Object();
						stepValue = new Object();

						// stepAttempts = new Object();
						previousHint = false;
						question = "";

						console.log(" Data : " + data + " JSONDATA : "
								+ jsonData);

						for (var i = 0; i < jsonData.length; i++) {
							var selection = jsonData[i].selection;
							var input = jsonData[i].input;
							console.log(" Selection : " + selection
									+ " Input : " + input);
							if (selection == "wheelSpinning") {
								$("#doneMessage").html(askToReviewResource);
								showPopup();
								// Log when wheel spinning is detected
								/*
								 * createLogJSON('HINT_REQUEST', 0, 'N/A',
								 * 'N/A', 'UNGRADED', 'N/A', 'N/A', 'N/A',
								 * 'N/A', 'N/A', kc, 'Wheel Spinning detected',
								 * 'N/A');
								 */
							} else if (!selection.toLowerCase().includes(
									"problemindex")) {
								if (!selection.includes("_")) {
									$("#" + selection + " input[type=text]")
											.val(input);
									$("#" + selection + " input[type=text]")
											.attr("disabled", true);
								} else {
									var id = selection.substring(0, selection
											.indexOf("_"))
											+ ".R"
											+ (parseInt(selection.substring(
													selection.length - 1,
													selection.length)) - 1)
											+ "C"
											+ (parseInt(selection.substring(
													selection.indexOf("_") + 2,
													selection.indexOf("_") + 3)) - 1);
									console.log(" selection : " + id);
									if (document.getElementById(id)
											.getElementsByTagName('textarea').length) {
										document.getElementById(id)
												.getElementsByTagName(
														'textarea')[0].value = input;
										$("#" + id + " :textarea").attr(
												"disabled", true);
									} else {
										document.getElementById(id)
												.getElementsByTagName('input')[0].value = input;
										$("#" + id + " :input").attr(
												"disabled", true);
									}

								}
								requestUpdateWM(selection, input);
								question = question + "," + input;
							} else
								problemIndex = input;

							console.log(jsonData[i].selection + "  "
									+ jsonData[i].input);
						}

						if (question != '') {
							// Log when a New Problem is Given
							createLogJSON('HINT_REQUEST', '1', question, 'N/A',
									'UNGRADED', 'N/A', 'N/A', 'N/A', 'N/A', '',
									kc, 'New Problem Given', question);

						}
					}

				}
			});
}

function resetWorkingMemory() {
	$
			.ajax({
				async : false,
				crossDomain : true,
				url : hostname + "/SimStudentServlet/serv",
				method : "POST",
				dataType : "text",
				data : "<message><verb>NotePropertySet</verb><properties>"
						+ "<MessageType>InterfaceAction</MessageType>"
						+ "<transaction_id>235f276d-5772-3c22-e64d-4c51ab6427ac</transaction_id>"
						+ "<Selection><value>ResetWorkingMemory</value></Selection>"
						+ "<Action><value>ButtonPressed</value></Action>"
						+ "<Input><value>-1</value></Input>" + "<session_id>"
						+ sessionID + "</session_id>"
						+ "</properties></message>",
				success : function(data) {
					console.log(" Successfully cleared the working memory");
				}
			});
}
function requestUpdateWM(selection, input) {
	console.log(" Requesting to update Working Memory");
	$
			.ajax({
				async : false,
				crossDomain : true,
				url : hostname + "/SimStudentServlet/serv",
				method : "POST",
				dataType : "text",
				data : "<message><verb>NotePropertySet</verb><properties>"
						+ "<MessageType>InterfaceAction</MessageType>"
						+ "<transaction_id>235f276d-5772-3c22-e64d-4c51ab6427ac</transaction_id>"
						+ "<Selection><value>" + selection
						+ "</value></Selection>"
						+ "<Action><value>UpdateWorkingMemory</value></Action>"
						+ "<Input><value>" + input + "</value></Input>"
						+ "<session_id>" + sessionID + "</session_id>"
						+ "</properties></message>",
				success : function(data) {
					console.log(" Successfully updated the working memory "
							+ selection + " with " + input);
				}
			});
}

function buildPopUp() {
	console.log("enabling hint window");
	$("body").append(
			"<div id='hintArea' style='left:50%;margin-left:21%;'></div>");
	$("body").append(part1 + part2);
	$("#hintArea").load("/SimStudentServlet/SimStWebTutor/HintWindow.html");
}

/**
 * *HintsMessage *
 */

function validateDone() {
	console.log(" Validating done");
	var skillname, color;
	$
			.ajax({
				async : false,
				crossDomain : true,
				url : hostname + "/SimStudentServlet/serv",
				method : "GET",
				dataType : "text",
				data : "session_id=" + sessionID,
				success : function(data) {
					var wellData = "<MessageBundle>" + data
							+ "</MessageBundle>";
					console.log("Response : " + wellData);
					xmlDoc = $.parseXML(wellData);
					console.log(" XML : " + xmlDoc);

					/***********************************************************
					 * The message has three parts : InterfaceAttribute,
					 * SkillMessage, HintsMessage The Model Tracer evaluates
					 * 'clicking done' button. If the action is correct, it will
					 * send a message "You have completed the problem" else it
					 * will change the color of the done button to red. The
					 * message (correct & incorrect) contains the SkillMessage
					 * which tells the skill associated with that step.
					 */

					$(xmlDoc)
							.find("message properties")
							.each(
									function() {
										var messageType = $(this).find(
												"MessageType").text();
										if (messageType == "ShowHintsMessage") {
											var message = $(this).find(
													"HintsMessage").text();
											if (message.trim().length > 0) {
												updateProblemSolved();
												clearInterface();
												resetWorkingMemory();
												if (mastery == true)
													$("#doneMessage")
															.html(
																	masteryReachedYetWant2Practice);
												else {
													var status = getStatus();
													if (status == "mastery") {
														createLogJSON(
																'HINT_REQUEST',
																0,
																'N/A',
																'N/A',
																'UNGRADED',
																'N/A',
																'N/A',
																'N/A',
																'N/A',
																'',
																kc,
																'Mastery is reached',
																'N/A');
														$("#doneMessage")
																.html(
																		practiceCompletion);

													} else if (status == "wheelSpinning") {
														createLogJSON(
																'HINT_REQUEST',
																0,
																'N/A',
																'N/A',
																'UNGRADED',
																'N/A',
																'N/A',
																'N/A',
																'N/A',
																'',
																kc,
																'Wheel Spinning detected',
																'N/A');
														$("#doneMessage").html(
																wheelSpinning);

													} else
														$("#doneMessage")
																.html(
																		problemCompletion);

												}

												// $("#confirm").show();
												showPopup();

											}
										} else if (messageType == "InterfaceAttribute") {
											console
													.log(" It's interface attribute");
											color = $(this)
													.find("border_color")
													.text();
											component = $(this).find(
													"component").text();
											if (component == "done")
												$('.CTAT-done-button').css(
														'border-color', color);
											else if (component != "textFieldSkill"
													&& component != "hint")
												$("#" + component + " input")
														.css('border-color',
																'#D7D7D7');
										} else if (messageType == "SkillMessage") {
											console
													.log(" Inside Skill Message");
											skillname = $(this).find(
													"skillname").text().split(
													"::")[1];
											console.log(" skillname : "
													+ skillname);

											attempts[stepCount] = (attempts[stepCount] == undefined) ? 1
													: attempts[stepCount] + 1;
											stepValue[stepCount] = "done";
											current = stepCount;
											if (color == "#13E65A") {
												correctness[stepCount] = "correct";
												stepCount = stepCount + 1;
											} else
												correctness[stepCount] = "incorrect";
											/**
											 * * If the current step was
											 * attempted for the first time then
											 * update the L value
											 */
											if (attempts[current] == 1)
												updateSkillCorrectness(
														skillname,
														correctness[current]);

											// Log when done button is clicked
											// Log when mastery is reached
											// 'ATTEMPT', '_question',
											// '_attempts','_correctness',
											// '_selection', '_action','_input',
											// '_feedback',
											// '_help_level', kc,'Mastery
											// reached', '_CfResult'
											createLogJSON('ATTEMPT', 1,
													question,
													attempts[current],
													correctness[current],
													'done', 'ButtonPressed',
													'-1', 'N/A', '', skillname,
													'Step Performed', 'N/A');
										}

									});
				}
			});

}

function clearInterface() {
	if ($("textarea").length > -1) {
		$("textarea").val("");
		$(".CTATTextArea").css('border-color', 'initial');
	}
	if ($("input[type=text]").length > -1) {
		$("input[type=text]").val("");
		$(".CTATTextInput").css('border-color', 'initial');
	}

}

function getTimeStamp() {
	var currentDate = new Date();
	var month = (currentDate.getMonth() + 1).toString();
	month = month.length > 1 ? month : '0' + month;

	var day = currentDate.getDate().toString();
	day = day.length > 1 ? day : '0' + day;

	var date = currentDate.getFullYear() + "-" + month + "-" + day;
	var currenttime = currentDate.getHours() + ":" + currentDate.getMinutes()
			+ ":" + currentDate.getSeconds() + ":"
			+ currentDate.getMilliseconds();
	return date + " " + currenttime;
}
function updateProblemSolved() {
	$.ajax({
		async : false,
		crossDomain : true,
		url : alpURL + "/updateProblemSolvedList",
		data : "student_id=" + studentID + "&tutor_name=" + tutorname
				+ "&question_name=" + problemIndex,
		dataType : 'jsonp',
		jsonp : 'callback',
		success : function(data) {
			console.log("updated successfully")
		}
	});
}

function generateSessionID() {
	return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-'
			+ this.s4() + '-' + this.s4() + this.s4() + this.s4();
}

this.s4 = function s4() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

function updateSkillCorrectness(skill, correctness) {

	var correct = (correctness == "incorrect") ? 0 : 1;
	skill = skill + "_" + tutorname;
	$.ajax({
		async : false,
		crossDomain : true,
		url : alpURL + "/callandsaveBKTCogTutor",
		data : "studentid=" + studentID + "&skillname=" + skill
				+ "&correctness=" + correct,
		dataType : 'jsonp',
		jsonp : 'callback',
		success : function(data) {
			console.log("success");
		}
	});

}

function logging(logDetails) {
	parent.postMessage(logDetails, '*');
}

function getTimeZone() {
	var momentTimeZone = moment.tz.guess();
	if (momentTimeZone.includes("America")) {
		var ab = moment.tz(momentTimeZone).format('z');
		return abbrs[ab];
	}
	return momentTimeZone;
}

function checkPreviousState() {
	$.ajax({
		async : false,
		crossDomain : true,
		url : alpURL + "/checkPreviousStatus",
		data : "studentID=" + studentID + "&tutor_name=" + tutorname,
		dataType : 'jsonp',
		jsonp : 'callback',
		success : function(data) {
			console.log("Previous State " + data);
			var previousState = data['state'];

			if (previousState == "practice" || previousState == undefined) {
				requestNewProblem();
			} else {
				if (previousState == "wheelSpinning") {
					$("#doneMessage").html(askToReviewResource);
					parent.postMessage('dynamicLink', '*');
				} else if (previousState == "mastery") {
					$("#doneMessage").html(masteryReachedYetWant2Practice);
				} else if (previousState == "resourceReviewed") {
					$("#doneMessage").html(askToPracticeAgain);
					parent.postMessage('dynamicLink', '*');
				}
				showPopup();
			}
		}
	});

}

function showPopup() {
	$(".modal").css("display", "block");
	createLogJSON('HINT_REQUEST', 0, 'N/A', 'N/A', 'UNGRADED', 'N/A', 'N/A',
			'N/A', 'N/A', '', 'N/A', 'Pop up displayed', $("#doneMessage")
					.text());
}
$(document).on('click', '#doneOKButton', function() {
	/**
	 * If the OK => problemCompletion, just close the popup =>
	 * practiceCompletion, the XBlock has to be closed and the shrink bar has to
	 * appear => completion, then start giving new problem => wheelspinning,
	 * theXBlock has to be closed and the shrink bar has to appear
	 */
	doneButtonClicked();

});

function doneButtonClicked() {
	var doneMessage = $("#doneMessage").text();
	$(".modal").css("display", "none");

	if (doneMessage == askToReviewResource || doneMessage == wheelSpinning) {
		// shrink and dynamic link should appear
		parent.postMessage('dynamicLinkShrink', '*');
		// dynamic link

	} else if (doneMessage == askToPracticeAgain) {
		// start the practice again
		updateStatus("practice");
		requestNewProblem();
	} else if (doneMessage == masteryReachedYetWant2Practice) {
		// the student has reached the mastery yet he wants to practice more so
		// ask PS to give random problem
		mastery = true;
		requestNewProblem();
	} else if (doneMessage == practiceCompletion) {
		// shrink
		parent.postMessage('shrink', '*');
	} else if (doneMessage == problemCompletion) {
		// ask PS to give next problem based on L value
		requestNewProblem();
	}
}

function updateStatus(status) {
	$.ajax({
		type : "GET",
		async : false,
		crossDomain : true,
		url : hostname + "/ProblemSelector/updateStatus",
		data : "studentID=" + studentID + "&tutorname=" + tutorname
				+ "&status=" + status,
		dataType : "text",
		success : function(data) {
			console.log("Status of the update operation : " + data[0].status);
		}
	});
}

function getStatus() {
	var status = "";
	$.ajax({
		type : "GET",
		async : false,
		crossDomain : true,
		url : hostname + "/ProblemSelector/getStatus",
		data : "studentID=" + studentID + "&folder=" + username + ","
				+ tutorname,
		dataType : "text",
		success : function(data) {
			console.log("Status " + data);
			status = data;
		}
	});

	return status;
}
function createLogJSON(_student_response_type, _problem_view, _question,
		_attempts, _correctness, _selection, _action, _input, _feedback,
		_help_level, _skillname, _CfAction, _CfResult) {

	var logDetails = {
		timestamp : getTimeStamp(),
		timezone : timezone,
		student_response_type : _student_response_type,
		problem_name : _question,
		problem_view : _problem_view,
		attempts : _attempts,
		outcome : _correctness,
		selection : _selection,
		action : _action,
		input : _input,
		feedback : _feedback,
		help_level : _help_level,
		kc : _skillname,
		cf_field : {
			cf_action : _CfAction,
			cf_result : _CfResult
		}
	};

	// alert(logDetails);
	// Log the step to the database
	logging(logDetails);
}