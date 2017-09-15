var ExperimentalToken = artifacts.require("./ExperimentalToken.sol");
var ExperimentalPreICO = artifacts.require("./ExperimentalPreICO.sol");
var config = require('../config/preICO.json');

module.exports = function(deployer) {
  deployer.deploy(ExperimentalToken).then(function() {
    console.log('ExperimentalToken Deployed');
    console.log(ExperimentalToken.address);
    console.log('Owner Address:' + web3.eth.accounts[0]);
    return deployer.deploy(ExperimentalPreICO,
      /*address _wallet*/ web3.eth.accounts[0],
      /*uint256 _goalInEthers*/ config.goal,
      /*uint256 _capInEthers*/ config.cap,
      /*uint256 _minPaymentInEthers*/ config.minPayment,
      /*uint256 _maxPaymentInEthers*/ config.maxPayment,
      /*uint256 _rate*/ config.rate,
      /*address _rewardToken*/ ExperimentalToken.address);
  }).then(function () {
    console.log('ExperimentalPreICO Deployed');
    console.log(ExperimentalPreICO.address);
  });
}
