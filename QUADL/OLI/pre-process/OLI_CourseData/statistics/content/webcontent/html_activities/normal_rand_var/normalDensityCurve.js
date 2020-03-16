$(document).ready(function(){

	//for dynamic ordering
	d3.selection.prototype.moveToFront = function() {
	  return this.each(function(){
	    this.parentNode.appendChild(this);
	  });
	};

	var margin = {left: 40, right: 40, top: 50, bottom: 75},
	    	width = 500,
	    	height = 200;

    var bins = 1000;

    var svg = d3.select("svg.Graph")
			.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "graph")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var curve = svg.append("g").attr("class", "curve"),
    	 flags = svg.append("g").attr("class", "flags"),
       	axis = svg.append("g").attr("class", "axis");

    var shade = svg.append("g").attr("class", "shade");
       	flags.moveToFront();

    var twoTail = true;

    var checkBox = d3.select("input[type='checkbox']")
    				.property('checked', true)
    				.on("click", function(){
    					twoTail = checkBox.property("checked");
    					if(twoTail){
    						ax = mean - SD;
   							bx = mean + SD;
    						update();
    					}
    				});

    //get curve
    var mean = 0, SD = 1,
    	min = mean - (4 * SD),
   		max = mean + (4 * SD),
   		binWidth = (max - min)/bins;

   	var xScale = d3.scale.linear()
				.domain([min, max])
				.range([margin.left, width - margin.right]),

  		xInverse = d3.scale.linear()
				.domain([margin.left, width - margin.right])
				.range([min, max]),

		yScale = d3.scale.linear()
				.domain([0, p(mean, mean, SD)])
				.range([height, margin.top]),

		yInverse = d3.scale.linear()
				.domain([height, margin.top])
				.range([0, p(mean, mean, SD)]);

	getAxis(xScale);

   	var data = getProbabilities(mean, SD, min, bins, binWidth);
   	renderCurve(curve, data, "#BF6EE0", "curve");

   	// create the flags with label on one side
   	ax = mean - SD,
   	bx = mean + SD;

   	a = createFlag(ax, "a");
   	b = createFlag(bx, "b");

   	var aDrag = d3.behavior.drag();
   	aDrag.on("drag", function(){
   		var change = (d3.event.dx);
   		var oldX = xScale(ax);
   		var newX = oldX + change;
   		newAX = xInverse(newX);
   		if (newAX >= min && newAX <= max){
   			ax = newAX;
   			if(twoTail){
   				bx = (mean + (mean - ax));
   			}
   			update();
   		}
   	});

   	var bDrag = d3.behavior.drag();
   	bDrag.on("drag", function(){
   		var change = (d3.event.dx);
   		var oldX = xScale(bx);
   		var newX = oldX + change;
   		newBX = xInverse(newX);
   		if (newBX >= min && newBX <= max){
        bx = newBX;
   			if(twoTail){
   				ax = (mean + (mean - bx));
   			}
   			update();
   		}
   	});

   	a.call(aDrag);
   	b.call(bDrag);

    flags.append("text")
      .attr("id", "between")
      .attr("x", xScale(mean))
      .attr("y", yScale(0.03))
      .attr("text-anchor", "middle")
      .attr("fill", "black");

   	//a bug catcher. Ignore
   	// svg.on("mouseleave", function(){
   	// 	d3.selectAll(".flag").select("#val").attr("visibility", "hidden");
   	// });

   	function createFlag(x, id){
   		f = flags.append("g")
	   			.attr("class", "flag")
	   			.attr("id", id)
	   			.attr("transform", "translate(" + xScale(x) + ")")
	   			// .on("mousedown", function(){
	   			// 	d3.selectAll(".flag").select("#val").attr("visibility", "visible");
	   			// })
	   			// .on("mouseup", function(){
	   			// 	d3.selectAll(".flag").select("#val").attr("visibility", "hidden");
	   			// })
	   			
	   	f.append("line")
	   		.attr("x1", 0)
	   		.attr("x2", 0)
	   		.attr("y1", yScale(0))
	   		.attr("y2", yScale(0.1))
	   		.attr("stroke", "black")
	   		.attr("stroke-width", 3);

	   	f.append("circle")
	   		.attr("cx", 0)
	   		.attr("cy", yScale(0.1))
	   		.attr("r", 5)
	   		.attr("fill", "black");

	   	f.append("text")
	   		.attr("id", "val")
	   		.attr("text-anchor", "left")
	   		.attr("fill", "black");
	   		// .attr("visibility", "hidden");

      f.append("text")
        .attr("id", "proportion")
        .attr("y", yScale(0.03))
        .attr("text-anchor", "left")
        .attr("fill", "black");
	   	return f;
   	}

   	// add dragging functionality

   	//add an update function

    function update(){

      shade.selectAll("*").remove();

    	d3.select("#a.flag").attr("transform", "translate(" + xScale(ax) + ")");
    	d3.select("#b.flag").attr("transform", "translate(" + xScale(bx) + ")");

    	if(ax <= bx){
    		d3.selectAll("#a.flag").select("#val")
    			.attr("text-anchor", "end")
    			.text("a = " + ax.toFixed(2));

        d3.selectAll("#a.flag").select("#proportion")
          .attr("text-anchor", "end")
          .attr("x", -5)
          .text((cdf(ax, mean,SD)-cdf(min,mean,SD)).toFixed(4));

    		d3.selectAll("#b.flag").select("#val")
    			.attr("text-anchor", "start")
    			.text("b = " + bx.toFixed(2));

        d3.selectAll("#b.flag").select("#proportion")
          .attr("text-anchor", "start")
          .attr("x", 5)
          .text((cdf(max, mean,SD)-cdf(bx,mean,SD)).toFixed(4));

        flags.select("#between")
            .text("");

        leftCurve = inRange(data, min, ax);
        renderCurve(shade, leftCurve, "yellow", "what?");

        rightCurve = inRange(data, bx, max);
        renderCurve(shade, rightCurve, "yellow", "what?");

        //set up outer curves



    	}else{
        d3.selectAll("#a.flag").select("#proportion").text("");
        d3.selectAll("#b.flag").select("#proportion").text("");


    		d3.selectAll("#a.flag").select("#val")
    			.attr("text-anchor", "start")
    			.text("a = " + ax.toFixed(2));

    		d3.selectAll("#b.flag").select("#val")
    			.attr("text-anchor", "end")
    			.text("b = " + bx.toFixed(2));

        flags.select("#between")
            .attr("x", xScale((ax + bx)/2))
            .text((cdf(ax, mean,SD)-cdf(bx,mean,SD)).toFixed(4));


        //set up inner curves
        innerCurve = inRange(data, bx, ax);
        renderCurve(shade, innerCurve, "yellow", "what?");

    	}

    } 

    function inRange(data, x, y){
      console.log(data.length);

      result = [];
      for(var i = 0; i < data.length; i++){
        d = data[i];
        if (d.q >= x && d.q <= y){
          result.push(d);
        }
      }

      return result;
    }

    function getProbabilities(mean, SD, min, bins, binWidth){
		var probs = [];
		for(var i = 0; i < bins; i++){
			var q = min + i * binWidth;
			probs.push({q: q, p: p(q, mean, SD)});
		}
		return probs;
	}

	function getAxis(scale){
   		axis.selectAll("*").remove();

        var xAxis = d3.svg.axis()
          .scale(scale)
          .orient('bottom');

        axis.attr("class", "x axis")
        	.attr("transform", "translate(0," + height + ")")
        	.call(xAxis);
  	}

  	function renderCurve(svg, data, color, name){
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

    //the maths:

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

	update();

});