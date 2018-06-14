pragma solidity ^0.4.23;

//solhint-disable max-line-length

contract ContractProbe {

    function probe(address _addr) public view returns (bool isContract, address forwardedTo) {
        bytes memory clone = hex"6000368180378080368173bebebebebebebebebebebebebebebebebebebebe5af43d82803e15602c573d90f35b3d90fd";
        uint size;
        bytes memory code;

        assembly {  //solhint-disable-line
            size := extcodesize(_addr)
        }

        isContract = size > 0;
        forwardedTo = _addr;

        if (size <= clone.length && size >= clone.length - 4) {
            bool matches = true;
            uint i;

            assembly { //solhint-disable-line
                code := mload(0x40)
                mstore(0x40, add(code, and(add(add(size, 0x20), 0x1f), not(0x1f))))
                mstore(code, size)
                extcodecopy(_addr, add(code, 0x20), 0, size)
            }
            for (i = 0; matches && i < 10; i++) { // address label - 1
                matches = code[i] == clone[i];
            }
            for (i = 0; matches && i < 17; i++) { // code-end label - address label - forwardAddressLength
                if (i == 8) { // calculate based on code-end and the jump label
                    matches = code[code.length - i - 1] == byte(uint(clone[clone.length - i - 1]) - (clone.length - size));
                } else {
                    matches = code[code.length - i - 1] == clone[clone.length - i - 1];
                }
            }
            if (code[10] != byte(0x73 - (clone.length - size))) {  // 10 is address label minus 1
                matches = false;
            }
            uint forwardedToBuffer;
            if (matches) {
                assembly { //solhint-disable-line
                    forwardedToBuffer := mload(add(code, add(0xb, 20))) // 0xb = address label
                }
                forwardedToBuffer &= (0x1 << 20 * 8) - 1;
                forwardedTo = address(forwardedToBuffer >> ((clone.length - size) * 8));
            }
        }
    }
}
