let SimpleStorage = artifacts.require("./SimpleStorage.sol");
let TokenAly = artifacts.require("./TokenAly.sol");
let SwapAly = artifacts.require("./SwapAly.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(TokenAly);
  deployer.deploy(SwapAly, TokenAly.address);
};
