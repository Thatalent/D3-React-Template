import * as d3 from "d3";
import React from 'react';

var width = 500;
var height = 500;
var padding = { top: 20, bottom: 20, right: 20, left: 25 };
var orientation = 'vertical';

var accessX = ((data) => { return data.x });
var accessY = ((data) => { return data.y });
var d3Graph = 'g';

var color, yScale, xScale, xAxis, yAxis;


class HorizontalBarChart extends React.Component {

  constructor(props) {
    super(props);
    this.graph = React.createRef();
    accessX = props.accessX || accessX;
    accessY = props.accessY || accessY;
    orientation = props.orientation || this.orientation;
    width = props.width || width;
    height = props.height || height;
    padding = props.padding || padding;
    this.data = this.setData(this.props.data);
    this.yList = this.getListOfY(this.data);
    this.xList = this.getListOfX(this.data);
    color = d3.scaleOrdinal()
      .domain(d3.range(this.data.length))
      .range(d3.schemeCategory10);
  }

  setData(rawData) {
    return rawData;
  }

  componentDidMount() {
    d3Graph = d3.select(this.graph.current)
      .attr("transform", "translate(" + padding.left + "," + padding.top + ")");
    this.createBarChart();
  }

  createBarChart() {

    const graph = d3Graph;
    this.updateScales();

    xAxis = d3.axisBottom(yScale);
    yAxis = d3.axisLeft(xScale);

    graph.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + (height) + ")")
      .call(xAxis);

    graph.append("g")
      .attr("class", "yaxis")
      .call(yAxis);

    this.updateBarChart();
  }

  updateScales() {
    // const graph = d3Graph;
    const dataYMax = d3.max(this.yList);
    yScale = d3.scaleLinear()
      .domain([0, dataYMax])
      .range([0, height]);

    xScale = d3.scaleLinear()
      .domain(d3.extent(this.xList))
      .range([0, width]);
  }

  updateBarChart() {
    const graph = d3Graph;

    var scaleBand = d3.scaleBand()
      .domain(this.xList)
      .rangeRound([0, height])
      .padding(0.08);

    // if (orientation === 'horizontal') {
      var bars = graph.selectAll('rect')
        .data(this.data).enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d) => { return scaleBand(accessX(d)) })
        .attr('width', 0)
        .attr("height", scaleBand.bandwidth())
        .attr('fill', (d, i) => color(i));

      bars.transition()
        .duration(1000)
        .delay((d, i) => { return i * 100 + 1000; })
        .attr("x", (d) => { return scaleBand(accessX(d)) })
        .attr("y", (height))
        .attr('width', scaleBand.bandwidth())
        .attr("height", 0);

      bars.transition()
        .duration(1000)
        .delay((d, i) => { return i * 100; })
        .attr("width", (d) => { return yScale(accessY(d)) });
    // }
    // else if (orientation === 'vertical') {
      bars.transition()
        .duration(1000)
        .delay((d, i) => { return i * 100 + 1000; })
        .attr("x", (d) => { return scaleBand(accessX(d)) })
        .attr("y", (height))
        .attr('width', scaleBand.bandwidth())
        .attr("height", 0);

      bars.transition()
        .duration(1000)
        .delay((d, i) => { return i * 100 + 2000; })
        .attr("y", (d) => { return height - yScale(accessY(d)) })
        .attr("height", (d) => { return yScale(accessY(d)) });

      var newYAxis = d3.axisLeft(yScale.range([height, 0]));

      var yaxis = d3.select(".yaxis")
        .transition()
        .duration(500)
        .delay((d) => { return 1000; })
        .call(newYAxis);

      var newXAxis = d3.axisBottom(xScale);
      var xaxis = d3.select(".xaxis")
        .transition()
        .duration(500)
        .delay((d) => { return 1000; })
        .call(newXAxis);
    // }
  }

  getListOfY(data) {
    return this.getDataArray(data, "y");
  }

  getListOfX(data) {
    return this.getDataArray(data, "x");
  }

  getDataArray(data, value) {
    var accessor = (dataValue) => { return dataValue };
    if (value === "y") {
      accessor = accessY;
    }
    if (value === "x") {
      accessor = accessX;
    }
    return data.map((dataObject) => accessor(dataObject));
  }

  updateGraph(selection) {
    selection.selectAll('.rect')
      .call(this.updateRect);
  }

  updateRect(selection) {
    selection.attr('x', accessX.bind(this))
      .attr('y', accessY);
  }

  render() {
    return (
      <svg width={width} height={height + padding.top + padding.bottom} orientation={orientation}>
        <g ref={this.graph} />
      </svg>
    );
  }

}

export default HorizontalBarChart;
