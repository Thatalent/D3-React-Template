import * as d3 from "d3";
import React from 'react';
import BaseChart from './BaseChart';
import ArcTools from '../../utils/ArcTools';

var width = 500;
var height = 500;
var padding = { top: 20, bottom: 20, right: 20, left: 20 };

class PieChart extends BaseChart {

  createChart() {
    this.createPieChart();

    this.updatePieChart();
  }

  createPieChart() {

    let colorScale = d3.scaleOrdinal()
      .domain(d3.range(this.data.length))
      .range(d3.schemeCategory10);

    let arcs = this.d3Graph.selectAll(".arc")
      .data(ArcTools.getData(this.data))
      .enter();

      console.log(ArcTools.getData(this.data));

    arcs.append('path')
      .attr('class', 'arc')
      .attr("d", (datum) => {
        return ArcTools.getArcGenerator(100, 75)(datum);
      })
      .attr('x', width / 2)
      .attr("fill", (datum, i) => {
        return colorScale(i);
      })
      .attr('transform', `translate(${width/2}, ${height/2})`);
  }

  updatePieChart() {

  }

  render() {
    return (
      <svg width={width + padding.left + padding.right} height={height + padding.top + padding.bottom}>
        <g ref={this.graph} />
      </svg>
    );
  }
}
export default PieChart