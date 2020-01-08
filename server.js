const Web3 = require("web3");
const SwapAlyJSON = require("./client/src/contracts/SwapAly.json");
const TokenAlyJSON = require("./client/src/contracts/TokenERC20Aly.json");
const TokenDaiJSON = require("./client/src/contracts/TokenERC20Dai.json");


//Deploy swap contract
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));
const testServerAddress = "0xCD3F68265720450519c4A62289a4eC2141FcA26D";
let swapContractAddress = '';

let SwapAlyContractModel = new web3.eth.Contract(SwapAlyJSON.abi);

SwapAlyContractModel.deploy({
	data: SwapAlyJSON.bytecode
})
.send({
    from: testServerAddress,
    gas: 1500000,
    gasPrice: '30000000000000'
})
.then(function(newContractInstance){
    console.log(newContractInstance.options.address) // instance with the new contract address
    swapContractAddress = newContractInstance.options.address;
    SwapAlyContractModel.options.address = swapContractAddress;
});

let tokenALYContract = new web3.eth.Contract(TokenAlyJSON.abi, '0x38966853e9a429cc23632e18688cA5c6b86255D4');
let tokenDAIContract = new web3.eth.Contract(TokenDaiJSON.abi, '0x5985Db3C6294D1716d8b6eF8c45B659B68b5dc8a');

//Server functions
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
  res.send({ express: testServerAddress });
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
app.post('/api/world', (req, res) => {
  console.log(req.body);
	console.log(req.body.post.price);

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
	// console.log("serverAddress: ", testServerAddress)
	// let owner1 = await SwapAlyContractModel.methods.getOwner().call({from: testServerAddress});
	// console.log("owner1: ", owner1);
	// let owner2 = await SwapAlyContractModel.methods.getOwner().call({from: '0x9b1072e802cA3E8e54F9D867E6767fE557334eB8'});
	// console.log("owner2: ", owner2);
	let owner3 = await tokenALYContract.methods.getOwner().call();
	console.log("ALY owner", owner3);
	let allowance1 = await tokenALYContract.methods.allowance('0x9b1072e802cA3E8e54F9D867E6767fE557334eB8', testServerAddress).call();
	console.log("allowance1", allowance1);
	let owner4 = await tokenDAIContract.methods.getOwner().call();
	console.log("DAI owner", owner4);
	let allowance2 = await tokenDAIContract.methods.allowance('0x18eaca6735c3D935cdEA3f7794b6C8B4B9654e0D', testServerAddress).call();
	console.log("allowance2", allowance2);

	fs.readFile('./databases/orderBook.json', 'utf8', async function readFileCallback(err, data){
    if (err){
      console.log(err);
    } else {
		  let orderBook = JSON.parse(data);
    	if (orderBook.DAIALY.asks[0] && orderBook.DAIALY.bids[0]) {
		    let seller = orderBook.DAIALY.asks[orderBook.DAIALY.asks.length-1].seller;
		    let sellerTokenAddress = orderBook.DAIALY.asks[orderBook.DAIALY.asks.length-1].tokenContractAddress;	
		    let sellerPrice = orderBook.DAIALY.asks[orderBook.DAIALY.asks.length-1].price;
		    let sellerVolume = 1;
		    
		    let buyer = orderBook.DAIALY.bids[0].buyer;
		    let buyerTokenAddress = orderBook.DAIALY.bids[0].tokenContractAddress;
		    let buyerPrice = orderBook.DAIALY.bids[0].price;
		    let buyerVolume = 1;

		    if (sellerPrice == buyerPrice) {
					await SwapAlyContractModel.methods.swapToken(seller, sellerTokenAddress, sellerVolume, buyer, buyerTokenAddress, buyerVolume)
					.send({from: testServerAddress, gas:3000000})
					.then(function(){
						console.log("swap done");

						//Update orderBook
						orderBook.DAIALY.asks[orderBook.DAIALY.asks.length-1].volume -= sellerVolume;
						orderBook.DAIALY.bids[0].volume -= buyerVolume;
						
						json = JSON.stringify(orderBook, null, 2);
				    fs.writeFile('./databases/orderBook.json', json, 'utf8', (err) => {
						  if (err) {
						  	console.log(err);
						  } else {
						  	orderbookUpdated
						  	console.log('Orderbook updated');
						  }
						});
					});
		    }
	    }
		}
	})
}

app.get('/api/swap', (req, res) => {
	checkOrders();
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
