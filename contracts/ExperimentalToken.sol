pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/token/ERC20Basic.sol';
import 'zeppelin-solidity/contracts/token/ERC20.sol';
import 'zeppelin-solidity/contracts/token/BasicToken.sol';
import 'zeppelin-solidity/contracts/token/StandardToken.sol';

contract ExperimentalToken is StandardToken {

  string public constant name = "Experimental Token";
  string public constant symbol = "e11";

  uint8 public constant decimals = 18;

  uint256 public constant INITIAL_SUPPLY = 100000000 * 1 ether;

  /**
   * @dev Constructor that gives msg.sender all existing tokens.
   */
  function ExperimentalToken() {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}
