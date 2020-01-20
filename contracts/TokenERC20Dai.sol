pragma solidity 0.5.12;

import "./ERC20.sol";

/// @title ALY ERC-20 contract
/// @author Raphael Pinto Gregorio
/// @notice Basic ERC-20 token based on OpenZepellin ERC-20 standard
/// @dev The token has all classic ERC-20 functions: totalSupply(), balanceOf(), transfer(), allowance(), approve(), transferFrom(). It has two decimals.
contract TokenERC20Dai is ERC20 {
    string public name;
    string public symbol;
    uint256 public decimals;
    uint256 public _totalSupply;
    address private _owner;

    constructor() public {
        name = "ERC20 Token Dai";
        symbol = "DAI";
        decimals = 2;
        _owner = msg.sender;
        
        _mint(msg.sender, 1000000);
    }

    /// @author Raphael Pinto Gregorio
    /// @notice return contract owner
    /// @dev basic function
    /// @return contract owner address
    function getOwner() external view returns(address) {
        return _owner;
    }
}