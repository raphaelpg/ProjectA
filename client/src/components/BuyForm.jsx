import React, { Component } from 'react';
import { checkOrders, fixRounding } from '../utils/serverInteractionsFunctions';

class BuyForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			buyInputTotal: '',
			pushedOrder: '',
		};
		this.checkOrders = checkOrders.bind(this);
		this.handleBuyPrice = this.handleBuyPrice.bind(this);
    this.handleBuyVolume = this.handleBuyVolume.bind(this);
    this.updateBuyTotal = this.updateBuyTotal.bind(this);
	}

	//AUTOCOMPLETE BUY TOKEN FORM
	handleBuyPrice = async (e) => {
	  if (e.target.value === '') {
	    this.setState({ buyInputTotal: '' });      
	  }
	  this.setState({ buyInputPrice: e.target.value }, this.updateBuyTotal)
	}
	
	handleBuyVolume = async (e) => {
	  if (e.target.value === '') {
	    this.setState({ buyInputTotal: '' });      
	  }
	  this.setState({ buyInputVolume: e.target.value }, this.updateBuyTotal)
	}
	
	updateBuyTotal = async () => {
	  let buyTotal = this.state.buyInputPrice * this.state.buyInputVolume;
	  if (buyTotal > 0){
	    this.setState({ buyInputTotal: fixRounding(buyTotal, 2).toFixed(2) });
	  }
	}

	//SEND BUY ORDER TO SERVER
	buyOrder = async (_volume, _price) => {
		const { accounts, swapAlyOwner, tokenDaiContract, tokenDaiContractAddress } = this.props;

		//CHECK IF USER HAVE SUFFICIENT BALANCE
		let buyerBalance = await tokenDaiContract.methods.balanceOf(accounts[0]).call();
		if ( buyerBalance/100 >= (_volume*_price) ) {

		  //PREPARE ORDER
	    let total = fixRounding(_price * _volume, 2).toFixed(2);
		  this.state.pushedOrder = {'type': 'bid', 'price': _price, 'volume': _volume, 'total': total, 'buyer': accounts[0], 'tokenContractAddress': tokenDaiContractAddress};
		  
		  let volumeToApprove = total;

		  //EXECUTE APPROVAL TO THE TOKEN CONTRACT
		  await tokenDaiContract.methods.approve(swapAlyOwner, volumeToApprove*100).send({from: accounts[0]})

		  //SEND ORDER TO SERVER
		  await fetch('/api/insert', {
		    method: 'POST',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify({ post: this.state.pushedOrder }),
		  });

		  //TRY TO FIND MATCHING ORDERS FOR SWAP
		  await checkOrders()

		} else alert("Unsifficient balance")
	}

	render() {
		return (
			<div className="buyToken">
	      <div className="buyTokenTitle">Buy</div>
	      <form onSubmit={ async (event) => {
	          event.preventDefault()
	          const buyVolume = this.volumeBuy.value
	          const buyPrice = this.priceBuy.value
	          this.buyOrder(buyVolume, buyPrice)
	        }}>
	        <div className="fields">
	          <div className="buyFields">
	            <label>Price:</label>
	            <div>
	              <input 
	                className="inputFields"
	                type="text"
	                id="priceBuy"
	                placeholder={ this.props.bestSellerPrice.toFixed(2) }
	                onChange={ this.handleBuyPrice }
	                ref={ (input) => { this.priceBuy = input } }
	                autoComplete="off"
	                required
	              />
	              <input className="inputFields2" type="text" id="priceBuy2" value="DAI " disabled/>
	            </div>
	          </div>
	          <div className="buyFields">
	            <label>Volume:</label>
	            <div>
	              <input
	                className="inputFields"
	                type="text"
	                id="volumeBuy"
	                onChange={ this.handleBuyVolume }
	                ref={ (input) => { this.volumeBuy = input } }
	                autoComplete="off"
	                required
	              />
	              <input className="inputFields2" type="text" id="volumeBuy2" value="ALY " disabled/>
	            </div>
	          </div>
	          <div className="buyFields">
	            <label>Total:</label>
	            <div>
	              <input className="inputFields" type="text" id="totalBuy" value={ this.state.buyInputTotal } disabled />
	              <input className="inputFields2" type="text" id="totalBuy2" value="DAI " disabled/>
	            </div>
	          </div>
	        </div>
	        <button className="buyTokenButton" type="submit">Buy</button>
	      </form>
	    </div>
		)
	}
}

export default BuyForm;