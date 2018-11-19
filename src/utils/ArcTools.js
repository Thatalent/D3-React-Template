import * as d3 from "d3";

export default {

  getData: function (data) {
    let pieData = d3.pie()
      .value((datum) => {
        return datum.y
      })(data);
    return pieData;
  },

  getArcGenerator: function (outerRadius, innerRadius) {
    var arcGenerator = d3.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    return arcGenerator;
  }

}