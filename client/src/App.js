import React, { Component } from "react";
import TokenAlyContract from "./contracts/TokenAly.json";
import SwapAlyContract from "./contracts/SwapAly.json";
import TokenERC20AlyContract from "./contracts/TokenERC20Aly.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import logoAly from "./logoAly.jpg";

class App extends Component {
  state = { 
    web3: null,
    accounts: null,
    tokenAlyContract: null,
    tokenAlyAmount: 0,
    tokenAlyOwner: null,
    ownerBalance: 0,
    swapAlyContract: null,
    swapAlyOwner: null,
    swapAlyConstructor: null,
    allowance: 0,
    priceEthAly: 128,
    buyAmount: 0,
    tokenERC20AlyContract: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork2 = TokenAlyContract.networks[networkId];
      const deployedNetwork3 = SwapAlyContract.networks[networkId];
      const instanceTokenAly = new web3.eth.Contract(
        TokenAlyContract.abi,
        deployedNetwork2 && deployedNetwork2.address,
      );
      const instanceSwapAly = new web3.eth.Contract(
        SwapAlyContract.abi,
        deployedNetwork3 && deployedNetwork3.address,
      );

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

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ 
        web3, 
        accounts, 
        tokenAlyContract: instanceTokenAly,
        swapAlyContract: instanceSwapAly
      }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, tokenAlyContract, swapAlyContract, swapAlyConstructor } = this.state;

    // Get the value from the contract to prove it worked.
    const response2 = await tokenAlyContract.methods.totalSupply().call();
    const response3 = await tokenAlyContract.methods.getOwner().call();
    const response4 = await tokenAlyContract.methods.balanceOf(accounts[0]).call();
    const response5 = await swapAlyContract.methods.getOwner().call();
    const response6 = await swapAlyContract.methods.getTokenAlyAddress().call();

    // Update state with the result.
    this.setState({ 
      tokenAlyAmount: response2, 
      tokenAlyOwner: response3, 
      ownerBalance: response4,
      swapAlyOwner: response5,
      swapAlyConstructor: response6
    });
  };

  retrievePrice = async () => {
    console.log("retrieve price function started");
    this.setState({priceEthAly: 130});
    console.log("retrieve price function ended");
  }

  approve = async () => {
    console.log("approve function started");
    const { accounts, tokenAlyOwner, tokenAlyContract, allowance, priceEthAly } = this.state;
    const buyer = '0x9b1072e802cA3E8e54F9D867E6767fE557334eB8';
    const amount = 1 * priceEthAly;
    console.log("tokenAly owner: ", tokenAlyOwner);
    await tokenAlyContract.methods.approve(buyer, amount).send({from: tokenAlyOwner});

    // const allowanceResponse = await tokenAlyContract.methods.allowances(tokenAlyOwner, buyer).call();
    // this.setState({allowance: allowanceResponse});
    console.log("approve function ended", this.state.allowance);
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

  createAlyTokens = async() => {
    console.log("create Aly Tokens started");
    const { web3, accounts } = this.state;
    // let tokenERC20AlyContract = web3.eth.contract(TokenERC20AlyContract.abi);
    // let contractERC20 = tokenERC20AlyContract.new({from: accounts[0]});
    // console.log("Aly Tokens function ended");
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
        <div>The owner balance of ALY is: {this.state.ownerBalance}</div>
        <div>The swapAly contract owner is: {this.state.swapAlyOwner}</div>  
        <div>The swapAly parsed contract is: {this.state.swapAlyConstructor}</div>
        <div>The ETH price in ALY is: {this.state.priceEthAly}</div>  
        <div>The current allowance is set to: {this.state.allowance}</div>  
        <div className="conteneur">
          <h3>Retrieve price</h3>
            <button type="button" onClick={(event) => {
              this.createAlyTokens()
            }}>Create ALY tokens</button>
          <h3>Retrieve price</h3>
            <button type="button" onClick={(event) => {
              this.retrievePrice()
            }}>Retrieve price</button>
          <h3>Approve</h3>
            <form onSubmit={(event) => {
                event.preventDefault()
                this.approve()
              }}>
              <div className="champs">
                <div className="formulaireItems">
                  <textarea id="toApprove" readOnly></textarea>
                </div>
              </div>
              <button type="submit">Approve</button>
            </form>
        </div>
        <div className="conteneur">
          <h3>Buy ALY tokens</h3>
            <form onSubmit={(event) => {
                event.preventDefault()
                const amountToBuy = this.quantity.value
                this.buyAly(amountToBuy)
              }}>
              <div className="champs">
                <div className="formulaireItems">Amount to buy: 
                  <input id="quantity" type="text" ref={(input) => { this.quantity = input }} required/>
                </div>
              </div>
              <button type="submit">Buy</button>
            </form>
        </div>
      </div>
    );
  }
}

export default App;


