import React, { Component } from 'react';
import Highcharts from "highcharts/highstock";

class Graph extends Component {

	componentDidMount = async () => {
		//SET CHART CSS
		Highcharts.setOptions({
	    chart: {
        backgroundColor: [0, 0, 0, 0],
        borderWidth: 0,
        plotBackgroundColor: [0, 0, 0, 0],
        plotBorderWidth: 1,
        plotBorderColor: "#353535",
        spacingLeft: 0,
        spacingRight: 0
	    },
	    colors: ["#FF8C00"],
	    credits: {
	    	enabled: false
	    },
     	navigator: {
     		enabled: false
     	},
     	plotOptions: {
        series: {
          lineWidth: 1
        }
    	},
     	rangeSelector: {
     		allButtonsEnabled: false,
     		buttonPosition: {
     			x: 5
     		},
     		inputEnabled: false,
     		buttonTheme: {
          fill: 'none',
          stroke: 'none',
          'stroke-width': 0,
          style: {
            color: "#ADA2B0",
          },
          states: {
            hover: {
            	fill: "#353535",
            	style: {
            		color: "#ADA2B0"
            	}
            },
            select: {
              fill: "#FF8C00",
              style: {
                  color: "#000000",
                  fontweight: 100
              }
            },
            disabled: {
            	style: {
            		color: "#ADA2B0"
            	}
            }
          }
        }
     	},
     	scrollbar: {
     		enabled: false
     	},
     	xAxis: [{
     		lineWidth: 1,
     		lineColor: "#353535",
     		tickWidth: 0
     	}],
     	yAxis: [{
     		gridLineColor: "#353535",
     		gridLineDashStyle: "ShortDash",
     		gridLineWidth: 1,
     	}]
		})

		//SET CHART
    setTimeout( () => {
  		Highcharts.stockChart('graphContainer', {
        rangeSelector: {
          selected: 1
        },
        series: [{
          name: 'ALY to DAI',
          data: this.props.tradeGraph,
          pointStart: Date.UTC(2020, 0, 1)
          //pointInterval: 60 * 1000 // one minute
       	}]
      })
    },1000)
	}

	render() {
		return (
			<div id="graphContainer">
      </div>
		)
	}
}

export default Graph;