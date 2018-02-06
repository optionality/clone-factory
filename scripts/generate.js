const fs = require('fs');
const contract = require('../clone-contract.js');

const template = fs.readFileSync('./templates/CloneFactory.solt');

const code = contract.generate().substring(2); // eliminate the 0x

const result = eval('`' + template + '`');

fs.writeFileSync('./contracts/CloneFactory.sol', result);

console.log("Generated CloneFactory.sol");