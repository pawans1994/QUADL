$(document).ready(function(){

	var scores, state;

	function newGame(){
		return {
		closed: [true, true, true],
		winner: Math.floor(Math.random() * 3),
		gameOver: false,
		firstGuess: null,
		stage: 'start'
		};
	}

	function legalAction(door){
		if (state.gameOver == true){
			return true;
		}

		if (state.closed[door]){
			return true;
		}
		return false;
	}

	function removeOption(options, val){
		// var i = options.indexOf(val);
		var result = [];
		for (var i = 0; i < options.length; i++){
			if(options[i] != val){
				result.push(options[i]);				
			}
		}
		return result;
	}

	function pickRandomOption(options){
		var l = options.length;
		for (var i = 0; i < l; i++){
			// alert(options[i] + ' is an option');
		}
		var index = Math.floor(Math.random() * l);
		var result = options[index];
		return result;
	}

	function openDoor(door){
		//if door is already open this does nothing
		if(state.closed[door]){
			state.closed[door] = false;
			doorSelector = $("#" + door + ".door");
			doorSelector.find("img").remove();
			if(door == state.winner){
				doorSelector.append('<img id="door" src="money.png" />');
			}else{
				doorSelector.append('<img id="door" src="donkey.jpg" />');
			}
		}	
	}

	function closeDoor(door){
		//if door is already closed this does nothing
		if(!state.closed[door]){
			state.closed[door] = true;
			doorSelector = $("#" + door + ".door");
			doorSelector.find("img").remove();
			doorSelector.append('<img id="door" src="Door.jpg" />');
		}	
	}

	function updateScore(){
		//update the table in the DOM
		var tableString = "<table><tr><th/><th>Wins</th><th>Losses</th></tr>";
		tableString += "<tr><th>Switching: </th><td>" + scores.Switching.Win + "</td><td>" + scores.Switching.Loss +"</td></tr>";
		tableString += "<tr><th>Staying: </th><td>" + scores.Staying.Win + "</td><td>" + scores.Staying.Loss +"</td></tr>";
		tableString += "</table>";

		var table = $(tableString);
		var div = $('.table');
		div.find('*').remove();
		div.append(table);
	}

	function playAction(action){
		switch(state.stage){
			case 'start': //all doors open
				state.firstGuess = action;
				var toOpen;
				var options = [0, 1, 2];
				options = removeOption(options, action);
				options = removeOption(options, state.winner);
				toOpen = pickRandomOption(options);
				openDoor(toOpen);
				message("You have picked door " + (action+1) + ". Switch or stay?");
				state.stage = 'middle';
				break;

			case 'middle':
				//open all doors
				for(var i = 0; i < 3; i++){
					openDoor(i);
				}
				var strategy = (action == state.firstGuess) ? "Staying" : "Switching";
				var result = (action == state.winner) ? "Win" : "Loss";
				var msg = (action == state.winner) ? "You win! Click a door to play again." : "You lose! Click a door to play again.";
				message(msg);
				scores[strategy][result]++;
				updateScore(strategy, result);
				state.gameOver = true;
				state.stage = 'end';
				break;

			case 'end':
				//close all doors
				for(var i = 0; i < 3; i++){
					closeDoor(i);
				}
				state = newGame();
				message("Pick a door");
				break;
		}
	}

	function message(msg){

		$(".msg").text(msg);
	}

	$(".door").on("click", function(){
		var action = parseInt($(this).attr('id'));
		if (legalAction(action)){
			playAction(action);
		}
	});
	
	function init(){
		$(".door > img").remove();
		$(".door").append('<img id="door" src="Door.jpg" />');
		scores = {
					Switching: {
						Win: 0,
						Loss: 0
					},
					Staying: {
						Win: 0,
						Loss: 0
					}}
		updateScore();
		state = newGame();
		message('Pick a door');
	}

	init();	
});