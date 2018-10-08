const fs = require('fs');
const clonerFactory = require('../clone-contract.js');

function generate(bytes, output) {

  const template = fs.readFileSync('./templates/CloneFactory.solt');
  const cloner = clonerFactory.loader(bytes);
  const code = cloner.generate().substring(2); // eliminate the 0x
  const contract = clonerFactory.contract(bytes);
  const contractcode = contract.generate().substring(2);

  const result = eval('`' + template + '`');

  fs.writeFileSync(output, result);

}

function generateProbe(output) {
  const template = fs.readFileSync('./templates/ContractProbe.solt');
  const cloner = clonerFactory.contract(20);
  const code = cloner.generate().substring(2); // eliminate the 0x

  const result = eval('`' + template + '`');

  fs.writeFileSync(output, result);
}

generate(20, './contracts/CloneFactory.sol')
generate(18, './contracts/CloneFactory18.sol')
generate(17, './contracts/CloneFactory17.sol')
generate(16, './contracts/CloneFactory16.sol')

generateProbe('./contracts/ContractProbe.sol')

console.log("Generated CloneFactory classes!");

