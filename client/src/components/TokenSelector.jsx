import React, { Component } from 'react';
import logoALY from "./ALY2020.png";
import logoDAI from "./DAI2020.png";

class TokenSelector extends Component {
	// constructor(props) {
	// 	super(props);
	// }

	render() {
		return (
			<div className="tokenSelector">
        <div className="pairTitle">Selected pair:</div>
        <div>
          <img src={logoALY} alt="logo ALY token" className="logoALY"/>
          <div className="nameALY">ALY</div>
        </div>
        <div>
          <img src={logoDAI} alt="logo DAI token" className="logoDAI"/>
          <div className="nameDAI">DAI</div>
        </div>
      </div>
		)
	}
}

export default TokenSelector;