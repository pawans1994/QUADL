function CheckboxXBlockInitStudio(runtime, element) {
    
    $(function ($) {
        /* when the page on load, get all the data from python backend. */
        var getDefaultData = runtime.handlerUrl(element, 'get_default_data');
        $.ajax({
            type: "POST",
            url: getDefaultData,
            data: JSON.stringify({'result': 'getDefaultData'}),
            success: function(data) {
                
                $('#problemTitleForEdit').val(data.display_name);
                $('#problemIdForEdit').val(data.problemId);
                $('#kcForEdit').val(data.kc);
                $('#questionForEdit').val(data.question);
                var choices = "";
                for(var i = 0; i < data.choices.length; i++) {
                    if(i == data.choices.length - 1) {
                        choices += data.choices[i];
                    } else {
                        choices += data.choices[i] + '|';
                    }
                }
                $('#choicesForEdit').val(choices);
                $('#hintForEdit').val(data.hint);
                $('#correctForEdit').val(data.correct_choice);
            }
        });
    });
    
    // for cancel button:
    $('.cancel-button', element).click(function() {
        runtime.notify('cancel', {});
    });
    
    // for save button:
    $('.save-button', element).click(function() {
        var problemTitle = $("#problemTitleForEdit").val();
        var problemId = $("#problemIdForEdit").val();
        var question = $("#questionForEdit").val();
        var choices = $("#choicesForEdit").val().split("|");
        var hint = $("#hintForEdit").val();
        var correct = $("#correctForEdit").val();
        var kc = $("#kcForEdit").val();
        
        var updateUrl = runtime.handlerUrl(element, 'update_question');
        var obj = {
            'problemTitle' : problemTitle,
            'problemId' : problemId,
            'question': question,
            'choices': choices,
            'hint': hint,
            'correct': correct,
            'kc': kc
        }
       
        
        $.ajax({
            type: "POST",
            data: JSON.stringify(obj),
            url: updateUrl,
            success: function(data){
                runtime.notify('save', {state: 'end'});
            }
        });
        
        
    });
                                     

        
}