/**
 * 
 */

var url = new URLSearchParams(window.location.search);
var page = "/interface/" + url.get("userName") + "/" + url.get("tutorName")
		+ "/" + url.get("html");
$("#tutorInterface").attr('src', page);
var hostname = $(location).attr('protocol');
var argument = "";
var simst_sessionID;
console.log(" typeChecker " + url.get("typeChecker") + " inputMatcher : "
		+ url.get("inputMatcher"));
if (url.get("typeChecker") != null && url.get("typeChecker").length > 0)
	argument = " -ssTypeChecker " + url.get("userName") + "."
			+ url.get("tutorName") + "." + url.get("typeChecker");
if (url.get("inputMatcher") != null && url.get("inputMatcher").length > 0)
	argument += " -ssInputMatcher " + url.get("userName") + "."
			+ url.get("tutorName") + "." + url.get("inputMatcher");
console.log(" Argument : " + argument);
console.log(" Hostname " + window.location.hostname);
var quizMode = $("#doNextStepButton").hasClass("disabled");
var problemName = "";
var problemBank = [];
var answers;
var rulesLearned = {};
var skillvalue;
var foas = {};
var productionRule = hostname + "/interface/" + url.get("userName") + "/"
		+ url.get("tutorName") + "/" + "productionRules.pr";

$(".btn-primary")
		.click(
				function() {

					if (this.id.includes("newProblemButton")) {

						$("#tutorInterface").contents().find("textarea")
								.val("");
						$("#tutorInterface").contents()
								.find('input[type=text]').val("");

						/*
						 * $("#tutorInterface").contents()
						 * .find('input[type=text]').css("border-color",
						 * "initial");
						 * $("#tutorInterface").contents().find('textarea').css(
						 * "border-color", "initial");
						 */
						changeBorderColor("rgb(0,0,0)");

					}

					if (this.id.includes("doNextStepButton"))
						changeBorderColor("rgb(0,0,0)");

					if (this.id.includes("noButton")) {
						if (previous.includes("."))
							window.frames['tutorInterface'].contentDocument
									.getElementById(previous)
									.getElementsByTagName('textarea')[0].value = "";
						else
							window.frames['tutorInterface'].contentDocument
									.getElementById(previous)
									.getElementsByTagName('input')[0].value = "";
					}

					if (this.id.includes("startStateButton")) {
						problemName = "";
						$("#tutorInterface")
								.contents()
								.find('input[type=text]')
								.each(
										function() {
											var value = $.trim($(this).val());
											if (value.length > 0) {
												if (problemName.length > 0)
													problemName = problemName
															+ ",";
												problemName = problemName
														+ $.trim($(this).val());
											}

										});
						answers = {};
					}

					$
							.ajax(
									{
										async : true,
										crossDomain : true,
										url : hostname
												+ "/SimStudentServlet/serv",
										method : "POST",
										dataType : "text",
										data : "<message><verb>NotePropertySet</verb><properties><MessageType>InterfaceAction</MessageType>"
												+ "<transaction_id>235f276d-5772-3c22-e64d-4c51ab6427ac</transaction_id><Selection><value>"
												+ this.id
												+ "</value></Selection><Action><value>ButtonPressed</value></Action><Input><value><![CDATA[-1]]></value></Input><session_id>"
												+ simst_sessionID
												+ "</session_id></properties></message>"
									}).done(requestResponseFromSimSt);

					/*
					 * if (this.id.includes("done")) {
					 * $("#textFieldSkill").val("");
					 * $("#textFieldSkill").show(); }
					 */

				});

