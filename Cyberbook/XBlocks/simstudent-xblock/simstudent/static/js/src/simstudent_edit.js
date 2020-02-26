/* Javascript for simstudentXBlock. */
function simstudentXBlock(runtime, element) {

    $(element).find('.cancel-button').bind('click', function() {
        runtime.notify('cancel', {});
    });

	//$('.save-button',element).click(function(eventObject){
	$(element).find('.save-button').bind('click', function(){
		var host = $(edit_host).context.value;
		var port = $(edit_port).context.value;
		var brd_name = $(edit_name).context.value;
		var folder_name = $(edit_folder_name).context.value;
		var problem_name = $(edit_problem_name).context.value;
		var type_checker_name = $(edit_value_type_checker_name).context.value;
		var backend_name = $(edit_backend_name).context.value;
		var complete_url = "http://"+host+":"+port+"/SimStudentServlet/tutor.html?BRD=http%3A%2F%2F"+host+"%3A"+port+"%2FSimStudentServlet%2F"+brd_name+"&ARG=-traceOn+-folder+"+folder_name+"+-problem+"+problem_name+"+-ssTypeChecker+"+type_checker_name+"&CSS=&INFO=&BRMODE=AuthorTimeTutoring&AUTORUN=on&KEYBOARDGROUP=Disabled&BACKDIR=http%3A%2F%2F"+host+"%3A"+port+"%2FSimStudentServlet%2Fbuild%2Fclasses&BACKENTRY="+backend_name+"&PROBLEM=xxx&DATASET=FlashLoggingTest_xxx&LEVEL1=Unit1&TYPE1=unit&USER=qa-test&GENERATED=on&SOURCE=PACT_CTAT_HTML5&USEOLI=false&SLOG=true&LOGTYPE=None&DISKDIR=.&PORT=4000&REMOTEURL=serv&SKILLS=&VAR1=xxx_xxx&VAL1=xxx&VAR2=xxx_xxx&VAL2=xxx&VAR3=xxx_xxx&VAL3=xxx&VAR4=xxx_xxx&VAL4=xxx&submit=Launch+HTML5+Tutor";

		var data = {
			'href':complete_url,
			'host':host,
			'port':port, 
			'name':brd_name,
			'folder_name': folder_name,
			'problem_name': problem_name,
			'value_type_checker_name': type_checker_name,
			'backend_name': backend_name
		};
		
		$('.xblock-editor-error-message', element).html();
        	$('.xblock-editor-error-message', element).css('display', 'none');
		
		var handlerUrl = runtime.handlerUrl(element,'save_simstudent');

		runtime.notify('save', {state: 'start'});
	        $.post(handlerUrl, JSON.stringify(data)).done(function(response){
			runtime.notify('save', {state: 'end'});
	        });

        // $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
        //     if (response.result === 'success') {
        //         window.location.reload(false);
        //     } else {
        //         $('.xblock-editor-error-message', element).html('Error: '+response.message);
        //         $('.xblock-editor-error-message', element).css('display', 'block');
        //     }
        // });

	});
}
