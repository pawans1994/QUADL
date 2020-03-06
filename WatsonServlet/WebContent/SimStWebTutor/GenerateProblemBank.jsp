<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Watson</title>
</head>
<link href="css/custom.css" rel="stylesheet">
<link rel="stylesheet" href="css/bootstrap.min.css">
<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/themes/smoothness/jquery-ui.css" rel="stylesheet" type="text/css" media="all" />
<script data-silex-static="true" type="text/javascript"src="https://cdn.ctat.cs.cmu.edu/html-editor/js/jquery.js"></script>
<script data-silex-static="true" type="text/javascript"src="https://cdn.ctat.cs.cmu.edu/html-editor/js/jquery-ui.js"></script>
<script src="js/bootstrap.min.js"></script>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<body>
	<h1 align="center">Web based SimStudent Tutoring</h1>

	<div>
		<div class="col-md-6"><%@ include file="TutorPage.jspf" %></div>
		<div class="col-md-6">
			<div class="row">
			   <div class="col-md-12" id="barChart">
			   </div> 
			</div>
			<div class="row">
			   <div class="col-md-6 well well-lg">
			       <table id="problemBank">
			       <thead><h4>Problem Bank</h4></thead>
			       </table>
			       <button class="btn btn-success" id="saveProblemBank">Save</button>
			   </div>
			   <div class="col-md-6 well well-lg">Skills</div>
			</div>
		</div>
	</div>
	<div class="modal" id="problemBankConfirmation" role="dialog" style='display: none;'>
				<div class="modal-dialog">

					<!-- Modal content-->
					<div class="modal-content">
						<div class="modal-body">
							<p>The problem Bank was successfully saved</p>
						</div>
						<div class="modal-footer">
							<button type="button" id="okButton" class="btn btn-success" data-dismiss="modal">OK</button>
						</div>
					</div>

				</div>
		</div>
</body>
<script>
var config ={
path : '<%=getServletContext().getInitParameter("folderPath")%>'
};
</script>
<script src="js/ProblemBank.js"></script>
<script src="js/SimSt.js"></script>
</html>