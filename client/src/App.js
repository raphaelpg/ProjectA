//CRYPTOGAMA REACT CLIENT: 

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
import TokenERC20AlyContract from "./contracts/TokenERC20Aly.json";
import TokenERC20DaiContract from "./contracts/TokenERC20Dai.json";
import SwapAlyContract from "./contracts/SwapAly.json";

//IMPORT COMPONENTS
import Header from './components/Header';
import TokenSelector from './components/TokenSelector';
import UserBalance from './components/UserBalance';
import TradeHistory from './components/TradeHistory';
import Graph from './components/Graph';
import Orderbook from './components/Orderbook';
import UserOrders from './components/UserOrders';

//IMPORT CSS AND TOKENS LOGOS
import "./App.css";
// import metaLogoALY from "./logoALY.jpg";
// import metaLogoDAI from "./logoDAI.jpg";



class App extends Component {

//2.DAPP SET UP

  //STATE SET UP
  constructor(props) {
    super(props);
    this.state = { 
      web3: null,
      accounts: null,
      swapAlyContract: null,
      swapAlyOwner: null,
      swapAlyContractAddress: null,
      tokenAlyContract: null,
      tokenAlyContractAddress: null,
      tokenDaiContract: null,
      tokenDaiContractAddress: null,
      _orderBookBids: [],
      _orderBookAsks: [],
      tradeHistory: [],
      tradeGraph: [],
      serverStatus: '',
      pushedOrder: '',
      bestSellerPrice: 0,
      bestBuyerPrice: 0,
      buyInputPrice: 0,
      buyInputVolume: 0,
      buyInputTotal: '',
      sellInputPrice: 0,
      sellInputVolume: 0,
      sellInputTotal: '',
      ALYBalance: 0,
      DAIBalance: 0,
    }
  }

