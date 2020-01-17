import React, { Component } from 'react';
import logoALY from "./ALY2020.png";
import logoDAI from "./DAI2020.png";

class UserBalance extends Component {
	constructor(props) {
		super(props);
    this.state = {
      ALYBalance: 0,
      DAIBalance: 0,
    }
    this.getUserBalance = this.getUserBalance.bind(this)
	}

  componentDidMount = async () => {
    await this.getUserBalance()
  }

  //GET USER'S TOKEN BALANCE
  getUserBalance = async () => {
    const { accounts, tokenAlyContract, tokenDaiContract } = this.props;

    //RETRIEVE USER ALY AND DAI BALANCES
    let ALYBalance = await tokenAlyContract.methods.balanceOf(accounts[0]).call();
    let DAIBalance = await tokenDaiContract.methods.balanceOf(accounts[0]).call();
    console.log("ALYBalance: ",ALYBalance)
    this.setState({
      ALYBalance: (ALYBalance/100).toFixed(2),
      DAIBalance: (DAIBalance/100).toFixed(2)
    })
    return
  }

  componentDidUpdate = async () => {
    await this.getUserBalance()
  }

	render() {
		return (
			<div className="balance">
        <div className="balanceTitle">Current balance</div>
        <div className="currency">
          <div className="ALYnumber">{ this.state.ALYBalance } ALY</div>
          <img src={logoALY} alt="logo ALY token" className="logoALY"/>
        </div>
        <div className="currency">
          <div className="DAInumber">{ this.state.DAIBalance } DAI</div>
          <img src={logoDAI} alt="logo DAI token" className="logoDAI"/>
        </div>
      </div>
		)
	}
}

export default UserBalance;