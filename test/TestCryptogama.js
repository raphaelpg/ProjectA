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
    it("Check swap contract get owner function", async function() {
        expect(await this.SwapAlyInstance.owner()).to.equal(contractOwner);
    });


    //Test 18
    it("Check swap contract transferOwnership function", async function() {
        await this.SwapAlyInstance.transferOwnership(seller, {from: contractOwner});
        expect(await this.SwapAlyInstance.owner()).to.equal(seller);
    });


    //Test 19
    it("Check swapToken function regarding token balances", async function() {
        let sellAmount = new BN('10000');
        let buyAmount = new BN('150000');

        console.log("Initial balances: ")

        let sellerAlyBalanceBeforeTransfer = await this.TokenERC20AlyInstance.balanceOf(seller);
        let sellerDaiBalanceBeforeTransfer = await this.TokenERC20DaiInstance.balanceOf(seller);
        console.log("Seller's balance before transfer: ALY:",parseInt(sellerAlyBalanceBeforeTransfer), " DAI:",parseInt(sellerDaiBalanceBeforeTransfer));

        let buyerDaiBalanceBeforeTransfer = await this.TokenERC20DaiInstance.balanceOf(buyer);
        let buyerAlyBalanceBeforeTransfer = await this.TokenERC20AlyInstance.balanceOf(buyer);
        console.log("Buyer's balance before transfer: ALY:",parseInt(buyerAlyBalanceBeforeTransfer), " DAI:",parseInt(buyerDaiBalanceBeforeTransfer));

        let contractDaiBalanceBeforeTransfer = await this.TokenERC20DaiInstance.balanceOf(this.SwapAlyInstance.address);
        let contractAlyBalanceBeforeTransfer = await this.TokenERC20AlyInstance.balanceOf(this.SwapAlyInstance.address);
        console.log("Contract's balance before transfer: ALY:",parseInt(contractAlyBalanceBeforeTransfer), " DAI:",parseInt(contractDaiBalanceBeforeTransfer));

        await this.TokenERC20AlyInstance.transfer(this.SwapAlyInstance.address, sellAmount, {from: seller});
        await this.TokenERC20DaiInstance.transfer(this.SwapAlyInstance.address, buyAmount, {from: buyer});

        console.log("After transfer balances: ")

        let sellerAlyBalanceBeforeSwap = await this.TokenERC20AlyInstance.balanceOf(seller);
        let sellerDaiBalanceBeforeSwap = await this.TokenERC20DaiInstance.balanceOf(seller);
        console.log("Seller's balance before swap: ALY:",parseInt(sellerAlyBalanceBeforeSwap), " DAI:",parseInt(sellerDaiBalanceBeforeSwap));

        let buyerDaiBalanceBeforeSwap = await this.TokenERC20DaiInstance.balanceOf(buyer);
        let buyerAlyBalanceBeforeSwap = await this.TokenERC20AlyInstance.balanceOf(buyer);
        console.log("Buyer's balance before swap: ALY:",parseInt(buyerAlyBalanceBeforeSwap), " DAI:",parseInt(buyerDaiBalanceBeforeSwap));

        let contractDaiBalanceBeforeSwap = await this.TokenERC20DaiInstance.balanceOf(this.SwapAlyInstance.address);
        let contractAlyBalanceBeforeSwap = await this.TokenERC20AlyInstance.balanceOf(this.SwapAlyInstance.address);
        console.log("Contract's balance before swap: ALY:",parseInt(contractAlyBalanceBeforeSwap), " DAI:",parseInt(contractDaiBalanceBeforeSwap));

        await this.SwapAlyInstance.swapToken(
            seller,
            this.TokenERC20AlyInstance.address,
            sellAmount,
            buyer,
            this.TokenERC20DaiInstance.address,
            buyAmount
        );

        console.log("After swap balances: ")

        let sellerAlyBalanceAfter = await this.TokenERC20AlyInstance.balanceOf(seller);
        let sellerDaiBalanceAfter = await this.TokenERC20DaiInstance.balanceOf(seller);
        console.log("Seller's balance after swap: ALY:",parseInt(sellerAlyBalanceAfter), " DAI:",parseInt(sellerDaiBalanceAfter));
        
        let buyerDaiBalanceAfter = await this.TokenERC20DaiInstance.balanceOf(buyer);
        let buyerAlyBalanceAfter = await this.TokenERC20AlyInstance.balanceOf(buyer);
        console.log("Buyer's balance after swap: ALY:",parseInt(buyerAlyBalanceAfter), " DAI:",parseInt(buyerDaiBalanceAfter));

        let contractDaiBalanceAfter = await this.TokenERC20DaiInstance.balanceOf(this.SwapAlyInstance.address);
        let contractAlyBalanceAfter = await this.TokenERC20AlyInstance.balanceOf(this.SwapAlyInstance.address);
        console.log("Contract's balance after swap: ALY:",parseInt(contractAlyBalanceAfter), " DAI:",parseInt(contractDaiBalanceAfter));

        expect(sellerAlyBalanceAfter).to.be.bignumber.equal(sellerAlyBalanceBeforeTransfer.sub(sellAmount));
        expect(sellerDaiBalanceAfter).to.be.bignumber.equal(sellerDaiBalanceBeforeTransfer.add(buyAmount));

        expect(buyerDaiBalanceAfter).to.be.bignumber.equal(buyerDaiBalanceBeforeTransfer.sub(buyAmount));
        expect(buyerAlyBalanceAfter).to.be.bignumber.equal(buyerAlyBalanceBeforeTransfer.add(sellAmount));

        expect(contractDaiBalanceAfter).to.be.bignumber.equal(new BN('0'));
        expect(contractAlyBalanceAfter).to.be.bignumber.equal(new BN('0'));
    });

    //Test 20
    it("Check swapToken function regarding hacker's calling", async function() {
        let sellAmount = new BN('10000');
        let buyAmount = new BN('150000');

        await this.TokenERC20AlyInstance.transfer(this.SwapAlyInstance.address, sellAmount, {from: seller});
        await this.TokenERC20DaiInstance.transfer(this.SwapAlyInstance.address, buyAmount, {from: buyer});

        console.log("Expect hacker call to be reverted");

        await expectRevert(this.SwapAlyInstance.swapToken(
            seller,
            this.TokenERC20AlyInstance.address,
            sellAmount,
            hacker,
            this.TokenERC20DaiInstance.address,
            buyAmount,
            {from: hacker}
        ),"Ownable: caller is not the owner");

        console.log("Call reverted");
    });

    //Test 21
        it("Check swap contract withdrawAll() function", async function() {
        let ALYAmount = new BN('2000');
        let DAIAmount = new BN('20000');

        //Check owner balance in ETH, ALY and DAI
        let contractOwnerETHBalanceBefore = await web3.eth.getBalance(contractOwner);
        console.log("Owner", contractOwnerETHBalanceBefore/1000000000000000000, "ETH");
        let ownerALYBalanceBefore = await this.TokenERC20AlyInstance.balanceOf(contractOwner);
        console.log("Owner: ", parseInt(ownerALYBalanceBefore), "ALY");
        let ownerDAIBalanceBefore = await this.TokenERC20DaiInstance.balanceOf(contractOwner);
        console.log("Owner: ", parseInt(ownerDAIBalanceBefore), "DAI");

        //Check contract balance in ETH, ALY and DAI
        let SwapETHBalanceBefore = await web3.eth.getBalance(this.SwapAlyInstance.address);
        console.log("Contrac:t", SwapETHBalanceBefore/1000000000000000000, "ETH");
        let contractALYBalanceBefore = await this.TokenERC20AlyInstance.balanceOf(this.SwapAlyInstance.address);
        console.log("Contract:", parseInt(contractALYBalanceBefore), "ALY");
        let contractDAIBalanceBefore = await this.TokenERC20DaiInstance.balanceOf(this.SwapAlyInstance.address);
        console.log("Contract:", parseInt(contractDAIBalanceBefore), "DAI");

        //Send ETH, ALY and ETH to the contract
        await web3.eth.sendTransaction({from:seller, to:this.SwapAlyInstance.address, value:"10000000000000000000"});
        console.log("Send 10 ETH");
        await this.TokenERC20AlyInstance.transfer(this.SwapAlyInstance.address, ALYAmount, {from: seller});
        console.log("Send 2000 ALY");
        await this.TokenERC20DaiInstance.transfer(this.SwapAlyInstance.address, DAIAmount, {from: buyer});
        console.log("Send 20000 DAI");

        //Check contract balance in ETH, ALY and DAI
        let SwapETHBalanceAfterTransaction = await web3.eth.getBalance(this.SwapAlyInstance.address);
        console.log("Contract:", SwapETHBalanceAfterTransaction/1000000000000000000, "ETH");
        let contractALYBalanceAfterTransaction = await this.TokenERC20AlyInstance.balanceOf(this.SwapAlyInstance.address);
        console.log("Contract:", parseInt(contractALYBalanceAfterTransaction), "ALY");
        let contractDAIBalanceAfterTransaction = await this.TokenERC20DaiInstance.balanceOf(this.SwapAlyInstance.address);
        console.log("Contract:", parseInt(contractDAIBalanceAfterTransaction), "DAI");

        //Withdraw function
        await this.SwapAlyInstance.withdrawAll(this.TokenERC20AlyInstance.address, this.TokenERC20DaiInstance.address);
        console.log("Contract withdraw function()");

        //Check contract balance in ETH, ALY and DAI
        let SwapETHBalanceAfterWithdraw = await web3.eth.getBalance(this.SwapAlyInstance.address);
        console.log("Contract", SwapETHBalanceAfterWithdraw/1000000000000000000, "ETH");
        let contractALYBalanceAfterWithdraw = await this.TokenERC20AlyInstance.balanceOf(this.SwapAlyInstance.address);
        console.log("Contract: ", parseInt(contractALYBalanceAfterWithdraw), "ALY");
        let contractDAIBalanceAfterWithdraw = await this.TokenERC20DaiInstance.balanceOf(this.SwapAlyInstance.address);
        console.log("Contract: ", parseInt(contractDAIBalanceAfterWithdraw), "DAI");

        //Check owner balance in ETH, ALY and DAI
        let contractOwnerETHBalanceAfterWithdraw = await web3.eth.getBalance(contractOwner);
        console.log("Owner", contractOwnerETHBalanceAfterWithdraw/1000000000000000000, "ETH");
        let ownerALYBalanceAfterWithdraw = await this.TokenERC20AlyInstance.balanceOf(contractOwner);
        console.log("Owner: ", parseInt(ownerALYBalanceAfterWithdraw), "ALY");
        let ownerDAIBalanceAfterWithdraw = await this.TokenERC20DaiInstance.balanceOf(contractOwner);
        console.log("Owner: ", parseInt(ownerDAIBalanceAfterWithdraw), "DAI");
    });
});