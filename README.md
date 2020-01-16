# Cryptogama

Cryptogama is a decentralized ERC-20 token exchange student project.  

For teaching purposes only, it runs on a local ethereum blockchain and allows you to place buy and sell orders between two tokens: the ALY and the DAI.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.  


### Prerequisites

To run this application you will need below programs installed on your machine:

Node v10.16.3  
Metamask v7.7.1  

This project has been developed and tested on a UNIX operating system.  
Compatibility with other OS not tested yet.


### Installing the app

The app can be installed within 5 steps:  

1.Download all the files  
Copy the git project repository using below command line in a new empty folder on your machine:  

```
git clone https://github.com/raphaelpg/ProjectA.git
```


2.Install server dependencies  
Inside the main app directory, install all dependencies by running below command line:  

```
npm install
```


3.Install client dependencies  
Go to the client app directory and again install dependencies by running below command line:  

```
cd client
npm install
```


4.Create Metamask network  
In your browser, open Metamask and select "Custom RPC" to set a new network.  
Name it as you want and copy below line in URL field:  

```
http://localhost:7545
```


5.Create Metamask accounts  
To test the app, three accounts are needed inside the 7545 network.  
In your browser, open Metamask and check how many accounts are set.  
Create three accounts if needed by clicking on the top right logo and clicking on "Create Account"  




### Starting the app

The application can be started with four steps:

1.Local blockchain  
Run a local blockchain using ganache-cli:

```
ganache-cli -p 7545 -i 5777 -m "[YOUR METAMASK MNEMONIC]"
```


2.Deploy contracts  
From another console, deploy the contracts on the blockchain with below command line.  
From the main application directory, run:

```
truffle migrate --network develop
```
Wait for the five transactions to be executed.



3.Start server  
Then, run Cryptogama server with below command with the same console:

```
node server.js
```
You should see the message "Swap contract deployed at: [address]" in the console.



4.Run client  
Then, run the application with below command:

```
cd client
npm run start
```
Wait untill the browser open and Metamask asks for login.



## Interact with the app

Once the app started, select the network 7545 in Metamask.

Three Metamask accounts are used:  
	Account #1: owner of the App  
	Account #2: the owner of ALY ERC-20 tokens  
	Account #3: the owner of DAI (ERC-20 tokens in this example)  

Important: after changing account in Metamask, refresh the browser for the change to be considered.  

Select the account#2 in Metamask and place a Sell order, setting the price and the volume of ALY you want to sell and clicking on the Sell button.  
The order should appear in the order book.

Select the account#3 in Metamask, refresh the browser, place a Buy order with the same price to exchange tokens with account#2.  
The exchange is automaticaly done when two orders have a matching price.

You can check each token's balance in the App and in Metamask.



## Running the tests


Run a local blockchain using ganache-cli:

```
ganache-cli -p 7545 -i 5777
```

From the test directory, run the tests with below command in another console :

```
truffle test --network develop
```

Three contracts are tested: two ERC-20 and the Swap contract.


## Deployment

Contracts are not deployed on the mainnet nor testnets (Ropsten, Kovan, Rinkeby, Goerli).  
Public addresses will be displayed later.


## Built With

* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - ECMAScript 2018 - v9  
* [React](https://reactjs.org/) - A JavaScript library for building user interfaces - v16.12.0  
* [web3js](https://web3js.readthedocs.io/en/v1.2.1/web3.html) - Used to interact with Ethereum blockchain and smart contracts - v1.2.1  
* [Solidity](https://solidity.readthedocs.io/en/v0.6.0/#) - For smart contracts development - v0.5.12  


## Versioning

The project is still in development.  
Current version is 0.1.1.  


## Authors

* **Raphael Pinto Gregorio** - https://github.com/raphaelpg/


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details