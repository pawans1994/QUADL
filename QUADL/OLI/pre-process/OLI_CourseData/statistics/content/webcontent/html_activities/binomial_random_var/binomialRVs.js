
// Binomial random variables (4 of 4)

// n slider: 1 to 60 (left)
// p slider: 0.00 to 1.00 (right)
// each has a written display above the slider

// The applet shows the binomical distribution for n and p


// get the 'confidence interval'
// for each confidence interval x:
$(document).ready(function(){

	var margin = {left: 20, right: 20, top: 10, bottom: 25},
    	width = 500,
    	height = 200;

	 var svg = d3.select("svg.Applet")
			.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "applet")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var nSlider = $("#n"),
    	pSlider = $("#p");

    var xMin = 10,
		xMax = 60,
		pMin = 0.00,
		pMax = 1.00;

	var negligible = 0.0001;

	function productRange(a,b) {
	  var product=a,i=a;
	 
	  while (i++<b) {
	    product*=i;
	  }
	  return product;
	}
 
	function combinations(n,k) {
	  if (k==0) return 1;
	  if (n==k) {
	    return 1;
	  } else {
	    k=(k < n-k) ? n-k : k;
	    return productRange(k+1,n)/productRange(1,n-k);
	  }
	}


	// Binomial distribution function
	function Pr(k, n, p){
		if (k > n) return 0;
		result = (combinations(n, k) * (Math.pow(p, k) * Math.pow((1-p), (n-k))));
		if (result > negligible){
			return result.toFixed(4);
		}
		return 0.0000;
	}

	function getPoints(n, p){
		var points = [];

		// 	points.append(point);
		// 	return points;
		// }
		for (var k = 0; k <= n; k++){
			var pr = Pr(k,n,p)
			var point = {
				k: k,
				p: pr
			}
			points.push(point);
		}
		return points;
	}

	function highlight(selection, d){
		var k = d.k;
		var pr = d.p;

		d3.selectAll('.bar > rect').style("fill", "grey");
		var msg = 'P(X = ' + k + ') = ' + pr;
		d3.select('#highlighed-value-display').text(msg);
		d3.select(selection).style("fill", "blue");

		//update to clear previous
		//show value in bottom display window
	}

	function update(){
		svg.selectAll("*").remove();

		var n = nSlider.val();
		var p = pSlider.val();
		var points = [];

		// hack for edgecases
		points = getPoints(n,p);

		var lambda = function(point){return point.p;};
		currMaxP = d3.max(points, lambda);

		// define scales
		var pScale = d3.scale.linear()
					.domain([0, currMaxP])
					.range([0, -height]);

		var xScale = d3.scale.linear()
					.domain([0, n])
					.range([margin.left, width - margin.right]);

		// //clear

		//create axis
		var axis = svg.append("g").attr("class", "axis");
		xAxis = d3.svg.axis().scale(xScale).orient("bottom");
		axis.attr("class", "x_axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		//create lines 
		var bars = svg.selectAll(".bar")
					.data(points)
					.enter()
					.append("g")
					.attr("class", "bar")
					.attr("transform", function(d){
						return "translate(" + xScale(d.k)
								+ ", " + height + ")"});
					// .on("click", alert("WHOOP"));
		var lines = bars
					.append("rect")
					.attr("x", 0)
					.attr("width", 3)
					.attr("y", function(d){
						return pScale(d.p);
					})
					.attr("height", function(d){
						return -pScale(d.p);
					})
					.style("fill", function(d){
						if (d.k == selected){
							return "blue";
						} else {
							return "grey";
						}
					})
					.on("click", function(d){
						selected = d.k;
						update();
					})
		if (selected != null){
			var pr = Pr(selected,n,p);
			var msg = 'P(X = ' + selected + ') = ' + pr;
			d3.select('#highlighed-value-display').text(msg);
		}

		// //Add functionality for showing the numerical displays:
		d3.select('#n-value').text(n);
		d3.select('#p-value').text(p);
		// 	//above each slider

	}

	var selected = null;

	nSlider.on("input", update);
	pSlider.on("input", update);
	update();

	//add functionality for showing displays when you click a p line

});