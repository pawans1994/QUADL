$(document).ready(function(){

	var margin = {left: 20, right: 20, top: 10, bottom: 75},
    	width = 500,
    	height = 200;

    var bins = 1000;

    var svg = d3.select("svg.Graph")
			.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "graph")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var graph = svg.append("g").attr("class", "curve"),
    	flags = svg.append("g").attr("class", "flags"),
       	axis = svg.append("g").attr("class", "axis");

    var controls = d3.select(".Controls"),
    	meanControl = controls.select("#mean"),
    	SDControl = controls.select("#sd"),
    	updateControl = controls.select("#update");
    updateControl.on("click", function(){
    	var mean = parseFloat(meanControl.property("value")),
    		SD 	 = parseFloat(SDControl.property("value"));
    	update(graph, axis, mean, SD);

    });

    var twoTail = true;

    var checkBox = controls.select("input[type='checkbox']")
    				.property('checked', true)
    				.on("click", function(){
    					twoTail = checkBox.property("checked");
    					if(twoTail){

    						$("#update").trigger( "click" );
    					}
    				}); 

    				

    var mean = 0, SD = 1;

    update(graph, axis, mean, SD);

   	function update(graph, axis, mean, SD){
   		graph.selectAll("*").remove();

   		var N = bins,
   			min = mean - (4 * SD),
   			max = mean + (4 * SD);
   		

   		var binWidth = (max - min)/N;

   		var data = getProbabilities(mean, SD, min, bins, binWidth);

   		var x = d3.scale.linear()
					.domain([min, max])
					.range([margin.left, width - margin.right]),

		y = d3.scale.linear()
				.domain([0, p(mean, mean, SD)])
				.range([height, margin.top]);

		getAxis(x);

		renderCurve(graph, data, x, y, binWidth, "#BF6EE0", "curve");

		addFlags(graph, data, x, y, mean, SD, min, max, binWidth);
   	}
	
	function addFlags(graph, data, xScale, yScale, mean, SD, binWidth){
		var flags = graph.append("g").attr("class", "flags");

		var lFlag = getFlag(flags, xScale, mean, SD, "left"),
			rFlag = getFlag(flags, xScale, mean, SD, "right");

		addFunctionality(lFlag, data, flags, xScale, yScale, mean, SD, "left", binWidth);
		addFunctionality(rFlag, data, flags, xScale, yScale, mean, SD, "right", binWidth);

		//Put hack for flag label visibility here
		

	}

	function addFunctionality(flag, data, graph, xScale, yScale, mean, SD, side, binWidth){

		var max = mean + 4 * SD,
			min = mean - 4 * SD;

		var maxX = xScale(max),
			minX = xScale(min);

		var otherFlag = graph.select("#" + ((side == "left") ? "right":"left") + ".flag");

		var drag = d3.behavior.drag();

		drag.on("drag", function() {
			var change = d3.event.dx;
			var thisFlag = d3.select(this);
			move(thisFlag, change, minX, maxX);
			updatePositionText(thisFlag, xScale);

            if(twoTail){
            	move(otherFlag, (-change), minX, maxX);
            	updatePositionText(otherFlag, xScale);

            }

            updateSegments(graph, data, xScale, yScale, mean, SD, min, max, binWidth);
		});

		flag.call(drag);

		addXLabel(flag, side, xScale);


		updateSegments(graph, data, xScale, yScale, mean, SD, min, max, binWidth);

	}

	function move(flag, change, min, max){
		flag.attr("transform", function(d){
            	d.x += change;
	            if(d.x > max) d.x = max;
	            if(d.x < min) d.x = min;
                return "translate(" + [ d.x,0 ] + ")"
            });
    }

    function updateSegments(graph, data, xScale, yScale, mean, SD, min, max, binWidth){

    	graph.selectAll("text.percentile").remove();
    	var leftFlag = graph.select("#left.flag"),
    		rightFlag = graph.select("#right.flag");

    	var left = getX(leftFlag, xScale);
    		right = getX(rightFlag, xScale);

    	var hash = (bins/(max-min));
    	var leftIndex = Math.floor((left-min) * hash),
			rightIndex = Math.floor((right-min) * hash);
		graph.selectAll(".faded").remove();
		var fadeColor = " #9D8319";
			
    	if(left < right){
    		var arr = data.slice(leftIndex, rightIndex);
    		renderCurve(graph, arr, xScale, yScale, binWidth, fadeColor, "faded");

    		showPercentile(leftFlag, left, "left", mean, SD, min, max);
    		showPercentile(rightFlag, right, "right", mean, SD, min, max);    		
    	}else{
    		var arr1 = data.slice(0, rightIndex),
    			arr2 = data.slice(leftIndex, bins);
    		renderCurve(graph, arr1, xScale, yScale, binWidth, fadeColor, "faded");
    		renderCurve(graph, arr2, xScale, yScale, binWidth, fadeColor, "faded");
    		var val = cdf(left, mean, SD) - cdf(right, mean, SD);
    		graph.append("text")
			.attr("class", "percentile")
			.attr("x", xScale(mean))
			.attr("y", height - 30)
			.attr("fill", "black")
			.attr("text-anchor", "middle")
			.text(val.toPrecision(4));
    	}
    }

    function showPercentile(flag, pos, side, mean, SD, min, max){
    	pos = pos.toPrecision(4);
    	flag.append("text")
			.attr("class", "percentile")
			.attr("x", ((side == "left") ? (-10) : (10)))
			.attr("y", height - 30)
			.attr("fill", "black")
			.attr("text-anchor", ((side == "left") ? "end":"start"))
			.text(function(){
				var result;
				if(side == "left"){
					result = cdf(pos, mean, SD) - cdf(min, mean, SD);
				}else{
					result = (cdf(max, mean, SD) - cdf(pos, mean, SD));
				}
				return result.toPrecision(4);
			});
    }

	function getFlag(graph, xScale, mean, SD, side){
		var x;

		if(side == "right"){
			x = xScale(mean + SD);
		}else if (side == "left"){
			x = xScale(mean - SD);
		}else{
			alert("error: flag given invalid input");
		}

		var y = 0;
		var flag = graph.append("g")
						.attr("class", "flag")
						.attr("id", side)
						.data([ {"x":x} ])
						.attr("transform", "translate(" + x + "," + y + ")");
		renderFlag(flag, side);
		return flag;
	}

	function updatePositionText(elem, xScale){
		var scaledX = getX(elem, xScale).toPrecision(4);
		elem.select("text.x").text(scaledX);
	}

	function getX(elem, xScale){
		var reverseScale = d3.scale.linear()
					.domain(xScale.range())
					.range(xScale.domain());
		var pureX = d3.transform(elem.attr("transform")).translate[0];
		return parseFloat((reverseScale(pureX)));
	}

	function addXLabel(flag, side, xScale){
		flag.append("text")
			.attr("class", "x")
			.attr("y", 20)
			.attr("x", ((side == "left") ? (-10) : (10)))
			.attr("fill", "black")
			.attr("text-anchor", ((side == "left") ? "end" : "start"));

		updatePositionText(flag, xScale);
	}

	function renderFlag(g, side){
		var flagWidth = 5;
		var color = ((side == "left") ? "green" : "red");
		var flag = g.append("circle")
					.attr("cx", 0)
					.attr("cy", 0)
					.attr("r", flagWidth)
					.style("fill", color),
			pole = g.append("line")
					.attr("y1",height)
					.attr("y2",0)
					.style("stroke", color)
					.style("stroke-width", 2);
	}

	function renderCurve(svg, data, xScale, yScale, binWidth, color, name){
		var area = d3.svg.area()
		    .x(function(d) { return xScale(d.q); })
		    .y0(height)
		    .y1(function(d) { return yScale(d.p); });

	    svg.append("path")
	    .datum(data)
	    .attr("class", "area")
	    .attr("class", name)
	    .attr("d", area)
	    .style("fill", color)
	    .style("stroke", "black")
	    .style("stroke-width", 1);
	}

	function getProbabilities(mean, SD, min, bins, binWidth){
		var probs = [];
		for(var i = 0; i < bins; i++){
			var q = min + i * binWidth;
			probs.push({q: q, p: p(q, mean, SD)});
		}
		return probs;
	}

	function p(val, mean, SD){
	      	var x1 = (val*100 + 10)/100,
	        x2 = (val*100 -10)/100;
	      return (cdf(x1, mean, SD) - cdf(x2, mean, SD));
	}

  	function cdf(val, mean, SD) {
  		//
    	return 0.5 * (1 + erf((val - mean) / ((Math.sqrt(2) * SD))));
  	}

	function erf(val) {
	    // save the sign of x
	    var sign = (val >= 0) ? 1 : -1;
	    val = Math.abs(val);

	    // constants
	    var a1 =  0.254829592;
	    var a2 = -0.284496736;
	    var a3 =  1.421413741;
	    var a4 = -1.453152027;
	    var a5 =  1.061405429;
	    var p  =  0.3275911;

	    // A&S formula 7.1.26
	    var t = 1.0/(1.0 + p*val);
	    var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-val * val);
	    return sign * y; // erf(-x) = -erf(x);
	}

   	function getAxis(scale){
   		axis.selectAll("*").remove();

        xAxis = d3.svg.axis()
          .scale(scale)
          .orient('bottom');

        axis.attr("class", "x axis")
        	.attr("transform", "translate(0," + height + ")")
        	.call(xAxis);
  	}

});