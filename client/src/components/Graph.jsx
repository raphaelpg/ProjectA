import React, { Component } from 'react';
import Highcharts from "highcharts/highstock";

class Graph extends Component {
	// constructor(props) {
	// 	super(props);
	// }

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

		//SET CHART DATA
		let trades=[
	    [1313964000000,23.17],
	    [1314050400000,23.78],
	    [1314136800000,24.10],
	    [1314223200000,23.86],
	    [1314309600000,24.54],
	    [1314568800000,25.51],
	    [1314655200000,25.19],
	    [1314741600000,25.24],
	    [1314828000000,24.77],
	    [1314914400000,24.15],
	    [1315260000000,23.74],
	    [1315346400000,25.30],
	    [1315432800000,24.99],
	    [1315519200000,24.64],
	    [1315778400000,25.20],
	    [1315864800000,25.18],
	    [1315951200000,25.75],
	    [1316037600000,26.12],
	    [1316124000000,25.52],
	    [1316383200000,25.27],
	    [1316469600000,24.64],
	    [1316556000000,24.89],
	    [1316642400000,24.31],
	    [1316728800000,24.88],
	    [1316988000000,25.13]
    ];

		//SET CHART
		let myChart = Highcharts.stockChart('graphContainer', {
      rangeSelector: {
        selected: 1
      },
      series: [{
        name: 'ALY to DAI',
        data: trades,
        pointStart: Date.UTC(2020, 0, 1),
        pointInterval: 60 * 1000 // one minute
     	}]
    });
	}

	render() {
		return (
			<div id="graphContainer">
      </div>
		)
	}
}

export default Graph;