function requestResponseFromSimSt() {
	var xmlDoc;
	var activationRule;
	var activationRuleID;
	$("#activationList > tbody > tr").empty();
	foas = {};

	$("#dvLoading").hide();

	$
			.ajax({
				async : true,
				crossDomain : true,
				url : hostname + "/SimStudentServlet/serv",
				method : "GET",
				dataType : "text",
				data : "session_id=" + simst_sessionID,
				success : function(data) {
					var wellData = "<MessageBundle>" + data
							+ "</MessageBundle>";
					console.log("Response : " + wellData);
					xmlDoc = $.parseXML(wellData);
					console.log(" XML : " + xmlDoc);
					$(xmlDoc)
							.find("MessageBundle message properties")
							.each(
									function() {
										var messageType = $(this).find(
												"MessageType").text();
										if (messageType == "SkillMessage") {
											parseSkillMessage(this);
										} else if (messageType == "ProblemMessage") {
											parseProblemMessage(this);
										} else {

											var selection = $(this).find(
													"Selection").text();
											var inputRes = $(this)
													.find("Input").text();

											if (inputRes.length > 0
													&& selection.length > 0) {
												/** * for textFieldSS * */
												if (selection
														.includes("textFieldSS")) {

													if (inputRes
															.includes("Start state for problem created.")) {
														var input = inputRes
																.split(".");
														problemName = input[1];
														inputRes = input[0];
													}

													if (inputRes
															.includes("Problem learned! Clear the interface and enter a new one.")) {
														$('#problemsSolved')
																.append(
																		'<tr><td> '
																				+ problemName
																				+ '</td></tr>');
													}

													if (inputRes == "Step succesfully learned.") {
														if (typeof skillvalue != 'undefined'
																&& typeof rulesLearned[skillvalue] == 'undefined') {
															rulesLearned[skillvalue] = true;
															$('#rulesLearned')
																	.append(
																			'<tr><td><a href="'
																					+ productionRule
																					+ '">'
																					+ skillvalue
																					+ '</a></td></tr>');
														}
													}
													$("#" + selection).val(
															"SimSt : "
																	+ inputRes);

													if (inputRes
															.includes("Step was NOT learned...")) {
														$("#learningFailed")
																.show();
													}

													if (inputRes
															.includes("Please specify the skill")) {
														$("#textFieldSkill")
																.val("");
														$("#textFieldSkill")
																.show();
													}
												}
												/**
												 * ** if the interface contains
												 * table **
												 */
												else if (selection
														.toLowerCase()
														.includes("_")
														&& !selection
																.toLowerCase()
																.includes("$")) {
													var id = convertTable(selection);
													window.frames['tutorInterface'].contentDocument
															.getElementById(id)
															.getElementsByTagName(
																	'textarea')[0].value = inputRes;
													previous = id;

												}

												else if (selection == "FOA") {
													var id;
													console.log(inputRes);
													var array = inputRes
															.replace("[", "")
															.replace("]", "")
															.split(",");

													for ( var input in array) {
														if (array[input]
																.toLowerCase()
																.includes("_"))
															id = convertTable(array[input]);
														else
															id = array[input];
														foas[activationRuleID]
																.push(id);

													}

												} else if (selection
														.includes("MAIN::")) {
													console.log(selection);
													activationRuleID = selection;
													activationRule = selection
															.substring(
																	0,
																	selection
																			.indexOf("$"));
													console.log(activationRule);

													$("#activationList")
															.append(
																	"<tr id="
																			+ "'"
																			+ selection
																			+ "'"
																			+ "><td><a>"
																			+ activationRule
																			+ "</td><td>"
																			+ inputRes
																			+ "</td><tr>");

													foas[activationRuleID] = new Array();
												}
												/**
												 * ** If the interface has
												 * textfield **
												 */
												else if (!selection
														.includes("textFieldSkill")
														&& inputRes.length > 0
														&& !selection
																.includes("done")) {
													var iframe = window.frames['tutorInterface'].contentDocument;
													if (iframe
															.getElementById(
																	selection)
															.getElementsByTagName(
																	'input').length > -1)
														iframe
																.getElementById(
																		selection)
																.getElementsByTagName(
																		'input')[0].value = inputRes;
													previous = selection;
												}

											}
										}
									});
					if (quizMode == true)
						fillProblemBank();
				}
			});

}

function convertTable(selection) {
	var id = selection.substring(0, selection.indexOf("_"))
			+ ".R"
			+ (parseInt(selection.substring(selection.length - 1,
					selection.length)) - 1)
			+ "C"
			+ (parseInt(selection.substring(selection.indexOf("_") + 2,
					selection.indexOf("_") + 3)) - 1);

	return id;
}

$("#textFieldSkill")
		.on(
				'keydown',
				function(event) {
					if (event.which == 13) {
						skillvalue = $("#textFieldSkill").val();
						$("#dvLoading").show();
						$
								.ajax(
										{
											async : true,
											crossDomain : true,
											url : hostname
													+ "/SimStudentServlet/serv",
											method : "POST",
											dataType : "text",
											data : "<message><verb>NotePropertySet</verb><properties><MessageType>InterfaceAction</MessageType>"
													+ "<transaction_id>235f276d-5772-3c22-e64d-4c51ab6427ac</transaction_id><Selection><value>"
													+ this.id
													+ "</value></Selection><Action><value>UpdateTextField</value></Action><Input><value>"
													+ skillvalue
													+ "</value></Input><session_id>"
													+ simst_sessionID
													+ "</session_id></properties></message>",
											success : function(data) {
												console.log("Response " + data);
											}
										}).done(requestResponseFromSimSt);
						$("#textFieldSkill").hide();
						if ($("#tutorInterface").contents().find(
								".CTATComponent").length > 0)
							$("#tutorInterface").contents().find(
									".CTATComponent").css("border-color",
									"rgb(0,0,0)");

					}
				});

