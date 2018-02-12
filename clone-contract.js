const evm = require('@optionality.io/evm-asm');

module.exports = evm.program([

  // initialization code
  evm.callvalue(),
  evm.push1('revert'),
  evm.jumpi(),
  evm.push1('codeend-code'),
  evm.dup1(),
  evm.push1('code'),
  evm.push1(0),
  evm.codecopy(),
  evm.push1(0),
  evm.return(),
  evm.stop(),
  evm.label('code'),

  // contract code
  evm.calldatasize(),
  evm.push1(0),
  evm.push1(0xff),
  evm.calldatacopy(),
  evm.push1(0),
  evm.dup1(),
  evm.calldatasize(),
  evm.push1(0xff),
  evm.push20('0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef'),
  evm.gas(),
  evm.delegatecall(),
  evm.iszero(),
  evm.push1('revert-code'),
  evm.jumpi(),
  evm.returndatasize(),
  evm.dup1(),
  evm.push1(0x0),
  evm.push1(0xff),
  evm.returndatacopy(),
  evm.push1(0xff),
  evm.return(),
  evm.stop(),
  evm.jumpdest('revert'),
  evm.push1(0x0),
  evm.dup1(),
  evm.revert(),
  evm.stop(),

  // end label
  evm.label('codeend')
]);
