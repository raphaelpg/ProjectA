import React, { Component } from 'react';
import { checkOrders, fixRounding } from '../utils/serverInteractionsFunctions';

class BuyForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			sellInputTotal: '',
			pushedOrder: '',
		};
		this.checkOrders = checkOrders.bind(this);
		this.handleSellPrice = this.handleSellPrice.bind(this);
    this.handleSellVolume = this.handleSellVolume.bind(this);
    this.updateSellTotal = this.updateSellTotal.bind(this);
	}

	//AUTOCOMPLETE SELL TOKEN FORM
	handleSellPrice = async (e) => {
	  if (e.target.value === '') {
	    this.setState({ sellInputTotal: '' });      
	  }
	  this.setState({ sellInputPrice: e.target.value }, this.updateSellTotal)
	}

	handleSellVolume = async (e) => {
	  if (e.target.value === '') {
	    this.setState({ sellInputTotal: '' });      
	  }
	  this.setState({ sellInputVolume: e.target.value }, this.updateSellTotal)
	}

	updateSellTotal = async () => {
	  let sellTotal = this.state.sellInputPrice * this.state.sellInputVolume;
	  if (sellTotal > 0){
	    this.setState({ sellInputTotal: fixRounding(sellTotal, 2).toFixed(2) });
	  }
	}

	//SEND SELL ORDER TO SERVER
	sellOrder = async (_volume, _price) => {
	  const { accounts, swapAlyOwner, tokenAlyContract, tokenAlyContractAddress } = this.props;

	  //CHECK IF USER HAVE SUFFICIENT BALANCE
	  let sellerBalance = await tokenAlyContract.methods.balanceOf(accounts[0]).call();
	  if (sellerBalance/100 >= _volume) {

	    //PREPARE ORDER
	    let total = fixRounding(_price * _volume, 2).toFixed(2);
	    this.state.pushedOrder = {'type': 'ask', 'price': _price, 'volume': _volume, 'total': total, 'seller': accounts[0], 'tokenContractAddress': tokenAlyContractAddress};

	    //EXECUTE APPROVAL TO THE TOKEN CONTRACT
	    await tokenAlyContract.methods.approve(swapAlyOwner, _volume*100).send({from: accounts[0]});

	    //SEND ORDER TO SERVER
	    await fetch('/api/insert', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/json',
	      },
	      body: JSON.stringify({ post: this.state.pushedOrder }),
	    });

	    //TRY TO FIND MATCHING ORDERS FOR SWAP
	    await checkOrders();
	  
	  } else  alert("Unsifficient balance")
	}


	render() {
		return (
			<div className="buyToken">
	      <div className="buyTokenTitle">Sell</div>
	      <form onSubmit={ async (event) => {
	          event.preventDefault()
	          const sellVolume = this.volumeSell.value
	          const sellPrice = this.priceSell.value
	          this.sellOrder(sellVolume, sellPrice)
	        } }>
	        <div className="fields">
	          <div className="buyFields">
	            <label>Price:</label>
	            <div>
	              <input 
	                className="inputFields"
	                type="text"
	                id="priceSell"
	                placeholder={ this.props.bestSellerPrice.toFixed(2) }
	                onChange={ this.handleSellPrice }
	                ref={ (input) => { this.priceSell = input } }
	                autoComplete="off"
	                required
	              />
	              <input className="inputFields2" type="text" id="priceSell2" value="DAI " disabled/>
	            </div>
	          </div>
	          <div className="buyFields">
	            <label>Volume:</label>
	            <div>
	              <input
	                className="inputFields"
	                type="text"
	                id="volumeSell"
	                onChange={ this.handleSellVolume }
	                ref={ (input) => { this.volumeSell = input } }
	                autoComplete="off"
	                required
	              />
	              <input className="inputFields2" type="text" id="volumeSell2" value="ALY " disabled/>
	            </div>
	          </div>
	        </div>
	        <div className="buyFields">
	          <label>Total:</label>
	          <div>
	            <input className="inputFields" type="text" id="totalSell" value={ this.state.sellInputTotal } disabled />
	            <input className="inputFields2" type="text" id="totalSell2" value="DAI " disabled/>
	          </div>
	        </div>
	        <button className="buyTokenButton" type="submit">Sell</button>
	      </form>
	    </div>
		)
	}
}

export default BuyForm;