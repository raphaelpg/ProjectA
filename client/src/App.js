//CRYPTOGAMA DEX REACT CLIENT:

//1.IMPORTS
//2.DAPP SET UP
//3.FUNCTIONS TO RETRIEVE DATA FROM THE SERVER
//4.FUNCTIONS TO SEND DATA TO THE SERVER
//5.FUNCTIONS FOR HTML RENDERING
//6.RENDERING HTML




//1.IMPORTS:

//IMPORT
import React, { Component } from "react";
import getWeb3 from "./getWeb3";

//IMPORT ERC20 TOKEN CONTRACTS
//import SwapAlyContract from "./contracts/SwapAly.json";
import TokenERC20AlyContract from "./contracts/TokenERC20Aly.json";
import TokenERC20DaiContract from "./contracts/TokenERC20Dai.json";

//IMPORT CSS AND TOKENS LOGOS
import "./App.css";
import logoALY from "./ALY2020.png";
import logoDAI from "./DAI2020.png";
import metaLogoALY from "./logoALY.jpg";
import metaLogoDAI from "./logoDAI.jpg";



class App extends Component {

//2.DAPP SET UP

  //STATE SET UP
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
    buyInputPrice: 0,
    buyInputVolume: 0,
    buyInputTotal: '',
    sellInputPrice: 0,
    sellInputVolume: 0,
    sellInputTotal: '',
  }

  //DAPP CONFIGURATION
  componentDidMount = async () => {
    try {
      //GET NETWORK PROVIDER AND WEB3 INSTANCE
      const web3 = await getWeb3();

      //GET USER'S ACCOUNTS
      const accounts = await web3.eth.getAccounts();

      //GET TOKEN CONTRACTS INSTANCE
      const networkId = await web3.eth.net.getId();
      const deployedNetwork2 = TokenERC20AlyContract.networks[networkId];
      const deployedNetwork3 = TokenERC20DaiContract.networks[networkId];

      const instanceTokenAly = new web3.eth.Contract(
        TokenERC20AlyContract.abi,
        deployedNetwork2 && deployedNetwork2.address,
      );

      const instanceTokenDai = new web3.eth.Contract(
        TokenERC20DaiContract.abi,
        deployedNetwork3 && deployedNetwork3.address,
      );

      //MAPPING TOKENS INTO METAMASK
      let tokenAddresses = new Map();

      web3.currentProvider.sendAsync({
        method: 'metamask_watchAsset',
        params: {
          "type":"ERC20",
          "options":{
            "address":deployedNetwork2.address,
            "symbol":"ALY",
            "decimals":0,
            "image":metaLogoALY
          },
        },
        id: 20,
      }, console.log)
      tokenAddresses.set("ALY", deployedNetwork2.address);

      web3.currentProvider.sendAsync({
        method: 'metamask_watchAsset',
        params: {
          "type":"ERC20",
          "options":{
            "address":deployedNetwork3.address,
            "symbol":"DAI",
            "decimals":0,
            "image":metaLogoDAI
          },
        },
        id: 30,
      }, console.log)
      tokenAddresses.set("DAI", deployedNetwork3.address);

      //SET PARAMETERS TO THE STATE
      this.setState({ 
        web3, 
        accounts, 
        tokenAlyContract: instanceTokenAly,
        tokenDaiContract: instanceTokenDai,
        tokenAlyContractAddress: deployedNetwork2.address,
        tokenDaiContractAddress: deployedNetwork3.address,
        tokenAddresses: tokenAddresses
      })
    } catch (error) {
      //CATCH ERRORS
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    };

    //RUN FILL ORDERBOOK SCRIPT (NOT FINISHED YET)
    //this.runOrderBookFillingScript();

    //SET SERVER STATUS TO STATE
    this.setState({serverStatus: "disconnected"});
    this.callApi()
      .then(res => this.setState({ serverStatus: res.express }))
      .catch(err => console.log(err));

    //SET SWAP CONTRACT OWNER ADDRESS TO STATE
    this.getSwapContractOwner()
      .then(res => this.setState({ swapAlyOwner: res.express }))
      .catch(err => console.log(err));

    //SET SWAP CONTRACT ADDRESS TO STATE
    this.getSwapContractAddress()
      .then(res => this.setState({ swapAlyContractAddress: res.express }))
      .catch(err => console.log(err));

    //DISPLAY DATA
    this.displayOrderBook();
    this.displayTradeHistory();

    //LISTEN TO TOKEN CONTRACTS EVENTS
    this.state.tokenAlyContract.events.Approval({fromBlock: 0, toBlock: 'latest'},
    async (error, event) => {
      console.log("event ALY contract: ", event);
    })

    this.state.tokenDaiContract.events.Approval({fromBlock: 0, toBlock: 'latest'},
    async (error, event) => {
      console.log("event DAI contract: ", event);
    })
  }



  //3.FUNCTIONS TO RETRIEVE DATA FROM THE SERVER:

  //GET SERVER STATUS
  callApi = async () => {
    const response = await fetch('/api/hello');
    const serverConnect = await response.json();
    if (response.status !== 200) throw Error(serverConnect.message);
    
    return serverConnect;
  }

  //GET SWAP CONTRACT OWNER
  getSwapContractOwner = async () => {
    const responseSwapOwner = await fetch('/api/swapContractOwner');
    const swapOwner = await responseSwapOwner.json();
    if (responseSwapOwner.status !== 200) throw Error(swapOwner.message);
    
    return swapOwner;
  }

  //GET SWAP CONTRACT ADDRESS
  getSwapContractAddress = async () => {
    const responseSwap = await fetch('/api/swapContractAddress');
    const swapAddress = await responseSwap.json();
    if (responseSwap.status !== 200) throw Error(swapAddress.message);
    
    return swapAddress;
  }

  //GET ORDERBOOK DATA
  displayOrderBook = async () => {
    let { _orderBookBids, _orderBookAsks } = this.state;

    //FETCH AND SAVE ORDERBOOK
    const orderBookResponse = await fetch('/api/orderBook');
    const orderBookEntire = await orderBookResponse.json();
    if (orderBookResponse.status !== 200) throw Error(orderBookEntire.message);
    
    //SEPARATE ORDERBOOK IN TWO ARRAYS (BUY AND SELL)
    _orderBookBids = orderBookEntire['orderBook']['DAIALY']['bids'];
    _orderBookAsks = orderBookEntire['orderBook']['DAIALY']['asks'];

    //REMOVE OLD ORDERS FROM THE DOM
    let orderBookBidsBody = document.getElementById('orderBookBidsBody');
    while (orderBookBidsBody.firstChild){
      orderBookBidsBody.removeChild(orderBookBidsBody.firstChild);
    }

    let orderBookAsksBody = document.getElementById('orderBookAsksBody');
    while (orderBookAsksBody.firstChild){
      orderBookAsksBody.removeChild(orderBookAsksBody.firstChild);
    }

    //INSERT NEW ORDERS INTO DOM (BUY AND SELL)
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

    //SAVE BEST PRICES INTO THE STATE
    if (_orderBookAsks[0]){
      this.setState({ bestSellerPrice: _orderBookAsks[0].price, bestSellerVolume: _orderBookAsks[0].volume, bestSellerAddress: _orderBookAsks[0].seller });
    }

    if (_orderBookBids[0]){
      this.setState({ bestBuyerPrice: _orderBookBids[0].buyer, bestBuyerVolume: _orderBookBids[0].volume, bestBuyerAddress: _orderBookBids[0].buyer });
    }
  }


  //GET TRADE HISTORY DATA
  displayTradeHistory = async () => {
    let { tradeHistory } = this.state;

    ////FETCH AND SAVE TRADE HISTORY
    const tradeHistoryResponse = await fetch('/api/tradeHistory');
    const tradeHistoryEntire = await tradeHistoryResponse.json();
    if (tradeHistoryResponse.status !== 200) throw Error(tradeHistoryEntire.message);

    //SAVE TRADE HISTORY IN ARRAY
    tradeHistory = tradeHistoryEntire['tradeHistory']['trades'];

    //SORT ARRAY
    function sortDecreaseTime(a, b){
      if (a.timestamp === b.timestamp) {
          return 0;
      } else {
          return (a.timestamp > b.timestamp) ? -1 : 1;
      }
    }

    tradeHistory.sort(sortDecreaseTime);

    //REMOVE OLD TRADES FROM THE DOM
    let tradeHistoryBody = document.getElementById('tradeHistoryBody');
    while (tradeHistoryBody.firstChild){
      tradeHistoryBody.removeChild(tradeHistoryBody.firstChild);
    }

    //INSERT NEW TRADES INTO DOM
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
          newTradeTime.className += "tradeTimestamp";
          newTradeTime.textContent = tradeHistory[i].timestamp;

          newTrade.appendChild(newTradePrice);
          newTrade.appendChild(newTradeVolume);
          newTrade.appendChild(newTradeTime);
          tradeHistoryBody.appendChild(newTrade);
        }
      }
    }
  }

  


  //4.FUNCTIONS TO SEND DATA TO THE SERVER:

  //ASK SERVER TO TRY SWAP ORDERS 
  checkOrders = async () => {
    const callCheck = await fetch('/api/swap');
    const callCheckResponse = await callCheck.json();
    if (callCheck.status !== 200) throw Error(callCheckResponse.message);
    return;
  }

  //SEND BUY ORDER TO SERVER
  buyOrder = async (_volume, _price) => {

    //RETRIEVE DATA FROM STATE AND PREPARE ORDER
    const { accounts, swapAlyOwner, tokenDaiContract, tokenDaiContractAddress } = this.state;
    this.state.pushedOrder = {'type': 'bid', 'price': _price, 'volume': _volume, 'total': _price * _volume, 'buyer': accounts[0], 'tokenContractAddress': tokenDaiContractAddress};
    
    //EXECUTE APPROVAL TO THE TOKEN CONTRACT
    await tokenDaiContract.methods.approve(swapAlyOwner, _volume * _price).send({from: accounts[0]})

    //SEND ORDER TO SERVER
    await fetch('/api/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.pushedOrder }),
    });

    //TRY TO FIND MATCHING ORDERS FOR SWAP
    await this.checkOrders()
  }

  //SEND SELL ORDER TO SERVER
  sellOrder = async (_volume, _price) => {

    //RETRIEVE DATA FROM STATE AND PREPARE ORDER
    const { accounts, swapAlyOwner, tokenAlyContract, tokenAlyContractAddress } = this.state;
    this.state.pushedOrder = {'type': 'ask', 'price': _price, 'volume': _volume, 'total': _price * _volume, 'seller': accounts[0], 'tokenContractAddress': tokenAlyContractAddress};

    //EXECUTE APPROVAL TO THE TOKEN CONTRACT
    await tokenAlyContract.methods.approve(swapAlyOwner, _volume).send({from: accounts[0]});

    //SEND ORDER TO SERVER
    await fetch('/api/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.pushedOrder }),
    });

    //TRY TO FIND MATCHING ORDERS FOR SWAP
    await this.checkOrders();
  }





  //5.FUNCTIONS FOR HTML RENDERING
  

  //AUTOCOMPLETE BUY TOKEN FORM
  handleBuyPrice = async (e) => {
    if (e.target.value === '') {
      this.setState({buyInputTotal: ''});      
    }
    this.setState({buyInputPrice: e.target.value}, this.updateBuyTotal)
  }
  handleBuyVolume = async (e) => {
    if (e.target.value === '') {
      this.setState({buyInputTotal: ''});      
    }
    this.setState({buyInputVolume: e.target.value}, this.updateBuyTotal)
  }
  updateBuyTotal = async () => {
    let buyTotal = this.state.buyInputPrice * this.state.buyInputVolume;
    if (buyTotal > 0){
      this.setState({buyInputTotal: buyTotal});
    }
  }

  //AUTOCOMPLETE SELL TOKEN FORM
  handleSellPrice = async (e) => {
    if (e.target.value === '') {
      this.setState({sellInputTotal: ''});      
    }
    this.setState({sellInputPrice: e.target.value}, this.updateSellTotal)
  }
  handleSellVolume = async (e) => {
    if (e.target.value === '') {
      this.setState({sellInputTotal: ''});      
    }
    this.setState({sellInputVolume: e.target.value}, this.updateSellTotal)
  }
  updateSellTotal = async () => {
    let sellTotal = this.state.sellInputPrice * this.state.sellInputVolume;
    if (sellTotal > 0){
      this.setState({sellInputTotal: sellTotal});
    }
  }





  //6.RENDERING HTML

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">


        {/*HEADER*/}
        <header className="Header">
          <h1 className="Title">Cryptogama</h1>
          {/*
          <div>The amount of ALY tokens is: {this.state.tokenAlyAmount}</div>
          <div>The ALY contract owner is: {this.state.tokenAlyOwner}</div>
          <div>The ALY contract address is: {this.state.tokenAlyContractAddress}</div>
          <div>The amount of DAI tokens is: {this.state.tokenDaiAmount}</div>
          <div>The DAI contract owner is: {this.state.tokenDaiOwner}</div>
          <div>The DAI contract address is: {this.state.tokenDaiContractAddress}</div>
          <div>The swapAly contract owner is: {this.state.swapAlyOwner}</div>
          <div>The swapAly contract address: {this.state.swapAlyContractAddress}</div>
          */}
          <div className="description">Swap and trade ERC20 tokens</div>
          <p className="ServerStatus">Server status: {this.state.serverStatus}</p>
        </header>      


        {/*TOKEN SELECTOR*/}
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



        {/*MAIN SECTION*/}
        <div className="Main">


          {/*MAIN LEFT PART*/}
          <div className="MainLeft">

            {/*TRADE HISTORY*/}
            <div className="tradeHistoryTitle">Trade history</div>
            <div className="tradeContainer">
              <table id="tradeHistoryTable">
                <tbody id="tradeHistoryBody">
                </tbody>
              </table>
            </div>
          </div>


          {/*MAIN CENTER PART*/}
          <div className="MainCenter">

            {/*TOKEN PRICE GRAPH*/}
            <div className="graph">
              <div className="tbd">
                ALY price evolution graph (to come...)
              </div>
            </div>

            {/*BUY AND SELL FORMS*/}
            <div className="buySellToken">
              <div className="buyToken">

                {/*BUY FORM*/}
                <div className="buyTokenTitle">Buy</div>
                <form onSubmit={async (event) => {
                    event.preventDefault()
                    const buyVolume = this.volumeBuy.value
                    const buyPrice = this.priceBuy.value
                    await this.buyOrder(buyVolume, buyPrice)
                    setTimeout( () => {
                      this.displayOrderBook();
                      this.displayTradeHistory();
                    }, 1000);
                  }}>
                  <div className="fields">
                    <div className="buyFields">
                      <label>Price:</label>
                      <div>
                        <input 
                          className="inputFields"
                          type="text"
                          id="priceBuy"
                          placeholder={ this.state.bestSellerPrice.toFixed(2) }
                          onChange={ this.handleBuyPrice }
                          ref={(input) => { this.priceBuy = input }}
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
                          ref={(input) => { this.volumeBuy = input }}
                          autoComplete="off"
                          required
                        />
                        <input className="inputFields2" type="text" id="volumeBuy2" value="ALY " disabled/>
                      </div>
                    </div>
                    <div className="buyFields">
                      <label>Total:</label>
                      <div>
                        <input className="inputFields" type="text" id="totalBuy" value={this.state.buyInputTotal} disabled />
                        <input className="inputFields2" type="text" id="totalBuy2" value="DAI " disabled/>
                      </div>
                    </div>
                  </div>
                  <button className="buyTokenButton" type="submit">Buy</button>
                </form>
              </div>

              {/*SELL FORM*/}
              <div className="buyToken">
                <div className="buyTokenTitle">Sell</div>
                <form onSubmit={async (event) => {
                    event.preventDefault()
                    const sellVolume = this.volumeSell.value
                    const sellPrice = this.priceSell.value
                    await this.sellOrder(sellVolume, sellPrice)
                    setTimeout( () => {
                      this.displayOrderBook();
                      this.displayTradeHistory();
                    }, 1000);
                  }}>
                  <div className="fields">
                    <div className="buyFields">
                      <label>Price:</label>
                      <div>
                        <input 
                          className="inputFields"
                          type="text"
                          id="priceSell"
                          placeholder={this.state.bestSellerPrice.toFixed(2)}
                          onChange={ this.handleSellPrice }
                          ref={(input) => { this.priceSell = input }}
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
                          ref={(input) => { this.volumeSell = input }}
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
                      <input className="inputFields" type="text" id="totalSell" value={this.state.sellInputTotal} disabled />
                      <input className="inputFields2" type="text" id="totalSell2" value="DAI " disabled/>
                    </div>
                  </div>
                  <button className="buyTokenButton" type="submit">Sell</button>
                </form>
              </div>
            </div>
            
            {/*USERS OPEN ORDERS*/}
            <div className="checkOrders">
              <div className="yourOrders">Your open orders: </div>
              <table className="userOrders"></table>
            </div>
          </div>


          {/*MAIN RIGHT PART*/}
          <div className="MainRight">

            {/*ORDERBOOK SECTION*/}
            <div className="sectionOrderBook">
              <div className="orderBookTitles">
                <div>Price (DAI)</div>
                <div>Volume (ALY)</div>
                <div>Total (DAI)</div>
              </div>

              {/*SELL ORDERBOOK*/}
              <table id="asks">
                <tbody id="orderBookAsksBody">
                </tbody>
              </table>

              {/*CURRENT PRICE*/}
              <p className="orderBookPrice">{this.state.bestSellerPrice.toFixed(2)} DAI (Current price)</p>

              {/*BUY ORDERBOOK*/}
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


