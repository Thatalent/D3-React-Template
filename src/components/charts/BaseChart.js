import * as d3 from "d3";
import React, { Component } from 'react';
import ChartTools from '../../utlis/ChartTools.js';

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


class BaseChart extends Component {

  constructor(props){
     super(props);
    this.setupUsingProps(props);
  }

  setupUsingProps(props){
    this.graph = React.createRef();
    this.setUpDataAccess(props);
    this.setUpGraphSize(props);
    this.setUpAxisSettings(props);
    this.color = d3.scaleOrdinal()
     .domain(d3.range(this.data.length))
     .range(d3.schemeCategory10);
  }

  setUpDataAccess(props){
    this.accessX = props.accessX || accessX;
    this.accessY = props.accessY || accessY;
    this.setUpDataList(props);
  }

  setUpGraphSize(props){
    this.width = props.width || width;
    this.height = props.height || height;
    this.padding = props.padding || padding;
  }

  setUpDataList(props){
    this.data = ChartTools.setData(props.data);
    this.yList = this.getListOfY(this.data);
    this.xList = this.getListOfX(this.data);
  }

  setUpAxisSettings(props){
    this.xAxisSettings = this.buildAxisSettings(props.xAxisSettings, xAxisSettings);
    this.yAxisSettings = this.buildAxisSettings(props.yAxisSettings, yAxisSettings);
    this.timeMapping = props.timeMapping || timeMapping;
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
    this.d3Graph = d3.select(this.graph.current)
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")");
    this.createChart();
  }

  componentDidUpdate(prevProps){

    var data_length = this.props.data.length >= prevProps.data.length ? prevProps.data.length : this.props.data.length;
    let newData = false, 
    newXaxisSettings = false, 
    newYaxisSettings = false,
    newXaccess = false,
    newYaccess = false;
    
    for(let i = 0; i < data_length; i++){
      if( this.accessX(this.props.data[i]) === this.accessX(prevProps.data[i]) || this.accessY(this.props.data[i]) === this.accessY(prevProps.data[i])  ){

        newData = true, newXaxisSettings = true, newYaxisSettings = true;
      }
    }

    this.setUpDataAccess(this.props);
    this.setUpGraphSize(this.props);
    this.setUpAxisSettings(this.props);

    if(newData){
      this.updateScales();
    }
    if(newXaxisSettings || newYaxisSettings){
      this.updateAxis();
    }

    this.updateChart();
  }

  createAxis(){
    const graph = this.d3Graph;

    this.xAxisCall = ChartTools.createAxis(this.xScale, this.xAxisSettings.position, this.xAxisSettings.direction);
    this.yAxisCall = ChartTools.createAxis(this.yScale, this.yAxisSettings.position, this.yAxisSettings.direction, this.yAxisSettings.ticks);

    this.xAxis = graph.append("g")
        .attr("class","xAxis")
        .attr("transform","translate(0," + (height) + ")")
        .call(this.xAxisCall);

    this.yAxis = graph.append("g")
		.attr("class","yAxis")
		.call(this.yAxisCall);
  }

  updateAxis(){

    this.xAxisCall = ChartTools.createAxis(this.xScale, this.xAxisSettings.position, this.xAxisSettings.direction);
    this.yAxisCall = ChartTools.createAxis(this.yScale, this.yAxisSettings.position, this.yAxisSettings.direction, this.yAxisSettings.ticks);

    let transitionDefault = d3.transition().duration(500);

    this.xAxis.transition(transitionDefault).call(this.xAxisCall);
    this.yAxis.transition(transitionDefault).call(this.yAxisCall);

  }

  createScales() {

    const dataYMax = d3.max(this.yList);

    this.yMin = this.yAxisSettings.type == 'linear' ? 0 : d3.min(this.yList);

    this.yScale = ChartTools.createScale([this.yMin, dataYMax],[height, 0], this.yAxisSettings);

    this.xScale = ChartTools.createScale(this.xList, [0,width], this.xAxisSettings);
  }

  updateScales(){
    
    const dataYMax = d3.max(this.yList);

    this.yScale.domain([this.yMin, dataYMax]).range([height, 0]);

    this.xScale.domain(this.xList).range([0,width]);
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

  render() {
  return (
    <svg width={width+ padding.left + padding.right} height={height + padding.top + padding.bottom}>
      <g ref={this.graph} />
    </svg>
  );
}

}

export default BaseChart
