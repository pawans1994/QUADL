/* Javascript for CheckboxXBlock. */
function CheckboxXBlock(runtime, element) {

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



function CheckboxXBlockInitView(runtime, element) {

    var hint_array = [];
    var count = 0;
    var xblock_id = "";
    var xblock_code = "";
    // for refresh:
    var countTimes = 0;
    var correctOrNot = false;
    var userChoice = '';
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
                console.log(xblock_id + "nan??");
                countTimes = data.countTimes;
                correctOrNot = data.correctness;
                userChoice = data.userChoice.replace(",", "");
                var checkboxes = $("div[data-usage-id='" + xblock_id + "'] input[type='checkbox']");
                console.log("User choices: " + userChoice);
                for(var i = 0; i < userChoice.length; i++) {
                    $("div[data-usage-id='" + xblock_id + "'] input[value='" + userChoice[i] + "']").attr('checked', 'checked');
                }
            }
        });
        
        
        //alert("...countTimes: " + countTimes + ", correctOrNot: " + correctOrNot + ", userChoice: " + userChoice);
        
        //addBorderColor();
        
    });
    /*
    function addBorderColor() {
        $("label").not($("label input[name='choice']:checked").parent()).hover(function() {
            $(this).addClass("addBorder");
        }, function() {
            $(this).removeClass("addBorder");
        });
    }
    
    function removeBorderColor() {
        $("label").hover(function() {
            $(this).removeClass("addBorder");
        }, function() {
            $(this).removeClass("addBorder");
        });
    }
     After page refreshed..
    jQuery(window).load(function () {
        //alert($("div[data-usage-id='" + xblock_id + "'] input[name='choice']:checked").val());
        // which means user refresh the page:
        if(countTimes > 0 && userChoice > 0) {
            var selectedCheck = $("div[data-usage-id='" + xblock_id + "'] input[name='choice']:checked");
            //alert(selectedCheck.val());
            if(correctOrNot) {
                selectedCheck.parent().addClass('correct');
                selectedCheck.parent().append("<i class='tick'>&nbsp;&nbsp;&nbsp;  &#x2713;</i>");
            } else {
                selectedCheck.parent().addClass('incorrect');
                selectedCheck.parent().append("<i class='ballot'>&nbsp;&nbsp;&nbsp; &#10006;</i>");
            }
        }
    });
    */
    
    
    
    // when submit button has been clicked
    $('#submit', element).on('click', function(e){
        //send ajax request to get the question name
        checkAnswer();
        /*
        removeBorderColor();
        addBorderColor();
        */
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
        $("#" + xblock_code).text(hint_array[count]);
        
    });
    
    // check answer button
    function checkAnswer() {
        
        var selectedCheck = '';
        var checkboxes = $("div[data-usage-id='" + xblock_id + "'] input[type='checkbox']:checked");
        for(var i = 0; i < checkboxes.length; i++) {
            if(i != checkboxes.length - 1) {
                selectedCheck += checkboxes[i].value + ',';
            } else {
                selectedCheck += checkboxes[i].value
            }
            console.log("selectedCheck zhi: " + selectedCheck);
        }
        
        
        var setStatusWhenRefresh = runtime.handlerUrl(element, 'set_status_when_refresh');
        $.ajax({
            type: "POST",
            data: JSON.stringify({'setStatus': true, 'userChoice': selectedCheck}),
            url: setStatusWhenRefresh,
            success: function(data) {
                // do nothing.
            }
        });
        
        
        //alert(selectedCheck);
        
        var checkUrl = runtime.handlerUrl(element, 'check_answer');
        $.ajax({
            type: "POST",
            data: JSON.stringify({'ans': selectedCheck}),
            url: checkUrl,
            success: function(data){
                // mark question as attempted
                //$("#question-block").attr("id", xblock_id + "question-block");
                //$("#question-block", element).addClass('attempted');
                
                
                if(data.correct == true){
                    //selectedCheck.parent().addClass('correct');
                    //selectedCheck.parent().append("<i class='tick'>&nbsp;&nbsp;&nbsp;  &#x2713;</i>");
                    console.log("The answer is correct");
                }else{
                    // indicate correct and incorrect
                    //selectedCheck.parent().addClass('incorrect');
                    //selectedCheck.parent().append("<i class='ballot'>&nbsp;&nbsp;&nbsp; &#10006;</i>");
                    console.log("The answer is incorrect.");
                }
                // start to store all the user activities:
                var userUrl = runtime.handlerUrl(element, 'get_student_id');
                $.ajax({
                    type: "POST",
                    data: JSON.stringify({'hintCount': count, 'type': 'checkbutton'}),
                    url: userUrl,
                    success: function(data) {
                        console.log("User Id : " + data.user);
                        console.log("Xblock Id :" + data.xblock_id);
                        if(data.user !== null) {
                            // Then start to store all the information to db:
                            var student_id = data.user.toString().split(',')[3];

                            // all the answer located in edxapp.courseware_studentmodule

                        }
                    }
                });
            }
        });
        
        
        
        /*
        
        var setStatusWhenRefresh = runtime.handlerUrl(element, 'set_status_when_refresh');
        $.ajax({
            type: "POST",
            data: JSON.stringify({'setStatus': true, 'userChoice': selectedCheck}),
            url: setStatusWhenRefresh,
            success: function(data) {
                // do nothing.
            }
        });
        
       
        var selectedCheck = $("div[data-usage-id='" + xblock_id + "'] input[name='choice']:checked");
        var answerId = selectedCheck.val();
        var userSelected = answerId;
        
        //alert("user selected: " + answerId);
        $("div[data-usage-id='" + xblock_id + "'] input[name='choice']").not(selectedCheck).removeAttr('checked');
        selectedCheck.attr("checked", "checked");
        // remove class and <i> tag if there are any exist:
        $("div[data-usage-id='" + xblock_id + "'] label").attr('class', '');
        $("div[data-usage-id='" + xblock_id + "'] i").remove(".tick");
        $("div[data-usage-id='" + xblock_id + "'] i").remove(".ballot");
        
        //alert("dada: " + userSelected + ", changed?:" + answerId);
        
        //selectedCheck.parent().addClass('user-choice');
       
        
        //================Testing the anonynous user id=================
        */
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
                
            } 
        });
    }
    
    function saveHint() {
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
                console.log(data);
            }
        });
    }
}