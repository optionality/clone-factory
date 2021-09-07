pragma solidity ^0.4.23;

import "./Thing.sol";
import "../contracts/CloneFactory.sol";


contract ThingFactory is CloneFactory {

  address public target;

  event ThingCreated(address newThingAddress, address target);

  constructor (address _target) public {
    target = _target;
  }

  function onlyCreate() public {
    createClone(target);
  }

  function createThing(string _name, uint _value) public {
    address clone = createClone(target);
    Thing(clone).init(_name, _value);
    emit ThingCreated(clone, target);
  }

  function isThing(address thing) public view returns (bool) {
    return isClone(target, thing);
  }

  function incrementThings(address[] things) public returns (bool) {
    for(uint i = 0; i < things.length; i++) {
      require(isThing(things[i]), "Must all be things");
      Thing(things[i]).increment();
    }

  }
}