$("#tutorInterface")
		.on(
				"load",
				function() {
					simst_sessionID = generateSessionID();
					// alert("tutorInterface on load " + simst_sessionID);
					$
							.ajax(
									{
										async : true,
										crossDomain : true,
										url : hostname
												+ "/SimStudentServlet/serv",
										method : "POST",
										dataType : "text",
										data : "<?xml version=\"1.0\" encoding=\"UTF-8\"?><message><verb>NotePropertySet</verb><properties><MessageType>SetPreferences</MessageType><log_service_url>http:pslc-qa.andrew.cmu.edu/log/server</log_service_url><log_to_remote_server>false</log_to_remote_server><log_to_disk>false</log_to_disk><log_to_disk_directory>.</log_to_disk_directory><user_guid>qa-test</user_guid><problem_name>xxx</problem_name>"
												+ "<Argument>-traceLevel 3 -debugCodes miss mt webAuth -ssInteractiveLearning -ssWebAuthoringMode -ssDeletePrFile -ssSearchTimeOutDuration 20000 -ssMaxSearchDepth 3 -ssHintMethod WebAuthoring -ssRuleActivationTestMethod WebAuthoring -ssDontShowAllRaWhenTutored true -ssCacheOracleInquiry  false -ssPackageName "
												+ url.get("userName")
												+ "."
												+ url.get("tutorName")
												+ " -ssProjectDirectory "
												+ config.path
												+ "/"
												+ url.get("userName")
												+ "/"
												+ url.get("tutorName")
												+ " -DssFoilBase="
												+ config.path
												+ "/FOIL6 "
												+ "-DnoCtatWindow -DappRunType=servlet -DprojectDir="
												+ config.path
												+ "/"
												+ url.get("userName")
												+ "/"
												+ url.get("tutorName")
												+ argument
												+ "</Argument><class_name>Default Class</class_name><school_name>none</school_name><instructor_name>none</instructor_name><session_id>"
												+ simst_sessionID
												+ "</session_id><source_id>PACT_CTAT_HTML5</source_id><sui>undefined</sui><problem_state_status>empty</problem_state_status>"
												+ "<back_dir>http://"
												+ window.location.hostname
												+ ":8080/SimStudentServlet/build/classes</back_dir><back_entry>interaction.SimStTutoringBackend</back_entry></properties></message>",
										success : function(data) {
											console.log("Response : " + data);

										}

									}).done(readXML);
				});

function readXML() {
	console.log("readXML");
	$.ajax(
			{
				type : "GET",
				url : hostname + "/interface/" + parent.url.get("userName")
						+ "/" + parent.url.get("tutorName") + "/interface.xml",
				dataType : "xml",
				success : function(data) {
					$(data).find('MessageBundle message').each(function() {
						$(this).find('session_id').text(simst_sessionID);
					})
					xml = (new XMLSerializer()).serializeToString(data);

				}
			}).done(sendMessageToSimSt);
	if (quizMode == true)
		QuizMode();
}

function sendMessageToSimSt() {
	console.log(xml);
	$.ajax({
		async : true,
		crossDomain : true,
		url : hostname + "/SimStudentServlet/serv",
		method : "POST",
		dataType : "text",
		data : xml,
		success : function(data) {
			console.log("Response : " + data);
		}
	});
}

$("#closetutorInterface")
		.on(
				'click',
				function() {
					$
							.ajax(
									{
										async : true,
										crossDomain : true,
										url : hostname
												+ "/SimStudentServlet/serv",
										method : "POST",
										dataType : "text",
										data : "<message><verb>NotePropertySet</verb><properties><MessageType>InterfaceAction</MessageType>"
												+ "<transaction_id>235f276d-5772-3c22-e64d-4c51ab6427ac</transaction_id><Selection><value>"
												+ "closetutor</value></Selection><Action><value>ButtonPressed</value></Action><Input><value><![CDATA[-1]]></value></Input><session_id>"
												+ simst_sessionID
												+ "</session_id></properties></message>",
										success : function() {
											$("#confirm").show();
										}

									}).done(requestResponseFromSimSt);
				});

$("#confirmButton")
		.click(
				function() {
					$("#confirmprompt").hide();
					window.location.href = hostname
							+ "/SimStudentServlet/SimStWebTutor/TutorOptions.jsp?username="
							+ url.get("userName");
				});

$("#learningFailedConfirmation").click(function() {
	$("#learningFailed").hide();
})

$(document)
		.on(
				'mouseover',
				'#activationList td',
				function() {
					var key = $(this).closest('tr').attr('id');
					for (var i = 0; i < foas[key].length; i++)
						window.frames['tutorInterface'].contentDocument
								.getElementById(foas[key][i].trim()).style.borderColor = "rgb(19,230,90)";
				});
$(document)
		.on(
				'mouseout',
				'#activationList td',
				function() {
					var key = $(this).closest('tr').attr('id');
					for (var i = 0; i < foas[key].length; i++)
						window.frames['tutorInterface'].contentDocument
								.getElementById(foas[key][i].trim()).style.borderColor = "rgb(0,0,0)";
				});

function generateSessionID() {
	return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-'
			+ this.s4() + '-' + this.s4() + this.s4() + this.s4();
}

this.s4 = function s4() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

function changeBorderColor(color) {

	for ( var i in foas)
		$("#tutorInterface").contents().find(foas[i])
				.css("border-color", color);
}