/**
 * 
 */
var hostname = $(location).attr('protocol');
var hints = [];
var index = 0;
var skillHint;
$("#hintRequest")
		.click(
				function(event) {
					event.stopPropagation();
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
												+ "hint</value></Selection><Action><value>ButtonPressed</value></Action><Input><value>"
												+ "<![CDATA[hint request]]></value></Input><session_id>"
												+ sessionID
												+ "</session_id></properties></message>"
									}).done(getResponse);

				});

$("#prevHint").click(function() {
	index--;
	$("#hintMessage").val(hints[index]);
	logHint();
	/** disable the previous hint button* */
	if (index - 1 < 0)
		$('#prevHint').prop('disabled', true);

	/** enable next hint button * */
	if (index + 1 < hints.length)
		$('#nextHint').prop('disabled', false);

});

$("#nextHint").click(function() {

	index++;
	$("#hintMessage").val(hints[index]);
	logHint();

	/** disable next hint button */
	if (index + 1 == hints.length)
		$('#nextHint').prop('disabled', true);

	/** enable prev hint button* */
	if (index - 1 > -1)
		$('#prevHint').prop('disabled', false);
});

function getResponse() {
	$
			.ajax(
					{
						async : true,
						crossDomain : true,
						url : hostname + "/SimStudentServlet/serv",
						method : "GET",
						dataType : "text",
						data : "session_id=" + sessionID,
						success : function(data) {
							console.log("Response : " + data);
							xmlDoc = $.parseXML("<data>" + data + "</data>");
							console.log(" XML : " + xmlDoc);
							index = 0;
							hints = [];

							/***************************************************
							 * The message has three parts : InterfaceAttribute,
							 * SkillMessage, HintsMessage
							 */

							$(xmlDoc)
									.find("message properties")
									.each(
											function() {
												var messageType = $(this).find(
														"MessageType").text();

												if (messageType == "ShowHintsMessage") {
													var hintMessage = $(this)
															.find(
																	"HintsMessage")
															.text().trim();
													console.log(" Message : "
															+ hintMessage);
													if (hintMessage.length > 0)
														hints.push(hintMessage);

													console.log(" Length : "
															+ hints.length);
													if (hints.length > 0) {
														var hintMessage = hints[index]
																.split(",");
														$("#hintMessage").val(
																hintMessage[0]);
														$(
																"#"
																		+ hintMessage[1]
																		+ " input")
																.css(
																		'border-color',
																		'#FFFF00');
													}

													$('#prevHint').prop(
															'disabled', true);
													/** enable next button* */
													if (index + 1 < hints.length) {
														console
																.log("enabling next hint button");
														$("#nextHint").prop(
																'disabled',
																false);
													}
												} else if (messageType == "SkillMessage") {
													/**
													 * Since the student has
													 * requested a hint, the
													 * current step is incorrect
													 */
													var skillDetails = $(this)
															.find("skillname")
															.text().split(" ");
													skillHint = skillDetails[1]
															.split("::")[1];
													correctness[stepCount] = "incorrect";
													attempts[stepCount] = (attempts[stepCount] == undefined) ? 1
															: attempts[stepCount] + 1;

													if (attempts[stepCount] == 1)
														updateSkillCorrectness(
																skillHint,
																correctness[stepCount]);

												}

											});
						}
					}).done(logHint);
}

function logHint() {
	console.log(" Logging : " + hints);

	var logDetails = {
		timestamp : getTimeStamp(),
		timezone : getTimeZone(),
		student_response_type : 'HINT_REQUEST',
		problem_name : question,
		problem_view : 1,
		attempts : '0',
		outcome : 'hint',
		selection : 'Hint',
		action : 'ButtonPressed',
		input : '-1',
		feedback : hints,
		help_level : index,
		kc : skillHint,
		cf_field : {
			cf_action : 'Hint Requested',
			cf_result : 'N/A'
		}
	};

	// Log the step to the database
	logging(logDetails);
}
