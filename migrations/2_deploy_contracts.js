let TokenAly = artifacts.require("./TokenERC20Aly.sol");
let TokenDai = artifacts.require("./TokenERC20Dai.sol");
//let SwapAly = artifacts.require("./SwapAly.sol");

module.exports = function(deployer, network, accounts) {
  //deployer.deploy(SwapAly);
  deployer.deploy(TokenAly, {from: accounts[1]});
  deployer.deploy(TokenDai, {from: accounts[2]});
};
