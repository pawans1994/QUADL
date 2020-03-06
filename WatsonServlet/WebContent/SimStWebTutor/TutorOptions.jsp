<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href = "css/bootstrap.min.css">
<title>Watson</title>
<style>
body {
    padding-top: 248px;
    padding-bottom: 28px;
}
</style>
</head>
<script src="js/jquery.js"></script>
<script type="text/javascript">
var hostname = $(location).attr('protocol');
var url = new URLSearchParams(window.location.search);
var createPage = hostname+"/SimStudentServlet/SimStWebTutor/TutorDetails.jsp?username="+url.get("username");
var modifyPage = hostname+"/SimStudentServlet/SimStWebTutor/TutorsList.jsp?username="+url.get("username");
</script>
<body>
<div class="container" align="center">

     <a id="createTutor" href="">Click here to create a new Tutor</a><br>
     <a id="modifyTutor">Click here to modify a Tutor</a>
</div>
<script>
$("#createTutor").attr('href',createPage);
$("#modifyTutor").attr('href',modifyPage);
</script>
</body>
</html>