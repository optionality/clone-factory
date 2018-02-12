pragma solidity 0.4.19;

//solhint-disable max-line-length
//solhint-disable no-inline-assembly

contract Thing {

  string public name;
  uint public value;

  event ThingEvent(address sender, string name, uint value);

  function Thing() public {
    name = "master"; // force default deployment to be init'd
  }

  function init(string _name, uint _value) public {
    require(bytes(name).length == 0); // ensure not init'd already.
    require(bytes(_name).length > 0);

    name = _name;
    value = _value;
  }

  function doit() public {
    ThingEvent(address(this), name, value);
  }
}
