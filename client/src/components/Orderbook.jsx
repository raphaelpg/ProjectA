import React, { Component } from 'react';

class Orderbook extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="sectionOrderBook">
        <div className="orderBookTitles">
          <div>Price (DAI)</div>
          <div>Volume (ALY)</div>
          <div>Total (DAI)</div>
        </div>

        {/*SELL ORDERBOOK*/}
        <table id="asks">
          <tbody id="orderBookAsksBody">
          </tbody>
        </table>

        {/*CURRENT PRICE*/}
        <p className="orderBookPrice">{ this.props.bestSellerPrice.toFixed(2) } DAI (Current price)</p>

        {/*BUY ORDERBOOK*/}
        <table id="bids">
          <tbody id="orderBookBidsBody">
          </tbody>
        </table>
      </div>
		)
	}
}

export default Orderbook;