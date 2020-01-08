const { BN, ether } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const SwapAly = artifacts.require("SwapAly");
const TokenERC20Aly = artifacts.require("TokenERC20Aly");
const TokenERC20Dai = artifacts.require("TokenERC20Dai");

contract("TokenERC20Aly", function(accounts){
    const owner = accounts[0];
    const spender = accounts[1];
    const recipient = accounts[2];
    const _name = "ERC20 Token Aly";
    const _symbol = "ALY";
    const _decimals = 0;
    const _totalSupply = 1000;

    //Avant chaque test unitaire  
    beforeEach(async function() {
        this.TokenERC20AlyInstance = await TokenERC20Aly.new();
    });

    //Test 1
    it("Check token name", async function() {
        expect(await this.TokenERC20AlyInstance.name.call()).to.equal(_name);
    });

    //Test 2
    it("Check token symbol", async function() {
        expect(await this.TokenERC20AlyInstance.symbol.call()).to.equal(_symbol);
    });

    //Test 3
    it("Check token decimals", async function() {
        expect(await this.TokenERC20AlyInstance.decimals.call()).to.be.bignumber.equal(new BN(_decimals));
    });

    //Test 4
    it('Check totalSupply value', async function () {
        let totalSupply = await this.TokenERC20AlyInstance.totalSupply();
        expect(totalSupply).to.be.bignumber.equal(new BN(_totalSupply));
    });

    //Test 5
    it("Check owner's balance", async function () {
        let balanceOf = await this.TokenERC20AlyInstance.balanceOf(owner);
        expect(balanceOf).to.be.bignumber.equal(new BN(_totalSupply));
    });

    //Test 6
    it("Check approve() and allowance() function", async function () {
        let amount = new BN('10');
        await this.TokenERC20AlyInstance.approve(spender, amount, {from: owner});
        let amountApproved = await this.TokenERC20AlyInstance.allowance(owner, spender); 
        expect(amountApproved).to.be.bignumber.equal(amount);
    });

    //Test 6
    it("Check transfer() function", async function () {
        let ownerBalanceBefore = await this.TokenERC20AlyInstance.balanceOf(owner);
        let recipientBalanceBefore = await this.TokenERC20AlyInstance.balanceOf(recipient);
        let amount = new BN('10');

        await this.TokenERC20AlyInstance.transfer(recipient, amount, {from: owner});

        let ownerBalanceAfter = await this.TokenERC20AlyInstance.balanceOf(owner);
        let recipientBalanceAfter = await this.TokenERC20AlyInstance.balanceOf(recipient);

        expect(ownerBalanceAfter).to.be.bignumber.equal(ownerBalanceBefore.sub(amount));
        expect(recipientBalanceAfter).to.be.bignumber.equal(recipientBalanceBefore.add(amount));
    });

    //Test 7
    it("Check transferFrom() function", async function () {
        let ownerBalanceBefore = await this.TokenERC20AlyInstance.balanceOf(owner);
        let recipientBalanceBefore = await this.TokenERC20AlyInstance.balanceOf(recipient);
        let amount = new BN('10');

        await this.TokenERC20AlyInstance.approve(spender, amount, {from: owner});

        await this.TokenERC20AlyInstance.transferFrom(owner, recipient, amount, {from: spender});

        let ownerBalanceAfter = await this.TokenERC20AlyInstance.balanceOf(owner);
        let recipientBalanceAfter = await this.TokenERC20AlyInstance.balanceOf(recipient);

        expect(ownerBalanceAfter).to.be.bignumber.equal(ownerBalanceBefore.sub(amount));
        expect(recipientBalanceAfter).to.be.bignumber.equal(recipientBalanceBefore.add(amount));
    });
});

