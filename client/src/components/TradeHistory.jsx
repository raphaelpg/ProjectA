import React, { Component } from 'react';

class TradeHistory extends Component {

	render() {
		return (
			<div className="sectionTradeHistory">
				{/*TRADE HISTORY TITLE*/}
				<div className="tradeHistoryTitle">Trade history</div>

				{/*TRADE HISTORY*/}
        <table id="tradeHistoryTable">
          <tbody id="tradeHistoryBody">
          </tbody>
        </table>
      </div>
		)
	}
}

export default TradeHistory;