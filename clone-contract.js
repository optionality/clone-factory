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
  evm.dup2(),
  evm.dup4(),
  evm.calldatacopy(),
  evm.dup1(),
  evm.dup1(),
  evm.calldatasize(),
  evm.dup5(),
  evm.push20('0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef'),
  evm.gas(),
  evm.delegatecall(),
  evm.iszero(),
  evm.push1('revert-code'),
  evm.jumpi(),
  evm.returndatasize(),
  evm.dup1(),
  evm.dup3(),
  evm.dup5(),
  evm.returndatacopy(),
  evm.dup3(),
  evm.return(),
  evm.stop(),
  evm.jumpdest('revert'),
  evm.dup1(),
  evm.revert(),
  evm.stop(),

  // end label
  evm.label('codeend')
]);
