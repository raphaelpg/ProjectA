pragma solidity 0.5.12;

import "./ERC20.sol";

contract TokenERC20Dai is ERC20 {
    string public name;
    string public symbol;
    uint256 public decimals;
    uint256 public _totalSupply;
    address private _owner;

    constructor() public {
        name = "ERC20 Token Dai";
        symbol = "DAI";
        decimals = 0;
        _owner = msg.sender;
        
        _mint(msg.sender, 10000);
    }

    function getOwner() external view returns(address) {
        return _owner;
    }
}