const expect = require('expect');

const ThingFactory = artifacts.require('./ThingFactory.sol');
const Thing = artifacts.require('./Thing.sol');

contract('CloneFactory', () => {
  var global;
  var factory;

  before(() => {
    return Thing.new()
      .then(_thing => {
        global = _thing;
        return ThingFactory.new(_thing.address)
      })
      .then(_factory => {
        factory = {
          createThing: (name, value) => {
            return _factory.createThing(name, value)
              .then(tx => Thing.at(tx.logs[0].args.newThingAddress))
          }
        }
      })
  })

  it('should work', () => {
    return factory.createThing("Fred", 233)
      .then(thing => {
        return Promise.resolve()
          .then(() => thing.value())
          .then(value => expect(+value).toBe(233))
          .then(() => thing.name())
          .then(name => expect(name).toBe('Fred'))
      })
      .then(() => global.name())
      .then(value => expect(value).toBe('master'))
      .then(() => global.value())
      .then(value => expect(+value).toBe(0));
  })
})