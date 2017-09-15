var ExperimentalToken = artifacts.require("ExperimentalToken");
var ExperimentalPreICO = artifacts.require('ExperimentalPreICO');
var config = require('../config/preICO.json');
console.log(config);

// IMPORTANT: This test is made for reachedGoal: 10 ETH, and capGoal 13 ETH.

contract('ExperimentalPreICO', function(accounts) {

  let e11;
  let preICO;
  let preICO_address;

  let acc_zero = accounts[0];
  let acc_one = accounts[1];
  let acc_two = accounts[2];

  let ethAmount = 1 * Math.pow(10,18);
  let e11Amount = 50 * 1000 * Math.pow(10,18);

  it('PreICO First e11 Balance', function() {


    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return e11.transfer(preICO_address, e11Amount);
      }).then(function() {
        return e11.balanceOf(preICO_address);
      }).then(function(balance) {
        assert.equal(balance.toNumber(), e11Amount, 'PreICO didnt recieved e11')
      });
    });
  });

  it('PreICO Whitlisting', function() {


    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return preICO.whitelistAddress([acc_zero, acc_one]);
      }).then(function() {
        return preICO.whitelistedAddresses(acc_one);
      }).then(function(res) {
        assert.equal(res, true, 'The account is not whitelisted');
      })
    });
  });

  it('Purchase without bying whitelisted', function() {
    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return web3.eth.sendTransaction({from: acc_two, to: preICO_address, value: ethAmount, gas: 1000000})
      }).catch(function(error) {

      });
    });
  });

  it('PreICO first purchase', function() {
    let acc_zero_initial_e11;
    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return e11.balanceOf(acc_zero);
      }).then(function(balance) {
        acc_zero_initial_e11 = balance.toNumber();
      }).then(function() {
        return web3.eth.sendTransaction({from: acc_zero, to: preICO_address, value: ethAmount, gas: 100000});
      }).then(function() {
        return e11.balanceOf(acc_zero);
      }).then(function(balance) {
        balance = balance.toNumber() / Math.pow(10,18);
        let intialBal = Math.round(((acc_zero_initial_e11 + (ethAmount * 1000)) / Math.pow(10,18)));
        // assert.equal(intialBal, bal, 'Acc_one didnt recieved e11 correctly');
      });
    });
  });

  it('Min & Max payments', function() {
    let acc_one_initial_eth;
    let acc_one_final_eth;
    let testAmount = 1 * Math.pow(10,18);
    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return web3.eth.getBalance(acc_one);
      }).then(function(balance) {
        acc_one_initial_eth = balance.toNumber() / Math.pow(10,18);
      }).then(function() {
        return web3.eth.sendTransaction({from: acc_one, to: preICO_address, value: testAmount, gas: 100000});
      }).then(function() {
        // return web3.eth.sendTransaction({from: acc_one, to: preICO_address, value: testAmount, gas: 100000});
      }).then(function() {
        return web3.eth.getBalance(acc_one);
      }).then(function(balance) {
        acc_one_final_eth = balance.toNumber() / Math.pow(10,18);
        testAmount = testAmount / Math.pow(10,18);
        assert.equal(Math.round(acc_one_initial_eth) - (testAmount*1), Math.round(acc_one_final_eth), "No se desconto correctamnete" )
      })
    });
  });

  // TODO: Set acc_one balance to 0
  // it('Try buying without ether', function() {
  //   return ExperimentalToken.deployed().then(function(TokenInstance) {
  //     e11 = TokenInstance
  //     return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
  //       preICO_address = PreICOInstance.address;
  //       preICO = PreICOInstance;
  //       return web3.eth.getBalance(acc_one);
  //     }).then(function(balance) {
  //       balance = balance.toNumber() - 1 * Math.pow(10,18);
  //       return web3.eth.sendTransaction({from: acc_one, to: acc_zero, value: bal});
  //     }).then(function() {
  //       return web3.eth.sendTransaction({from: acc_one, to: preICO_address, value: (1*Math.pow(10,18))});
  //     }).catch(function(error) {
  //
  //     })
  //   });
  // });

  it('Reach Eth Goal', function() {
    // IMPORTANT: This depends on the Reach Goal set on the contract migration and the min & max Payment.
    // you need to make as much transactions as you need to reach the goal and test it;
    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return web3.eth.sendTransaction({from: acc_zero, to: preICO_address, value: (ethAmount* 3), gas: 100000});
      }).then(function() {
        return web3.eth.sendTransaction({from: acc_one, to: preICO_address, value: (ethAmount* 3), gas: 100000});
      }).then(function() {
        return web3.eth.sendTransaction({from: acc_one, to: preICO_address, value: (ethAmount * 3), gas: 100000});
      }).then(function() {
        return preICO.amountRaised.call();
      }).then(function(balance) {
        // console.log('-----------balance-----------');
        // console.log(balance.toNumber() / Math.pow(10,18) + 'Eth');
      })
    });
  });

  it('Safe Withdrawal Before crowdsaleClosed', function() {
    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return preICO.safeWithdrawal({from: acc_zero});
      }).catch(function(error) {

      })
    });
  });

  //----------- endCrowdsale() -----------
  it('Transfer OnwerShip', function() {
    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return preICO.transferOwnership(acc_one);
      });
    });
  });

  it('Try endCrowdsale Without Ownership', function() {
    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return preICO.endCrowdsale();
      }).catch(function(error) {
      });
    });
  });

  it('Try endCrowdsale With Ownership', function() {
    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return preICO.endCrowdsale({from: acc_one});
      })
    });
  });

  it('Check Goal', function() {
    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return preICO.checkGoal({from: acc_one});
      });
    });
  });

  it('Safe Withdrawal After crowdsaleClosed', function() {
    // IMPORTANT: TO TEST safeWithdrawal WITH OR WITHOUT reachedGoal, just modify the amount of ether sent to the contract.
    // now is reachedGoal false;
    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return web3.eth.getBalance(acc_zero);
      }).then(function(balance) {
        // console.log('-----------balance acc_zero BEFORE safeWithdrawal-----------');
        // console.log(balance.toNumber() / Math.pow(10,18) + 'Eth');
        return preICO.safeWithdrawal({from: acc_zero});
      }).then(function() {
        return web3.eth.getBalance(acc_zero);
      }).then(function(balance) {
        // console.log('-----------balance acc_zero AFTER safeWithdrawal-----------');
        // console.log(balance.toNumber() / Math.pow(10,18) + 'Eth');
      })
    });
  });

  it('Safe Withdrawal of a non contributor', function() {
    // IMPORTANT: TO TEST safeWithdrawal WITH OR WITHOUT reachedGoal, just modify the amount of ether sent to the contract.
    // now is reachedGoal false;
    let initial_balance;
    let final_balance;
    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return web3.eth.getBalance(preICO_address);
      }).then(function(balance) {
        initial_balance = balance.toNumber() / Math.pow(10,18);
        return preICO.safeWithdrawal({from: accounts[9]});
      }).then(function() {
        return web3.eth.getBalance(preICO_address);
      }).then(function(balance) {
        final_balance = balance.toNumber() / Math.pow(10,18);
        assert.equal(initial_balance, final_balance, 'The account balance should be the same.')
      })
    });
  });

  it('Safe Withdrawal reachedGoal from owner', function() {
    // IMPORTANT: TO TEST safeWithdrawal WITH OR WITHOUT reachedGoal, just modify the amount of ether sent to the contract.
    // now is reachedGoal false;
    let preICO_initial_balance;
    let e11_initial_balance;
    let e11_final_balance;
    return ExperimentalToken.deployed().then(function(TokenInstance) {
      e11 = TokenInstance
      return ExperimentalPreICO.deployed().then(function(PreICOInstance) {
        preICO_address = PreICOInstance.address;
        preICO = PreICOInstance;
        return web3.eth.getBalance(preICO_address);
      }).then(function(balance) {
        preICO_initial_balance = balance.toNumber();
        return web3.eth.getBalance(acc_zero);
      }).then(function(balance) {
        e11_initial_balance = balance.toNumber();
        return preICO.safeWithdrawal({from: acc_one});
      }).then(function() {
        return web3.eth.getBalance(acc_zero);
      }).then(function(balance) {
        e11_final_balance = balance.toNumber();
        assert.equal(e11_initial_balance + preICO_initial_balance, e11_final_balance, 'safeWithdrawal didnt send the amount correctly')
      })
    });
  });

});
