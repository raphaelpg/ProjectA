# SwapAly
_Use this contract to swap ERC-20 tokens_
> Created By Raphael Pinto Gregorio

The owner of this contract need to get the approval from both token owners to be able to proceed the swap
## Cryptogama swap contract

## constructor - read
_No parameters_
function Object() {
    [native code]
}

## TokenExchanged - read
|name |type |description
|-----|-----|-----------
|from|address|
|to|address|
|amountSold|uint256|
|amountBought|uint256|
**Add Documentation for the method here**

## getOwner - view
_No parameters_
> Created By Raphael Pinto Gregorio

basic function
Return : contract owner address

## swapToken - read
|name |type |description
|-----|-----|-----------
|sellerAddress|address|the address of the seller, sellerTokenAddress the address of the seller ERC-20, amountSeller the amount the seller wants to exchange, buyerAddress the buyer address, buyerTokenAddress the adress of the buyer ERC-20, amountBuyer the amount to be exchanged
|sellerTokenAddress|address|
|amountSeller|uint256|
|buyerAddress|address|
|buyerTokenAddress|address|
|amountBuyer|uint256|
> Created By Raphael Pinto Gregorio

swap tokens, owner of swap contract need the approval of both token owners, emit an event called TokenExchanged
Return : an event TokenExchanged containing the seller address, the buyer address, the amount sold and the amount bought in this order