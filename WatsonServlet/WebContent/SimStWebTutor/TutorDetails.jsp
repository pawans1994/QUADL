<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Watson</title>
<link rel="stylesheet" href = "css/bootstrap.min.css">
<link  href="css/TutorDetails.css" rel="stylesheet">
<script src="js/jquery.js"></script>
</head>
<body>
<div class="container">
<div id="message"></div>
<form class="form-horizontal" method="post" enctype="multipart/form-data" id="fileUpload">
                <div class="form-group">
                    <label class="col-sm-3 control-label">Tutor Name</label>
                    <div class="col-sm-6">
                        <input type="text" id="tutorName" placeholder="Tutor Name" class="form-control" autofocus>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">HTML file</label>
                    <div class="col-sm-6">
                        <input type="text" id="htmlPath"  class="form-control">
                    </div>
                    <div class="col-sm-3">
                    <label class="btn btn-default btn-file"> Browse
                        <input type="file" id="html" hidden>
                    </label>
                    </div>
                </div>
                 <div class="form-group">
                    <label class="col-sm-3 control-label">CSS file</label>
                    <div class="col-sm-6">
                        <input type="text" id="cssPath"  class="form-control">
                    </div>
                    <div class="col-sm-3">
                    <label class="btn btn-default btn-file"> Browse
                        <input type="file" id="css" hidden multiple>
                    </label>
                    </div>
                </div>
                 <div class="form-group">
                    <label class="col-sm-3 control-label">Operator file</label>
                    <div class="col-sm-6">
                        <input type="text" id="operatorPath"  class="form-control">
                    </div>
                    <div class="col-sm-3">
                    <label class="btn btn-default btn-file"> Browse
                        <input type="file" id="operator" hidden>
                    </label>
                    </div>
                </div>
                 <div class="form-group">
                    <label class="col-sm-3 control-label">Feature file</label>
                    <div class="col-sm-6">
                        <input type="text" id="featurePath"  class="form-control">
                    </div>
                    <div class="col-sm-3">
                    <label class="btn btn-default btn-file"> Browse
                        <input type="file" id="feature" hidden>
                    </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">Java class files</label>
                    <div class="col-sm-6">
                        <input type="text" id="javaPath"  class="form-control">
                    </div>
                    <div class="col-sm-3">
                    <label class="btn btn-default btn-file"> Browse
                        <input type="file" id="java" hidden multiple>
                    </label>
                    </div>
                </div>
                <div class="form-group">
                	  <label class="col-sm-3 control-label">Type Checker</label>
                      <div class="col-sm-3">
                      	<div class="radio"> 
                      	<input type="radio" id="defaultClass" name="typeChecker">
                      	<label for="defaultClass">Default</label>
                      	</div>
						<div class="radio">
						<input type="radio" id="customClass" name="typeChecker">
                      	<label for="customClass">New Type Checker</label>
						</div>                      		
                     </div>
                     <div class="col-sm-3" id="typeCheckerClass"></div>
                </div>
                <div class="form-group">
                	  <label class="col-sm-3 control-label">Input Matcher</label>
                      <div class="col-sm-3">
                      	<div class="radio"> 
                      	<input type="radio" id="defaultClass" name="inputMatcher">
                      	<label for="defaultClass">Default</label>
                      	</div>
						<div class="radio">
						<input type="radio" id="customClass" name="inputMatcher">
                      	<label for="customClass">New Input Matcher</label>
						</div>                      		
                     </div>
                     <div class="col-sm-3" id="inputMatcherClass"></div>
                </div>
                
                <div class="form-group">
                    <div class="col-sm-6 col-sm-offset-3">
                        <button type="submit" id="createTutor" class="btn btn-primary btn-block">Create Tutor</button>
                    </div>
                </div>
            </form>
</div>
</body>
<script src="js/bootstrap.min.js"></script>

<script src="js/createNewTutor.js"></script>

</html>