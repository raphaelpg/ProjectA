//CRYPTOGAMA REACT CLIENT: 

//1.IMPORTS
//2.DAPP SET UP
//3.RENDER  



//1.IMPORTS:

//IMPORT
import React, { Component } from 'react';
import getWeb3 from './getWeb3';

//IMPORT ERC20 TOKEN CONTRACTS
import TokenERC20AlyContract from './contracts/TokenERC20Aly.json';
import TokenERC20DaiContract from './contracts/TokenERC20Dai.json';
import SwapAlyContract from './contracts/SwapAly.json';

//IMPORT COMPONENTS
import Header from './components/Header';
import TokenSelector from './components/TokenSelector';
import UserBalance from './components/UserBalance';
import TradeHistory from './components/TradeHistory';
import Graph from './components/Graph';
import Orderbook from './components/Orderbook';
import BuyForm from './components/BuyForm';
import SellForm from './components/SellForm';

//IMPORT FUNCTIONS
import * as utils from './utils/serverInteractionsFunctions';
import { displayOrderBook, displayTradeHistory, getTradeGraphData, updateTradeGraphData, getUserBalance } from './utils/serverInteractionsFunctions';

//IMPORT CSS AND TOKENS LOGOS
import './App.css';


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
    this.displayOrderBook = displayOrderBook.bind(this);
    this.displayTradeHistory = displayTradeHistory.bind(this);
    this.getTradeGraphData = getTradeGraphData.bind(this);
    this.updateTradeGraphData = updateTradeGraphData.bind(this);
    this.getUserBalance = getUserBalance.bind(this);
    this.getTradeGraphData();
  }

  //DAPP CONFIGURATION
  componentDidMount = async () => {
    try {
      //SET SWAP CONTRACT ADDRESS TO STATE
      utils.getSwapContractAddress()
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

    //RUN FILL ORDERBOOK SCRIPT (TBD)
    //this.runOrderBookFillingScript();

    //SET SERVER STATUS TO STATE
    this.setState({ serverStatus: "disconnected" });
    utils.callApi()
      .then(res => this.setState({ serverStatus: res.express }))
      .catch(err => console.log(err));

    //SET SWAP CONTRACT OWNER ADDRESS TO STATE
    utils.getSwapContractOwner()
      .then(res => this.setState({ swapAlyOwner: res.express }))
      .catch(err => console.log(err));

    //DISPLAY DATA
    this.displayOrderBook();
    this.displayTradeHistory();
    this.getUserBalance();


    //LISTEN TO CONTRACTS EVENTS:

    //ALY ERC-20 APPROVE EVENT
    this.state.tokenAlyContract.events.Approval({ fromBlock: 'latest', toBlock: 'latest' },
    async (error, event) => {
      console.log("Approve ALY: ",event)
      this.displayOrderBook()
    })

    //DAI ERC-20 APPROVE EVENT
    this.state.tokenDaiContract.events.Approval({ fromBlock: 'latest', toBlock: 'latest' },
    async (error, event) => {
      console.log("Approve DAI: ",event)
      this.displayOrderBook()
    })

    //SWAP CONTRACT EVENT, TRIGGER UPDATE USER BALANCE, UPDATE ORDERBOOK, UPDATE TRADE HISTORY
    this.state.swapAlyContract.events.TokenExchanged({ fromBlock: 'latest', toBlock: 'latest'},
    async (error, event) => {
      this.getUserBalance()
      this.displayOrderBook()
      this.displayTradeHistory()
      this.updateTradeGraphData() 
    })
  }


  //3.RENDER

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Header serverStatus={ this.state.serverStatus } />  
        <div className="navbar">
          <TokenSelector />
          <UserBalance 
            ALYBalance = { this.state.ALYBalance }
            DAIBalance = { this.state.DAIBalance }
          />
        </div>
        <div className="Main">
          <div className="MainLeft">
            <TradeHistory />            
          </div>
          <div className="MainCenter">
            <Graph tradeGraph = { this.state.tradeGraph } />
            <div className="buySellToken">
              <BuyForm 
                bestSellerPrice = { this.state.bestSellerPrice }
                accounts = { this.state.accounts }
                swapAlyOwner = { this.state.swapAlyOwner }
                tokenDaiContract = { this.state.tokenDaiContract }
                tokenDaiContractAddress = { this.state.tokenDaiContractAddress }
              />
              <SellForm 
                bestSellerPrice = { this.state.bestSellerPrice }
                accounts = { this.state.accounts }
                swapAlyOwner = { this.state.swapAlyOwner }
                tokenAlyContract = { this.state.tokenAlyContract }
                tokenAlyContractAddress = { this.state.tokenAlyContractAddress }
              />
            </div>
          </div>
          <div className="MainRight">
            <Orderbook bestSellerPrice={ this.state.bestSellerPrice } />
          </div>
        </div>
      </div>
    );
  }
}

export default App;


