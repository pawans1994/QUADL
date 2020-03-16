$(document).ready(function(){

  function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
  //creates the points distributed somewhat-evenly throughout the graph
  var points = [];
  var xMax = 30;

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

  var margin = {top: 20, right: 15, bottom: 60, left: 60}
  var width = 500 - margin.left - margin.right;
  var height = 100 - margin.top - margin.bottom;

  var x = d3.scale.linear()
            .domain([0, xMax])
            .range([ 0, width ]);

  var y = d3.scale.linear()
          .domain([0,25])
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

  var g = main.append("svg:g")
                .attr('id', 'graph-body');
  var RECT_WIDTH = 5
  var RECT_HEIGHT = 20
  meanVal = 0
  medianVal = 0
  var updatePoints = function() {
    $('.point').remove();
    var counts = {};
    $.each(points, function(index, point) {
      if (!counts[point]) {
        counts[point] = 0;
      }
      var yVal = counts[point] * 10;
      g.append('circle')
          .attr("cx", x(point))
          .attr("cy", y(yVal))
          .attr("r", 4)
          .attr('fill', 'steelblue')
          .attr('class','point');
      counts[point]++;
    });
    if (!counts[moveablePoint]) {
        counts[moveablePoint] = 0;
    }
    var yVal = counts[moveablePoint] * 10;
    if (isMovingPoint) {
      g.append('circle')
        .attr("cx", x(moveablePoint))
        .attr("cy", y(yVal))
        .attr("r", 4)
        .attr('id', 'moveable-point')
        .attr('fill', 'green')
        .attr('class','point');
    }
    if (meanVal != medianVal) {
      g.append('rect')
        .attr("x", x(meanVal) - RECT_WIDTH/2)
        .attr("y", y(0))
        .attr("height", RECT_HEIGHT)
        .attr("width", RECT_WIDTH)
        .attr('id', 'mean')
        .attr('fill', 'green')
        .attr('class','point');
      g.append('rect')
        .attr("x", x(medianVal) - RECT_WIDTH/2)
        .attr("y", y(0))
        .attr("height", RECT_HEIGHT)
        .attr("width", RECT_WIDTH)
        .attr('id', 'mean')
        .attr('fill', 'red')
        .attr('class','point');
    } else {
      g.append('rect')
        .attr("x", x(medianVal) - RECT_WIDTH/2)
        .attr("y", y(0))
        .attr("height", RECT_HEIGHT)
        .attr("width", RECT_WIDTH)
        .attr('id', 'mean')
        .attr('fill', 'yellow')
        .attr('class','point');
    }

  }

  var addPoint = function(x) {
    points.push(x);
    updatePoints();
    updateMeanMedian(points)
  }

  var median = function(points) {
    points.sort( function(a,b) {return a - b;} );
    var half = Math.floor(points.length/2);
    if(points.length % 2 == 1) {
      return points[half];
    } else {
      return (points[half-1] + points[half]) / 2.0;
    }
  }

  var mean = function(points) {
    var sum = 0;
    $.each(points, function(index, point) {
      sum += point;
    });
    return sum/points.length;
  }

  var updateMeanMedian = function(points) {
    meanVal = mean(points);
    medianVal = median(points);
    updatePoints();
    $('#mean').text('Mean = ' + meanVal);
    $('#median').text('Median = ' + medianVal);
  }

  var wasPointRemoved = function(point) {
    for (var i = 0; i < points.length; i++) {
      if (points[i] == point){
        points.splice(i, 1)
        return true;
      }
    }
    return false;
  }

  var moveablePoint = -1;
  var isMovingPoint = false;
  var hasMovedPoint = false;
  $('#chart').click(function(e){
    if (!hasMovedPoint) {
      var px = (e.pageX - ($('#chart').position().left + margin.left))/width * xMax;
      if (px < 0 || px > xMax) return;
      addPoint(Math.round(px));
    } else {
      hasMovedPoint = false;
    }
  });

  $('#chart').mousedown(function(e){
    var px = (e.pageX - ($('#chart').position().left + margin.left))/width * xMax;
    if (px < 0 || px > xMax) return;
    px = Math.round(px);
    if (wasPointRemoved(px)) {
        isMovingPoint = true;
        moveablePoint = px;
        updatePoints();
    }
  });

  $('#chart').mousemove(function(e){
    if (isMovingPoint) {
      var px = (e.pageX - ($('#chart').position().left + margin.left))/width * xMax;
      if (px < 0 || px > xMax) return;
      moveablePoint = Math.round(px);
      tempPoints = points.slice(0);
      tempPoints.push(moveablePoint);
      updateMeanMedian(tempPoints);
      $('#moveable-point').remove();
      updatePoints();
      hasMovedPoint = true;
    }

  });

  $('#chart').mouseup(function(e){
    if (isMovingPoint) {
      isMovingPoint = false;
      $('#moveable-point').remove()
      var px = (e.pageX - ($('#chart').position().left + margin.left))/width * xMax;
      if (px < 0 || px > xMax) return;
      addPoint(Math.round(px));
    }
  });


  $('#clear').click(function(){
    points = [];
    g.selectAll("*").remove();
    $('#mean').text('Mean = 0');
    $('#median').text('Median = None');
  });


})
