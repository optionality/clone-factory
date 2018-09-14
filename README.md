# clone-factory
Simple clone contract factory [![Build Status](https://travis-ci.org/optionality/clone-factory.svg?branch=master)](https://travis-ci.org/optionality/clone-factory)


Check out the contracts/CloneFactory.sol file for details.  This code (intended to be called from an implementor factory contract)
will allow you to install a master copy of a contract, then easily (cheaply) create clones with separate state.  The deployed bytecode
just delegates all calls to the master contract address.

`npm install @optionality.io/clone-factory`

```javascript
import "./Thing.sol";
import "@optionality.io/clone-factory/contracts/CloneFactory.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract ThingFactory is Ownable, CloneFactory {

  address public libraryAddress;

  event ThingCreated(address newThingAddress);

  function ThingFactory(address _libraryAddress) public {
    libraryAddress = _libraryAddress;
  }

  function setLibraryAddress(address _libraryAddress) public onlyOwner {
    libraryAddress = _libraryAddress;
  }

  function createThing(string _name, uint _value) public onlyOwner {
    address clone = createClone(libraryAddress);
    Thing(clone).init(_name, _value);
    ThingCreated(clone);
  }
}
```

This will inexpensively create a mimimalist forwarding shim contract that will delegate all calls to the contract libraryAddress

## WARNINGS
- Be sure that the master contract is pre-initialized.  You can usually accomplish this in your constructor as the only time the master contract constructor is called is during the master contract's creation.  Clone contracts do not call the constructor, but are initialized with an inline initialization method (as demonstrated above).
- Do not allow your master contract to be self-destructed as it will cause all clones to stop working, thus freezing their state and balances.

## Use vanity contract addresses for even CHEAPER clone contracts
Using [vanity-eth](https://github.com/MyEtherWallet/VanityEth) generate a vanity contract address with up to 4 bytes of leading zeros and use the CloneFactory16 - CloneFactory18 versions to deploy even smaller clones.  HT to [wjmelements](https://github.com/wjmelements) for pointing this out!

## ContractProbe contract 
Using this deployed contract d'apps, wallets, or other contracts can detect if an address contains a clone and to what address it redirects to.  This contract is deployed at the following addresses:
- Kovan: [0xBA0668bA8D0c3220f488985B80A07380532630Be](https://kovan.etherscan.io/address/0xBA0668bA8D0c3220f488985B80A07380532630Be)
- Mainnet: [0x4B6B2db16E3EEe4EE52bC3888c38a76C20d375f1](https://etherscan.io/address/0x4B6B2db16E3EEe4EE52bC3888c38a76C20d375f1)
- Ropsten: [0xC48E6e8E89DfbbcDcdBC8d5514A46Ba5e9A509EC](https://ropsten.etherscan.io/address/0xc48e6e8e89dfbbcdcdbc8d5514a46ba5e9a509ec)
- Rinkeby: [0x74f06a973046999fcd3905461baf8cbce596668f](https://rinkeby.etherscan.io/address/0x74f06a973046999fcd3905461baf8cbce596668f)

## Build Notes
To run the scripts/r2.js script, you need to have [radare2](http://www.radare.org/r/) installed along with the evm module (`r2pm install evm`).


## License
Code released under the [MIT License](https://github.com/optionality/clone-factory/blob/master/LICENSE).
