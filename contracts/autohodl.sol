pragma solidity ^0.8.0;

contract Autohodl
{
  mapping(address => uint) private balances;
  mapping(address => uint) private lockedUntil;

  constructor()
  {
  }

  
  function _isLocked(address hodler) private view returns (bool) {
    if (block.timestamp <= lockedUntil[hodler]) {
      return true;
    }
    return false;
  }

  /**
   * @dev Deposits some eth.
   */
  function hodl(address hodler, uint lockSeconds) payable public {
    uint newLock;
    uint requestedLock = block.timestamp + lockSeconds;
    if (requestedLock > lockedUntil[hodler]) {
      require(msg.sender == hodler);
      newLock = requestedLock;
    } else {
      newLock = lockedUntil[hodler];
    }
    lockedUntil[hodler] = newLock;
    balances[hodler] = balances[hodler] + msg.value;
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

  function balanceOf(address hodler) public view returns (uint) {
    return balances[hodler];
  }

  function lockedUntilOf(address hodler) public view returns (uint) {
    return lockedUntil[hodler];
  }

}
