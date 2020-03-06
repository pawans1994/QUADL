/**
 *
 */

var url = new URLSearchParams(window.location.search);
var username = url.get("username");
//var username = "Sally";
var tutorName;
var html;
var typeClass="", inputClass="";
var hostname = $(location).attr('protocol');
var formData = new FormData();
$('input[type=file]').on('change', prepareUpload);

function prepareUpload(event){
	var files = event.target.files;
	$.each(files, function(key,value){
		formData.append(key,value);
	});
}

$("#tutorName").change(function(){
	tutorName = $("#tutorName").val();
    formData.append("tutorName", tutorName);
    formData.append("userName", username);
});

$("#createTutor").click(function(event){
	event.preventDefault();
	html = $("#html").val().replace(/.*(\/|\\)/, '');
	var operator = $("#operator").val();
    var feature = $("#feature").val();
    var java = $("#java").val();
     console.log(" Input : "+$("#inputclassname").length+"  Type : "+$("#typeclassname").val());
    if($("#inputclassname").length > 0)
		inputClass = $("#inputclassname").val();
	if($("#typeclassname").length > 0)
		typeClass = $("#typeclassname").val();

    if(html.length == 0 || operator.length == 0 || feature.length == 0 || java.length == 0){
        $("#message").addClass("alert alert-danger fadeInUp").html("Please upload all the necessary files");
    }
    else{
    	$.ajax({
    		type: 'POST',
    		url : hostname+'/SimStudentServlet/UploadFile',
    		data : formData,
    		processData: false,
    		contentType: false
    	}).done(createJessFile);
    }
});


function createJessFile(){
	console.log("Gonna send ajax req");


	$.ajax({
		type: 'GET',
		url : hostname+'/SimStudentServlet/GenerateJessFiles',
		data : 'userName='+username+'&tutorName='+tutorName+'&html='+html+"&inputMatcher="+inputClass+"&typeChecker="+typeClass,
		processData: false,
		success: function(data){
        	 window.location = hostname+"/SimStudentServlet/SimStWebTutor/TrainSimSt.jsp?"+"userName="+username+
        	 "&tutorName="+tutorName+"&html="+html+
        	 "&inputMatcher="+inputClass+
        	 "&typeChecker="+typeClass;
         }
	})/*.done(updateDatabase)*/;
}

function updateDatabase(){
	$.ajax({
		type: 'POST',
		url :hostname+'/SimStudentServlet/createTutor',
		data : 'userName='+username+"&tutorName="+tutorName,
		processData: false,
		success: function(data){
       	 window.location = hostname+"/SimStudentServlet/SimStWebTutor/TrainSimSt.jsp?"+"userName="+username+"&tutorName="+tutorName+"&html="+html;
        }
	});

}


$('input[type=radio][name=typeChecker]').change(function(){
	if(this.id == 'customClass'){
		$("#typeCheckerClass").show();
		$("#typeCheckerClass").after().html('<label>Classname.MethodName</label>'+
				'<input type="text" id="typeclassname" placeholder="Predicate.TypeCheckerForMyDomain">');
	}
	else if(this.id == 'defaultClass')
		$("#typeCheckerClass").hide();
});

$('input[type=radio][name=inputMatcher]').change(function(){
	if(this.id == 'customClass'){
		$("#inputMatcherClass").show();
		$("#inputMatcherClass").after().html('<label>Classname</label>'+
				'<input type="text" id="inputclassname" placeholder="IsEquivalent">');
	}
	else if(this.id == 'defaultClass')
		$("#inputMatcherClass").hide();
});
