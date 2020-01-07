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
	    	orderBook.DAIALY.bids.push({price: parseFloat(req.body.post.price), volume: parseFloat(req.body.post.volume), total: parseFloat(req.body.post.total), buyer: req.body.post.buyer});
	    } else if (req.body.post.type === "ask") {
	    	orderBook.DAIALY.asks.push({price: parseFloat(req.body.post.price), volume: parseFloat(req.body.post.volume), total: parseFloat(req.body.post.total), seller: req.body.post.seller});
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

app.listen(port, () => console.log(`Listening on port ${port}`));