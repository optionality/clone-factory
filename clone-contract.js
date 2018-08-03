const evm = require('@optionality.io/evm-asm');

const contract = (bytes = 20) => [
  // contract code
  evm.label('code'),
  evm.calldatasize(),                                   // cds            
  evm.returndatasize(),                                 // 0 cds          // per EIP-211
  evm.returndatasize(),                                 // 0 0 cds        // per EIP-211
  evm.calldatacopy(),                                   //    
  evm.returndatasize(),                                 // 0              // per EIP-211
  evm.returndatasize(),                                 // 0 0            // per EIP-211
  evm.returndatasize(),                                 // 0 0 0          // per EIP-211
  evm.calldatasize(),                                   // cds 0 0 0       
  evm.returndatasize(),                                 // 0 cds 0 0 0    // per EIP-211
  evm.label('address'),
  evm['push' + bytes]('0x' + 'be'.repeat(bytes)),       // bebe 0 cds 0 0 0
  evm.gas(),                                            // gas bebe 0 cds 0 0 0  // all gas for delegate
  evm.delegatecall(),                                   // s 0
  evm.returndatasize(),                                 // rds s 0
  evm.dup3(),                                           // 0 rds s 0
  evm.dup1(),                                           // 0
  evm.returndatacopy(),                                 // s 0
  evm.swap1(),                                          // 0 s 
  evm.returndatasize(),                                 // rds 0 s
  evm.swap2(),                                          // s 0 rds
  evm.push1('return-code'),                             // return address (in code address space)
  evm.label('returnpush'),                              // 
  evm.jumpi(), // return if zero
  evm.revert(),
  evm.jumpdest('return'),
  evm.return(),
  // end label
  evm.label('codeend')
]

const loader = (bytes = 20) => [
  // initialization code
  evm.returndatasize(),                                 // 0                           // Per EIP-211 this is a 0
  evm.push1('codeend-code'),                            // codelen 0
  evm.dup1(),                                           // codelen codelen 0
  evm.push1('code'),                                    // codeoff codelen codelen 0
  evm.returndatasize(),                                 // 0 codeoff codelen codelen 0
  evm.codecopy(),                                       // codelen 0
  evm.dup2(),                                           // 0 codelen 0
  evm.return(),                                         // 0

  ...contract(bytes)
]

module.exports = {
  loader: (bytes = 20) => evm.program(loader(bytes)),
  contract: (bytes = 20) => evm.program(contract(bytes))
}
