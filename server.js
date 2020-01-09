//IMPORT LIBRARIES
const Web3 = require("web3");
const SwapAlyJSON = require("./client/src/contracts/SwapAly.json");
const TokenAlyJSON = require("./client/src/contracts/TokenERC20Aly.json");
const TokenDaiJSON = require("./client/src/contracts/TokenERC20Dai.json");


//DEPLOY SWAP CONTRACT
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));

let accounts = '';
let serverAddress = '';
let swapContractAddress = '';

let SwapAlyContract = new web3.eth.Contract(SwapAlyJSON.abi);

const getAccount = async () => {
	accounts = await web3.eth.getAccounts()
	serverAddress = accounts[0]
}

const deploySwapContract = async () => {
	await getAccount()
	SwapAlyContract.deploy({
		data: SwapAlyJSON.bytecode
	})
	.send({
	    from: serverAddress,
	    gas: 1500000,
	    gasPrice: '30000000000000'
	})
	.then(function(newContractInstance){
	    swapContractAddress = newContractInstance.options.address;
	    SwapAlyContract.options.address = swapContractAddress;
			//listen to events
			// let events = SwapAlyContract.events.TokenExchanged({fromBlock: 0, toBlock: 'latest'},
			// (error, event) => { console.log("event: ",event);});
			console.log("Server address: ", serverAddress)
			console.log("Swap contract deployed at: ", swapContractAddress)
			console.log("Accounts: ", accounts)
	})
}

deploySwapContract();





let tokenALYContract = new web3.eth.Contract(TokenAlyJSON.abi, '0x38966853e9a429cc23632e18688cA5c6b86255D4');
let tokenDAIContract = new web3.eth.Contract(TokenDaiJSON.abi, '0x5985Db3C6294D1716d8b6eF8c45B659B68b5dc8a');


//SERVER FUNCTIONS, ANSWER CALLS FROM CLIENTS
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Just a test
app.get('/api/hello', (req, res) => {
  res.send({ express: 'connected' });
});

//Send swap contract's owner
app.get('/api/swapContractOwner', (req, res) => {
  res.send({ express: serverAddress });
});

//Send swap contract's address
app.get('/api/swapContractAddress', (req, res) => {
  res.send({ express: swapContractAddress });
});

//Send order book to be displayed in client
app.get('/api/tradeHistory', (req, res) => {
	let tradeHistory = '';
  fs.readFile('./databases/trades.json', 'utf8', function readFileCallback(err, data){
  	if (err){
      console.log(err);
    } else {
	    tradeHistory = JSON.parse(data);
	  }
  	res.json({ tradeHistory });
  });
});

//Send order book to be displayed in client
app.get('/api/orderBook', (req, res) => {
	let orderBook = '';
  fs.readFile('./databases/orderBook.json', 'utf8', function readFileCallback(err, data){
  	if (err){
      console.log(err);
    } else {
	    orderBook = JSON.parse(data);
	  }
  	res.json({ orderBook });
  });
});

//Insert new order inside orderBook (ask and bid)
app.post('/api/insert', (req, res) => {
  console.log(req.body);

  fs.readFile('./databases/orderBook.json', 'utf8', function readFileCallback(err, data){
    if (err){
      console.log(err);
    } else {
	    let orderBook = JSON.parse(data);

	    if (req.body.post.type === "bid") {
	    	orderBook.DAIALY.bids.push({price: parseFloat(req.body.post.price), volume: parseFloat(req.body.post.volume), total: parseFloat(req.body.post.total), buyer: req.body.post.buyer, tokenContractAddress: req.body.post.tokenContractAddress});
	    } else if (req.body.post.type === "ask") {
	    	orderBook.DAIALY.asks.push({price: parseFloat(req.body.post.price), volume: parseFloat(req.body.post.volume), total: parseFloat(req.body.post.total), seller: req.body.post.seller, tokenContractAddress: req.body.post.tokenContractAddress}); 	
	    }

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

	    orderBook.DAIALY.bids.sort(sortDecrease);
	    orderBook.DAIALY.asks.sort(sortIncrease);

	    json = JSON.stringify(orderBook, null, 2);
	    fs.writeFile('./databases/orderBook.json', json, 'utf8', (err) => {
			  if (err) {
			  	console.log(err);
			  } else {
			  	console.log('The file has been saved!');
			  }
			});
		}
	});

  let parsedRes = JSON.stringify(req.body.post);
  res.send(
    `I received your POST request. This is what you sent me: ${parsedRes}`,
  );
});

