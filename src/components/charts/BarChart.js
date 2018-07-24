import * as d3 from "d3";
import React, { Component } from 'react';
import BarTools from '../../utlis/BarTools.js';

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


class BarChart extends Component {

  constructor(props){
     super(props);
     this.graph = React.createRef();
     this.accessX = props.accessX || accessX;
     this.accessY = props.accessY || accessY;
     this.width = props.width || width;
     this.height = props.height || height;
     this.padding = props.padding || padding;
     this.data = BarTools.setData(this.props.data, );
     this.yList = this.getListOfY(this.data);
     this.xList = this.getListOfX(this.data);
     this.xAxisSettings = this.buildAxisSettings(props.xAxisSettings, xAxisSettings);
     this.yAxisSettings = this.buildAxisSettings(props.yAxisSettings, yAxisSettings);
     this.timeMapping = props.timeMapping || timeMapping;
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
    this.createBarChart();
  }

  createBarChart() {

    const graph = d3Graph;
    this.updateScales();

    xAxis = BarTools.createAxis(this.xScale, this.xAxisSettings.position, this.xAxisSettings.direction);
    yAxis = BarTools.createAxis(this.yScale, this.yAxisSettings.position, this.yAxisSettings.direction, this.yAxisSettings.ticks);

    graph.append("g")
        .attr("class","x axis")
        .attr("transform","translate(0," + (height) + ")")
        .call(xAxis);

    graph.append("g")
				.attr("class","y axis")
				.call(yAxis);

    this.updateBarChart();
  }

  updateScales() {

    const dataYMax = d3.max(this.yList);

    this.yScale = BarTools.createScale([0, dataYMax],[height, 0], this.yAxisSettings);

    this.xScale = BarTools.createScale(this.xList, [0,width], this.xAxisSettings);
  }

  updateBarChart(){
      const graph = d3Graph;
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
        .attr('fill', (d, i) => color(i));

      bars.transition()
      .duration(1000)
      .delay((d, i) => { return i * 100; })
      .attr("y", (d) => { return yScale(accessY(d))})
      .attr("height", (d) => { return height - yScale(accessY(d))})
      .ease(d3.easeElastic);
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

export default BarChart
