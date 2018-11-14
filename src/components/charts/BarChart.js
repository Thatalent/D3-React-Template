import * as d3 from "d3";
import React, { Component } from 'react';
import BarTools from '../../utils/BarTools.js';
import BaseChart from './BaseChart';


var width = 500;
var height = 500;
var padding = { top: 20, bottom: 20, right: 20, left: 20};

var accessX = ((data) => {return data.x});
var accessY = ((data) => {return isNaN(data.y) ? 0 : data.y});
var d3Graph = 'g';

var timeMapping = { type:"string", format: "%B %d, %Y" };

var color, yScale, xScale, xAxis, yAxis;

var xAxisSettings = { type:"list", padding: "0.08", position: "bottom", direction: "right"}
var yAxisSettings = { type:"linear", position: "left", direction: "top", ticks: 5}


class BarChart extends BaseChart {

  constructor(props){
    super(props);
    this.setupUsingProps(props);
  }

  componentDidMount() {
    this.d3Graph = d3.select(this.graph.current)
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")");
    this.createBarChart();
  }

  // componentDidUpdate(prevProps){

  //   var data_length = this.props.data.length >= prevProps.data.length ? prevProps.data.length : this.props.data.length;
  //   let newData = false, 
  //   newXaxisSettings = false, 
  //   newYaxisSettings = false,
  //   newXaccess = false,
  //   newYaccess = false;
    
  //   for(let i = 0; i < data_length; i++){
  //     if( this.accessX(this.props.data[i]) === this.accessX(prevProps.data[i]) || this.accessY(this.props.data[i]) === this.accessY(prevProps.data[i])  ){

  //       newData = true, newXaxisSettings = true, newYaxisSettings = true;
  //     }
  //   }

  //   this.setUpDataAccess(this.props);
  //   this.setUpGraphSize(this.props);
  //   this.setUpAxisSettings(this.props);

  //   if(newData){
  //     this.updateScales();
  //   }
  //   if(newXaxisSettings || newYaxisSettings){
  //     this.updateAxis();
  //   }

  //   this.updateBars();
  // }

  createChart(){
    this.createBarChart();
  }

  createBarChart() {
    
    this.createScales();

    this.createAxis();
  
    this.createBars();
  }

  updateChart(){
    this.updateBars();
  }

  createBars(){
      const graph = this.d3Graph;
      const xScale = this.xScale;
      const yScale = this.yScale;
      const accessX = this.accessX;
      const accessY = this.accessY;

      var bars = graph.selectAll('rect')
      .data(this.data).enter()
      .append("rect")
        .attr("x", (d) => { return xScale(accessX(d))})
        .attr("y", (height))
        .attr('width', xScale.bandwidth())
        .attr("height", 0)
        .attr('fill', (d, i) => this.color(i));

      bars.transition()
      .duration(1000)
      .delay((d, i) => { return i * 100; })
      .attr("y", (d) => { return yScale(accessY(d))})
      .attr("height", (d) => { return height - yScale(accessY(d))})
      .ease(d3.easeElastic);
    }

  updateBars(){
    var bars = this.d3Graph.selectAll('rect');
   bars.data(this.data).enter()
    .append("rect")
      .attr("x", (d) => { return this.xScale(accessX(d))})
      .attr("y", (height))
      .attr('width', this.xScale.bandwidth())
      .attr("height", 0)
      .attr('fill', (d, i) => this.color(i));

    bars.exit().remove();

    bars.transition()
    .duration(1000)
    .delay((d, i) => { return i * 100; })
    .attr("y", (d) => { return !isNaN(this.yScale(accessY(d))) ? this.yScale(accessY(d)) : height})
    .attr("height", (d) => { return height - (!isNaN(this.yScale(accessY(d))) ? this.yScale(accessY(d)) : 0)})
    .ease(d3.easeElastic);
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

export default BarChart
