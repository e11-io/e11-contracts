var ExperimentalToken = artifacts.require("ExperimentalToken");

contract('ExperimentalToken', function(accounts) {
  it('Approve & Allowance & TransferFrom Test', function() {
    let exp;

    let acc_one = accounts[0];
    let acc_two = accounts[1];
    let acc_three = accounts[2];

    let acc_one_balance_start;
    let acc_three_balance_start;

    let acc_one_balance_final;
    let acc_three_balance_final;

    let acc_two_balance;

    let allowance_amount = 200;
    let transfer_amount = 50;

    let initial_allowance;
    let final_allowance;

    return ExperimentalToken.deployed().then(function(instance) {
      exp = instance;
      return exp.balanceOf.call(acc_one);
    }).then(function(bal) {
      acc_one_balance_start = bal.toNumber();
      return exp.balanceOf.call(acc_two);
    }).then(function(bal) {
      acc_two_balance = bal.toNumber();
      return exp.balanceOf.call(acc_three)
    }).then(function(bal) {
      acc_three_balance_start = bal.toNumber();
      return exp.approve(acc_two, allowance_amount)
    }).then(function() {
      return exp.allowance(acc_one, acc_two);
    }).then(function(allowed) {
      initial_allowance = allowed.toNumber();
      return exp.transferFrom(acc_one, acc_three, transfer_amount, {from: acc_two})
    }).then(function() {
      return exp.transferFrom(acc_one, acc_three, transfer_amount, {from: acc_two})
    }).then(function() {
      return exp.allowance(acc_one, acc_two);
    }).then(function(allowed) {
      final_allowance = allowed.toNumber();
      return exp.balanceOf.call(acc_one);
    }).then(function(bal) {
      acc_one_balance_final = bal.toNumber();
      return exp.balanceOf.call(acc_three) // get e11 balance
    }).then(function(bal) {
      acc_three_balance_final = bal.toNumber();
      assert.equal(acc_one_balance_start - (transfer_amount *2), acc_one_balance_final, "Amount wasn't correctly taken from the sender");
      assert.equal(acc_three_balance_start + (transfer_amount*2), acc_three_balance_final, "Amount wasn't correctly sent from the receiver");
      assert.equal(acc_two_balance, 0, 'Account Two shouldnt have any balance');
      assert.equal(initial_allowance - (transfer_amount*2), final_allowance, 'The discount of the allowance doesnt match')
    })
  });

  it('Test Send Ethereum', function() {
    let exp;
    let balance1;
    let balance2;
    let acc_one = accounts[4]
    let test;
    return ExperimentalToken.deployed().then(function(instance) {
      exp = instance;
      return web3.eth.getBalance(acc_one);
    }).then(function(bal) {
      balance1 = bal.toNumber();
      return web3.eth.sendTransaction({ from: accounts[0], to: acc_one, value: 1 * Math.pow(10,18)})
    }).then(function(res) {
      test = res;
      return web3.eth.getBalance(acc_one);
    }).then(function(bal) {
      balance2 = bal.toNumber();
      // console.log((web3.eth.getBalance(accounts[0]).toNumber()) / Math.pow(10,18));
      // console.log((web3.eth.getBalance(accounts[4]).toNumber()) / Math.pow(10,18));
      // console.log(test);
    })
  })
});
