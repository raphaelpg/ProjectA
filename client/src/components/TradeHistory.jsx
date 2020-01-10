import React, { Component } from 'react';

class TradeHistory extends Component {
	// constructor(props) {
	// 	super(props);
	// }

	render() {
		return (
			<div>
				<div className="tradeHistoryTitle">Trade history</div>
	      <div className="tradeContainer">
	        <table id="tradeHistoryTable">
	          <tbody id="tradeHistoryBody">
	          </tbody>
	        </table>
	      </div>
	    </div>
		)
	}
}

export default TradeHistory;