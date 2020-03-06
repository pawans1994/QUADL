var xml = "";
var parentID;
var hostname = $(location).attr('protocol');
var url = new URLSearchParams(window.location.search);
var myVars = {
	question_file : "/SimStudentServlet/SimStWebTutor/anyStepOk.brd",
	tutoring_service_communication : "javascript"
};
$(document)
		.on(
				'dblclick',
				function(event) {
					event.stopPropagation();
					parentID = event.target.parentNode.id;
					var value = event.target.value.trim();
					var session = (typeof sessionID == 'undefined') ? window.parent.simst_sessionID
							: sessionID;
					var id;

					if (value.length > 0) {
						if (parentID.includes('.')) {
							var row = parseInt(parentID.substring(parentID
									.indexOf("R") + 1,
									parentID.indexOf("R") + 2)) + 1;
							var col = parseInt(parentID.substring(parentID
									.indexOf("C") + 1,
									parentID.indexOf("C") + 2)) + 1;
							id = parentID.substring(0, parentID.indexOf("."))
									+ "_C" + col + "R" + row;
						} else
							id = parentID;
						$
								.ajax(
										{
											async : true,
											crossDomain : true,
											url : hostname
													+ "/SimStudentServlet/serv",
											method : "POST",
											dataType : "text",
											data : "<message><verb>NotePropertySet</verb><properties><MessageType>InterfaceAction</MessageType><transaction_id>235f276d-5772-3c22-e64d-4c51ab6427ac</transaction_id><Selection><value>"
													+ id
													+ "</value></Selection><Action><value>DoubleClick</value></Action><Input><value>"
													+ value
													+ "</value></Input><session_id>"
													+ session
													+ "</session_id></properties></message>"
										}).done(requestResponseFromSimSt);
					}

				});

$(document)
		.on(
				"keydown",
				function(event) {
					// event.originalEvent.stopImmediatePropagation();
					if (event.keyCode == 13) {
						parentID = event.target.parentNode.id;
						var val = event.target.value.trim();
						var session = (typeof (sessionID) == 'undefined') ? window.parent.simst_sessionID
								: sessionID;
						var id;
						var previous;

						if (val.length > 0) {
							console
									.log(" ID : " + parentID + " value : "
											+ val);
							if (parentID.includes('.')) {
								var row = parseInt(parentID.substring(parentID
										.indexOf("R") + 1, parentID
										.indexOf("R") + 2)) + 1;
								var col = parseInt(parentID.substring(parentID
										.indexOf("C") + 1, parentID
										.indexOf("C") + 2)) + 1;
								id = parentID.substring(0, parentID
										.indexOf("."))
										+ "_C" + col + "R" + row;
								console.log(" ID in keydown : " + id
										+ " row : " + row + " col : " + col);
							} else
								id = parentID;

							if (typeof stepValue !== 'undefined') {
								stepValue[stepCount] = val;
								attempts[stepCount] = (attempts[stepCount] == undefined) ? 1
										: attempts[stepCount] + 1;

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
												data : "<message><verb>NotePropertySet</verb><properties><MessageType>InterfaceAction</MessageType><transaction_id>235f276d-5772-3c22-e64d-4c51ab6427ac</transaction_id><Selection><value>"
														+ id
														+ "</value></Selection><Action><value>UpdateTextField</value></Action><Input><value>"
														+ val
														+ "</value></Input><session_id>"
														+ session
														+ "</session_id></properties></message>"
											}).done(requestResponseFromSimSt);
							$(this).blur();
							$(this).css('outline', 'none');
						}

					} else {
						parentID = event.target.parentNode.id;
						$("#" + parentID + " :input").css('color',
								'rgb(0, 0, 0)');
						$("#" + parentID + " :input").css('border-color',
								'initial');
						$("#" + parentID + " :input").css('outline',
								'rgb(59, 153, 252) auto 5px');
					}
				});

