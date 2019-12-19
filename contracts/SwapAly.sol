pragma solidity 0.5.12;

import "./TokenAly.sol";
import "./SafeMath.sol";

contract SwapAly{
    string public name = "ERC20 Token Aly";
    string public symbol = "ALY";
    uint256 public decimals = 0;
    address private _owner;
    TokenAly private tokenAly;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) public allowances;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event AlySold(address indexed from, address indexed to, uint256 amount);

    constructor (TokenAly _tokenAlyAddress) public {
        tokenAly = _tokenAlyAddress;
        _owner = msg.sender;
    }


    function getOwner() external view returns(address){
        return _owner;
    }

    function getTokenAlyAddress() external view returns(TokenAly){
        return tokenAly;
    }

    function buyAly(uint256 amount, uint256 rate) external payable returns(bool){
        require(msg.value > 0,"unsuficient value");
        require(msg.value >= (amount / rate));
        return true;
    }

    function transfer(address to, uint256 amount) external returns(bool) {
        require(to != address(0), "Sending to null address");
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external returns(bool) {
        require(allowances[sender][recipient] >= amount, "Insufficient allowance");
        require(_balances[sender] >= amount, "Insufficient balance");
        _balances[sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        allowances[sender][msg.sender] -= amount;
        emit Approval(sender, msg.sender, allowances[sender][msg.sender]);
        return true;
    }

    function approve(address spender, uint256 amount) external returns(bool) {
        require(spender != address(0), "Approving to zero address");
        require(msg.sender != address(0), "Approving to zero address");
        allowances[msg.sender][spender] += amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function allowance(address owner, address spender) external view returns(uint256) {
        return allowances[owner][spender];
    }

    function balanceOf(address account) external view returns(uint256) {
        return _balances[account];
    }

    // function totalSupply() external view returns(uint256) {
    //     return _totalSupply;
    // }
}