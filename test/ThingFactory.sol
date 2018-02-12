pragma solidity 0.4.19;

import "./Thing.sol";
import "../contracts/CloneFactory.sol";


contract ThingFactory is CloneFactory {

  address public libraryAddress;

  event ThingCreated(address newThingAddress);

  function ThingFactory(address _libraryAddress) public {
    libraryAddress = _libraryAddress;
  }

  function createThing(string _name, uint _value) public {
    address clone = createClone(libraryAddress);
    Thing(clone).init(_name, _value);
    ThingCreated(clone);
  }
}
