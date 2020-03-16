$(document).ready(function(){


	var container = "#applet",
		minAge = 1,
		maxAge = 10,
		ageSlots = maxAge - minAge + 1;

	var button = $("<button>Reset</button>")
					.css("float", "left")
					.css("clear", "both")
					.on("click", function(){
						plot.update([]);
					});
	$(container).append(button);


	var plot = d3.dotplot().plot(container, minAge, maxAge);
	plot.color("black", "red", "blue");
	plot.showMean();
	plot.showMedian();
	plot.slider();
	plot.update([]);
});