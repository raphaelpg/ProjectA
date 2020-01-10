import React, { Component } from 'react';

class UserOrders extends Component {
	// constructor(props) {
	// 	super(props);
	// }

	render() {
		return (
			<div className="checkOrders">
        <div className="yourOrders">Your open orders: </div>
        <table className="userOrders"></table>
      </div>
		)
	}
}

export default UserOrders;