//Check order function: parse orderbook for matching, if yes, perform the swap
checkOrders = async () => {
	console.log("CheckOrders function started");
	let owner3 = await tokenALYContract.methods.getOwner().call();
	console.log("ALY owner", owner3);
	let allowance1 = await tokenALYContract.methods.allowance(owner3, serverAddress).call();
	console.log("ALY allowance", allowance1);
	let owner4 = await tokenDAIContract.methods.getOwner().call();
	console.log("DAI owner", owner4);
	let allowance2 = await tokenDAIContract.methods.allowance(owner4, serverAddress).call();
	console.log("DAI allowance", allowance2);

	fs.readFile('./databases/orderBook.json', 'utf8', async function readFileCallback(err, data){
    if (err){
      console.log(err);
    } else {
		  let orderBook = JSON.parse(data);
    	if (orderBook.DAIALY.asks[0] && orderBook.DAIALY.bids[0]) {
	    	//Retrieve orders parameters
		    let seller = orderBook.DAIALY.asks[orderBook.DAIALY.asks.length-1].seller;
		    let sellerTokenAddress = orderBook.DAIALY.asks[orderBook.DAIALY.asks.length-1].tokenContractAddress;	
		    let sellerPrice = orderBook.DAIALY.asks[orderBook.DAIALY.asks.length-1].price;
		    let sellerVolume = orderBook.DAIALY.asks[orderBook.DAIALY.asks.length-1].volume;
		    
		    let buyer = orderBook.DAIALY.bids[0].buyer;
		    let buyerTokenAddress = orderBook.DAIALY.bids[0].tokenContractAddress;
		    let buyerPrice = orderBook.DAIALY.bids[0].price;
		    let buyerVolume = orderBook.DAIALY.bids[0].volume;

		    if (sellerPrice <= buyerPrice) {
			    //Define transaction parameters
			    let transactionVolume = 0;
			    if (sellerVolume >= buyerVolume) {
			    	transactionVolume = buyerVolume;
			    } else {
			    	transactionVolume = sellerVolume;
			    }

			    let transactionCost = transactionVolume * sellerPrice;

			    //Send swap transaction
			    console.log(
			    	"Trying swap transaction: seller:", seller,
			    	" seller token: ", sellerTokenAddress,
			    	" volume sold: ", transactionVolume,
			    	" buyer: ", buyer,
			    	" buyer token: ", buyerTokenAddress,
			    	" cost ", transactionCost
			    )
					await SwapAlyContract.methods.swapToken(seller, sellerTokenAddress, transactionVolume, buyer, buyerTokenAddress, transactionCost)
					.send({from: serverAddress, gas:3000000})
					.then(function(){
						console.log("Swap transaction success");

						//Update order parameters (eventually remove order if volume = 0)
						orderBook.DAIALY.asks[orderBook.DAIALY.asks.length-1].volume -= transactionVolume;
						orderBook.DAIALY.asks[orderBook.DAIALY.asks.length-1].total = orderBook.DAIALY.asks[orderBook.DAIALY.asks.length-1].volume * orderBook.DAIALY.asks[orderBook.DAIALY.asks.length-1].price;
						if (orderBook.DAIALY.asks[orderBook.DAIALY.asks.length-1].volume == 0) {
							orderBook.DAIALY.asks.splice(orderBook.DAIALY.asks.length-1, 1);
						}
						orderBook.DAIALY.bids[0].volume -= transactionVolume;
						orderBook.DAIALY.bids[0].total = orderBook.DAIALY.bids[0].volume * orderBook.DAIALY.bids[0].price;
						if (orderBook.DAIALY.bids[0].volume == 0) {
							orderBook.DAIALY.bids.splice(0, 1);
						}
						
						//Save in orderbook
						json = JSON.stringify(orderBook, null, 2);
				    fs.writeFile('./databases/orderBook.json', json, 'utf8', (err) => {
						  if (err) {
						  	console.log(err);
						  } else {
						  	console.log('Orderbook updated');
						  }
						});

						//Update trade history database
							//Read file
						fs.readFile('./databases/trades.json', 'utf8', async function readFileCallback(err, data){
					    if (err){
					      console.log(err);
					    } else {
							  let tradeFile = JSON.parse(data);

							  //Set timestamp of the transaction...
								let today = new Date();
								let dd = String(today.getDate()).padStart(2, '0');
								let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
								let yyyy = today.getFullYear();
								let time = today.getHours() + ":" + today.getMinutes() + ":" + ("0" + today.getSeconds()).slice(-2);
								today =  dd + '/' + mm + '/' + yyyy;
								nowStamp = today + ' ' + time;

								//Update hitsory
								tradeFile.trades.unshift({
									price: parseFloat(sellerPrice),
									volume: parseFloat(transactionVolume),
									timestamp: nowStamp
								})

								//Save file
								json = JSON.stringify(tradeFile, null, 2);
						    fs.writeFile('./databases/trades.json', json, 'utf8', (err) => {
								  if (err) {
								  	console.log(err);
								  } else {
								  	console.log('Trade history updated');
								  }
								});
							}
						})	
					})
					.catch(error => {
						console.log('checkOrders error', error);
					})
					return;
		    } else {
		    	console.log("No matching orders")
		    	return;
		    }
	    }
		}
	})
}

//TRY SWAP
app.get('/api/swap',async (req, res) => {
	await checkOrders()
	.then(() => {
		res.send({ express: 'checkOrdersFinished' });
	})
	.catch(error => {
		console.log('checkOrders error', error);
	})
	return;
});

//SAVE EVENT INTO log.json FILE
app.post('/api/log',async (req, res) => {
	console.log(req.body)
	fs.readFile('./databases/log.json', 'utf8', async function readFileCallback(err, data){
    if (err){
      console.log(err);
    } else {
		  let log = JSON.parse(data);
		  console.log(log)
		  log.logs.push({event: req.body.post.event, values: req.body.post.returnValues})
			logJson = JSON.stringify(log, null, 2);
		  fs.writeFile('./databases/log.json', logJson, 'utf8', (err) => {
			  if (err) {
			  	console.log(err);
			  } else {
			  	console.log('Log file updated');
			  }
			})
		}
	})
	// .then(() => {
	// 	res.send({ express: 'Event log saved' })
	// })
	// .catch(error => {
	// 	console.log('Event log error', error);
	// })
	return;
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// function swapToken(
// 	address sellerAddress,
// 	address sellerTokenAddress,
// 	uint256 amountSeller,
// 	address buyerAddress,
// 	address buyerTokenAddress,
// 	uint256 amountBuyer
// )