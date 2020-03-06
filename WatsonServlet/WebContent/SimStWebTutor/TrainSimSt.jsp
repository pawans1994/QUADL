<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Watson</title>
</head>

<link rel="stylesheet" href="css/bootstrap.min.css">
<link href="css/custom.css" rel="stylesheet">

<script data-silex-static="true" type="text/javascript"src="https://cdn.ctat.cs.cmu.edu/html-editor/js/jquery.js"></script>
<script data-silex-static="true" type="text/javascript"src="https://cdn.ctat.cs.cmu.edu/html-editor/js/jquery-ui.js"></script>
<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/themes/smoothness/jquery-ui.css" rel="stylesheet" type="text/css" media="all" />
<script src="js/bootstrap.min.js"></script>
<script>
//var url = new URLSearchParams(window.location.search);
var config ={
path : '<%=getServletContext().getInitParameter("folderPath")%>'
	};
</script>
</head>

<body>


	<div><h1 align="center">Web based SimStudent Tutoring</h1>
	</div>
	<!--  <div>
		<div  style="float: left; width: 20%;">
			<div id="productionlearned"></div><br>
			<div id="problemslearned"></div>
		</div>
		<div id="tutor" style="float: left; width: 60%;" align="center">
			<!-- src must be "/SimStudentServlet/WebAuthoring/"+getUserName()+"/"+getTutorName()"/"+getHTML() -->
			<!--  <iframe id="tutorInterface" align="center" width="550" height="550">
			</iframe>
			<br> <br> <br>
			<div class="btn-toolbar">
				<button class="btn-primary" id="startStateButton">Start</button>
				<button class="btn-primary" id="doNextStepButton">Do the
					next step</button>
				<button class="btn-primary" id="newProblemButton">Clear the interface</button>
				 <!--<button class="btn-primary" id="done">Done</button>-->
			<!--  	<br> <br> <br>
			</div>
			<textarea class="form-control" id="textFieldSS" rows="5" cols="2"></textarea>
			<br> <br>

			<button class="btn-primary" id="yesButton">Yes</button>
			<button class="btn-primary" id="noButton">No</button>
			<input type="text" id="textFieldSkill" hidden="true">
		</div>

		<div style="float: right; width: 20%;">
			<button class="btn-warning" data-toggle="modal" data-target="#closetutorprompt">Close the Tutor</button>
			<div class="modal fade" id="closetutorprompt" role="dialog">
				<div class="modal-dialog">

					<!-- Modal content-->
					<!--  <div class="modal-content">
						<div class="modal-body">
							<p>Do you want to close the tutor?</p>
						</div>
						<div class="modal-footer">
							<button type="button" id="closetutorInterface" class="btn btn-warning" data-dismiss="modal">Yes</button>
							<button type="button" class="btn btn-warning" data-dismiss="modal">No</button>
						</div>
					</div>

				</div>
			</div>
		</div>
		<div class="modal" id="confirm" role="dialog" style='display: none;'>
				<div class="modal-dialog">

					<!-- Modal content-->
					<!--  <div class="modal-content">
						<div class="modal-body">
							<p>The tutor was closed successfully</p>
						</div>
						<div class="modal-footer">
							<button type="button" id="confirmButton" class="btn btn-success" data-dismiss="modal">OK</button>
						</div>
					</div>

				</div>
		</div>
		<script src="js/SimSt.js"></script>
	</div>-->
	
	<div>
	    <div class="col-sm-6">
	    	<div id="dvLoading" style='display: none;' ></div>
	     <%@ include file="TutorPage.jspf" %>
	    </div>
		<div class="col-sm-6">
		   	<div class="row"><button class="btn-warning" data-toggle="modal" data-target="#closetutorprompt">Close the Tutor</button>
		   	</div>
		   	<br>
			<div class="row">
			   <div class="col-md-3">
			       <table id="problemsSolved" class="table table-bordered">
			       <thead ><tr><th scope="col">Problems Solved</th></tr></thead>
			       </table>
			   </div>
			   <div class="col-md-3">
			   		<table id="rulesLearned" class="table table-bordered">
			        <thead ><tr><th scope="col">Rules learned</th></tr></thead>
			        </table>
			   </div>
			   <div class="col-md-6" >
			      <table id="activationList" class="table table-bordered">
				  <thead>
			       <tr>
			         <th scope="col">Activation rule</th>
			         <th scope="col">Input</th>
			       </tr>
			       </thead>
			       </table>
			   </div> 
			</div>
		</div>
	</div>
	<div style="float: right; width: 20%;">
			<div class="modal fade" id="closetutorprompt" role="dialog">
				<div class="modal-dialog">

					<!-- Modal content-->
					 <div class="modal-content">
						<div class="modal-body">
							<p>Do you want to close the tutor?</p>
						</div>
						<div class="modal-footer">
							<button type="button" id="closetutorInterface" class="btn btn-warning" data-dismiss="modal">Yes</button>
							<button type="button" class="btn btn-warning" data-dismiss="modal">No</button>
						</div>
					</div>

				</div>
			</div>
		</div>
		<div class="modal" id="confirm" role="dialog" style='display: none;'>
				<div class="modal-dialog">

					<!-- Modal content-->
					  <div class="modal-content">
						<div class="modal-body">
							<p>The tutor was closed successfully</p>
						</div>
						<div class="modal-footer">
							<button type="button" id="confirmButton" class="btn btn-success" data-dismiss="modal">OK</button>
						</div>
					</div>

				</div>
		</div>
		
		<div class="modal" id="learningFailed" role="dialog" style='display: none'>
		   <div class="modal-dialog">
		       <div class="modal-content">
		                <div class="modal-body">
							<p>The step was not learned.</p>
						</div>
						<div class="modal-footer">
							<button type="button" id="learningFailedConfirmation" class="btn btn-success" data-dismiss="modal">OK</button>
						</div>
		       </div>
		   </div>
		</div>
	
       <script src="js/SimSt.js"></script>
       <script src= "js/accessory.js"></script>

</body>
</html>