  //DAPP CONFIGURATION
  componentDidMount = async () => {
    try {
      //SET SWAP CONTRACT ADDRESS TO STATE
      this.getSwapContractAddress()
      .then(res => this.setState({ swapAlyContractAddress: res.express }))
      .catch(err => console.log(err));

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

      const instanceSwapAly = new web3.eth.Contract(
        SwapAlyContract.abi,
        this.state.swapAlyContractAddress,
      );

      //SET PARAMETERS TO THE STATE
      this.setState({ 
        web3, 
        accounts, 
        tokenAlyContract: instanceTokenAly,
        tokenDaiContract: instanceTokenDai,
        swapAlyContract: instanceSwapAly,
        tokenAlyContractAddress: deployedNetwork2.address,
        tokenDaiContractAddress: deployedNetwork3.address,

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
    this.setState({ serverStatus: "disconnected" });
    this.callApi()
      .then(res => this.setState({ serverStatus: res.express }))
      .catch(err => console.log(err));

    //SET SWAP CONTRACT OWNER ADDRESS TO STATE
    this.getSwapContractOwner()
      .then(res => this.setState({ swapAlyOwner: res.express }))
      .catch(err => console.log(err));

    //DISPLAY DATA
    this.displayOrderBook();
    this.displayTradeHistory();
    this.getUserBalance();

    //LISTEN TO CONTRACTS EVENTS
    this.state.tokenAlyContract.events.Approval({ fromBlock: 0, toBlock: 'latest' },
    async (error, event) => {
      console.log("event ALY contract: ", event);
    })

    this.state.tokenDaiContract.events.Approval({ fromBlock: 0, toBlock: 'latest' },
    async (error, event) => {
      console.log("event DAI contract: ", event);
    })

    this.state.swapAlyContract.events.TokenExchanged({ fromBlock: 0, toBlock: 'latest'},
    async (error, event) => {
      console.log("event Swap Contract: ", event);
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
      this.setState({ bestSellerPrice: _orderBookAsks[0].price });
    }

    if (_orderBookBids[0]){
      this.setState({ bestBuyerPrice: _orderBookBids[0].buyer });
    }
  }


  //GET TRADE HISTORY AND GRAPH
  displayTradeHistory = async () => {
    let { tradeHistory, tradeGraph } = this.state;

    ////FETCH AND SAVE TRADES
    const tradeHistoryResponse = await fetch('/api/tradeHistory');
    const tradeHistoryEntire = await tradeHistoryResponse.json();
    if (tradeHistoryResponse.status !== 200) throw Error(tradeHistoryEntire.message);

    //TRADE HISTORY
    //SAVE TRADE HISTORY IN ARRAY
    tradeHistory = tradeHistoryEntire['tradeHistory']['trades'];

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

    //INSERT TRANSACTIONS INTO TRADE GRAPH
    if (tradeHistoryEntire['tradeHistory']['trades'].length > 0){
      for (let i=0; i<tradeHistoryEntire['tradeHistory']['trades'].length; i++){
        tradeGraph.unshift([ tradeHistoryEntire['tradeHistory']['trades'][i].epoch,tradeHistoryEntire['tradeHistory']['trades'][i].price ]);
      }
    }


    console.log('1 Graph: ', tradeGraph)
    this.setState({ tradeGraph: tradeGraph });

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
    const { accounts, swapAlyOwner, tokenDaiContract, tokenDaiContractAddress } = this.state;

    //CHECK IF USER HAVE SUFFICIENT BALANCE
    let buyerBalance = await tokenDaiContract.methods.balanceOf(accounts[0]).call();
    if ( buyerBalance/100 >= (_volume*_price) ) {

      //RETRIEVE DATA FROM STATE AND PREPARE ORDER
      this.state.pushedOrder = {'type': 'bid', 'price': _price, 'volume': _volume, 'total': _price * _volume, 'buyer': accounts[0], 'tokenContractAddress': tokenDaiContractAddress};
      
      let volumeToApprove = _volume * _price;

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
      await this.checkOrders()

    } else alert("Unsifficient balance")
  }

  //SEND SELL ORDER TO SERVER
  sellOrder = async (_volume, _price) => {
    const { accounts, swapAlyOwner, tokenAlyContract, tokenAlyContractAddress } = this.state;

    //CHECK IF USER HAVE SUFFICIENT BALANCE
    let sellerBalance = await tokenAlyContract.methods.balanceOf(accounts[0]).call();
    if (sellerBalance/100 >= _volume) {

      //RETRIEVE DATA FROM STATE AND PREPARE ORDER
      this.state.pushedOrder = {'type': 'ask', 'price': _price, 'volume': _volume, 'total': _price * _volume, 'seller': accounts[0], 'tokenContractAddress': tokenAlyContractAddress};

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
      await this.checkOrders();
    
    } else  alert("Unsifficient balance")
  }





  //5.FUNCTIONS FOR HTML RENDERING
  
  //GET USER'S TOKEN BALANCES
  getUserBalance = async () => {
    const { accounts, tokenAlyContract, tokenDaiContract } = this.state;

    //RETRIEVE USER ALY AND DAI BALANCES
    let TempALYBalance = await tokenAlyContract.methods.balanceOf(accounts[0]).call();
    let TempDAIBalance = await tokenDaiContract.methods.balanceOf(accounts[0]).call();
    console.log("ALYBalance: ",TempALYBalance/100)
    console.log("DAIBalance: ",TempDAIBalance/100)
    this.setState({
      ALYBalance: (TempALYBalance/100).toFixed(2),
      DAIBalance: (TempDAIBalance/100).toFixed(2)
    })
  }

  updateUserBalance = async () => {
    const { accounts, tokenAlyContract, tokenDaiContract } = this.state;

    //RETRIEVE USER ALY AND DAI BALANCES
    setTimeout( async () => {
      let TempALYBalance = await tokenAlyContract.methods.balanceOf(accounts[0]).call();
      let TempDAIBalance = await tokenDaiContract.methods.balanceOf(accounts[0]).call();
      console.log("ALYBalance: ",TempALYBalance/100)
      console.log("DAIBalance: ",TempDAIBalance/100)
      this.setState({
        ALYBalance: (TempALYBalance/100).toFixed(2),
        DAIBalance: (TempDAIBalance/100).toFixed(2)
      })
    }, 10000)
  }

  //AUTOCOMPLETE BUY TOKEN FORM
  fixRounding = (value, precision) => {
      var power = Math.pow(10, precision || 0);
      return Math.round(value * power) / power;
  }

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
      this.setState({ buyInputTotal: this.fixRounding(buyTotal) });
    }
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
      this.setState({ sellInputTotal: this.fixRounding(sellTotal) });
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
        <Header serverStatus={ this.state.serverStatus } />    


        {/*NAVBAR*/}
        <div className="navbar">
          <TokenSelector />

          <UserBalance 
            ALYBalance = { this.state.ALYBalance }
            DAIBalance = { this.state.DAIBalance }
          />
        </div>

        {/*MAIN SECTION*/}
        <div className="Main">


          {/*MAIN LEFT PART*/}
          <div className="MainLeft">
            <TradeHistory />            
          </div>


          {/*MAIN CENTER PART*/}
          <div className="MainCenter">

            {/*TOKEN PRICE GRAPH (EMPTY FOR THE MOMENT)*/}
            <Graph tradeGraph={ this.state.tradeGraph } />

            {/*BUY AND SELL FORMS*/}
            <div className="buySellToken">
              
              {/*BUY FORM*/}
              <div className="buyToken">
                <div className="buyTokenTitle">Buy</div>
                <form onSubmit={ async (event) => {
                    event.preventDefault()
                    const buyVolume = this.volumeBuy.value
                    const buyPrice = this.priceBuy.value
                    await this.buyOrder(buyVolume, buyPrice)
                    setTimeout( () => {
                      this.displayOrderBook()
                      this.displayTradeHistory()
                      this.updateUserBalance()
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

              {/*SELL FORM*/}
              <div className="buyToken">
                <div className="buyTokenTitle">Sell</div>
                <form onSubmit={ async (event) => {
                    event.preventDefault()
                    const sellVolume = this.volumeSell.value
                    const sellPrice = this.priceSell.value
                    await this.sellOrder(sellVolume, sellPrice)
                    setTimeout( () => {
                      this.displayOrderBook()
                      this.displayTradeHistory()
                      this.updateUserBalance()
                    }, 1000);
                  } }>
                  <div className="fields">
                    <div className="buyFields">
                      <label>Price:</label>
                      <div>
                        <input 
                          className="inputFields"
                          type="text"
                          id="priceSell"
                          placeholder={ this.state.bestSellerPrice.toFixed(2) }
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
            </div>
            
            <UserOrders />
          </div>


          {/*MAIN RIGHT PART*/}
          <div className="MainRight">
            <Orderbook bestSellerPrice={ this.state.bestSellerPrice } />
          </div>

        </div>
      </div>
    );
  }
}

export default App;


