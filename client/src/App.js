//Import modules
import React, { Component } from "react";
import getWeb3 from "./getWeb3";
//Import dapp contract and tokens contracts
import SwapAlyContract from "./contracts/SwapAly.json";
import TokenERC20AlyContract from "./contracts/TokenERC20Aly.json";
import TokenERC20DaiContract from "./contracts/TokenERC20Dai.json";
//Import style and tokens logo
import "./App.css";
import logoAly from "./logoAly.jpg";
import logoDai from "./logoDai.jpg";

class App extends Component {
  state = { 
    web3: null,
    accounts: null,
    swapAlyContract: null,
    swapAlyOwner: null,
    swapAlyContractAddress: null,
    tokenAlyContract: null,
    tokenAlyAmount: 0,
    tokenAlyOwner: null,
    tokenAlyContractAddress: null,
    tokenDaiContract: null,
    tokenDaiAmount: 0,
    tokenDaiOwner: null,
    tokenDaiContractAddress: null,
    allowance: 0,
    priceEthAly: 128,
    buyAmount: 0,
    tokenAddresses: null,
    _orderBookALYDAI: [],
  };

  //Dapp set up
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get contracts instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork1 = SwapAlyContract.networks[networkId];
      const deployedNetwork2 = TokenERC20AlyContract.networks[networkId];
      const deployedNetwork3 = TokenERC20DaiContract.networks[networkId];
      const instanceSwapAly = new web3.eth.Contract(
        SwapAlyContract.abi,
        deployedNetwork1 && deployedNetwork1.address,
      );
      const instanceTokenAly = new web3.eth.Contract(
        TokenERC20AlyContract.abi,
        deployedNetwork2 && deployedNetwork2.address,
      );
      const instanceTokenDai = new web3.eth.Contract(
        TokenERC20DaiContract.abi,
        deployedNetwork3 && deployedNetwork3.address,
      );

      //Mapping token addresses
      let tokenAddresses = new Map();

      //Maping ALY
      web3.currentProvider.sendAsync({
        method: 'metamask_watchAsset',
        params: {
          "type":"ERC20",
          "options":{
            "address":deployedNetwork2.address,
            "symbol":"ALY",
            "decimals":0,
            "image":logoAly
          },
        },
        id: 20,
      }, console.log)
      tokenAddresses.set("ALY", deployedNetwork2.address);

      //Mapping DAI
      web3.currentProvider.sendAsync({
        method: 'metamask_watchAsset',
        params: {
          "type":"ERC20",
          "options":{
            "address":deployedNetwork3.address,
            "symbol":"DAI",
            "decimals":0,
            "image":logoDai
          },
        },
        id: 30,
      }, console.log)
      tokenAddresses.set("DAI", deployedNetwork3.address);

      // Set web3, accounts, and contract to the state
      this.setState({ 
        web3, 
        accounts, 
        swapAlyContract: instanceSwapAly,
        tokenAlyContract: instanceTokenAly,
        tokenDaiContract: instanceTokenDai,
        swapAlyContractAddress: deployedNetwork1.address,
        tokenAlyContractAddress: deployedNetwork2.address,
        tokenDaiContractAddress: deployedNetwork3.address,
        tokenAddresses: tokenAddresses
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    };
    this.runOrderBookFillingScript();
  };

  //Fill order book for example purpose
  runOrderBookFillingScript = async () => {
    const { swapAlyContract, tokenAlyContract, tokenDaiContract, tokenAddresses, _orderBookALYDAI } = this.state;

    for(let i=0; i<20; i++){
      let _price = 99;
      let _volume = 10;
      _orderBookALYDAI.push({'type': 'bid', 'price': _price-i, 'volume': _volume+(10*i), 'total': (_price-i) * (_volume+(10*i))});
    }

    for(let i=0; i<20; i++){
      let _price = 101;
      let _volume = 10;
      _orderBookALYDAI.push({'type': 'ask', 'price': _price+i, 'volume': _volume+(10*i), 'total': (_price+i) * (_volume+(10*i))});
    }

    // Get the value from the contract to prove it worked.
    const response2 = await tokenAlyContract.methods.totalSupply().call();
    const response3 = await tokenAlyContract.methods.getOwner().call();
    const response4 = await tokenDaiContract.methods.totalSupply().call();
    const response5 = await tokenDaiContract.methods.getOwner().call();
    const response6 = await swapAlyContract.methods.getOwner().call();

    // Update state with the result.
    this.setState({ 
      tokenAlyAmount: response2, 
      tokenAlyOwner: response3, 
      tokenDaiAmount: response4,
      tokenDaiOwner: response5,
      swapAlyOwner: response6
    });

    //For each token pair, creates an order book
    if(tokenAddresses.size > 1){

    }

    //Display order book
    this.displayOrderBook();
  };

  retrievePrice = async () => {
    console.log("retrieve price function started");
    this.setState({priceEthAly: 130});
    console.log("retrieve price function ended");
  }

