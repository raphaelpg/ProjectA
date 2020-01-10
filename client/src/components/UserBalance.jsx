import React, { Component } from 'react';
import logoALY from "./ALY2020.png";
import logoDAI from "./DAI2020.png";

class UserBalance extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="balance">
        <div className="balanceTitle">Current balance</div>
        <div className="currency">
          <div className="ALYnumber">{ this.props.userALYBalance } ALY</div>
          <img src={logoALY} alt="logo ALY token" className="logoALY"/>
        </div>
        <div className="currency">
          <div className="DAInumber">{ this.props.userDAIBalance } DAI</div>
          <img src={logoDAI} alt="logo DAI token" className="logoDAI"/>
        </div>
      </div>
		)
	}
}

export default UserBalance;