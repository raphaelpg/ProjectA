const { BN, ether, expectRevert } = require("@openzeppelin/test-helpers");
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
    const _decimals = 2;
    const _totalSupply = 100000;

    //Before each unit test  
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

    //Test 7
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

    //Test 8
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
    const _decimals = 2;
    const _totalSupply = 1000000;

    //Before each unit test  
    beforeEach(async function() {
        this.TokenERC20DaiInstance = await TokenERC20Dai.new();
    });

    //Test 9
    it("Check token name", async function() {
        expect(await this.TokenERC20DaiInstance.name.call()).to.equal(_name);
    });

    //Test 10
    it("Check token symbol", async function() {
        expect(await this.TokenERC20DaiInstance.symbol.call()).to.equal(_symbol);
    });

    //Test 11
    it("Check token decimals", async function() {
        expect(await this.TokenERC20DaiInstance.decimals.call()).to.be.bignumber.equal(new BN(_decimals));
    });

    //Test 12
    it('Check totalSupply value', async function () {
        let totalSupply = await this.TokenERC20DaiInstance.totalSupply();
        expect(totalSupply).to.be.bignumber.equal(new BN(_totalSupply));
    });

    //Test 13
    it("Check owner's balance", async function () {
        let balanceOf = await this.TokenERC20DaiInstance.balanceOf(owner);
        expect(balanceOf).to.be.bignumber.equal(new BN(_totalSupply));
    });

    //Test 14
    it("Check approve() and allowance() function", async function () {
        let amount = new BN('10');
        await this.TokenERC20DaiInstance.approve(spender, amount, {from: owner});
        let amountApproved = await this.TokenERC20DaiInstance.allowance(owner, spender); 
        expect(amountApproved).to.be.bignumber.equal(amount);
    });

    //Test 15
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

    //Test 16
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
    const hacker = accounts[3];

    //Before each unit test  
    beforeEach(async function() {
        this.TokenERC20AlyInstance = await TokenERC20Aly.new({from: seller});
        this.TokenERC20DaiInstance = await TokenERC20Dai.new({from: buyer});
        this.SwapAlyInstance = await SwapAly.new({from: contractOwner});
    });

    
    //Test 17
    it("Check swap contract owner", async function() {
        expect(await this.SwapAlyInstance.getOwner()).to.equal(contractOwner);
    });


    //Test 18
    it("Check swapToken function regarding owner's balances", async function() {
        let sellAmount = new BN('10000');
        let buyAmount = new BN('150000');
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


    //Test 19
    it("Check swapToken function regarding swap contract approval and allowances", async function() {
        let sellAmount = new BN('10000');
        let buyAmount = new BN('150000');
        
        await this.TokenERC20AlyInstance.approve(contractOwner, sellAmount, {from: seller});
        let sellerBeforeSwapAllowance = await this.TokenERC20AlyInstance.allowance(seller, contractOwner);
        console.log("ALY allowance before swap:", parseInt(sellerBeforeSwapAllowance));
        
        await this.TokenERC20DaiInstance.approve(contractOwner, buyAmount, {from: buyer});
        let buyerBeforeSwapAllowance = await this.TokenERC20DaiInstance.allowance(buyer, contractOwner);
        console.log("DAI allowance before swap:", parseInt(buyerBeforeSwapAllowance));
        
        await this.SwapAlyInstance.swapToken(
            seller,
            this.TokenERC20AlyInstance.address,
            sellAmount,
            buyer,
            this.TokenERC20DaiInstance.address,
            buyAmount,
            {from: contractOwner}
        );

        let sellerAfterSwapAllowance = await this.TokenERC20AlyInstance.allowance(seller, contractOwner);
        console.log("ALY allowance after swap:", parseInt(sellerAfterSwapAllowance));

        let buyerAfterSwapAllowance = await this.TokenERC20DaiInstance.allowance(buyer, contractOwner);
        console.log("DAI allowance after swap:", parseInt(buyerAfterSwapAllowance));

        expect(sellerAfterSwapAllowance).to.be.bignumber.equal(sellerBeforeSwapAllowance.sub(sellAmount));
        expect(buyerAfterSwapAllowance).to.be.bignumber.equal(buyerBeforeSwapAllowance.sub(buyAmount));
    });


    //Test 20
    it("Check swapToken function regarding approve attack", async function() {
        let sellAmount = new BN('10000');
        let buyAmount = new BN('150000');
        await this.TokenERC20AlyInstance.approve(contractOwner, sellAmount, {from: seller});
        await this.TokenERC20DaiInstance.approve(contractOwner, buyAmount, {from: buyer});

        let sellerAlyBalanceBefore = await this.TokenERC20AlyInstance.balanceOf(seller);
        console.log("Seller's balance before swap: ALY:",parseInt(sellerAlyBalanceBefore));

        await this.SwapAlyInstance.swapToken(
            seller,
            this.TokenERC20AlyInstance.address,
            sellAmount,
            buyer,
            this.TokenERC20DaiInstance.address,
            buyAmount,
            {from: contractOwner}
        );

        //Hacker tries to perform another transferFrom after the swap function to empty seller's wallet and then corrupt the orderbook
        await expectRevert(this.TokenERC20AlyInstance.transferFrom(seller, contractOwner, sellAmount, {from: hacker}), 'Insufficient allowance')
        console.log("Expect revert after approve attack")

        let sellerAlyBalanceAfter = await this.TokenERC20AlyInstance.balanceOf(seller);
        console.log("Seller's balance after swap: ALY:",parseInt(sellerAlyBalanceAfter));
        expect(sellerAlyBalanceAfter).to.be.bignumber.equal(sellerAlyBalanceBefore.sub(sellAmount));
    });
});