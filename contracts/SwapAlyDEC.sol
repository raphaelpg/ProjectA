pragma solidity 0.5.12;

// import "./TokenERC20Aly.sol";
// import "./TokenERC20Dai.sol";

// contract SwapAly{
//     address private _owner;
//     uint public bidId;
//     uint public askId;
//     uint public maximumBidPrice;
//     uint public minimumAskPrice;
//     uint public maximumBidId;
//     uint public minimumAskId;
    
//     struct Order {
//         bool active;
//         uint price;
//         uint volume;
//         uint total;
//         address orderOwner;
//         address tokenContractAddress;
//     }
    
//     mapping (uint => Order) public bids;
//     mapping (uint => Order) public asks;

//     event TokenExchanged(address indexed from, address indexed to, uint256 amountSold, uint256 amountBought);

//     constructor () public {
//         _owner = msg.sender;
//         bidId = 0;
//         askId = 0;
//         maximumBidPrice = 0;
//         minimumAskPrice = 0;
//         maximumBidId = 0;
//         minimumAskId = 0;
//     }
    
//     function getOwner() external view returns(address){
//         return _owner;
//     }

//     function checkOrders() view public returns (bool) {
//         if (maximumBidPrice != 0 && minimumAskPrice != 0 && asks[minimumAskId].active == true && bids[maximumBidId].active == true) {
//             if (maximumBidPrice >= minimumAskPrice){
//                 return true;
//             } else {
//                 return false;
//             }
//         }
//     }

//     function swapTokens() public {
//         TokenERC20Aly TokenAsk = TokenERC20Aly(asks[minimumAskId].tokenContractAddress);
//         TokenERC20Dai TokenBid = TokenERC20Dai(bids[maximumBidId].tokenContractAddress);

//         uint askAmount = 0;
//         uint bidAmount = 0;

//         if (asks[minimumAskId].volume >= bids[maximumBidId].volume){
//             askAmount = bids[maximumBidId].volume;
//             bidAmount = bids[maximumBidId].volume * bids[maximumBidId].price;
//         } else {
//             askAmount = asks[minimumAskId].volume;
//             bidAmount = asks[minimumAskId].volume * bids[maximumBidId].price;
//         }

//         require(TokenBid.transferFrom(bids[maximumBidId].orderOwner, asks[minimumAskId].orderOwner, bidAmount));
//         require(TokenAsk.transferFrom(asks[minimumAskId].orderOwner, bids[maximumBidId].orderOwner, askAmount));

//         emit TokenExchanged(asks[minimumAskId].orderOwner, bids[maximumBidId].orderOwner, askAmount, bidAmount);

//         if (asks[minimumAskId].volume - askAmount == 0){
//             asks[minimumAskId].active = false;
//         }
//         if (bids[maximumBidId].volume - bidAmount == 0){
//             bids[maximumBidId].active = false;
//         }
//     }

//     function insertOrder(string memory orderType, uint _price, uint _volume, uint _total, address _orderOwner, address _tokenContractAddress) public {
//         if (keccak256(abi.encodePacked((orderType))) == keccak256(abi.encodePacked(("bid")))){
//             bids[bidId].active = true;
//             bids[bidId].price = _price;
//             bids[bidId].volume = _volume;
//             bids[bidId].total = _total;
//             bids[bidId].orderOwner = _orderOwner;
//             bids[bidId].tokenContractAddress = _tokenContractAddress;
            
//             if (maximumBidPrice == 0 || maximumBidPrice < _price){
//                 maximumBidPrice = _price;
//                 maximumBidId = bidId;
//             }

//             bidId = bidId + 1;
            
//         } else if (keccak256(abi.encodePacked((orderType))) == keccak256(abi.encodePacked(("ask")))){
//             asks[askId].active = true;
//             asks[askId].price = _price;
//             asks[askId].volume = _volume;
//             asks[askId].total = _total;
//             asks[askId].orderOwner = _orderOwner;
//             asks[askId].tokenContractAddress = _tokenContractAddress;
            
//             if (minimumAskPrice == 0 || minimumAskPrice > _price){
//                 minimumAskPrice = _price;
//                 minimumAskId = askId;
//             }

//             askId = askId + 1;
//         }
        
//         // if (checkOrders()){
//         //     swapTokens();
//         // }
//     }
// }