/* Javascript for TextboxXBlock. */
function TextboxXBlock(runtime, element) {

    function updateCount(result) {
        $('.count', element).text(result.count);
    }

    var handlerUrl = runtime.handlerUrl(element, 'increment_count');

    $('p', element).click(function(eventObject) {
        $.ajax({
            type: "POST",
            url: handlerUrl,
            data: JSON.stringify({"hello": "world"}),
            success: updateCount
        });
    });

    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
}



/* Javascript for McqsXBlock. */
function TextboxXBlockInitView(runtime, element) {

    var hint_array = [];
    var count = 0;
    var xblock_id = "";
    var xblock_code = "";
    // for refresh:
    var countTimes = 0;
    var correctOrNot = false;
    var userAnswer = "";
    $(function ($) {
        var xblockIdUrl = runtime.handlerUrl(element, 'get_xblock_id');
        $.ajax({
            type: "POST",
            url: xblockIdUrl,
            data: JSON.stringify({'getquestion': true}),
            async: false,
            success: function(data) {
                xblock_id = data.xblock_id;
                xblock_code = data.xblock_code;
                $("div[data-usage-id='" + xblock_id + "'] span[id='hint']").attr("id", xblock_code);
            }
        }); 
        
        var getStatusWhenRefresh = runtime.handlerUrl(element, "get_status_when_refresh");
        $.ajax({
            type: "POST",
            url: getStatusWhenRefresh,
            data: JSON.stringify({'getData': true}),
            async: false,
            success: function(data) {
                countTimes = data.countTimes;
                correctOrNot = data.correctness;
                userAnswer = data.userAnswer;
                
                
                var selectedCheck = $("div[data-usage-id='" + xblock_id + "'] div[id='answers'] input");
                //console.log("This is the " + countTimes);
                
                if(countTimes >= 1) {
                    if(correctOrNot) {
                        selectedCheck.removeClass('correct incorrect');
                    selectedCheck.addClass('correct');
                    $("div[data-usage-id='" + xblock_id + "'] div[id='answers'] i").remove();
                    selectedCheck.parent().append("<i id='tick' class='tick'>&nbsp;&nbsp;&nbsp;  &#x2713;</i>");
                    selectedCheck.val(userAnswer);
                    } else {
                        selectedCheck.removeClass('correct incorrect');
                        selectedCheck.addClass('incorrect');
                        $("div[data-usage-id='" + xblock_id + "'] div[id='answers'] i").remove();
                        selectedCheck.parent().append("<i id='ballot' class='ballot'>&nbsp;&nbsp;&nbsp; &#10006;</i>");
                        selectedCheck.val(userAnswer);
                    }
                    
                } 
                
            }
        });
        
        // set focus
        
        $("div[data-usage-id='" + xblock_id + "'] div[id='answers'] input").bind('keydown', function(e) {
            if(e.which == 13) {
                e.preventDefault();
                //alert($("div[data-usage-id='" + xblock_id + "'] div[id='answers'] input").val());
                checkAnswer();
                removeBorderColor();
                $("div[data-usage-id='" + xblock_id + "'] div[id='answers'] input").blur();
            }    
        });
        
        // This method trigger the get_border_color, if there is no any other XBlock(e.g. Text paragraph XBlock) matches the skill name.
        $.ajax({
            url: runtime.handlerUrl(element, "get_border_color"),
            type: "POST",
            data: JSON.stringify({"getBorderColor": true}),
            success: function(data) {
                if(data.setBorderColor == 0) {
                    // studio and lms: the structure of the html are not the same, data-usage-id is for studio use only.
                    $("div[data-usage-id='" + xblock_id + "'] div[id='border']").css("border", "2px solid red");
                    
                } 
            }
        });
        
        // testing, for deletion function:
        var deleteButtonGroup = document.getElementsByClassName("delete-button");
        var xblockGroup = document.getElementsByClassName("xblock-student_view");
        
        var getXBlockIdFromBroswer=function(arg){  
            return function(){  
                
                console.log("Now I have: " + document.getElementsByClassName("xblock-student_view").length + " xblock on the page.");
                console.log("Now I have: " + document.getElementsByClassName("delete-button").length + " delete button on the page.");
                console.log(arg);
                console.log($("#deleteButton_" + arg).closest("section").children("article").children("div").attr("data-usage-id"));
                var selectedXBlockId = $("#deleteButton_" + arg).closest("section").children("article").children("div").attr("data-usage-id");
                
//                $("div").one("click", ".action-secondary", function(event) {
//	                //alert("Now the 'Cancle' button trigger: " + event.target.className + "#" + event.target.id);	
//                });
                $("div").one("click", ".action-primary", function(event) {
	                //alert("Now the 'Yes' button trigger: " + event.target.className + "#" + event.target.id);
                    $.ajax({
                        url: runtime.handlerUrl(element, "delete_xbock"),
                        type: "POST",
                        data: JSON.stringify({"xblock_id": selectedXBlockId}),
                        anysc: false,
                        success: function(data) {
                            console.log("Deleted sucessfully!");
                        }
                    });
                    for(var i = 0; i < deleteButtonGroup.length; i++) {
                        deleteButtonGroup[i].id = "deleteButton_" + (i);
                        deleteButtonGroup[i].onclick = getXBlockIdFromBroswer(i);
                    }
                });
                
            }  
        };
        for(var i = 0; i < deleteButtonGroup.length; i++) {
            deleteButtonGroup[i].id = "deleteButton_" + (i);
            deleteButtonGroup[i].onclick = getXBlockIdFromBroswer(i);
            
        }
        
        
    });
    
    
    
    function removeBorderColor() {
        $("label").hover(function() {
            $(this).removeClass("addBorder");
        }, function() {
            $(this).removeClass("addBorder");
        });
    }
    
    
    
    
    // when submit button has been clicked
    $('#submit', element).on('click', function(e){
        
        /* for sound effect application: ============================
        var audio = document.createElement("audio");
        audio.src = "http://www.freesfx.co.uk/rx2/mp3s/5/16952_1461335341.mp3";
        audio.volumn = 0.50;
        audio.autoPlay = false;
        audio.preLoad = true;
        audio.play();
        */
        //send ajax request to get the question name
        checkAnswer();
        removeBorderColor();
       
    });
    
    
    
    // when getHint button has been clicked
    $("#getHint", element).on('click', function(e){
        
        //$("div[data-usage-id='" + xblock_id + "'] span[id='hint']").attr("id", xblock_code);
        if(hint_array.length === 0) {
            getHint();
            saveHint();
        } else {
            count++;
            if(count > hint_array.length - 1) {
                count = 0;
            }
            saveHint();
            //alert(question);
            //$("#" + question + "hint").text(hint_array[count]);
            //$("#hint").text(hint_array[count]);    
        }
        //alert("hint message should show at the right place.");
        //alert(xblock_id);
        if(!$("div[data-usage-id='" + xblock_id + "'] span[title='Get Hint']").hasClass("help-tip")) {
            $("div[data-usage-id='" + xblock_id + "'] span[title='Get Hint']").addClass("help-tip");
        }
        $("#" + xblock_code).html(hint_array[count]);
        
    });
    
    // check answer button
    function checkAnswer() {
        var selectedCheck = $("div[data-usage-id='" + xblock_id + "'] input[id='userAnswer']");
        //alert(selectedCheck.val());
        // ==========================================================
        var setStatusWhenRefresh = runtime.handlerUrl(element, 'set_status_when_refresh');
        $.ajax({
            type: "POST",
            data: JSON.stringify({'setStatus': true, 'userAnswer': selectedCheck.val()}),
            url: setStatusWhenRefresh,
            async: false
        });
        
        var answer = selectedCheck.val();
        var userSelected = answer;
        
        //alert("user selected: " + answerId);
        //$("div[data-usage-id='" + xblock_id + "'] input[name='choice']").not(selectedCheck).removeAttr('checked');
        //selectedCheck.attr("checked", "checked");
        // remove class and <i> tag if there are any exist:
        //$("div[data-usage-id='" + xblock_id + "'] label").attr('class', '');
        //$("div[data-usage-id='" + xblock_id + "'] i").remove(".tick");
        //$("div[data-usage-id='" + xblock_id + "'] i").remove(".ballot");
        
        //alert("dada: " + userSelected + ", changed?:" + answerId);
        
        //selectedCheck.parent().addClass('user-choice');
        var checkUrl = runtime.handlerUrl(element, 'check_answer');
        $.ajax({
            type: "POST",
            data: JSON.stringify({'ans': userSelected}),
            url: checkUrl,
            success: function(data){
                // mark question as attempted
                //$("#question-block").attr("id", xblock_id + "question-block");
                //$("#question-block", element).addClass('attempted');
                
                 
                if(data.correct == true){
                    console.log("correct");
                    selectedCheck.removeClass('correct incorrect');
                    selectedCheck.addClass('correct');
                    $("div[data-usage-id='" + xblock_id + "'] div[id='answers'] i").remove();
                    selectedCheck.parent().append("<i id='tick' class='tick'>&nbsp;&nbsp;&nbsp;  &#x2713;</i>");
                }else{
                    // indicate correct and incorrect
                    console.log("incorrect");
                    selectedCheck.removeClass('correct incorrect');
                    selectedCheck.addClass('incorrect');
                    $("div[data-usage-id='" + xblock_id + "'] div[id='answers'] i").remove();
                    selectedCheck.parent().append("<i id='ballot' class='ballot'>&nbsp;&nbsp;&nbsp; &#10006;</i>");
                }
                
                
                var userUrl = runtime.handlerUrl(element, 'get_student_id');
                $.ajax({
                    type: "POST",
                    data: JSON.stringify({'hintCount': count, 'type': 'checkbutton'}),
                    url: userUrl,
                    success: function(data) {
                        console.log("User Id : " + data.user_id);
                        console.log("Xblock Id :" + data.xblock_id);
                        if(data.user_id !== null) {
                            // Then start to store all the information to db:
                            var student_id = data.user_id.toString().split(',')[3];

                            // all the answer located in edxapp.courseware_studentmodule

                        }
                    }
                });
            }
        });
        
        //================Testing the anonynous user id=================
        
    }

    // get hint function
    function getHint() {   
        // send Ajax:
        var hintUrl = runtime.handlerUrl(element, 'get_hint');

        $.ajax({
            type: "POST",
            data: JSON.stringify({'getHint': true}),
            url: hintUrl,
            async: false,
            success: function(data){
                hint_array = data.response.split("|");
                //alert(hint_array);
            } 
        });
    }
    
    function saveHint() {
        
        var hintUrl = runtime.handlerUrl(element, 'get_hint');
        
        $.ajax({
            type: "POST",
            data: JSON.stringify({'getHint': true}),
            url: hintUrl,
            async: false
        });
        //$("#hint").text(hint_array[count]);
        // start to send ajax request and store the user activities:
        var userUrl = runtime.handlerUrl(element, 'get_student_id');
        $.ajax({
            type: "POST",
            data: JSON.stringify({'hintCount': count, 'type': 'hintbutton'}),
            url: userUrl,
            success: function(data) {
                console.log("User Id : " + data.user);
                console.log("Xblock Id :" + data.xblock_id);
            }
        });
    }
}
