import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import TokenAlyContract from "./contracts/TokenAly.json";
import SwapAlyContract from "./contracts/SwapAly.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { 
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    tokenAlyContract: null,
    tokenAlyAmount: 0,
    tokenAlyOwner: null,
    ownerBalance: 0,
    swapAlyContract: null,
    swapAlyOwner: null,
    swapAlyConstructor: null,
    allowance: 0
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const deployedNetwork2 = TokenAlyContract.networks[networkId];
      const deployedNetwork3 = SwapAlyContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const instanceTokenAly = new web3.eth.Contract(
        TokenAlyContract.abi,
        deployedNetwork2 && deployedNetwork2.address,
      );
      const instanceSwapAly = new web3.eth.Contract(
        SwapAlyContract.abi,
        deployedNetwork3 && deployedNetwork3.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ 
        web3, 
        accounts, 
        contract: instance, 
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
    const { accounts, contract, tokenAlyContract, swapAlyContract, swapAlyConstructor } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();
    const response2 = await tokenAlyContract.methods.totalSupply().call();
    const response3 = await tokenAlyContract.methods.getOwner().call();
    const response4 = await tokenAlyContract.methods.balanceOf(accounts[0]).call();
    const response5 = await swapAlyContract.methods.getOwner().call();
    const response6 = await swapAlyContract.methods.getTokenAlyAddress().call();

    // Update state with the result.
    this.setState({ 
      storageValue: response,
      tokenAlyAmount: response2, 
      tokenAlyOwner: response3, 
      ownerBalance: response4,
      swapAlyOwner: response5,
      swapAlyConstructor: response6
    });
    console.log(this.state.accounts);
  };

  approve = async () => {
    console.log("approve function started");
    const buyer = '0x9b1072e802cA3E8e54F9D867E6767fE557334eB8';
    const amount = 128;
    const { accounts, tokenAlyContract, allowance } = this.state;

    await tokenAlyContract.methods.approve(buyer, amount).send({from: accounts[0]});

    const allowanceResponse = await tokenAlyContract.methods.allowances(accounts[0], buyer).call();
    this.setState({allowance: allowanceResponse});
    console.log("approve function ended", this.state.allowance);
  }

  async buyAly() {
    console.log("buyAly function started");
    const buyer = '0x9b1072e802cA3E8e54F9D867E6767fE557334eB8';
    //const amount = 1;
    const { accounts, tokenAlyContract } = this.state;
    await tokenAlyContract.methods.transfer(buyer, 128).send({from: accounts[0]});
    console.log("buyAly function ended");

    // const { web3, contrat } = this.state
    // const myContract = new web3.eth.Contract(Defi2.abi, contrat)
    // const contenuHasher = await myContract.methods.produireHash(contenu).call()
    // this.setState({contenuHasher});
    // this.setState({contenuStyle: {width: '90%', display: 'block'}});
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <div>The amount of ALY tokens is: {this.state.tokenAlyAmount}</div>
        <div>The ALY contract owner is: {this.state.tokenAlyOwner}</div>
        <div>The owner balance of ALY is: {this.state.ownerBalance}</div>
        <div>The swapAly contract owner is: {this.state.swapAlyOwner}</div>  
        <div>The swapAly parsed contract is: {this.state.swapAlyConstructor}</div>
        <div className="conteneur">
          <h3>Approve</h3>
          <form onSubmit={(event) => {
              event.preventDefault()
              this.approve()
            }}>
            <div className="champs">
              <div className="formulaireItems">
                <textarea id="toApprove"  readOnly></textarea>
              </div>
            </div>
            <button type="submit" >Approve</button>
          </form>
        </div>
        <div className="conteneur">
          <h3>Buy ALY tokens</h3>
          <form onSubmit={(event) => {
              event.preventDefault()
              this.buyAly()
            }}>
            <div className="champs">
              <div className="formulaireItems">
                <textarea id="contenuHasher"  readOnly></textarea>
              </div>
            </div>
            <button type="submit" >Buy</button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
