pragma solidity ^0.8.0;

contract Autohodl
{
  mapping(address => uint) private balances;
  mapping(address => uint) private lockedUntil;

  constructor()
  {
  }

  /**
   * @dev Deposits some eth.
   */
  function hodl(address hodler, uint lockSeconds) payable public {
    lockedUntil[hodler] = block.timestamp + lockSeconds;
    balances[hodler] = balances[hodler] + msg.value;
  }

  function _isLocked(address hodler) private returns (bool) {
    if (block.timestamp <= lockedUntil[hodler]) {
      return true;
    }
    return false;
  }

  /**
   * @dev Withdraws the balance
   */
  function withdraw(address to) public {
      if (_isLocked(to)) {
          return;
      }
    uint v = balances[to];
    balances[to] = 0;
    (bool success, ) = to.call{value: v}("");
    require(success, "Transfer failed.");
  }

}
