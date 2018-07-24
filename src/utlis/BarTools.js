import * as d3 from "d3";

export default {

    setData(rawData){
      return rawData;
    },
    
    createScale: function (domain, range, axisSettings){
        let scale  = axisSettings;
        let newScale = null;
    
        if(scale.type === "list"){
          newScale = d3.scaleBand().padding(scale.padding);
    
        }
        else if(scale.type === "time"){
          newScale = d3.scaleTime();
        }
        else if(scale.type === "linear"){
          newScale = d3.scaleLinear();
        }
    
        return newScale
                .domain(domain)
                .range(range);
      },

      createAxis: function(scale, position, direction, ticks){

        let axis = null;
    
        switch(position){
          case "bottom": axis = d3.axisBottom(scale);
            break;
          case "top": axis = d3.axisTop(scale);
            break;
          case "left": axis = d3.axisLeft(scale);
            break;
          case "right": axis = d3.axisRight(scale);
            break;
          default: axis = d3.axisBottom(scale);
            break;
        }
    
        if(ticks){
          axis.ticks(ticks);
        }
        return axis;
      }
};