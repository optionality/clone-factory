const evm = require('@optionality.io/evm-asm');

const contract = (bytes = 20) => [
  // contract code
  evm.label('code'),
  evm.push1(0),
  evm.calldatasize(), // size of copy
  evm.dup2(), // copy 0 - offset in calldata
  evm.dup1(), // copy 0x0 - destination location
  evm.calldatacopy(),
  evm.dup1(), // copy 0 - return data size
  evm.dup1(), // copy 0x0 - return data location
  evm.calldatasize(), // size of calldata
  evm.dup2(), // copy 0x0 - address of calldata
  evm.label('address'),
  evm['push' + bytes]('0x' + 'be'.repeat(bytes)), // address placeholder
  evm.gas(), // gas budget (all of it)
  evm.delegatecall(),
  evm.returndatasize(), // size of copy
  evm.dup3(), // copy 0 - offset in return data
  evm.dup1(), // copy 0x0 - destination location
  evm.returndatacopy(),
  evm.iszero(), // check return value
  evm.push1('revert-code'), // revert address (in code address space)
  evm.label('revertpush'),
  evm.jumpi(), // revert if zero
  evm.returndatasize(), // length of return data
  evm.swap1(), // pull up 0x0 - location of return data
  evm.return(),
  evm.jumpdest('revert'),
  evm.returndatasize(), // length of return data
  evm.swap1(), // pull up 0x0 - revert data location
  evm.revert(),

  // end label
  evm.label('codeend')
]

const loader = (bytes = 20) => [
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

  ...contract(bytes)
]

module.exports = {
  loader: (bytes = 20) => evm.program(loader(bytes)),
  contract: (bytes = 20) => evm.program(contract(bytes))
}
