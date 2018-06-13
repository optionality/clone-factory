pragma solidity ^0.4.23;

//solhint-disable max-line-length
//solhint-disable no-inline-assembly

contract TestRevertPayload {
  event MessageReceived(string message);

  function getRevertMessage(address thingClone) public returns (string) {
    bytes4 sig = bytes4(keccak256("epicfail()"));
    uint size;
    bytes memory buffer;
    assembly {
      mstore(0, sig)
      pop(call(gas, thingClone, 0, 0, 4, 0, 0))
      let offset := mload(0x40) // free memory space
      returndatacopy(offset, 0x24, 0x20)
      size := mload(offset)
    }
    buffer = new bytes(size);
    assembly { //solhint-disable-line
      returndatacopy(add(buffer, 0x20), 0x44, size)
    }
    emit MessageReceived(string(buffer));
  }
}
