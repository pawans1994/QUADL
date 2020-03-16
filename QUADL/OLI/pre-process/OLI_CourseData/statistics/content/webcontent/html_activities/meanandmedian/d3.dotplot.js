d3.dotplot = function(){

	var width = 300,
		height = 100,
		margin = {top: 20, right: 25, bottom: 30, left: 25},
		defaultMax = 10,
		bc = "white",
		defaultColor = "black",
		precision = 2,
		colMax = 15,
		colMin = 0;

	var labels = {
		values: 	{x: (width), y: 0, anchor: "end", offset: 20},
		title: 	{x: 0, y: 0, anchor: "start"}
	}

	//Puts data array into a histogram array for easier representation
	function d3_dotplot_histogramize(plot){
		var data = plot.data,
		histogram = [];//Array(plot.max - plot.min + 1).fill(0);
		for(var j = 0, y = (plot.max - plot.min + 1); j < y; j++){
			histogram.push(0);
		}
		for(var i = 0, x = data.length; i < x; i++){
			histogram[data[i] - plot.min]++;
		}
		plot.histogram = histogram;
	}

	function d3_dotplot_plot(container, minBin, maxBin){
		var x, x2, xAxis,
				labels,
				canvas;

		minBin = minBin || 0,
		maxBin = maxBin || defaultMax;

			/*myAdding the axis for mapping indexes (x) and index values (x2)
				to positions on the plot*/ 

			x = d3.scale.linear()
				.domain([0, (maxBin - minBin)])
				.range([0, width]);

			x2 = d3.scale.linear()
				      .domain([minBin, maxBin])
				      .range([0, width])
				      .clamp(true);

			xAxis = d3.svg.axis()
				      .scale(x2)
				      .orient('bottom');

	   		canvas = d3.select(container)
	   					.attr("width", width + margin.left + margin.right)
					    .attr("height", height + margin.top + margin.bottom)
						.append('svg')
						// .attr("viewBox", "30 30 100 100")
						// .attr("border", "5 5 5 5")
						.style('background-color', bc)
						.attr("width", width + margin.left + margin.right)
					    .attr("height", height + margin.top + margin.bottom)
					    .style("float", "left")
					    .style("clear", "both")
					    .append("g")
					    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
					    .attr("class", "canvas");			

			canvas.append("g")
				      .attr("class", "x axis")
				      .attr("transform", "translate(0," + height + ")")
				      .call(xAxis);

		return {
			data: 		[],
			histogram: 	[],
			min: 		minBin,
			max: 		maxBin,
			color: 		defaultColor,
			color2: 	defaultColor,
			color3: 	defaultColor,
			canvas: 	canvas,
			x: 			x,
			x2: 		x2,
			container: 	container,
			showMean: 	false,
			showMedian: false,
			showADM: 	false,
			boxPlot: 	false,
			showSD: 	false,
			labels: 	[]
		}
	}

	function d3_dotplot_mean(plot, color){
		plot.canvas.selectAll(".mean").remove();

		if(plot.data.length == 0){
			plot.canvas.select(".meanLabel").text("");
		}else{
			var mean = d3.mean(plot.data) || 0,
				g = plot.canvas.append("g")
								.attr("class", "mean")
								.attr("stroke", color),
				x = plot.x2(mean),
				y1 = height,
				y2 = margin.top;
			if(mean != 0){
				d3_dotplot_ln(g, x, x, y1, y2);
			}
			d3_dotplot_display(plot, ("Mean = " + mean.toPrecision(3)), "meanLabel", color);
		}
	}

	function d3_dotplot_median(plot, color){
		plot.canvas.selectAll(".median").remove();
		if(plot.data.length == 0){
			plot.canvas.select(".medianLabel").text("");
		}else{
			var median = d3.median(plot.data),
				g = plot.canvas.append("g")
								.attr("class", "median")
								.attr("stroke", color),
				x = plot.x2(median),
				y1 = height,
				y2 = margin.top;
			d3_dotplot_ln(g, x, x, y1, y2);
			d3_dotplot_display(plot, ("Median = " + median), "medianLabel", color);
		}
	}
	function d3_dotplot_update(plot){
		plot.data = plot.data.sort(d3.ascending);

		d3_dotplot_histogramize(plot);

		if(plot.showMean){
			d3_dotplot_mean(plot, plot.color2);
		}
		if(plot.boxPlot){
			d3_dotplot_boxplot(plot);
		}
		if(plot.showADM){
			d3_dotplot_ADM(plot);
		}
		if(plot.showSD){
			d3_dotplot_SD(plot);
		}
		if(plot.showMedian){
			d3_dotplot_median(plot, plot.color3);
		}

		plot.canvas.selectAll(".bar").remove();
		var bar = plot.canvas.selectAll(".bar")
						    .data(plot.histogram)
						    .enter().append("g")
						    .attr("class", "bar");

		var circles = bar.selectAll("circle")
						      	.data(function(d) { 
						      		return d3.range(0, d);
						      	})
								.enter()
						      	.append("circle")
						      	.attr("cx", function(d, i, j) {
						      		return plot.x(j);
						      	})
						      	.attr("cy", function(d, i, j) {
						      		return height + margin.top - margin.bottom - i * 7;
						      	})
						      	.attr("r", 3)
						      	.attr("fill", plot.color);
	}

	function findLabel(labels, name){
		for(var i = 0; i < labels.length; i++){
			if(labels[i].name === name){
				return i;
			}
		}
		return -1;
	}

	function d3_dotplot_display(plot, value, name, color){
		color = color || plot.color;

		var i = findLabel(plot.labels, name);

		if(i >= 0){
			plot.labels[i].value = value;
			plot.canvas.selectAll("." + name).text(value)
		}else{
			i = plot.labels.length;
			plot.labels.push({name: name, value: value});
			var template = labels.values;
			var position = {
				x: template.x,
				y: template.y + i * template.offset,
				anchor: template.anchor
			}
			d3_dotplot_label(plot, value, position, name, color);
		}
	}

	function d3_dotplot_ln(g, x1, x2, y1, y2, text){
			var line = g.append("line")
						.attr("x1", +x1)
						.attr("x2", +x2)
						.attr("y1", +y1)
						.attr("y2", +y2)
						.style("stroke-width", "1");
			if(text){
				g.append("text")
					.attr("dx", ((x1+x2)/2))
        			.attr("dy", ((y1+y2)/2 - 1))
        			.text(text);
			}
		}

	function d3_dotplot_polygon(g, points, color){
		var p = "";
		for(var i = 0; i < points.length; i++){
			p += points[i].toString() + " ";
		}
		g.append("polygon")
			.attr("points", p)
			.attr("fill", color)
			.attr("stroke", "none");
	}

	function target_boxplot(plot, qX){
		var y1 = 0,
			y2 = 10,
			y3 = 20;
		var boxplot = plot.canvas.append("g")
							.attr("class", "targetBoxPlot")
							.style("stroke", "black");

		d3_dotplot_ln(boxplot, qX[0], qX[4], y2, y2);
		d3_dotplot_ln(boxplot, qX[0], qX[0], y1, y3);
		d3_dotplot_ln(boxplot, qX[4], qX[4], y1, y3);
		d3_dotplot_polygon(boxplot, [ [qX[1], y1], [qX[1], y3], [qX[3], y3], [qX[3], y1]], "grey");
		d3_dotplot_ln(boxplot, qX[2], qX[2], y1, y3);
	}


	function d3_dotplot_boxplot(plot){
		plot.canvas.selectAll(".boxplot").remove();
		var data = plot.data;

		var	quartile = [d3.min(data),
						d3.quantile(data, 0.25),
						d3.quantile(data, 0.5),
						d3.quantile(data, 0.75),
						d3.max(data)],
			qX = quartile.map(plot.x2);
			
		if (plot.data.length > 0){
			var y1 = 25,
				y2 = 35,
				y3 = 45;

			var boxplot = plot.canvas
							.append("g")
							.attr("class", "boxplot")
							.style("stroke", "black");

			d3_dotplot_ln(boxplot, qX[0], qX[4], y2, y2);
			d3_dotplot_ln(boxplot, qX[0], qX[0], y1, y3);
			d3_dotplot_ln(boxplot, qX[4], qX[4], y1, y3);
			d3_dotplot_polygon(boxplot, [ [qX[1], y1], [qX[1], y3], [qX[3], y3], [qX[3], y1]], "Aqua");
			d3_dotplot_ln(boxplot, qX[2], qX[2], y1, y3);
		}
	}

	function StandardDeviation(data){
		var mean = d3.mean(data),
			dm = [];
		for (var i = 0, x = data.length; i < x; i++){
			dm.push(Math.abs(mean - data[i]));
		}
		var dm2 = dm.map(function(o){
			return Math.pow(o, 2);
		});
		return (Math.sqrt(d3.sum(dm2)/(data.length - 1)));
	}

	function d3_dotplot_SD(plot){
		var data = plot.data,
			SD = StandardDeviation(data),
			mean = d3.mean(data);
			plusSD = mean + SD,
			minusSD = mean - SD,
			min = d3.min(data),
			max = d3.max(data);

		plot.canvas.selectAll(".lines").remove();

		if(SD > 0){
			var lines = plot.canvas.append("g")
							.style("stroke", plot.color3)
							.attr("class", "lines");
			var sdh = 30;
			var sdh2 = 50;
			SD = SD.toPrecision(3);
			d3_dotplot_display(plot, ("SD = " + SD), "SDLabel", plot.color3);

			d3_dotplot_polygon(lines, [[plot.x2(minusSD), sdh]
									, [plot.x2(plusSD), sdh]
									, [plot.x2(plusSD), sdh2]
									, [plot.x2(minusSD), sdh2]]
									, "LightGrey");
			
			d3_dotplot_ln(lines, plot.x2(minusSD), plot.x2(mean), sdh, sdh, SD.toString());
			d3_dotplot_ln(lines, plot.x2(mean), plot.x2(plusSD), sdh, sdh, SD.toString());
			d3_dotplot_ln(lines, plot.x2(minusSD), plot.x2(minusSD), height, sdh);
			d3_dotplot_ln(lines, plot.x2(plusSD), plot.x2(plusSD), height, sdh);		
			d3_dotplot_ln(lines, plot.x2(min), plot.x2(max), sdh2, sdh2);
		}else{
			plot.canvas.select(".SDLabel").text("");
		}
	}

	function d3_dotplot_ADM(plot){
		var data = plot.data,
			mean = d3.mean(data),
			dm = [];

		for (var i = 0, x = data.length; i < x; i++){
			dm.push(Math.abs(mean - data[i]));
		}
		var ADM = d3.mean(dm),
		plusADM = mean + ADM,
		minusADM = mean - ADM;

		var min = d3.min(data),
			max = d3.max(data);

		plot.canvas.selectAll(".lines").remove();

		if(ADM > 0){
			var lines = plot.canvas.append("g")
							.style("stroke", plot.color3)
							.attr("class", "lines");
			var admh = 30;
			var admh2 = 50;
			ADM = ADM.toPrecision(3);
			d3_dotplot_display(plot, ("ADM = " + ADM), "ADMLabel", plot.color3);

			d3_dotplot_polygon(lines, [[plot.x2(minusADM), admh]
									, [plot.x2(plusADM), admh]
									, [plot.x2(plusADM), admh2]
									, [plot.x2(minusADM), admh2]]
									, "LightGrey");
			
			d3_dotplot_ln(lines, plot.x2(minusADM), plot.x2(mean), admh, admh);
			d3_dotplot_ln(lines, plot.x2(mean), plot.x2(plusADM), admh, admh);
			d3_dotplot_ln(lines, plot.x2(minusADM), plot.x2(minusADM), height, admh);
			d3_dotplot_ln(lines, plot.x2(plusADM), plot.x2(plusADM), height, admh);		
			d3_dotplot_ln(lines, plot.x2(min), plot.x2(max), admh2, admh2);
		}else{
			plot.canvas.select(".ADMLabel").text("");
		}
	}

	function d3_dotplot_add(plot){
		var index = plot.slider.value();
		if(plot.histogram[index - plot.min] < colMax){
			plot.data.push(index);
			d3_dotplot_update(plot);
		}
	}
	function d3_dotplot_minus(plot){
		var index = plot.data.indexOf(plot.slider.value());
		if (index > -1) {
    		plot.data.splice(index, 1);
		}
		d3_dotplot_update(plot);
	}

	function d3_dotplot_slider(plot){
		var div = d3.select(plot.container);

		var sliderDiv = div
						.append("div")
						.attr("id", "slider")
		var slider = d3.slider()
					.min(plot.min)
					.max(plot.max)
					.ticks(plot.max - plot.min + 1)
					.showRange(true)
					.value(Math.floor((plot.max + plot.min) / 2))
					.stepValues(d3.range(plot.min, plot.max + 1));

		plot["slider"] = slider;
		
		sliderDiv.call(slider);

		var buttonsDiv = div.append("div")
							.attr("id", "buttons");

		var plusButton = buttonsDiv.append("button")
							.style("float", "left")
							.text("Add")
							.on("click", function(){
								d3_dotplot_add(plot);
							})
		var minusButton = buttonsDiv.append("button")
							.style("float", "right")
							.text("Minus")
							.on("click", function(){
								d3_dotplot_minus(plot);
							});
	}

	function d3_dotplot_label(plot, text, position, name, color){

		plot.canvas.selectAll("." + name).remove();

		color = color || plot.color;

		plot.canvas.append("text")
					.attr("class", name)
					.attr("x", position.x)
					.attr("y", position.y)
					.attr("text-anchor", position.anchor)
					.text(text)
					.attr("fill", color)
					.style("font-size", "20px");		
	}

	return{
		plot: function(container, minBin, maxBin){
			var plot = d3_dotplot_plot(container, minBin, maxBin);

			return {
				update: function(data){
					plot.data = data;
					d3_dotplot_update(plot);
				},
				title: function(l){
					d3_dotplot_label(plot, l, labels["title"], "title");
				},
				slider: function(){
					d3_dotplot_slider(plot);
				},
				showMean: function(){
					plot.showMean = true;
					d3_dotplot_update(plot);
				},
				showMedian: function(){
					plot.showMedian = true;
					d3_dotplot_update(plot);
				},
				boxPlot: function(){
					plot.boxPlot = true;
				},
				ADM: function(){
					plot.showADM = true;
				},
				showSD: function(){
					plot.showSD = true;
				},
				color: function(c1, c2, c3){
					plot.color = c1;
					plot.color2 = c2 || plot.color;
					plot.color3 = c3 || plot.color;
				},
				targetBoxPlot: function(quartiles){
					target_boxplot(plot, quartiles.map(plot.x2));
				},
				selection: function(){
					return plot;
				}
			}
		}
	}
}