contract("TokenERC20Dai", function(accounts){
    const owner = accounts[0];
    const spender = accounts[1];
    const recipient = accounts[2];
    const _name = "ERC20 Token Dai";
    const _symbol = "DAI";
    const _decimals = 0;
    const _totalSupply = 10000;

    //Avant chaque test unitaire  
    beforeEach(async function() {
        this.TokenERC20DaiInstance = await TokenERC20Dai.new();
    });

    //Test 1
    it("Check token name", async function() {
        expect(await this.TokenERC20DaiInstance.name.call()).to.equal(_name);
    });

    //Test 2
    it("Check token symbol", async function() {
        expect(await this.TokenERC20DaiInstance.symbol.call()).to.equal(_symbol);
    });

    //Test 3
    it("Check token decimals", async function() {
        expect(await this.TokenERC20DaiInstance.decimals.call()).to.be.bignumber.equal(new BN(_decimals));
    });

    //Test 4
    it('Check totalSupply value', async function () {
        let totalSupply = await this.TokenERC20DaiInstance.totalSupply();
        expect(totalSupply).to.be.bignumber.equal(new BN(_totalSupply));
    });

    //Test 5
    it("Check owner's balance", async function () {
        let balanceOf = await this.TokenERC20DaiInstance.balanceOf(owner);
        expect(balanceOf).to.be.bignumber.equal(new BN(_totalSupply));
    });

    //Test 6
    it("Check approve() and allowance() function", async function () {
        let amount = new BN('10');
        await this.TokenERC20DaiInstance.approve(spender, amount, {from: owner});
        let amountApproved = await this.TokenERC20DaiInstance.allowance(owner, spender); 
        expect(amountApproved).to.be.bignumber.equal(amount);
    });

    //Test 6
    it("Check transfer() function", async function () {
        let ownerBalanceBefore = await this.TokenERC20DaiInstance.balanceOf(owner);
        let recipientBalanceBefore = await this.TokenERC20DaiInstance.balanceOf(recipient);
        let amount = new BN('10');

        await this.TokenERC20DaiInstance.transfer(recipient, amount, {from: owner});

        let ownerBalanceAfter = await this.TokenERC20DaiInstance.balanceOf(owner);
        let recipientBalanceAfter = await this.TokenERC20DaiInstance.balanceOf(recipient);

        expect(ownerBalanceAfter).to.be.bignumber.equal(ownerBalanceBefore.sub(amount));
        expect(recipientBalanceAfter).to.be.bignumber.equal(recipientBalanceBefore.add(amount));
    });

    //Test 7
    it("Check transferFrom() function", async function () {
        let ownerBalanceBefore = await this.TokenERC20DaiInstance.balanceOf(owner);
        let recipientBalanceBefore = await this.TokenERC20DaiInstance.balanceOf(recipient);
        let amount = new BN('10');

        await this.TokenERC20DaiInstance.approve(spender, amount, {from: owner});

        await this.TokenERC20DaiInstance.transferFrom(owner, recipient, amount, {from: spender});

        let ownerBalanceAfter = await this.TokenERC20DaiInstance.balanceOf(owner);
        let recipientBalanceAfter = await this.TokenERC20DaiInstance.balanceOf(recipient);

        expect(ownerBalanceAfter).to.be.bignumber.equal(ownerBalanceBefore.sub(amount));
        expect(recipientBalanceAfter).to.be.bignumber.equal(recipientBalanceBefore.add(amount));
    });
});


contract("SwapAly", function(accounts){
    const contractOwner = accounts[0];
    const seller = accounts[1];
    const buyer = accounts[2];

    //Avant chaque test unitaire  
    beforeEach(async function() {
        this.TokenERC20AlyInstance = await TokenERC20Aly.new({from: seller});
        this.TokenERC20DaiInstance = await TokenERC20Dai.new({from: buyer});
        this.SwapAlyInstance = await SwapAly.new({from: contractOwner});
    });

    //Test 1
    it("Check swap contract owner", async function() {
        expect(await this.SwapAlyInstance.getOwner()).to.equal(contractOwner);
    });

    // function swapToken(address sellerAddress, address sellerTokenAddress, uint256 amountSeller,  address buyerAddress, address buyerTokenAddress,, uint256 amountBuyer) external returns(bool)
    //Test 2
    it("Check swapToken function", async function() {
        let sellAmount = new BN('100');
        let buyAmount = new BN('1500');
        await this.TokenERC20AlyInstance.approve(contractOwner, sellAmount, {from: seller});
        await this.TokenERC20DaiInstance.approve(contractOwner, buyAmount, {from: buyer});

        let sellerAlyBalanceBefore = await this.TokenERC20AlyInstance.balanceOf(seller);
        let sellerDaiBalanceBefore = await this.TokenERC20DaiInstance.balanceOf(seller);
        console.log("Seller's balance before swap: ALY:",parseInt(sellerAlyBalanceBefore), " DAI:",parseInt(sellerDaiBalanceBefore));

        let buyerDaiBalanceBefore = await this.TokenERC20DaiInstance.balanceOf(buyer);
        let buyerAlyBalanceBefore = await this.TokenERC20AlyInstance.balanceOf(buyer);
        console.log("Buyer's balance before swap: ALY:",parseInt(buyerAlyBalanceBefore), " DAI:",parseInt(buyerDaiBalanceBefore));

        await this.SwapAlyInstance.swapToken(
            seller,
            this.TokenERC20AlyInstance.address,
            sellAmount,
            buyer,
            this.TokenERC20DaiInstance.address,
            buyAmount,
            {from: contractOwner}
        );

        let sellerAlyBalanceAfter = await this.TokenERC20AlyInstance.balanceOf(seller);
        let sellerDaiBalanceAfter = await this.TokenERC20DaiInstance.balanceOf(seller);
        console.log("Seller's balance after swap: ALY:",parseInt(sellerAlyBalanceAfter), " DAI:",parseInt(sellerDaiBalanceAfter));
        
        let buyerDaiBalanceAfter = await this.TokenERC20DaiInstance.balanceOf(buyer);
        let buyerAlyBalanceAfter = await this.TokenERC20AlyInstance.balanceOf(buyer);
        console.log("Buyer's balance after swap: ALY:",parseInt(buyerAlyBalanceAfter), " DAI:",parseInt(buyerDaiBalanceAfter));

        expect(sellerAlyBalanceAfter).to.be.bignumber.equal(sellerAlyBalanceBefore.sub(sellAmount));
        expect(sellerDaiBalanceAfter).to.be.bignumber.equal(sellerDaiBalanceBefore.add(buyAmount));

        expect(buyerDaiBalanceAfter).to.be.bignumber.equal(buyerDaiBalanceBefore.sub(buyAmount));
        expect(buyerAlyBalanceAfter).to.be.bignumber.equal(buyerAlyBalanceBefore.add(sellAmount));
    });
});