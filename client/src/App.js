//Import modules
import React, { Component } from "react";
import getWeb3 from "./getWeb3";
//Import dapp contract and tokens contracts
//import SwapAlyContract from "./contracts/SwapAly.json";
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
    _orderBookBids: [],
    _orderBookAsks: [],
    tradeHistory: [],
    serverStatus: '',
    post: '',
    responseToPost: '',
    pushedOrder: '',
    bestSellerPrice: 0,
    bestSellerVolume: 0,
    bestSellerAddress: '',
    bestBuyerPrice: 0,
    bestBuyerVolume: 0,
    bestBuyerAddress: '',
  }

  //Dapp set up
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get contracts instance.
      const networkId = await web3.eth.net.getId();
      //const deployedNetwork1 = SwapAlyContract.networks[networkId];
      const deployedNetwork2 = TokenERC20AlyContract.networks[networkId];
      const deployedNetwork3 = TokenERC20DaiContract.networks[networkId];
      // const instanceSwapAly = new web3.eth.Contract(
      //   SwapAlyContract.abi,
      //   deployedNetwork1 && deployedNetwork1.address,
      // );
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
        //swapAlyContract: instanceSwapAly,
        tokenAlyContract: instanceTokenAly,
        tokenDaiContract: instanceTokenDai,
        //swapAlyContractAddress: deployedNetwork1.address,
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
    //this.runOrderBookFillingScript();

    //Check server status
    this.setState({serverStatus: "disconnected"});
    this.callApi()
      .then(res => this.setState({ serverStatus: res.express }))
      .catch(err => console.log(err));

    //Retrieve swap contract's owner
    this.getSwapContractOwner()
      .then(res => this.setState({ swapAlyOwner: res.express }))
      .catch(err => console.log(err));

    //Retrieve swap contract's address
    this.getSwapContractAddress()
      .then(res => this.setState({ swapAlyContractAddress: res.express }))
      .catch(err => console.log(err));

    //Display data
    this.displayOrderBook();
    this.displayTradeHistory();
  }


  //Fill order book for example purpose
  runOrderBookFillingScript = async () => {
    const { swapAlyContract, tokenAlyContract, tokenDaiContract, tokenAddresses, _orderBookBids } = this.state;

    for(let i=0; i<20; i++){
      let _price = 99;
      let _volume = 10;
      _orderBookBids.push({'type': 'bid', 'price': _price-i, 'volume': _volume+(10*i), 'total': (_price-i) * (_volume+(10*i))});
    }

    for(let i=0; i<20; i++){
      let _price = 101;
      let _volume = 10;
      _orderBookBids.push({'type': 'ask', 'price': _price+i, 'volume': _volume+(10*i), 'total': (_price+i) * (_volume+(10*i))});
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
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const serverConnect = await response.json();
    if (response.status !== 200) throw Error(serverConnect.message);
    
    return serverConnect;
  }

  getSwapContractOwner = async () => {
    const responseSwapOwner = await fetch('/api/swapContractOwner');
    const swapOwner = await responseSwapOwner.json();
    if (responseSwapOwner.status !== 200) throw Error(swapOwner.message);
    
    return swapOwner;
  }

  getSwapContractAddress = async () => {
    const responseSwap = await fetch('/api/swapContractAddress');
    const swapAddress = await responseSwap.json();
    if (responseSwap.status !== 200) throw Error(swapAddress.message);
    
    return swapAddress;
  }

  displayOrderBook = async () => {
    let { _orderBookBids, _orderBookAsks } = this.state;

    //Get orderbook
    const orderBookResponse = await fetch('/api/orderBook');
    const orderBookEntire = await orderBookResponse.json();
    if (orderBookResponse.status !== 200) throw Error(orderBookEntire.message);
    
    //Fill _orderBookBids & _orderBooksAsks
    _orderBookBids = orderBookEntire['orderBook']['DAIALY']['bids'];
    _orderBookAsks = orderBookEntire['orderBook']['DAIALY']['asks'];

    //Sort array
    function sortDecrease(a, b){
      if (a.price === b.price) {
          return 0;
      } else {
          return (a.price > b.price) ? -1 : 1;
      }
    }

    function sortIncrease(a, b){
      if (a.price === b.price) {
          return 0;
      } else {
          return (a.price < b.price) ? -1 : 1;
      }
    }

    _orderBookBids.sort(sortDecrease);
    _orderBookAsks.sort(sortIncrease);

    //Reset DOM order book
    let orderBookBidsBody = document.getElementById('orderBookBidsBody');
    while (orderBookBidsBody.firstChild){
      orderBookBidsBody.removeChild(orderBookBidsBody.firstChild);
    }

    let orderBookAsksBody = document.getElementById('orderBookAsksBody');
    while (orderBookAsksBody.firstChild){
      orderBookAsksBody.removeChild(orderBookAsksBody.firstChild);
    }

    //Insert orders in DOM
    if (_orderBookBids.length > 0){
      for (let i=0; i<15; i++){
        if (_orderBookBids[i]){
          let newOrder = document.createElement('tr');
          newOrder.className += "newOrder";

          let newOrderType = document.createElement('th');
          newOrderType.textContent = _orderBookBids[i].type;
          let newOrderPrice = document.createElement('th');
          newOrderPrice.textContent = _orderBookBids[i].price.toFixed(2);
          newOrderPrice.className += "newOrderPriceBid";
          let newOrderVolume = document.createElement('th');
          newOrderVolume.textContent = _orderBookBids[i].volume.toFixed(2);
          let newOrderTotal = document.createElement('th');
          newOrderTotal.textContent = _orderBookBids[i].total.toFixed(2);

          newOrder.appendChild(newOrderPrice);
          newOrder.appendChild(newOrderVolume);
          newOrder.appendChild(newOrderTotal);
          orderBookBidsBody.appendChild(newOrder);
        }
      }
    }

    if (_orderBookAsks.length > 0){
      for (let i=0; i<15; i++){
        if (_orderBookAsks[i]){
          let newOrder = document.createElement('tr');
          newOrder.className += "newOrder";

          let newOrderType = document.createElement('th');
          newOrderType.textContent = _orderBookAsks[i].type;
          let newOrderPrice = document.createElement('th');
          newOrderPrice.textContent = _orderBookAsks[i].price.toFixed(2);
          newOrderPrice.className += "newOrderPriceAsk";
          let newOrderVolume = document.createElement('th');
          newOrderVolume.textContent = _orderBookAsks[i].volume.toFixed(2);
          let newOrderTotal = document.createElement('th');
          newOrderTotal.textContent = _orderBookAsks[i].total.toFixed(2);

          newOrder.appendChild(newOrderPrice);
          newOrder.appendChild(newOrderVolume);
          newOrder.appendChild(newOrderTotal);
          orderBookAsksBody.insertBefore(newOrder, orderBookAsksBody.firstChild);
        }
      }
    }

    if (_orderBookAsks[0]){
      this.setState({ bestSellerPrice: _orderBookAsks[0].price, bestSellerVolume: _orderBookAsks[0].volume, bestSellerAddress: _orderBookAsks[0].seller });
    }

    if (_orderBookBids[0]){
      this.setState({ bestBuyerPrice: _orderBookBids[0].buyer, bestBuyerVolume: _orderBookBids[0].volume, bestBuyerAddress: _orderBookBids[0].buyer });
    }
  }

  displayTradeHistory = async () => {
    let { tradeHistory } = this.state;

    //Get trade history
    const tradeHistoryResponse = await fetch('/api/tradeHistory');
    const tradeHistoryEntire = await tradeHistoryResponse.json();
    if (tradeHistoryResponse.status !== 200) throw Error(tradeHistoryEntire.message);

    //Fill tradeHistory
    console.log(tradeHistoryEntire);
    tradeHistory = tradeHistoryEntire['tradeHistory']['trades'];

    //Sort array
    function sortDecreaseTime(a, b){
      if (a.time === b.time) {
          return 0;
      } else {
          return (a.time > b.time) ? -1 : 1;
      }
    }

    tradeHistory.sort(sortDecreaseTime);

    //Reset DOM order book
    let tradeHistoryBody = document.getElementById('tradeHistoryBody');
    while (tradeHistoryBody.firstChild){
      tradeHistoryBody.removeChild(tradeHistoryBody.firstChild);
    }

    //Insert trades in DOM
    if (tradeHistory.length > 0){
      for (let i=0; i<31; i++){
        if (tradeHistory[i]){
          let newTrade = document.createElement('tr');
          newTrade.className += "newTrade";

          let newTradePrice = document.createElement('th');
          newTradePrice.textContent = tradeHistory[i].price.toFixed(2);
          newTradePrice.className += "newTradePriceBid";
          let newTradeVolume = document.createElement('th');
          newTradeVolume.textContent = tradeHistory[i].volume.toFixed(2);
          let newTradeTime = document.createElement('th');
          newTradeTime.textContent = tradeHistory[i].time;

          newTrade.appendChild(newTradePrice);
          newTrade.appendChild(newTradeVolume);
          newTrade.appendChild(newTradeTime);
          tradeHistoryBody.appendChild(newTrade);
        }
      }
    }
  }

  
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    
    this.setState({ responseToPost: body });
  }

  retrievePrice = async () => {
    console.log("retrieve price function started");
    this.setState({priceEthAly: 130});
    console.log("retrieve price function ended");
  }

  buyToken = async () => {
    this.displayOrderBook(); 
  }

  checkOrders = async () => {
    // const { accounts, swapAlyContract, tokenAlyContractAddress, tokenDaiContractAddress, bestSellerAddress, bestSellerPrice, bestSellerVolume, bestBuyerAddress, bestBuyerVolume } = this.state;
    // let volumeToTransfer = bestBuyerVolume * bestSellerPrice;

    // //swap
    // console.log("swap started");
    // await swapAlyContract.methods.swapToken(bestSellerAddress, tokenAlyContractAddress, bestBuyerVolume, bestBuyerAddress, tokenDaiContractAddress, volumeToTransfer).send({from: accounts[0]});
    // console.log("swap ended");
    //maj orderbook
    //maj decrease approve seller
    //maj decrease approve buyer
    //maj tradeHistory

    const callCheck = await fetch('/api/swap');
    const callCheckResponse = await callCheck.json();
    if (callCheck.status !== 200) throw Error(callCheckResponse.message);
    return callCheckResponse;
  }

  buyOrder = async (_volume, _price) => {
    const { accounts, swapAlyOwner, tokenDaiContract, tokenDaiContractAddress, _orderBookBids } = this.state;
    this.state.pushedOrder = {'type': 'bid', 'price': _price, 'volume': _volume, 'total': _price * _volume, 'buyer': accounts[0], 'tokenContractAddress': tokenDaiContractAddress};
    
    await tokenDaiContract.methods.approve(swapAlyOwner, _volume).send({from: accounts[0]});

    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.pushedOrder }),
    });

    await this.checkOrders();
    await this.displayOrderBook();
  }

  sellOrder = async (_volume, _price) => {
    const { accounts, swapAlyOwner, tokenAlyContract, tokenAlyContractAddress, _orderBookBids } = this.state;
    this.state.pushedOrder = {'type': 'ask', 'price': _price, 'volume': _volume, 'total': _price * _volume, 'seller': accounts[0], 'tokenContractAddress': tokenAlyContractAddress};

    await tokenAlyContract.methods.approve(swapAlyOwner, _volume).send({from: accounts[0]});

    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.pushedOrder }),
    });
    await this.checkOrders();
    await this.displayOrderBook();
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <header className="Header">
          <h1 className="Title">Cryptogama</h1>
          {/*<div>The amount of ALY tokens is: {this.state.tokenAlyAmount}</div>
          <div>The ALY contract owner is: {this.state.tokenAlyOwner}</div>
          <div>The ALY contract address is: {this.state.tokenAlyContractAddress}</div>
          <div>The amount of DAI tokens is: {this.state.tokenDaiAmount}</div>
          <div>The DAI contract owner is: {this.state.tokenDaiOwner}</div>
          <div>The DAI contract address is: {this.state.tokenDaiContractAddress}</div>
          <div>The swapAly contract owner is: {this.state.swapAlyOwner}</div>
          <div>The swapAly contract address: {this.state.swapAlyContractAddress}</div>
          <div>The current allowance is set to: {this.state.allowance}</div>*/}
          <div className="description">Swap and trade ERC20 tokens</div>
          <p className="ServerStatus">Server status: {this.state.serverStatus}</p>
        </header>      
        {/*<form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>*/}

        <div className="tokenSelector">
          <h2>Select token pair</h2>
          <select name="startToken" id="startToken">
            <option value="ALY">ALY</option>
            <option value="DAI">DAI</option>
          </select>
          <select name="endToken" id="endToken">
            <option value="ALY">ALY</option>
            <option value="DAI">DAI</option>
          </select>
        </div>

        <div className="Main">
          <div className="MainLeft">
            <div className="tradeHistoryTitle">Trade history</div>
            <table id="tradeHistoryTable">
                <tbody id="tradeHistoryBody">
                </tbody>
              </table>
          </div>

          <div className="MainCenter">
            <div className="graph"></div>
            <div className="buySellToken">
              <div className="buyToken">
                <div className="buyTokenTitle">Buy</div>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    const buyVolume = this.volumeBuy.value
                    const buyPrice = this.priceBuy.value
                    this.buyOrder(buyVolume, buyPrice)
                  }}>
                  <div className="fields">
                    <div className="buyFields">
                      <label for="priceBuy">Price:</label>
                      <input className="inputFields" id="priceBuy" type="text" ref={(input) => { this.priceBuy = input }} required/>
                    </div>
                    <div className="buyFields">
                      <label for="volumeBuy">Volume:</label>
                      <input className="inputFields" id="volumeBuy" type="text" ref={(input) => { this.volumeBuy = input }} required/>
                    </div>
                  </div>
                  <div className="buyFields">
                    <label for="totalBuy">Total:</label>
                    <input className="inputFields" id="totalBuy" type="text" ref={(input) => { this.totalBuy = input }} />
                  </div>
                  <button className="buyTokenButton" type="submit">Buy</button>
                </form>
              </div>
              <div className="buyToken">
                <div className="buyTokenTitle">Sell</div>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    const sellVolume = this.volumeSell.value
                    const sellPrice = this.priceSell.value
                    console.log("vol: ", sellVolume, ", price: ", sellPrice);
                    this.sellOrder(sellVolume, sellPrice)
                  }}>
                  <div className="fields">
                    <div className="buyFields">
                      <label for="priceSell">Price:</label>
                      <input className="inputFields" id="priceSell" type="text" ref={(input) => { this.priceSell = input }} required/>
                    </div>
                    <div className="buyFields">
                      <label for="volumeSell">Volume:</label>
                      <input className="inputFields" id="volumeSell" type="text" ref={(input) => { this.volumeSell = input }} required/>
                    </div>
                  </div>
                  <div className="buyFields">
                    <label for="totalSell">Total:</label>
                    <input className="inputFields" id="totalSell" type="text" ref={(input) => { this.totalBuy = input }} />
                  </div>
                  <button className="buyTokenButton" type="submit">Sell</button>
                </form>
              </div>
            </div>
            <div>
              <form onSubmit={(event) => {
                  event.preventDefault()
                  this.buyToken()
                }}>
                <button type="submit">Buy</button>
                <div className="fields">
                  Volume:
                  <input id="volumeToBuy" type="text" ref={(input) => { this.volumeToBuy = input }} />
                </div>
              </form>
            </div>
            <div className="checkOrders">
              <h2>Check orders</h2>
              <form onSubmit={(event) => {
                  event.preventDefault()
                  this.checkOrders()
                }}>
                <button type="submit">Swap</button>  
              </form>
            </div>
            
          
          </div>

          <div className="MainRight">
            <div className="sectionOrderBook">
              <div className="orderBookTitles">
                <div>Price (DAI)</div>
                <div>Volume (ALY)</div>
                <div>Total (DAI)</div>
              </div>
              <table id="asks">
                <tbody id="orderBookAsksBody">
                </tbody>
              </table>
              <p className="orderBookPrice">{this.state.bestSellerPrice.toFixed(2)} DAI (Current price)</p>
              <table id="bids">
                <tbody id="orderBookBidsBody">
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default App;


