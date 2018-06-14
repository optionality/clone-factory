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

## Use vanity contract addresses for even CHEAPER clone contracts
Using [vanity-eth](https://github.com/MyEtherWallet/VanityEth) generate a vanity contract address with up to 4 bytes of leading zeros and use the CloneFactory16 - CloneFactory18 versions to deploy even smaller clones.  HT to [wjmelements](https://github.com/wjmelements) for pointing this out!

## ContractProbe contract 
Using this deployed contract d'apps, wallets, or other contracts can detect if an address contains a clone and to what address it redirects to.  This contract is deployed at the following addresses:
- Kovan: [0x8b98e65e0e8bce0f71a2a22f3d2666591e4cc857](https://kovan.etherscan.io/address/0x8b98e65e0e8bce0f71a2a22f3d2666591e4cc857)
- Mainnet: [0x0c953133aa046965b83a3de1215ed4285414537c](https://etherscan.io/address/0x0c953133aa046965b83a3de1215ed4285414537c)

## License
Code released under the [MIT License](https://github.com/optionality/clone-factory/blob/master/LICENSE).
