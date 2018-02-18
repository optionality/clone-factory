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
  evm.push1(0xff),
  evm.push1(0),
  evm.calldatasize(),
  evm.dup2(), // copy 0
  evm.dup4(), // copy 0xff
  evm.calldatacopy(),
  evm.dup1(), // copy 0
  evm.dup1(), // copy 0
  evm.calldatasize(),
  evm.dup5(), // copy 0xff
  evm.push20('0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef'),
  evm.gas(),
  evm.delegatecall(),
  evm.iszero(),
  evm.push1('revert-code'),
  evm.jumpi(),
  evm.returndatasize(),
  evm.dup1(), // copy returndatasize
  evm.dup3(), // copy 0
  evm.dup5(), // copy 0xff
  evm.returndatacopy(),
  evm.dup3(), // copy 0xff
  evm.return(),
  evm.stop(),
  evm.jumpdest('revert'),
  evm.dup1(), // copy 0
  evm.revert(),
  evm.stop(),

  // end label
  evm.label('codeend')
]);