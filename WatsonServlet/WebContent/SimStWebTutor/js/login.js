/**
 * 
 */

var hostname = $(location).attr('protocol');

$(function(){

$("#login").submit(function(e){
    var username = $("#username").val();
    var password = $("#pwd").val();
    if(username.length == 0 || password.length == 0){
    	$("#output").removeClass(' alert alert-success');
        $("#output").addClass("alert alert-danger animated fadeInUp").html("Provide valid username & password");
        //$("#output").removeClass('alert alert-danger animated fadeInUp');

    }
    else {
    	$.ajax({
    		type: 'POST',
    		url : hostname+'/SimStudentServlet/Login',
    		data : "username="+username+"&password="+password,
    		success:function(data,textStatus,jqXHR){
    			console.log("Response from server : "+data);
    			if(data == "valid"){
    				window.location.href = hostname+"/SimStudentServlet/SimStWebTutor/TutorOptions.jsp?username="+username;
    			}
    			else{
    				$("#output").removeClass(' alert alert-success');
                    $("#output").addClass("alert alert-danger animated fadeInUp").html("Invalid username or password");
                    $("#output").removeClass('alert alert-danger animated fadeInUp');
    			}
    		},
    		error: function(jqXHR, textStatus, errorThrown){
    			console.log(" Error");
    		}
    	});
    }
	e.preventDefault(); //STOP default action
   });
});

             