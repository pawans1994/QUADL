/**
 * 
 */
var hostname = $(location).attr('protocol');
var url = new URLSearchParams(window.location.search);
var username = url.get("username");
$( document ).ready(function() {
	$.ajax({
		type: 'GET',
		url : hostname+'/SimStudentServlet/GetTutorsListUsingUsername',
		data : 'userName='+username,
		processData: false,
		success: function(data){
			$("#")
        	//window.location = hostname+"/SimStudentServlet/SimStWebTutor/TrainSimSt.jsp?"+"userName="+username+"&tutorName="+tutorName+"&html="+html;
         }
	});
});