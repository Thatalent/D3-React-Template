var d3 =  require("d3");
var { JSDOM } = require("jsdom");
var BarTools = require("/Users/jdhudson/code/d3-react-template/src/utils/BarTools.js");
var fs = require('fs');

var outputLocation = "test.html";

var width = 500;
var height = 500;
var padding = { top: 20, bottom: 20, right: 20, left: 20};

var accessX = ((data) => {return data.x});
var accessY = ((data) => {return data.y});
var d3Graph = 'g';

var timeMapping = { type:"string", format: "%B %d, %Y" };

var color, yScale, xScale, xAxis, yAxis;

var xAxisSettings = { type:"list", padding: "0.08", position: "bottom", direction: "right"};
var yAxisSettings = { type:"linear", position: "left", direction: "top", ticks: 5};
var data=[{x: "2015", y: 5}, {x: "2016", y: 10}, {x: "2017", y: 7}, { x: "2018", y: 8 }];


    console.log("opening");
    var getListOfY = (data)=>{
        return getDataArray(data, "y");
      };
    
      var getListOfX =(data) => {
        return getDataArray(data, "x");
      };

      var getDataArray =(data, value)=> {
        var accessor = (dataValue) => {return dataValue};
        if (value === "y") {
          accessor = accessY;
        }
        if (value === "x") {
          accessor = accessX;
        }
        return data.map((dataObject) => accessor(dataObject));
      };
    console.log("start");
    var dom = new JSDOM(`<svg width={${width}+ ${padding.left} + ${padding.right}} height={${height} + ${padding.top} + ${padding.bottom}}><g></g></svg>`,  { runScripts: "dangerously" });
    dom.window.d3 = d3.select(dom.window.document); //get d3 into the dom
    var graph = dom.window.d3.select("g");
    console.log(dom.window.document.documentElement.innerHTML);
    data = BarTools.setData(data);
    yList = getListOfY(data);
    xList = getListOfX(data);
    color = d3.scaleOrdinal()
    .domain(d3.range(data.length))
    .range(d3.schemeCategory10);

    const dataYMax = d3.max(yList);

    var yScale = BarTools.createScale([0, dataYMax],[height, 0], yAxisSettings);
    var xScale = BarTools.createScale(xList, [0,width], xAxisSettings);

    var bars = graph.selectAll('rect')
    .data(data).enter()
    .append("rect")
      .attr("x", (d) => { return xScale(accessX(d))})
      .attr("y", (d) => { return yScale(accessY(d))})
      .attr('width', xScale.bandwidth())
      .attr("height", (d) => { return height - yScale(accessY(d))})
      .attr('fill', (d, i) => color(i));
    
    var markup = dom.window.document.documentElement.innerHTML;
    console.log(markup);

    fs.writeFileSync(outputLocation, markup); //using sync to keep the code simple
