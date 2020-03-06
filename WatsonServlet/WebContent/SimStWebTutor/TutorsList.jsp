<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Watson</title>
<link rel="stylesheet" href = "css/bootstrap.min.css">
<link  href="css/TutorDetails.css" rel="stylesheet">
<script type="text/javascript">
var hostname = $(location).attr('protocol');
var url = new URLSearchParams(window.location.search);
var username = url.get("username");
</script>
</head>
<body>
<div class="container">
	
	<div class="dropdown">
		<label class="col-sm-3 control-label">Tutor</label>
  		<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Choose a tutor to modify
 	    <span class="caret"></span></button>
  		<ul id="tutorsList" class="dropdown-menu">
    		<li><a href="#">HTML</a></li>
    		<!--<li><a href="#">CSS</a></li>
    		<li><a href="#">JavaScript</a></li>-->
  		</ul>
	</div>
	
</div>
</body>
</html>