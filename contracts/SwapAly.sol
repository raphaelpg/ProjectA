pragma solidity 0.5.12;

import "./SafeMath.sol";
import "./TokenERC20Aly.sol";
import "./TokenERC20Dai.sol";

contract SwapAly{
    address private _owner;

    event TokenExchanged(address indexed from, address indexed to, uint256 amountSold, uint256 amountBought);

    constructor () public {
        _owner = msg.sender;
    }

    function getOwner() external view returns(address){
        return _owner;
    }

    function swapToken(address sellerAddress, address sellerTokenAddress, uint256 amountSeller,  address buyerAddress, address buyerTokenAddress, uint256 amountBuyer) external returns(bool){
        TokenERC20Aly TokenSell = TokenERC20Aly(sellerTokenAddress);
        TokenERC20Dai TokenBuy = TokenERC20Dai(buyerTokenAddress);

        TokenSell.transferFrom(sellerAddress, buyerAddress, amountSeller);
        TokenBuy.transferFrom(buyerAddress, sellerAddress, amountBuyer);
        
        emit TokenExchanged(sellerAddress, buyerAddress, amountSeller, amountBuyer);
        return true;
    }
}