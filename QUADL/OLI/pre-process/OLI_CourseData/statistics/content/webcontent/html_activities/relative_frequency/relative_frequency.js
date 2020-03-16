$(document).ready(function(){

/*function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}*/

var $grid = $('#grid');
    
    var numbers = '<div>';
    for (j = 1; j < 32; j++){
        numbers += '<div class="square2">'+ j + '</div>';
    }
    numbers += '</div>';
    $grid.append(numbers);

    var jan = '<div>';
    for (j = 1; j < 32; j++){
        jan += '<div class="square">'+ "0" + '</div>';
    }
    jan += '</div>';
    $grid.append(jan);


    var feb = '<div>';
    for (j = 1; j < 29; j++){
        feb += '<div class="square">'+ "0" + '</div>';
    }
    feb += '</div>';
    $grid.append(feb);


    var mar = '<div>';
    for (j = 1; j < 32; j++){
        mar += '<div class="square">' + "0" + '</div>';
    }
    mar += '</div>';
    $grid.append(mar);


    var apr = '<div>';
    for (j = 1; j < 31; j++){
        apr += '<div class="square">' + "0" + '</div>';
    }
    apr += '</div>';
    $grid.append(apr);


    var may = '<div>';
    for (j = 1; j < 32; j++){
        may += '<div class="square">' + "0" + '</div>';
    }
    may += '</div>';
    $grid.append(may);


    var june = '<div>';
    for (j = 1; j < 31; j++){
        june += '<div class="square">' + "0" + '</div>';
    }
    june += '</div>';
    $grid.append(june);


    var july = '<div>';
    for (j = 1; j < 32; j++){
        july += '<div class="square">' + "0" + '</div>';
    }
    july += '</div>';
    $grid.append(july);


    var aug = '<div>';
    for (j = 1; j < 32; j++){
        aug += '<div class="square">' + "0" + '</div>';
    }
    aug += '</div>';
    $grid.append(aug);


    var sep = '<div>';
    for (j = 1; j < 31; j++){
        sep += '<div class="square">' + "0" + '</div>';
    }
    sep += '</div>';
    $grid.append(sep);


    var oct = '<div>';
    for (j = 1; j < 32; j++){
        oct += '<div class="square">' + "0" + '</div>';
    }
    oct += '</div>';
    $grid.append(oct);


    var nov = '<div>';
    for (j = 1; j < 31; j++){
        nov += '<div class="square">' + "0" + '</div>';
    }
    nov += '</div>';
    $grid.append(nov);

    var dec = '<div>';
    for (j = 1; j < 32; j++){
        dec += '<div class="square">' + "0" + '</div>';
    }
    dec += '</div>';
    $grid.append(dec);
    
    var placeholder = '<div>';
    placeholder+='<div class="placeholder">'  + '  </div>'
    $grid.append(placeholder);



var birthdays = 0;
var matches = 0;
var button = d3.select("#samplebutton");
var birthdaytext = d3.select("#birthdaytext");
var matchtext = d3.select("#matchtext");

button.on("click",function(){
		birthdays = birthdays - (-document.getElementById("textbox").value);
	for(i = 0; i < document.getElementById("textbox").value; i++){

	randNumb=Math.floor((Math.random() * 365) + 1)-2;

	var ancestor = document.getElementById('grid');
	var  descendents = ancestor.getElementsByClassName('square');
	    var date = descendents[randNumb+1];
	    var newnumber = parseFloat(date.innerHTML)+1;
	    if(newnumber == 1){
	    	date.style.backgroundColor = "yellow";
	    }
	    else{
			date.style.backgroundColor = "orange";
			matches++;
	    }
	    date.innerHTML = newnumber;
	}
	birthdaytext.text("Birthdays: " + birthdays);
	matchtext.text("Matches: " + matches);
});

var reset = d3.select("#resetbutton");
reset.on("click",function(){
	var ancestor = document.getElementById('grid');
	var  descendents = ancestor.getElementsByClassName('square');
	for(var k = 0; k < 365; k++){
		descendents[k].style.backgroundColor = "white";
		descendents[k].innerHTML = 0;
	}
	matches = 0;
	birthdays = 0;
	birthdaytext.text("Birthdays: " + birthdays);
	matchtext.text("Matches: " + matches);
});







})