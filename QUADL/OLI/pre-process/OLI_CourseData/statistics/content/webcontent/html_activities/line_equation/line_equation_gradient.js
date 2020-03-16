$(function() {
  // Our SVG container will be 320x320, with 30px of padding on each side for text
  //
  var w = 320;
  var h = 320;
  var padding = 30;

  //Limiting parameters
  var xMin = 0,
      xMax = 5,
      yMin = 0,
      yMax = 5;

  // All of our grids are from 0.0 to 5.0, and the range is contained excluding the padding to ensure that our
  // grid lines aren't drawn to the edge of the SVG
  //
  var xScale = d3.scale.linear()
    .domain([xMin, xMax])
    .range([padding, w - padding]);

  var yScale = d3.scale.linear()
    .domain([yMin, yMax])
    .range([h - padding, padding]);

  // Define our axises
  //
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5)
    .tickSize(-h, 0, 0); //Set rough # of ticks

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5)
    .tickSize(-w, 0, 0);

  var drawGrid = function() {
    // First, we set the default properties for our SVG element, which is contained in the HTML.
    //
    var svg = d3.select("svg")
      .attr("width", w)
      .attr("height", h)

    // Render our axises into the SVG
    //
    svg.append("g")
      .attr("class", "axis") //assign "axis" class
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);

    // We're putting these 10 pixels in, instead of flush to the left edge of the SVG.
    //
    svg.append("g")
      .attr("class", "axis") //assign "axis" class
      .attr("transform", "translate(10,0)")
      .call(yAxis);

    // Next we render our grid lines:
    //
    var numberOfTicks = 5;
    var yAxisGrid = yAxis.ticks(numberOfTicks)
      .tickSize(w - (padding * 2), 0)
      .tickFormat('')
      .orient("right");

    var xAxisGrid = xAxis.ticks(numberOfTicks)
      .tickSize(-h + (padding * 2), 0)
      .tickFormat('')
      .orient("top");

    svg.append("g")
      .classed('y', true)
      .classed('grid', true)
      .attr('transform', 'translate(' + padding + ', 0)')
      .call(yAxisGrid);

    svg.append("g")
      .classed('x', true)
      .classed('grid', true)
      .attr('transform', 'translate(0, ' + padding + ')')
      .call(xAxisGrid);

    // Lastly, we add some text around the edges of our grid:
    //
    svg.append('text')
      .attr('x', 50)
      .attr('y', h - 10)
      .text('X')
      .attr('fill', 'black')

    svg.append('text')
      .attr('x', 1)
      .attr('y', 20)
      .text('Y')
      .attr('fill', 'black')

    // This is for our header of text, we add a few tspans that we can identify by class
    // and modify whenever the sliders change
    //
    var text = svg.append('text')
      .attr('x', 82)
      .attr('y', 10)
      .text('Y = ')
      .attr('font-size', 14)
      .attr('color', 'black')

    text.append('tspan')
      .text('2.5')
      .classed('intercept', true)
      .attr('fill', 'red')

    text.append('tspan')
      .text(' + ')
      .classed('sign', true)

    text.append('tspan')
      .text('0.0')
      .attr('fill', 'blue')
      .classed('slope', true)

    text.append('tspan')
      .text(' * X')
  }

  //Now for the interactive stuff
  //Variables that will be controlled by the range sliders

  var lIntercept; //Intercept at xMin
  var rIntercept; //Intercept at xMax
  var gradient;

  //Define our inputs
  interceptSlider = $('#intercept');
  gradientSlider = $('#gradient');

  //This defines how our inputs interact with the display and each other
  //Each input should output an lIntercept, an rIntercept and a gradient
  
  //If you change the left y intercept slider the gradient remains constant
  //so the right intercept slider moves with it
  interceptSlider.on('input', function(){
    intercept = parseFloat(interceptSlider.val());
    update();
  });

  //The right intercept slider controls the gradient
  gradientSlider.on('input', function(){
    gradient = parseFloat(gradientSlider.val());
    update();
  });

  function getY(x){
    return intercept + x * gradient;
  }

  function getX(y){
    return (y - intercept)/gradient;
  }

  function outOfBoundsX(){
    if (gradient > 0){
      var x = getX(yMax);
      return (x < xMax ? x : xMax);
    } else if (gradient < 0){
      var x = getX(yMin);
      return (x < xMax ? x : xMax);
    }
    return xMax;
  }


  //Redraws the line and updates the equations based on new intercepts and gradients
  function update(){
    //first, update the range sliders
    interceptSlider.val(intercept);
    gradientSlider.val(gradient);

    //then update the display
    var svg = d3.select('svg');
    // Remove the previous line group, if it exists, and rerender a new one to populate with the new
    // line:
    //
    svg.selectAll('g.line').remove('*');
    var svgContainer = svg.append('g')
      .attr('class', 'line');

    // First we draw our actual line:
    var x = outOfBoundsX();
    // console.log(x);

    svgContainer.append('line')
      .attr('x1', xScale(xMin))
      .attr('y1', yScale(intercept))
      .attr('x2', xScale(x))
      .attr('y2', yScale(getY(x)))
      .attr('stroke', 'black')
      .attr('stroke-width', 3);

    // Now we draw in the 2 blue lines that help to show the slope.
    // We reuse the existing xScale to determine the X coordinates, and then use
    // our yPosAtXVal helper function to populate the y coords.
    //

    var x1 = 1,
        x2 = 2;
    if (x < 2){
      x1 = x - 1;
      x2 = x;
      if (x1 < xMin){
        x1 = xMin;
      }
    }

    svgContainer.append('line')
      .attr('x1', xScale(x1))
      .attr('y1', yScale(getY(x1)))
      .attr('x2', xScale(x2))
      .attr('y2', yScale(getY(x1)))
      .attr('stroke', 'blue')
      .attr('stroke-width', 2);

    svgContainer.append('line')
      .attr('x1', xScale(x2))
      .attr('y1', yScale(getY(x1)))
      .attr('x2', xScale(x2))
      .attr('y2', yScale(getY(x2)))
      .attr('stroke', 'blue')
      .attr('stroke-width', 2);

    // Finally we add in the text showing the slope directly on the graph itself.
    //
    svgContainer.append('text')
      .attr('x', xScale(x2) + 5)
      .attr('y', yScale((getY(x1) + getY(x2)) / 2))
      .attr('fill', 'blue')
      .text('slope = ' + gradient.toFixed(2))

    // Also render the intercept in red, on the left side of the grid.
    //
    svgContainer.append('text')
      .attr('x', 0)
      .attr('y', yScale(getY(0)) + 5)
      .attr('fill', 'red')
      .attr('font-size', '14px')
      .text(intercept.toFixed(2));

    // Lastly, we update the tspans in the header to display the new values:
    //
    svg.selectAll('tspan.intercept').text(intercept.toFixed(2));
    var m = gradient.toFixed(2);
    if (m >= 0){
      svg.select('tspan.sign').text('+')
    } else {
      svg.select('tspan.sign').text('-')
    }
    svg.selectAll('tspan.slope').text(Math.abs(gradient).toFixed(2));
  }

  // Initially render our grid, and our line:
  //
  drawGrid();
  intercept = 2.5,
  gradient = 0;
  update();

});