$(document).on(
		'focusout',
		'.CTATTextInput :input',
		function() {
			$(this).css("outline", "none");
			if ($(this).val().length > 0) {
				event.preventDefault();
				$(this).focus();
				return false;
			}

			// if the border color is red we need to get rid of this
			if ($(this).css('border-color') == "#FF0000"
					|| $(this).css('border-color') == 'rgb(255, 0, 0)')
				$(this).css('border-color', 'initial');

		});

$(document).on(
		'focusin',
		'.CTATTextInput :input',
		function() {
			console.log($(this).css('border-color'));
			if ($(this).css('border-color') == '#FF0000'
					|| $(this).css('border-color') == 'rgb(255, 0, 0)')
				$(this).css('outline', 'none');
			else
				$(this).css('outline', 'rgb(59, 153, 252) auto 5px');
		});

$(document)
		.on(
				'click',
				'.CTAT-done-button',
				function() {
					var session = (typeof sessionID == 'undefined') ? window.parent.simst_sessionID
							: sessionID;
					console.log(" Done button clicked")
					$
							.ajax({
								async : false,
								crossDomain : true,
								url : hostname + "/SimStudentServlet/serv",
								method : "POST",
								dataType : "text",
								data : "<message><verb>NotePropertySet</verb><properties><MessageType>InterfaceAction</MessageType><transaction_id>235f276d-5772-3c22-e64d-4c51ab6427ac</transaction_id><Selection><value>"
										+ "done</value></Selection><Action><value>ButtonPressed</value></Action><Input><value>"
										+ "-1</value></Input><session_id>"
										+ session
										+ "</session_id></properties></message>"
							});
					if (typeof (sessionID) != 'undefined'
							&& session == sessionID)
						validateDone();
					else {
						$("#textFieldSS", parent.document.body).val(
								"Please specify the skill");
						$("#textFieldSkill", parent.document.body).val("");
						$("#textFieldSkill", parent.document.body).show();
						requestResponseFromSimSt();
					}
				});

function ctatOnload() {
	initTutor(myVars);
}

