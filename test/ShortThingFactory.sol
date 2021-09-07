pragma solidity ^0.4.23;

import "./Thing.sol";
import "../contracts/CloneFactory17.sol";


contract ShortThingFactory is CloneFactory17 {

  address public target;

  event ThingCreated(address newThingAddress, address target);

  constructor(address _target) public {
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

}
