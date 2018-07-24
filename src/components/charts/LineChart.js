import * as d3 from "d3";
import React, { Component } from 'react';
import LineTools from '../../utlis/LineTools.js';
import { interpolatePath } from 'd3-interpolate-path';

var width = 500;
var height = 500;
var padding = { top: 20, bottom: 20, right: 20, left: 20};

var accessX = ((data) => {return data.x});
var accessY = ((data) => {return data.y});
var d3Graph = 'g';

var timeMapping = { type:"string", format: "%B %d, %Y" };

var color, yScale, xScale, xAxis, yAxis;

var xAxisSettings = { type:"list", padding: "0.08", position: "bottom", direction: "right"}
var yAxisSettings = { type:"linear", position: "left", direction: "top", ticks: 5}
var curveSettings = { type:"linear"}
var animatationSettings = { duration: 1000, delay: "series"};

class LineChart extends Component {

  constructor(props){
     super(props);
     this.graph = React.createRef();
     this.accessX = props.accessX || accessX;
     this.accessY = props.accessY || accessY;
     this.width = props.width || width;
     this.height = props.height || height;
     this.padding = props.padding || padding;
     this.data = LineTools.setData(this.props.data, );
     this.yList = this.getListOfY(this.data);
     this.xList = this.getListOfX(this.data);
     this.xAxisSettings = this.buildAxisSettings(props.xAxisSettings, xAxisSettings);
     this.yAxisSettings = this.buildAxisSettings(props.yAxisSettings, yAxisSettings);
     this.timeMapping = props.timeMapping || timeMapping;
     this.curveSettings = props.curve || curveSettings;
     this.animatationSettings = props.animatationSettings || animatationSettings;
     color = d3.scaleOrdinal()
      .domain(d3.range(this.data.length))
      .range(d3.schemeCategory10);
  }

  buildAxisSettings(props, base){
    let axisSettings = {};
    if(!props){
      return base;
    }
    axisSettings.type = props.type || base.type;
    axisSettings.padding = props.padding || base.padding;
    axisSettings.position = props.position || base.position;
    axisSettings.direction = props.direction || base.direction;
    axisSettings.ticks = props.ticks || base.ticks;

    return axisSettings;
  }

  componentDidMount() {
    d3Graph = d3.select(this.graph.current)
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")");
    this.createLineChart();
  }

  createLineChart() {

    const graph = d3Graph;
    this.updateScales();

    xAxis = LineTools.createAxis(this.xScale, this.xAxisSettings.position, this.xAxisSettings.direction);
    yAxis = LineTools.createAxis(this.yScale, this.yAxisSettings.position, this.yAxisSettings.direction, this.yAxisSettings.ticks);

    graph.append("g")
        .attr("class","x axis")
        .attr("transform","translate(0," + (height) + ")")
        .call(xAxis);

    graph.append("g")
				.attr("class","y axis")
                .call(yAxis);
                
    this.starterData = LineTools.createStartData(this.yMin, this.xList);
    this.createPath(this.data, this.starterData);
    this.updateLineChart();
  }

  updateScales() {

    const dataYMax = d3.max(this.yList);

    this.yMin = 0;

    this.yScale = LineTools.createScale([this.yMin, dataYMax],[height, 0], this.yAxisSettings);

    this.xScale = LineTools.createScale(this.xList, [0,width], this.xAxisSettings);
  }

  createPath(data, starterData){

    const graph = d3Graph;
    const xScale = this.xScale;
    const yScale = this.yScale;
    const accessX = this.accessX;
    const accessY = this.accessY;

    const lineGenerator = LineTools.createLineGenerator(xScale, yScale, null, accessX, accessY, this.curveSettings);
    this.lineGenerator = lineGenerator;

    let path = graph.append('path')
        .attr("stroke", color(1))
        .attr("fill", "none")
        .attr("class", "line") // Assign a class for styling 
        .attr("d", lineGenerator(data)) // Calls the line generator 

        var totalLength = path.node().getTotalLength();
    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .delay(200)
        // .ease(d3.easeBounce)
        .attr("stroke-dashoffset", 0);
     
        var points = graph.selectAll(".dot")
        .data(data)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(accessX(d)) + (xScale.bandwidth()/2); })
        .attr("cy", function(d) { return yScale(accessY(d)); })
        .attr('fill', color(1))
        .attr("r", 0);

        points.transition()
        .duration(200)
        .delay((d,i)=>{return i*200;})
        .ease(d3.easeBounce)
        .attr("r", 2);

  }

  updateLineChart(){

      const graph = d3Graph;
      const xScale = this.xScale;
      const yScale = this.yScale;
      const accessX = this.accessX;
      const accessY = this.accessY;
      const lineGenerator = this.lineGenerator;

      graph.select(".line").datum(this.data).enter().transition()
      .duration(1000)
      .delay((d,i) => { return i*500})
      ;
      LineTools.updateLineGenerator(lineGenerator, xScale, yScale, null, accessX, accessY, this.curveSettings);
      

    }

  getListOfY(data) {
    return this.getDataArray(data, "y");
  }

  getListOfX (data) {
    return this.getDataArray(data, "x");
  }

  getDataArray (data, value) {
    var accessor = (dataValue) => {return dataValue};
    if (value === "y") {
      accessor = this.accessY;
    }
    if (value === "x") {
      accessor = this.accessX;
    }
    return data.map((dataObject) => accessor(dataObject));
  }

  updateGraph(selection) {
    selection.selectAll('.rect')
      .call(this.updateRect);
  }

  updateRect (selection) {
    selection.attr('x', this.accessX.bind(this))
    .attr('y', accessY);
  }

  render() {
  return (
    <svg width={width+ padding.left + padding.right} height={height + padding.top + padding.bottom}>
      <g ref={this.graph} />
    </svg>
  );
}

}

export default LineChart