function requestResponseFromSimSt() {
	var xmlDoc;
	var color, component, id;
	var session = (typeof sessionID == 'undefined') ? window.parent.simst_sessionID
			: sessionID;

	$
			.ajax({
				async : true,
				crossDomain : true,
				url : hostname + "/SimStudentServlet/serv",
				method : "GET",
				dataType : "text",
				data : "session_id=" + session,
				success : function(data) {
					var wellData = "<MessageBundle>" + data
							+ "</MessageBundle>";
					console.log("Response : " + data);
					xmlDoc = $.parseXML(wellData);
					console.log(" XML : " + xmlDoc);
					$(xmlDoc)
							.find("MessageBundle message")
							.each(
									function() {
										var messageType = $(this).find(
												"MessageType").text();
										console.log("Message Type : "
												+ messageType);
										/***************************************
										 * The message has three parts :
										 * InterfaceAttribute, SkillMessage,
										 * HintsMessage, Interface
										 */

										// InterfaceAtribute contains
										// border_color which tells whether the
										// step is correct or incorrect
										if (messageType
												.includes("InterfaceAttribute")) {
											color = $(this)
													.find("border_color")
													.text();
											component = $(this).find(
													"component").text();

											if (component.includes("_")) {
												id = component.substring(0,
														component.indexOf("_"))
														+ ".R"
														+ (parseInt(component
																.substring(
																		component.length - 1,
																		component.length)) - 1)
														+ "C"
														+ (parseInt(component
																.substring(
																		component
																				.indexOf("_") + 2,
																		component
																				.indexOf("_") + 3)) - 1);
											} else
												id = component;
											console.log(" ID : " + id);

											if (id.includes("done"))
												$(".CTAT-done-button").css(
														'border-color', color);
											else if (!id
													.includes("textFieldSkill")
													&& !id.includes("hint")) {
												$(
														"#"
																+ id
																+ " input[type=text]")
														.css('border-color',
																color);
												document.getElementById(id).style.borderColor = color;

												if (color == "#FF0000")
													$("#" + id + " :input")
															.css("color", color);

												if (color == "#13E65A")
													$("#" + id + " :input")
															.attr("disabled",
																	true);
												else {
													$("#" + id + " :input")
															.focus();
													$("#" + id + " :input")
															.css("outline",
																	"none");
												}
												if (typeof correctness != 'undefined') {
													correctness[stepCount] = (color == "#13E65A") ? "correct"
															: "incorrect";
												}
											}

										}
										// ShowHintsMessage contains the hint
										// message from the Model Tracer
										else if (messageType
												.includes("ShowHintsMessage")) {
											console.log(" Hint Message : "
													+ $(this).find(
															"HintsMessage")
															.text());
											var message = $(this).find(
													"HintsMessage").text();
											if (message.length > 0)
												$("#hintArea textarea").val(
														message);
										}
										// SkillMessage contains the skill name
										// assosiated with a step
										else if (messageType
												.includes("SkillMessage")) {
											var skillname = $(this).find(
													"skillname").text().split(
													"::")[1];
											console.log(" skillname : "
													+ skillname);
											// send only the first attempt of
											// the step ( dont allow if the user
											// requested for hint without
											// attempting for the step) to the
											// ALP

											if (attempts != undefined) {
												var logDetails = {
													timestamp : getTimeStamp(),
													timezone : timezone,
													student_response_type : 'ATTEMPT',
													problem_name : question,
													problem_view : 1,
													attempts : attempts[stepCount],
													outcome : correctness[stepCount],
													selection : id,
													action : 'UpdateTextField',
													input : stepValue[stepCount],
													feedback : 'N/A',
													help_level : '',
													kc : skillname,
													cf_field : {
														cf_action : 'Step Performed',
														cf_result : 'N/A'
													}
												};
												// Log the step to the database
												logging(logDetails);

												if (attempts[stepCount] == 1)
													updateSkillCorrectness(
															skillname,
															correctness[stepCount]);

												// If the step is correct then
												// we proceed to the next step
												if (correctness[stepCount] == "correct")
													stepCount = stepCount + 1;
											}

										}
										// InterfaceAction contains the
										// selection, action & input values. We
										// need to update the interface with SAI
										else {
											var selection = "#"
													+ $(this).find("Selection")
															.text();
											var inputRes = $(this)
													.find("Input").text();

											if (!selection.toLowerCase()
													.includes("table")) {
												console
														.log(" It's not a table")
												$(selection,
														parent.document.body)
														.val(
																"SimSt : "
																		+ inputRes);
												if (inputRes
														.includes("Please specify the skill")) {
													$(
															"#textFieldSkill",
															parent.document.body)
															.val("");
													$(
															"#textFieldSkill",
															parent.document.body)
															.show();
												}
											} else {
												id = selection.substring(1,
														selection.indexOf("_"))
														+ ".R"
														+ (parseInt(selection
																.substring(
																		selection.length - 1,
																		selection.length)) - 1)
														+ "C"
														+ (parseInt(selection
																.substring(
																		selection
																				.indexOf("_") + 2,
																		selection
																				.indexOf("_") + 3)) - 1);
												if (document.getElementById(id)
														.getElementsByTagName(
																'textarea').length)
													document
															.getElementById(id)
															.getElementsByTagName(
																	'textarea')[0].value = inputRes;
												else
													document
															.getElementById(id)
															.getElementsByTagName(
																	'input')[0].value = inputRes;
											}

										}
									});
				}
			});
}
CTAT.ToolTutor.sendToInterface = function(message) {

	if (this.message_handler) {
		if (!message.includes("CorrectAction")
				&& !message.includes("ProblemSummaryResponse")) {
			return this.message_handler.receiveFromTutor(message);
		}
	}

};

CTAT.ToolTutor.sendToTutor = function(message) {
	if (this.tutor) {
		return this.tutor.receiveFromInterface(message);
	}
};
