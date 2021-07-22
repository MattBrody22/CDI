 const CedarDesign = artifacts.require('./CedarDesign.sol');
const CDI = CedarDesign;

contract('CDI', function(accounts){
	let assetCreated;
	it('sets name', function() {
		return CDI.deployed().then(function(created) {
			assetCreated = created;
			return assetCreated.name()
		}).then(function(name) {
			assert.equal(name, 'CedarDesign', 'name')
			return assetCreated.logo()
		}).then(function(logo) {
			assert.equal(logo, 'CDI','logo')
			return assetCreated.version()
		}).then(function(version) {
			assert.equal(version, 'v2.2','version')
		})
	})
	it('sets stock', function() {
		return CDI.deployed().then(function(created) {
			assetCreated = created;
			return assetCreated.stock()
		}).then(function(stock) {
			assert.equal(stock.toNumber(), 22000000, 'stock total is 22,000,000')
			return assetCreated.balanceOf(accounts[0])
		}).then(function(creatorBalance) {
			assert.equal(creatorBalance.toNumber(),22000000, 'creator holds all token')
		})
	})

	it('transfers asset',function() {
		return CDI.deployed().then(function(created) {
			assetCreated = created;
			return assetCreated.transfer.call(accounts[1], 222222222222)
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'revert')
			return assetCreated.transfer.call(accounts[1], 22200, {from:accounts[0] })
		}).then(function(successful) {
			assert.equal(successful, true, 'returns true')
			return assetCreated.transfer(accounts[1], 22200, {from:accounts[0] })
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'event')
			assert.equal(receipt.logs[0].event, 'Transfer', 'Transfer event')
			assert.equal(receipt.logs[0].args._from, accounts[0], 'account from')
			assert.equal(receipt.logs[0].args._to, accounts[1], 'account to')
			assert.equal(receipt.logs[0].args._figure, 22200, 'amount')
			return assetCreated.balanceOf(accounts[1])
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 22200, 'amount recieved')
			return assetCreated.balanceOf(accounts[0])
		}).then(function(balance){
			assert.equal(balance.toNumber(), 21977800, 'amount deducted')
		})
	})

	it('approves transfer', function() {
		return CDI.deployed().then(function(created) {
			assetCreated = created;
			return assetCreated.approve.call(accounts[1], 2000)
		}).then(function(successful) {
			return assetCreated.approve(accounts[1], 2000)
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'event')
			assert.equal(receipt.logs[0].event, 'Approve', 'approve event')
			assert.equal(receipt.logs[0].args._possessor, accounts[0], 'account possessor')
			assert.equal(receipt.logs[0].args._costumer, accounts[1], 'account costumer')
			assert.equal(receipt.logs[0].args._figure, 2000, 'amount')
			return assetCreated.allowance(accounts[0], accounts[1])
		}).then(function(allowance) {
			assert.equal(allowance, 2000, 'allowance')
		})
	})

	it('transfers from', function() {
		return CDI.deployed().then(function(created) {
			assetCreated = created;
			fromAccount = accounts[2];
			toAccount = accounts[4];
			costumerAccount = accounts[6];

			return assetCreated.transfer(fromAccount, 200000, {from:accounts[0] })
		}).then(function(receipt) {
			return assetCreated.approve(costumerAccount, 20000, {from:fromAccount })
		}).then(function(receipt) {
			return assetCreated.transferFrom(fromAccount, toAccount, 44444444, {from:costumerAccount })
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'not enough allowance')
			return assetCreated.transferFrom(fromAccount, toAccount, 22000, {from:costumerAccount})
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'not enough allowance')
			return assetCreated.transferFrom.call(fromAccount, toAccount, 200, {from:costumerAccount})
		}).then(function(successful) {
			assert.equal(successful, true)
			return assetCreated.transferFrom(fromAccount, toAccount, 200, {from:costumerAccount})
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'event')
			assert.equal(receipt.logs[0].event, 'Approve', 'approve event')
			assert.equal(receipt.logs[0].args._possessor, fromAccount, 'account possessor')
			assert.equal(receipt.logs[0].args._costumer, toAccount, 'account costumer')
			assert.equal(receipt.logs[0].args._figure, 200, 'amount')
			return assetCreated.balanceOf(fromAccount)
		}).then(function(balance){
			assert.equal(balance.toNumber(), 199800, 'subtracts amount sent')
			return assetCreated.balanceOf(toAccount)
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 200, 'adds amount received')
			return assetCreated.allowance(fromAccount, costumerAccount)
		}).then(function(allowance) {
			assert.equal(allowance.toNumber(), 19800, 'subtracts amount from allowance')
		})
	})








































})