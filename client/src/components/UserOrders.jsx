import React, { Component } from 'react';

class UserOrders extends Component {

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