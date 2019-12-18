pragma solidity 0.5.12;

import "./TokenAly.sol";
import "./SafeMath.sol";

contract SwapAly{
    address private _owner;
    TokenAly private tokenAly;

    constructor (TokenAly _tokenAlyAddress) public {
        tokenAly = _tokenAlyAddress;
        _owner = msg.sender;
    }

    event AlySold(address indexed from, address indexed to, uint256 amount);

    function getOwner() external view returns(address){
        return _owner;
    }

    function getTokenAlyAddress() external view returns(TokenAly){
        return tokenAly;
    }

    function buyAly(address A, address B, uint8 price) external payable returns(bool){
        require(msg.value > 0,"unsuficient value");
        uint256 amountAly = msg.value * price; 
        //tokenAly.approve(B, amountAly);
        tokenAly.transferFrom(A, B, amountAly);
        emit AlySold(A, B, amountAly);
        return true;
    }
}