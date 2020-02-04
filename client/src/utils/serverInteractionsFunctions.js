//GET SERVER STATUS
export async function callApi() {
  const response = await fetch('/api/hello');
  const serverConnect = await response.json();
  if (response.status !== 200) throw Error(serverConnect.message);
  
  return serverConnect;
}

//GET SWAP CONTRACT OWNER
export async function getSwapContractOwner() {
  const responseSwapOwner = await fetch('/api/swapContractOwner');
  const swapOwner = await responseSwapOwner.json();
  if (responseSwapOwner.status !== 200) throw Error(swapOwner.message);
  
  return swapOwner;
}

//GET SWAP CONTRACT ADDRESS
export async function getSwapContractAddress() {
  const responseSwap = await fetch('/api/swapContractAddress');
  const swapAddress = await responseSwap.json();
  if (responseSwap.status !== 200) throw Error(swapAddress.message);
  
  return swapAddress;
}

//GET ORDERBOOK DATA
export async function displayOrderBook() {
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
    for (let i=0; i<_orderBookBids.length; i++){
      if (_orderBookBids[i]){
        let newOrder = document.createElement('tr');
        newOrder.className += "newOrder";

        let newOrderPrice = document.createElement('th');
        newOrderPrice.textContent = _orderBookBids[i].price.toFixed(2);
        newOrderPrice.className += "newOrderPriceBid";
        let newOrderVolume = document.createElement('th');
        newOrderVolume.textContent = _orderBookBids[i].volume.toFixed(2);
        newOrderVolume.className += "newOrderVolume";
        let newOrderTotal = document.createElement('th');
        newOrderTotal.textContent = _orderBookBids[i].total.toFixed(2);
        newOrderTotal.className += "newOrderTotal";

        newOrder.appendChild(newOrderPrice);
        newOrder.appendChild(newOrderVolume);
        newOrder.appendChild(newOrderTotal);
        orderBookBidsBody.appendChild(newOrder);
      }
    }
  }

  if (_orderBookAsks.length > 0){
    for (let i=0; i<_orderBookAsks.length; i++){
      if (_orderBookAsks[i]){
        let newOrder = document.createElement('tr');
        newOrder.className += "newOrder";

        let newOrderPrice = document.createElement('th');
        newOrderPrice.textContent = _orderBookAsks[i].price.toFixed(2);
        newOrderPrice.className += "newOrderPriceAsk";
        let newOrderVolume = document.createElement('th');
        newOrderVolume.textContent = _orderBookAsks[i].volume.toFixed(2);
        newOrderVolume.className += "newOrderVolume";
        let newOrderTotal = document.createElement('th');
        newOrderTotal.textContent = _orderBookAsks[i].total.toFixed(2);
        newOrderTotal.className += "newOrderTotal";

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


//GET TRADE HISTORY
export async function displayTradeHistory() {
  let { tradeHistory } = this.state;

  //FETCH AND SAVE TRADES
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
    for (let i=0; i<tradeHistory.length; i++){
      if (tradeHistory[i]){
        let newTrade = document.createElement('tr');
        newTrade.className += "newTrade";

        let newTradePrice = document.createElement('th');
        newTradePrice.textContent = tradeHistory[i].price.toFixed(2);
        newTradePrice.className += "newTradePrice";
        let newTradeVolume = document.createElement('th');
        newTradeVolume.textContent = tradeHistory[i].volume.toFixed(2);
        newTradeVolume.className += "newTradeVolume";
        let newTradeTime = document.createElement('th');
        newTradeTime.className += "newTradeTimestamp";
        newTradeTime.textContent = tradeHistory[i].timestamp;

        newTrade.appendChild(newTradePrice);
        newTrade.appendChild(newTradeVolume);
        newTrade.appendChild(newTradeTime);
        tradeHistoryBody.appendChild(newTrade);
      }
    }
  }
}

//GET TRADE GRAPH DATA
export async function getTradeGraphData() {
  let tradeGraph = []

  //FETCH AND SAVE TRADES
  const tradeHistoryResponse = await fetch('/api/tradeHistory');
  const tradeHistoryEntire = await tradeHistoryResponse.json();
  if (tradeHistoryResponse.status !== 200) throw Error(tradeHistoryEntire.message);

  //POPULATE TRADEGRAPH ARRAY
  for (let i=0; i<tradeHistoryEntire['tradeHistory']['trades'].length; i++){
    tradeGraph.unshift([ tradeHistoryEntire['tradeHistory']['trades'][i].epoch, tradeHistoryEntire['tradeHistory']['trades'][i].price ])
  }
  this.state.tradeGraph = tradeGraph;
}

//UPDATE TRADE GRAPH DATA
export async function updateTradeGraphData() {
  let tradeGraph = []

  //FETCH AND SAVE TRADES
  const tradeHistoryResponse = await fetch('/api/tradeHistory');
  const tradeHistoryEntire = await tradeHistoryResponse.json();
  if (tradeHistoryResponse.status !== 200) throw Error(tradeHistoryEntire.message);

  //POPULATE TRADEGRAPH ARRAY
  for (let i=0; i<tradeHistoryEntire['tradeHistory']['trades'].length; i++){
    tradeGraph.unshift([ tradeHistoryEntire['tradeHistory']['trades'][i].epoch, tradeHistoryEntire['tradeHistory']['trades'][i].price ])
  }
  this.setState({ tradeGraph: tradeGraph });
  window.graphComponent.updateGraph();
}


//ASK SERVER TO TRY SWAP ORDERS 
export async function checkOrders() {
  const callCheck = await fetch('/api/swap');
  const callCheckResponse = await callCheck.json();
  if (callCheck.status !== 200) throw Error(callCheckResponse.message);
  return;
}


//GET USER'S TOKEN BALANCES
export async function getUserBalance() {
  const { accounts, tokenAlyContract, tokenDaiContract } = this.state;

  //RETRIEVE USER ALY AND DAI BALANCES
  let TempALYBalance = await tokenAlyContract.methods.balanceOf(accounts[0]).call();
  let TempDAIBalance = await tokenDaiContract.methods.balanceOf(accounts[0]).call();
  this.setState({
    ALYBalance: (TempALYBalance/100).toFixed(2),
    DAIBalance: (TempDAIBalance/100).toFixed(2)
  })
}

//TWO DECIMALS NUMBER FORMAT
export function fixRounding(value, precision) {
  var power = Math.pow(10, precision || 0);
  return Math.round(value * power) / power;
}