  buyAly = async (amount) => {
    console.log("buyAly function started");
    const { web3, accounts, tokenAlyContract, swapAlyContract, tokenAlyOwner, priceEthAly } = this.state;
    const buyer = '0x9b1072e802cA3E8e54F9D867E6767fE557334eB8';
    const buyerBalance = await web3.eth.getBalance(accounts[0]);
    const cost = (amount / priceEthAly) * 10**18;

    if(buyerBalance >= cost){
      console.log("enough funds");
      console.log("accounts[0] ",accounts[0]);
      console.log("tokenAlyOwner ", tokenAlyOwner);
      await swapAlyContract.methods.approve(buyer, amount).send({from: accounts[0]});
      console.log("approve ok");
      await swapAlyContract.methods.buyAly(amount, priceEthAly).send({from: buyer, value: cost });
      console.log("buyAly ok");
      console.log("accounts[0] ",accounts[0]);
      await swapAlyContract.methods.transferFrom(accounts[0], buyer, amount).send({from: accounts[0]});
      console.log("transferFrom ok");
    } else {
      console.log("not enough funds");
    }
      console.log("buyAly function started4");

    //const buyerBalance2 = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]));
    // if (buyerBalance >= cost){
    //   approve
    //   transfer ETH to contract
    //   transfer token to buyer
    // }

    //await tokenAlyContract.methods.transfer(buyer, amount).send({from: accounts[0]});
    console.log('hello');
    console.log("buyer balance: ", buyerBalance);
  }

  displayOrderBook = async () => {
    const { _orderBookALYDAI } = this.state;

    //Sort array
    function sortFunction(a, b){
      if (a.price === b.price) {
          return 0;
      } else {
          return (a.price > b.price) ? -1 : 1;
      }
    }
    _orderBookALYDAI.sort(sortFunction);

    //Reset DOM order book
    let orderBookBody = document.getElementById('orderBookBody');
    while (orderBookBody.firstChild){
      orderBookBody.removeChild(orderBookBody.firstChild);
    }

    //Insert orders in DOM
    if (_orderBookALYDAI.length > 0){
      for (let i=0; i<_orderBookALYDAI.length; i++){
        let newOrder = document.createElement('tr');

        let newOrderType = document.createElement('th');
        newOrderType.textContent = _orderBookALYDAI[i].type;
        let newOrderPrice = document.createElement('th');
        newOrderPrice.textContent = _orderBookALYDAI[i].price;
        let newOrderVolume = document.createElement('th');
        newOrderVolume.textContent = _orderBookALYDAI[i].volume;
        let newOrderTotal = document.createElement('th');
        newOrderTotal.textContent = _orderBookALYDAI[i].total;

        newOrder.appendChild(newOrderPrice);
        newOrder.appendChild(newOrderVolume);
        newOrder.appendChild(newOrderTotal);
        orderBookBody.appendChild(newOrder);
      }
    }
  }

  buyOrder = async (_volume, _price) => {
    const { accounts, swapAlyContractAddress, tokenDaiContract, _orderBookALYDAI } = this.state;
    await tokenDaiContract.methods.approve(swapAlyContractAddress, _volume).send({from: accounts[0]});

    _orderBookALYDAI.push({'type': 'bid', 'price': _price, 'volume': _volume, 'total': _price * _volume});
    this.displayOrderBook(); 
  }

  sellOrder = async (_volume, _price) => {
    const { accounts, swapAlyContractAddress, tokenAlyContract, _orderBookALYDAI } = this.state;
    await tokenAlyContract.methods.approve(swapAlyContractAddress, _volume).send({from: accounts[0]});

    _orderBookALYDAI.push({'type': 'ask', 'price': _price, 'volume': _volume, 'total': _price * _volume});
    this.displayOrderBook();
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Cryptogama</h1>
        <div>The amount of ALY tokens is: {this.state.tokenAlyAmount}</div>
        <div>The ALY contract owner is: {this.state.tokenAlyOwner}</div>
        <div>The ALY contract address is: {this.state.tokenAlyContractAddress}</div>
        <div>The amount of DAI tokens is: {this.state.tokenDaiAmount}</div>
        <div>The DAI contract owner is: {this.state.tokenDaiOwner}</div>
        <div>The DAI contract address is: {this.state.tokenDaiContractAddress}</div>
        <div>The swapAly contract owner is: {this.state.swapAlyOwner}</div>  
        <div>The current allowance is set to: {this.state.allowance}</div>  
        <div className="conteneur">
          <h3>Select token pair</h3>
            <select name="startToken" id="startToken">
              <option value="ALY">ALY</option>
              <option value="DAI">DAI</option>
            </select>
            <select name="endToken" id="endToken">
              <option value="ALY">ALY</option>
              <option value="DAI">DAI</option>
            </select>
          <h3>Buy</h3>
            <form onSubmit={(event) => {
                event.preventDefault()
                const buyVolume = this.volumeBuy.value
                const buyPrice = this.priceBuy.value
                this.buyOrder(buyVolume, buyPrice)
              }}>
              <div className="fields">
                Price: 
                <input id="priceBuy" type="text" ref={(input) => { this.priceBuy = input }} required/>
                Volume:
                <input id="volumeBuy" type="text" ref={(input) => { this.volumeBuy = input }} required/>
              </div>
              <button type="submit">Place buy order</button>
            </form>
          <h3>Sell</h3>
            <form onSubmit={(event) => {
                event.preventDefault()
                const sellVolume = this.volumeSell.value
                const sellPrice = this.priceSell.value
                this.sellOrder(sellVolume, sellPrice)
              }}>
              <div className="fields">
                Price: 
                <input id="priceSell" type="text" ref={(input) => { this.priceSell = input }} required/>
                Volume:
                <input id="volumeSell" type="text" ref={(input) => { this.volumeSell = input }} required/>
              </div>
              <button type="submit">Place sell order</button>
            </form>
          <h3>Order Book</h3>
            <table id="orderBook">
              <thead>
                <tr>
                  <th>Price (DAI)</th>
                  <th>Volume (ALY)</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody id="orderBookBody">
              </tbody>
            </table>
        </div>
      </div>
    );
  }
}

export default App;


