import * as d3 from "d3";

var defaultAccessData = (data) => { return data;}

export default {

    setData(rawData){
      return rawData;
    },

    defaultAccessY: function(data) { return data.y;},

    defaultAccessX: function(data) { return data.x;},
    
    createScale: function (domain, range, axisSettings){
        let scale  = axisSettings;
        let newScale = null;
    
        if(scale.type === "list"){
          newScale = d3.scaleBand().padding(scale.padding || 0.0);
    
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
      },

      updateLineCurve: function(lineGenerator, curve){
        let newCurve = {}
        switch(curve.type){
            case "linear": newCurve.type = d3.curveLinear; break;
            case "closed": newCurve.type = d3.curveLinearClosed; break;
            case "monotoneX": newCurve.type = d3.curveMonotoneX; break;
            case "monotoneY": newCurve.type = d3.curveMonotoneY; break;
            case "natural": newCurve.type = d3.curveNatural; break;
            case "step": newCurve.type = d3.curveStep; break;
            case "stepAfter": newCurve.type = d3.curveStepAfter; break;
            case "stepBefore": newCurve.type = d3.curveStepBefore; break;
            case "basis": newCurve.type = d3.curveBasis; break;
            case "basisClosed": newCurve.type = d3.curveBasisClosed; break;
            case "basisOpen": newCurve.type = d3.curveBasisOpen; break;
            case "bundle": newCurve.type = d3.curveBundle; break;
            case "cardinal": newCurve.type = d3.curveCardinal; break;
            case "cardinalClosed": newCurve.type = d3.curveCardinalClosed; break;
            case "cardinalOpen": newCurve.type = d3.curveCardinalOpen; break;
            case "catmulRom": newCurve.type = d3.curveCatmullRom; break;
            case "catmulRomClosed": newCurve.type = d3.curveCatmullRomClosed; break;
            case "catmulRomOpen": newCurve.type = d3.curveCatmullRomOpen; break;

            default: newCurve.type = curve.type; break;
        }

        if(curve.alpha){
            newCurve.type = newCurve.type.alpha(curve.alpha);
        }
        else if(curve.beta){
            newCurve.type = newCurve.type.beta(curve.beta);
        }
        else if(curve.tension){
            newCurve.type = newCurve.type.tension(curve.tension);
        }

        return lineGenerator.curve(newCurve.type);
      },

      createLineGenerator: function(xScale, yScale, accessData, accessX, accessY, curve){

        accessData = accessData || defaultAccessData;

        let lineGenerator = d3.line().defined(((d) => accessData(d)))
        .x((d) => { return xScale(accessX(d)) + (xScale.bandwidth()/2); }) // set the x values for the line generator 
        .y((d) => { return yScale(accessY(d)); }); // set the y values for the line generator 
        
        if(curve){

            this.updateLineCurve(lineGenerator, curve);
        }

        return lineGenerator;
      },

      updateLineGenerator: function(lineGenerator, xScale, yScale, accessData, accessX, accessY, curve){
        
        accessData = accessData || lineGenerator.defined;

        lineGenerator.defined(((d) => accessData(d)))
            .x((d) => { return xScale(accessX(d)) + (xScale.bandwidth()/2); }) // set the x values for the line generator 
            .y((d) => { return yScale(accessY(d)); }); // set the y values for the line generator 
        
        if(curve){
            this.updateLineCurve(lineGenerator, curve);
        }
      },

      createStartData(yMin, xList){
        let startLineData = xList.map(xValue => {
            return {y: yMin, x: xValue};
        });

        return startLineData;
      }
};