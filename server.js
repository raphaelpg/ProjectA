//CRYPTOGAMA SERVER
//A.DEPLOY SWAP CONTRACT
//B.SERVER FUNCTIONS



//A.DEPLOY SWAP CONTRACT

//IMPORT LIBRARIES
const Web3 = require("web3");
const SwapALYJSON = require("./client/src/contracts/SwapAly.json");
const TokenALYJSON = require("./client/src/contracts/TokenERC20Aly.json");
const TokenDAIJSON = require("./client/src/contracts/TokenERC20Dai.json");


//DEPLOY SWAP CONTRACT
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));

let accounts = '';
let serverAddress = '';
let swapContractAddress = '';

let SwapAlyContract = new web3.eth.Contract(SwapALYJSON.abi);

const getAccount = async () => {
	accounts = await web3.eth.getAccounts()
	serverAddress = accounts[0]
}

const deploySwapContract = async () => {
	await getAccount()
	SwapAlyContract.deploy({
		data: SwapALYJSON.bytecode
	})
	.send({
	    from: serverAddress,
	    gas: 1500000,
	    gasPrice: '30000000000000'
	})
	.then(function(newContractInstance){
	    swapContractAddress = newContractInstance.options.address;
	    SwapAlyContract.options.address = swapContractAddress;
			console.log("Server address: ", serverAddress)
			console.log("Swap contract deployed at: ", swapContractAddress)
	})
	.catch(error => {
		console.log('Deployment error', error);
	})
}

deploySwapContract();




//B.SERVER FUNCTIONS
	//1.IMPORT LIBRARIES
	//2.SEND DATA TO CLIENT
	//3.SAVE DATA RECEIVED FROM CLIENT TO DATABASE
	//4.SWAP FUNCTION
	//5.START SERVER



//1.IMPORT LIBRARIES
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//2.SEND DATA TO CLIENT

//INFORM SERVER STATUS
app.get('/api/hello', (req, res) => {
  res.send({ express: 'connected' });
});

//INFORM SWAP CONTRACT OWNER'S ADDRESS
app.get('/api/swapContractOwner', (req, res) => {
  res.send({ express: serverAddress });
});

//INFORM SWAP CONTRACT ADDRESS
app.get('/api/swapContractAddress', (req, res) => {
  res.send({ express: swapContractAddress });
});

//SEND TRADE HISTORY DATA
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

//SEND ORDERBOOK DATA
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



//3.SAVE DATA RECEIVED FROM CLIENT TO DATABASE

//INSERT NEW ORDER INSIDE ORDERBOOK
app.post('/api/insert', (req, res) => {

	//LOAD ORDERBOOK JSON FILE
  fs.readFile('./databases/orderBook.json', 'utf8', function readFileCallback(err, data){
    if (err){
      console.log(err);
    } else {
	    let orderBook = JSON.parse(data);

	    //PUSH RECEIVED ORDER
	    if (req.body.post.type === "bid") {
	    	orderBook.DAIALY.bids.push({price: parseFloat(req.body.post.price), volume: parseFloat(req.body.post.volume), total: parseFloat(req.body.post.total), buyer: req.body.post.buyer, tokenContractAddress: req.body.post.tokenContractAddress});
	    } else if (req.body.post.type === "ask") {
	    	orderBook.DAIALY.asks.push({price: parseFloat(req.body.post.price), volume: parseFloat(req.body.post.volume), total: parseFloat(req.body.post.total), seller: req.body.post.seller, tokenContractAddress: req.body.post.tokenContractAddress}); 	
	    }

	    //SORT ORDERBOOK
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

	    //SAVE ORDERBOOK INTO JSON FILE
	    json = JSON.stringify(orderBook, null, 2);
	    fs.writeFile('./databases/orderBook.json', json, 'utf8', (err) => {
			  if (err) {
			  	console.log(err);
			  } else {
			  	console.log('New order added');
			  }
			});
		}
	});

  //RESPOND TO CLIENT TO VALIDATE
  res.send(
    `Order received`,
  );
});



//4.SWAP FUNCTION

