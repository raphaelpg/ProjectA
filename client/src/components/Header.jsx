import React, { Component } from 'react';

class Header extends Component {

	render() {
		return (
			<header className="Header">
        <h1 className="Title">Cryptogama</h1>
        <div className="description">Swap and trade ERC20 tokens</div>
        <div className="ServerStatus"><div className="ServerStatusTitle">Server status: </div>{ this.props.serverStatus }</div>
      </header> 
		)
	}
}

export default Header;