$(document).ready(function(){

  function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
  //creates the points distributed somewhat-evenly throughout the graph
  var points = [];

  var rCoefficient = function(points_arr) {
    sumX = 0.0;
    sumY = 0.0;
    sumSqX = 0.0;
    sumSqY = 0.0;
    sumXY = 0.0;
    n = points_arr.length;
    if (n <= 0) return 0;
    for (var i = 0; i < n; i++) {
      var point = points_arr[i];
      var x = point[0];
      var y = point[1];
      sumX += x;
      sumY += y;
      sumSqX += Math.pow(x, 2);
      sumSqY += Math.pow(y, 2);
      sumXY += x * y;

    }
    console.log(sumX)

    num = sumXY * n - sumX * sumY;
    denom = Math.pow(sumSqX * n - Math.pow(sumX,2), 0.5) * Math.pow(n * sumSqY - Math.pow(sumY, 2), 0.5);
    if (denom == 1) return 1;
    r = num/denom;
    return r;
  }

  var drawLine = function(x1, y1, x2, y2, id, color) {
    g.append("line")
      .attr('id', id)
      .attr("x1", x(x1))
      .attr("y1", y(y1))
      .attr("x2", x(x2))
      .attr("y2", y(y2))
      .attr("stroke-width", 2)
      .attr("stroke", color)
  }

  var updateMeanValueLines = function(points) {
    if (points.length == 0) return;

    var meanX = 0;
    var meanY = 0;
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      meanX += point[0];
      meanY += point[1];
    }
    meanX /= points.length;
    meanY /= points.length;
    $('#mean-x').remove();
    $('#mean-y').remove();

    drawLine(meanX, 0, meanX, 100, 'mean-x', 'blue');
    drawLine(0, meanY, 100, meanY, 'mean-y', 'blue');
  }

  var regressionLine = function(rPoints) {
    $('#least-squares').remove();

    var meanX = 0;
    var meanY = 0;
    for (var i = 0; i < rPoints.length; i++) {
      var point = rPoints[i];
      meanX += point[0];
      meanY += point[1];
    }
    meanX /= rPoints.length;
    meanY /= rPoints.length;

    // Calculate Standard Deviation
    var sdX = 0;
    var sdY = 0;
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      sdX += Math.pow(meanX - point[0], 2);
      sdY += Math.pow(meanY - point[1], 2);
    }
    sdX = Math.pow(sdX/points.length, 0.5);
    sdY = Math.pow(sdY/points.length, 0.5);

    var m = r * (sdY/sdX); //slope
    var b = meanY - m * meanX; //y-intercept

    var startX = 0;
    var startY = b;
    var endX = 100;
    var endY = Math.max(0, m*endX + b);
    if (endY == 0) {
      endX = (endY - b)/m
    }
    drawLine(startX, startY, endX, endY, 'least-squares', 'red');
  }

  var margin = {top: 20, right: 15, bottom: 60, left: 60}
    , width = 500 - margin.left - margin.right
    , height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear()
            .domain([0, 100])
            .range([ 0, width ]);

  var y = d3.scale.linear()
          .domain([0, 100])
          .range([ height, 0 ]);

  var chart = d3.select('#content')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')
    .attr('id', 'chart')

  var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main')
    .attr('id', 'main')

  // draw the x axis
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

  main.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'main axis date')
    .call(xAxis);

  // draw the y axis
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  main.append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'main axis date')
    .call(yAxis);

  var g = main.append("svg:g")
                .attr('id', 'graph-body');
  var r = 0;

  var updatePoints = function() {
    $('.point').remove();
    g.selectAll("scatter-dots")
      .data(points)
      .enter().append("svg:circle")
          .attr("cx", function (d,i) { return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 4)
          .attr('fill', 'steelblue')
          .attr('class','point');
  }

  var addPoint = function(point) {
    points.push(point);
    updatePoints();
  }

  var addMoveablePoint = function(point) {
    g.append("svg:circle")
      .attr("cx", function (d,i) { return x(point[0]); } )
      .attr("cy", function (d) { return y(point[1]); } )
      .attr("r", 4)
      .attr('fill', 'green')
      .attr('id','moveable-point');
  }

  var pointWasRemoved = function(point) {
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (Math.abs(p[0] - point[0]) < 1 && Math.abs(p[1] - point[1]) < 1){
        points.splice(i, 1)
        return true;
      }
    }
    return false;
  }

  var updateView = function(newPoints) {
    if (newPoints.length > 1) {
      r = rCoefficient(newPoints);
      $('#r-result').text("Correlation r = " + Math.round(r*100)/100);
    }

    if ($('#regression-line').is(':checked')) {
      regressionLine(newPoints);
    }
    if ($('#mean-vals').is(':checked')) {
      updateMeanValueLines(newPoints);
    }
  }

  var isMovingPoint = false;

  $('body').click(function(e){
    if ($('#addPoint').is(':checked')) {

      var px = (e.pageX - ($('#chart').position().left + margin.left))/width * 100;
      var py = ($('#chart').position().top + height + margin.top - e.pageY)/height * 100;
      if (px < 0 || px > 100 || py < 0 || py > 100) return;
      point = [+px.toFixed(4), +py.toFixed(4)]

      addPoint(point);

      $('#num-points').text("# points = " + points.length);

      updateView(points);
    }
  });

  var drawnStartX = 0;
  var drawnStartY = 0;
  var drawnEndX = 0;
  var drawnEndY = 0;

  var isDrawingLine = false;
  $('body').mousedown(function(e){
    var px = (e.pageX - ($('#chart').position().left + margin.left))/width * 100;
    var py = ($('#chart').position().top + height + margin.top - e.pageY)/height * 100;
    if (!$('#addPoint').is(":checked")&& $('#drawn-line').length == 0) {
      isDrawingLine = true;
      drawnStartX = px;
      drawnStartY = py;
    }
    else if ($('#addPoint').is(':checked')) {
      if (px < 0 || px > 100 || py < 0 || py > 100) return;
      point = [+px.toFixed(4), +py.toFixed(4)]
      if (pointWasRemoved(point)) {
        isMovingPoint = true;
        updatePoints();
        addMoveablePoint(point);
      }
    }
  });


  $('body').mousemove(function(e){
    var px = (e.pageX - ($('#chart').position().left + margin.left))/width * 100;
    var py = ($('#chart').position().top + height + margin.top - e.pageY)/height * 100;
    if (!$('#addPoint').is(":checked") && isDrawingLine) {
      $('#drawn-line').remove();
      drawnEndX = px;
      drawnEndY = py;
      drawLine(drawnStartX, drawnStartY, drawnEndX, drawnEndY, 'drawn-line', 'green');
    } else if ($('#addPoint').is(":checked") && isMovingPoint) {
      tempPoints = points.slice(0);
      tempPoints.push([px, py]);
      r = rCoefficient(tempPoints);
      updateView(tempPoints);
      $('#moveable-point').remove();
      addMoveablePoint([px, py]);
    }
  });

  $('body').mouseup(function(e){
    if (isMovingPoint) {
      isMovingPoint = false;
      $('#moveable-point').remove()
      var px = (e.pageX - ($('#chart').position().left + margin.left))/width * 100;
      var py = ($('#chart').position().top + height + margin.top - e.pageY)/height * 100;
      if (px < 0 || px > 100 || py < 0 || py > 100) return;
      point = [+px.toFixed(4), +py.toFixed(4)]
      addPoint(point);
    }
    else if (isDrawingLine) {
      isDrawingLine = false;
    }
  });

  $('#clear').click(function(){
    points = [];
    g.selectAll("*").remove();
    $('#r-result').text("Correlation r =  = 0");
    $('#num-points').text("# points = 0");
    $('#regression-line').attr('checked', false);
    $('#mean-vals').attr('checked', false);
  });

  $('#regression-line').change(function() {
    if (this.checked) {
      regressionLine(points);
    } else {
      $('#least-squares').remove();
    }
  });

  $('#mean-vals').change(function() {
    if (this.checked) {
      updateMeanValueLines(points);
    } else {
      $('#mean-y').remove();
      $('#mean-x').remove();
    }
  });

})
