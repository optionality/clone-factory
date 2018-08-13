const fs = require('fs');
const clonerFactory = require('../clone-contract.js');
const r2pipe = require('r2pipe-promise');
//NOTE requires radare2 to be installed: http://www.radare.org/r/ along with the evm module `r2pm install evm`

async function doit(len) {
    const proxy = clonerFactory.contract(len).generate();
    const bin = Buffer.from(proxy.substring(2), 'hex');
    const file = '___contract.bin';
    fs.writeFileSync(file, bin);

    const r2 = await r2pipe.open(file);
    await r2.cmd('e asm.arch=evm');
    await r2.cmd('aa');
    console.log(proxy);
    console.log(await r2.cmd('pD ' + bin.length));
    await r2.quit();

    fs.unlinkSync(file);
    console.log('done');
}
async function doBoth() {
    await doit(20);
    await doit(16);
}
doBoth();