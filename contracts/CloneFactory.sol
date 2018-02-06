pragma solidity 0.4.18;

//solhint-disable max-line-length
//solhint-disable no-inline-assembly

contract CloneFactory {

  event CloneCreated(address indexed target, address clone);

  function createClone(address target) internal returns (address result) {
    bytes memory clone = hex"34604457603a8060106000396000f30036600060ff376000803660ff73beefbeefbeefbeefbeefbeefbeefbeefbeefbeef5af48080156034573d80600060ff3e60fff3005b600080fd00";
    bytes20 targetBytes = bytes20(target);
    for (uint i = 0; i < 20; i++) {
      clone[29 + i] = targetBytes[i];
    }
    assembly {
      let len := mload(clone)
      let data := add(clone, 0x20)
      result := create(0, data, len)
    }
  }
}