//BELOW FUNCTION PARSE THE ORDERBOOK, IF TWO ORDERS MATCH IT PERFORM THE SWAP
checkOrderbook = async () => {

	//LOAD ORDERBOOK JSON FILE
	fs.readFile('./databases/orderBook.json', 'utf8', async function readFileCallback(err, data){
    if (err){
      console.log(err);
    } else {
		  let orderBook = JSON.parse(data);

		  //IF ORDERBOOK NOT EMPTY
    	if (orderBook.DAIALY.asks[0] && orderBook.DAIALY.bids[0]) {

	    	//RETRIEVE LOWEST ASKS AND HIGHEST BID PARAMETERS
		    let seller = orderBook.DAIALY.asks[0].seller;
		    let sellerTokenAddress = orderBook.DAIALY.asks[0].tokenContractAddress;	
		    let sellerPrice = orderBook.DAIALY.asks[0].price;
		    let sellerVolume = orderBook.DAIALY.asks[0].volume;
		    
		    let buyer = orderBook.DAIALY.bids[0].buyer;
		    let buyerTokenAddress = orderBook.DAIALY.bids[0].tokenContractAddress;
		    let buyerPrice = orderBook.DAIALY.bids[0].price;
		    let buyerVolume = orderBook.DAIALY.bids[0].volume;

		    //CHECK IF THEY IS A MATCH BETWEEN TWO ORDERS:
		    if (sellerPrice <= buyerPrice) {

			    //IF YES, DEFINE THE SWAP TRANSACTION PARAMETERS
			    let swapVolume = 0;
			    if (sellerVolume >= buyerVolume) {
			    	swapVolume = buyerVolume;
			    } else {
			    	swapVolume = sellerVolume;
			    }

			    let swapCost = swapVolume * sellerPrice;

			    //TRY SWAP
			    console.log(
			    	"Trying swap transaction: seller:", seller,
			    	" seller token: ", sellerTokenAddress,
			    	" volume sold: ", swapVolume,
			    	" buyer: ", buyer,
			    	" buyer token: ", buyerTokenAddress,
			    	" cost ", swapCost
			    )
					await SwapAlyContract.methods.swapToken(seller, sellerTokenAddress, swapVolume*100, buyer, buyerTokenAddress, swapCost*100)
					.send({from: serverAddress, gas:3000000})
					.then(() => {
						console.log("Swap transaction success");

						//UPDATE EACH ORDER PARAMETERS (AND REMOVE ORDER IF VOLUME IS 0)
						orderBook.DAIALY.asks[0].volume -= swapVolume;
						orderBook.DAIALY.asks[0].total = orderBook.DAIALY.asks[0].volume * orderBook.DAIALY.asks[0].price;
						if (orderBook.DAIALY.asks[0].volume == 0) {
							orderBook.DAIALY.asks.splice(0, 1);
						}
						orderBook.DAIALY.bids[0].volume -= swapVolume;
						orderBook.DAIALY.bids[0].total = orderBook.DAIALY.bids[0].volume * orderBook.DAIALY.bids[0].price;
						if (orderBook.DAIALY.bids[0].volume == 0) {
							orderBook.DAIALY.bids.splice(0, 1);
						}
						
						//SAVE ORDERBOOK IN JSON FILE
						json = JSON.stringify(orderBook, null, 2);
				    fs.writeFile('./databases/orderBook.json', json, 'utf8', (err) => {
						  if (err) {
						  	console.log(err);
						  } else {
						  	console.log('Orderbook updated');
						  }
						});

						//UPDATE TRADE HISTORY JSON FILE
						
						//LOAD TRADES JSON FILE
						fs.readFile('./databases/trades.json', 'utf8', async function readFileCallback(err, data){
					    if (err){
					      console.log(err);
					    } else {
							  let tradeFile = JSON.parse(data);

							  //SET TRANSACTION TIMESTAMP
								let today = new Date();
								let dd = String(today.getDate()).padStart(2, '0');
								let mm = String(today.getMonth() + 1).padStart(2, '0');
								let yyyy = today.getFullYear();
								let time = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2);
								today =  dd + '/' + mm + '/' + yyyy;
								nowStamp = today + ' ' + time;

								//UPDATE TRADES ARRAY
								tradeFile.trades.unshift({
									price: parseFloat(sellerPrice),
									volume: parseFloat(swapVolume),
									timestamp: nowStamp
								})

								//SAVE JSON FILE
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
						console.log('checkOrderbook error', error);
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


//SWAP CALLING CHECKORDERBOOK FUNCTION
app.get('/api/swap',async (req, res) => {
	await checkOrderbook()
	.then(() => {
		res.send({ express: 'checkOrderbookFinished' })
	})
	.catch(error => {
		console.log('checkOrderbook error', error)
	})
});



//5.START SERVER
app.listen(port, () => console.log(`Listening on port ${port}`));