let TokenAly = artifacts.require("./TokenAly.sol");
let SwapAly = artifacts.require("./SwapAly.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(TokenAly, {from: accounts[1]});
  deployer.deploy(SwapAly, TokenAly.address);
};
