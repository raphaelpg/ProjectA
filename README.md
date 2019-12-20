# Cryptogama

Cryptogama is a DEX prototype, allowing fully decentralized Ethereum token swap exchanges.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.  


### Prerequisites

To run this application you will need below programs installed on your machine:

Node v10.16.3
Truffle v5.1.2
Ganache CLI v6.7.0 (ganache-core: 2.8.0)
Metamask v7.7.1

This project has been developed and tested on a UNIX operating system.  
Compatibility with other OS is not tested yet.


### Installing

A step by step series of examples that tell you how to get a development env running.  

Copy the project git repository using below command line:

```
git clone https://github.com/raphaelpg/ProjectA.git
```

Run a local blockchain using ganache-cli:

```
ganache-cli -p 7545 -i 5777
```

Deploy the contracts on the blockchain with below command line in another console.  
From the main application directory, run:

```
truffle migrate --network develop
```

From the client directory, run the application with below command:

```
npm run start
```


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