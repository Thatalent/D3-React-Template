//Created by Jonathan Hudson for DoL 242. Github username Thatalent

import * as d3 from "d3";
import React, { Component } from 'react';
import LineTools from '../../utlis/LineTools.js';
import { interpolatePath } from 'd3-interpolate-path';
import BaseChart from "./BaseChart.js";


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

class LineChart extends BaseChart {

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

  updateChart(){
    this.updatePath();
    this.updateLineChart();

  }

  createChart(){
    this.createLineChart();

    this.updateLineChart();
  }

  createLineChart() {

    this.createScales();

    this.createAxis();
                
    this.starterData = LineTools.createStartData(this.yMin, this.xList);
    this.createPath(this.data, this.starterData);
  }

  createPath(data, starterData){

    const graph = this.d3Graph;
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

    // path.transition()        .duration(1000)

    // .delay(1200).attr("stroke-dasharray", 0);

     
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

  updatePath(){

    let data = this.data;
    const graph = this.d3Graph;
    const xScale = this.xScale;
    const yScale = this.yScale;
    const accessX = this.accessX;
    const accessY = this.accessY;
    let lineGenerator = this.lineGenerator;
    LineTools.updateLineGenerator(lineGenerator, xScale, yScale, null, accessX, accessY, this.curveSettings);


    let path = graph.append('path')
        .attr("stroke", color(1))
        .attr("fill", "none")
        .attr("class", "line") // Assign a class for styling 
        .attr("d", lineGenerator(data)) // Calls the line generator 

    var totalLength = path.node().getTotalLength();

    path.remove();

    path  = graph.select('path.line');

    let previousLength = path.node().getTotalLength();

    let points = graph.selectAll(".dot");

    points.transition()
    .duration(200)
    .delay((d,i)=>{
      return 200*(data.length-i);
    })
    .attr("r", (d, i) => { return i === 0 ? 2 : 0;});

    let dataPoints = points.data(data);

    dataPoints.enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(accessX(d)) + (xScale.bandwidth()/2); })
        .attr("cy", function(d) { return yScale(accessY(d)); })
        .attr('fill', color(1))
        .attr("r", 0);



    dataPoints.exit().transition()
      .duration(200)
      .delay(200*(data.length+1))
      .attr("cx", function(d) { return xScale(accessX(data[0])) + (xScale.bandwidth()/2); })
      .attr("cy", function(d) { return yScale(accessY(data[0])); })
      .remove();

    path.transition()
      .duration(200*data.length)
      .attr("stroke-dashoffset", totalLength)
      .attr("stroke-dasharray", totalLength + " " + (totalLength >= previousLength ? totalLength : previousLength));

    path.transition()
      .delay(200*(data.length + 1))
      // .duration(200*data.length)
      .attrTween('d', function(d) {
      
        var previous = d3.select(this).attr('d');
        var current = lineGenerator(data);
        return interpolatePath(previous, current);
      });

    path.transition()
      .delay(200*(data.length + 3))
      .duration(200*data.length)
      .attr("stroke-dashoffset", 0);

    points.transition()
      .duration(200)
      .delay(200*(data.length+1))
      // .ease(d3.easeBounce)
      .attr("cx", function(d, i) { return xScale(accessX(d)) + (xScale.bandwidth()/2); })
      .attr("cy", function(d, i) { return yScale(accessY(d)); });

      points.transition()
      .duration(200)
      .delay((d, i) => { return 200*(data.length + i+ 2); })
      .ease(d3.easeBounce)
      .attr("r", 2);
  }

  updateLineChart(){

      const graph = this.d3Graph;
      const xScale = this.xScale;
      const yScale = this.yScale;
      const accessX = this.accessX;
      const accessY = this.accessY;
      const lineGenerator = this.lineGenerator;
      LineTools.updateLineGenerator(lineGenerator, xScale, yScale, null, accessX, accessY, this.curveSettings);

      // graph.select(".line").datum(this.data).enter().transition()
      // .duration(1000)
      // .delay((d,i) => { return i*500});
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
