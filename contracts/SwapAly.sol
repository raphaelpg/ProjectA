pragma solidity 0.5.12;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./TokenERC20Aly.sol";
import "./TokenERC20Dai.sol";

/// @title Cryptogama swap contract
/// @author Raphael Pinto Gregorio
/// @notice Use this contract to swap ERC-20 tokens
/// @dev The owner of this contract need to get the approval from both token owners to be able to proceed the swap
contract SwapAly is Ownable {
    address payable private _owner;

    event TokenExchanged(address indexed from, address indexed to, uint256 amountSold, uint256 amountBought);
    event SwapContractEmptied(address indexed to, uint256 ETHAmount, uint256 ALYAmount, uint256 DAIAmount);

    constructor () public {
        _owner = msg.sender;
    }

    function() external payable {}

    /// @notice perform tokens swap between two owners 
    /// @dev swap tokens, owner of swap contract need the approval of both token owners, emit an event called TokenExchanged
    /// @param sellerAddress the address of the seller, sellerTokenAddress the address of the seller ERC-20, amountSeller the amount the seller wants to exchange, buyerAddress the buyer address, buyerTokenAddress the adress of the buyer ERC-20, amountBuyer the amount to be exchanged
    /// @return an event TokenExchanged containing the seller address, the buyer address, the amount sold and the amount bought in this order
    function swapToken(address sellerAddress, address sellerTokenAddress, uint256 amountSeller,  address buyerAddress, address buyerTokenAddress, uint256 amountBuyer) external onlyOwner returns(bool){
        TokenERC20Aly TokenSell = TokenERC20Aly(sellerTokenAddress);
        TokenERC20Dai TokenBuy = TokenERC20Dai(buyerTokenAddress);

        TokenSell.transfer(buyerAddress, amountSeller);
        TokenBuy.transfer(sellerAddress, amountBuyer);

        emit TokenExchanged(sellerAddress, buyerAddress, amountSeller, amountBuyer);
    }

    /// @notice withdraw all funds from contract 
    /// @dev withdraw funds from contract and transfer them to current owner, including ETH, emit an event called SwapContractEmptied
    /// @param ALYTokenAddress the address of ALY token, DAITokenAddress the address of DAI token
    /// @return an event SwapContractEmptied containing the owner address, the ETH amount sent, ALY amount sent and DAI amount sent
    function withdrawAll(address ALYTokenAddress, address DAITokenAddress) external onlyOwner {
        TokenERC20Aly TokenALY = TokenERC20Aly(ALYTokenAddress);
        TokenERC20Dai TokenDAI = TokenERC20Dai(DAITokenAddress);

        uint256 ETHbalance = address(this).balance;
        uint256 ALYbalance = TokenALY.balanceOf(address(this));
        uint256 DAIbalance = TokenDAI.balanceOf(address(this));

        _owner.call.value(ETHbalance)("");
        if (ALYbalance > 0) {
            TokenALY.transfer(_owner, ALYbalance);
        }
        if (DAIbalance > 0) {
            TokenDAI.transfer(_owner, DAIbalance);
        }

        emit SwapContractEmptied(_owner, ETHbalance, ALYbalance, DAIbalance);
    }
}