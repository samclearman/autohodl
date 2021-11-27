pragma solidity ^0.8.0;

contract Autohodl
{
  mapping(address => uint) private balances;
  mapping(address => uint) private lockTimes;
  
  constructor()
  {
  }

  /**
   * @dev Deposits some eth.
   */
  function hodl(address hodler) payable public {
    lockTimes[hodler] = block.timestamp;
    balances[hodler] = balances[hodler] + msg.value;
  }

  /**
   * @dev Withdraws the balance
   */
  function withdraw(address to) public {
    uint v = balances[to];
    balances[to] = 0;
    (bool success, ) = to.call{value: v}("");
    require(success, "Transfer failed.");
  }

}
