# SwapAly 
## Cryptogama swap contract
Use this contract to swap ERC-20 tokens
The owner of this contract need to get the approval from both token owners to be able to proceed the swap

> Created By Raphael Pinto Gregorio

## constructor
The deployer of this contract becomes automatically the owner

## Event TokenExchanged
|name |type |description
|-----|-----|-----------
|from|address|the seller address
|to|address|the buyer address
|amountSold|uint256|the amount sold
|amountBought|uint256|the amount bought

Event containing the seller address, the buyer address, the amount sold and the amount bought

## getOwner - view
No parameters  
Return : contract owner address

## swapToken - read
|name |type |description
|-----|-----|-----------
|sellerAddress|address|the address of the seller
|sellerTokenAddress|address|the address of the seller ERC-20
|amountSeller|uint256|the amount the seller wants to exchange
|buyerAddress|address|the buyer address
|buyerTokenAddress|address|the adress of the buyer ERC-20
|amountBuyer|uint256|the amount to be exchanged

Owner of swap contract need the approval of both token owners
Return : TokenExchanged event