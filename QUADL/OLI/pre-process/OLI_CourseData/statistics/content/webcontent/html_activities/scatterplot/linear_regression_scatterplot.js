$(document).ready(function(){

//var slider = slider().axis(true).min(2000).max(2100).step(5);

var slider = d3.select("#slider");
function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
//creates the data points distributed somewhat-evenly throughout the graph
var data = [[5,3], [14,100], [100,4], [88,35], [34,45], [13,68], [60,66], [20,84], [27,41], [51,57],
[17,24], [22,71],[6,98], [37,63], [46,75], [78,90], [70,30], [45,10], [66,85],[93,69]];
     
      var margin = {top: 20, right: 15, bottom: 60, left: 60}
        , width = 500 - margin.left - margin.right
        , height = 500 - margin.top - margin.bottom;
      
      var x = d3.scale.linear()
                .domain([0, d3.max(data, function(d) { return d[0]; })])
                .range([ 0, width ]);
      
      var y = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d[1]; })])
              .range([ height, 0 ]);
   
      var chart = d3.select('#content')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')

      var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main')   
          
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

      var g = main.append("svg:g"); 
     
      var circles = g.selectAll("scatter-dots")
        .data(data)
        .enter().append("svg:circle")
            .attr("cx", function (d,i) { return x(d[0]); } )
            .attr("cy", function (d) { return y(d[1]); } )
            .attr("r", 8);


//moves the datapoints towards the line y=x or y=-x when the slider moves.
slider.on("change", function(){
  var numbersign =  sign(document.getElementById("slider").value);
  var marker;
  if(numbersign >= 0){
    circles.attr("cy", function (d) { return y(d[1]-numbersign*( (d[1]-d[0])*document.getElementById("slider").value)); } );
    d3.select("#r").style("color","black");
  }
  else{
    circles.attr("cy", function (d) { return y(d[1]+numbersign*( (100-d[0]-d[1])*document.getElementById("slider").value)); } );
    d3.select("#r").style("color","red");
  }
  d3.select("#r").text("r = " + document.getElementById("slider").value);
  //alert(y(d[1]));
 // alert(document.getElementById("slider").value);

})

//reverses the sign when them button is clicked
var button = d3.select("#button");
button.on("click",function(){
  document.getElementById("slider").value = -document.getElementById("slider").value;
  var numbersign =  sign(document.getElementById("slider").value);
  var marker;
  if(numbersign >= 0){
    circles.attr("cy", function (d) { return y(d[1]-numbersign*( (d[1]-d[0])*document.getElementById("slider").value)); } );
    d3.select("#r").style("color","black");
  }
  else{
    circles.attr("cy", function (d) { return y(d[1]+numbersign*( (100-d[0]-d[1])*document.getElementById("slider").value)); } );
    d3.select("#r").style("color","red");
  }
  d3.select("#r").text("r = " + document.getElementById("slider").value);


})





        })
