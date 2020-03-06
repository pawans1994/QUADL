$("#doNextStepButton").addClass("disabled");
$("#yesButton").addClass("disabled");
$("#noButton").addClass("disabled");
google.charts.load("current", {
	packages : [ 'corechart' ]
});
var skills = [];

function fillProblemBank() {

	$("#tutorInterface").contents().find('input[type=text]').each(function() {
		// alert($(this).attr('id') + " " + $.trim($(this).val()));
		if ($.trim($(this).val()) != '') {
			fillAnswersTable($(this).attr('id'), $.trim($(this).val()));
			// answers[$(this).attr('id')] = $.trim($(this).val());
		}
	});
	fillProblemAnswer();
}

$(document).on(
		"click",
		"#problemBank tr",
		function(e) {
			var id = $(this).find('a').attr('id');
			// alert(id);
			var items = problemBank[id];

			for ( var key in items) {
				var element = $("#tutorInterface").contents().find("#" + key);
				if ($(element).is('div'))
					$("#tutorInterface").contents().find("#" + key + " input")
							.val(items[key]);
				else
					$("#tutorInterface").contents().find("#" + key).val(
							items[key]);

			}
		})

function QuizMode() {

	$
			.ajax(
					{
						async : true,
						crossDomain : true,
						url : hostname + "/SimStudentServlet/serv",
						method : "POST",
						dataType : "text",
						data : "<message><verb>NotePropertySet</verb><properties><MessageType>InterfaceAction</MessageType>"
								+ "<transaction_id>235f276d-5772-3c22-e64d-4c51ab6427ac</transaction_id><Selection><value>"
								+ "QuizMode</value></Selection><Action><value>ButtonPressed</value></Action><Input><value><![CDATA[-1]]></value></Input><session_id>"
								+ simst_sessionID
								+ "</session_id></properties></message>",

					}).done(getSkillName);
}

function getSkillName() {
	$.ajax({
		async : true,
		crossDomain : true,
		url : hostname + "/SimStudentServlet/serv",
		method : "GET",
		dataType : "text",
		data : "session_id=" + simst_sessionID,
		success : function(data) {
			var wellData = "<MessageBundle>" + data + "</MessageBundle>";
			console.log("Response : " + wellData);
			var xml = $.parseXML(wellData);
			$(xml).find("MessageBundle message properties").each(function() {
				var messageType = $(this).find("MessageType").text();
				if (messageType == "SkillMessage")
					parseSkillMessage(this);
				else if (messageType == "ProblemMessage")
					parseProblemMessage(this);
				else if (messageType == "InterfaceAction")
					parseInterfaceAttribute(this);
			});
		}
	});
}

function parseInterfaceAttribute(xmlDoc) {
	var selection = $(xmlDoc).find("Selection").text();
	var input = $(xmlDoc).find("Input").text();
	$("#tutorInterface").contents().find("#" + selection).val(input);
	fillAnswersTable(selection, input);

}

function fillAnswersTable(selection, input) {
	answers[selection] = input;
}

function fillProblemAnswer() {
	if (problemName != "") {
		problemBank[problemName] = answers;
		$("#problemBank").append(
				"<tr><td><a id='" + problemName + "'>" + problemName
						+ "</a></td></tr>");
		problemName = "";
	}
}
function parseProblemMessage(xmlDoc) {
	if (problemName != "") {
		fillProblemAnswer();
	}
	answers = {};
	problemName = $(xmlDoc).find("ProblemName").text();
}

function parseSkillMessage(xmlDoc) {

	if (skills[$(xmlDoc).find("skillname").text()] == undefined)
		skills[$(xmlDoc).find("skillname").text()] = 0;

	if ($(xmlDoc).find("skillCount") != undefined)
		skills[$(xmlDoc).find("skillname").text()] = skills[$(xmlDoc).find(
				"skillname").text()]
				+ parseInt($(xmlDoc).find("skillCount").text());

	google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {
	var chartDetails = [];
	var index = 0;
	chartDetails[index] = [ "Skills", "Number of problems", {
		role : "style"
	} ];
	for ( var skill in skills) {
		chartDetails[index + 1] = [ skill, skills[skill], "#76A7FA" ];
		index = index + 1;
	}
	var data = google.visualization.arrayToDataTable(chartDetails);

	var view = new google.visualization.DataView(data);
	view.setColumns([ 0, 1, {
		calc : "stringify",
		sourceColumn : 1,
		type : "string",
		role : "annotation"
	}, 2 ]);

	var options = {
		title : "Number of Problems vs Skills",
		width : 600,
		height : 400,
		bar : {
			groupWidth : "95%"
		},
		legend : {
			position : "none"
		},
	};
	var chart = new google.visualization.ColumnChart(document
			.getElementById("barChart"));
	chart.draw(view, options);
}

$("#saveProblemBank")
		.click(
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
												+ "saveProblemBank</value></Selection><Action><value>ButtonPressed</value></Action><Input><value><![CDATA[-1]]></value></Input><session_id>"
												+ simst_sessionID
												+ "</session_id></properties></message>",
										success : function(data) {
											$("#problemBankConfirmation")
													.show();
										}

									}).done(requestResponseFromSimSt);
				});

$("#okButton").click(function() {
	$("#problemBankConfirmation").hide();
});
