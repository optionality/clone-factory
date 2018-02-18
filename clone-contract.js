const evm = require('@optionality.io/evm-asm');

module.exports = evm.program([

  // initialization code
  evm.push1(0),
  evm.callvalue(),
  evm.push1('revert'),
  evm.jumpi(),
  evm.push1('codeend-code'),
  evm.dup1(),
  evm.push1('code'),
  evm.dup4(),
  evm.codecopy(),
  evm.dup2(),
  evm.return(),
  evm.stop(),
  evm.label('code'),


  // contract code
  evm.push1(0),
  evm.calldatasize(), // size of copy
  evm.dup2(), // copy 0 - offset in calldata
  evm.dup1(), // copy 0x0 - destination location
  evm.calldatacopy(),
  evm.dup1(), // copy 0 - return data size
  evm.dup1(), // copy 0x0 - return data location
  evm.calldatasize(), // size of calldata
  evm.dup2(), // copy 0x0 - address of calldata
  evm.push20('0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef'),
  evm.gas(),
  evm.delegatecall(),
  evm.iszero(),
  evm.push1('revert-code'),
  evm.jumpi(),
  evm.returndatasize(),
  evm.dup2(), // copy 0 - offset in return data
  evm.dup1(), // copy 0x0 - destination location
  evm.returndatacopy(),
  evm.returndatasize(), // length of return data
  evm.dup2(), // copy 0x0 - location of return data
  evm.return(),
  evm.jumpdest('revert'),
  evm.dup1(), // copy 0x0 - revert data location
  evm.revert(),

  // end label
  evm.label('codeend')
]);