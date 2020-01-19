# TokenERC20Dai
_Basic ERC-20 token based on OpenZepellin ERC-20 standard_
> Created By Raphael Pinto Gregorio

The token has all classic ERC-20 functions: totalSupply(), balanceOf(), transfer(), allowance(), approve(), transferFrom(). It has two decimals.
## ALY ERC-20 contract

## constructor - read
_No parameters_
function Object() {
    [native code]
}

## Approval - read
|name |type |description
|-----|-----|-----------
|owner|address|
|spender|address|
|value|uint256|
**Add Documentation for the method here**

## Transfer - read
|name |type |description
|-----|-----|-----------
|from|address|
|to|address|
|value|uint256|
**Add Documentation for the method here**

## _totalSupply - view
_No parameters_
**Add Documentation for the method here**

## allowance - view
|name |type |description
|-----|-----|-----------
|owner|address|
|spender|address|
See {IERC20-allowance}.

## approve - read
|name |type |description
|-----|-----|-----------
|spender|address|
|amount|uint256|
See {IERC20-approve}.     * Requirements:     * - `spender` cannot be the zero address.

## balanceOf - view
|name |type |description
|-----|-----|-----------
|account|address|
See {IERC20-balanceOf}.

## decimals - view
_No parameters_
**Add Documentation for the method here**

## decreaseAllowance - read
|name |type |description
|-----|-----|-----------
|spender|address|
|subtractedValue|uint256|
Atomically decreases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`.

## getOwner - view
_No parameters_
> Created By Raphael Pinto Gregorio

basic function
Return : contract owner address

## increaseAllowance - read
|name |type |description
|-----|-----|-----------
|spender|address|
|addedValue|uint256|
Atomically increases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address.

## name - view
_No parameters_
**Add Documentation for the method here**

## symbol - view
_No parameters_
**Add Documentation for the method here**

## totalSupply - view
_No parameters_
See {IERC20-totalSupply}.

## transfer - read
|name |type |description
|-----|-----|-----------
|recipient|address|
|amount|uint256|
See {IERC20-transfer}.     * Requirements:     * - `recipient` cannot be the zero address. - the caller must have a balance of at least `amount`.

## transferFrom - read
|name |type |description
|-----|-----|-----------
|sender|address|
|recipient|address|
|amount|uint256|
See {IERC20-transferFrom}.     * Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20};     * Requirements: - `sender` and `recipient` cannot be the zero address. - `sender` must have a balance of at least `amount`. - the caller must have allowance for `sender`'s tokens of at least `amount`.