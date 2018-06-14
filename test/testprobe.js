const expect = require('expect');
const WalletProvider = require('truffle-wallet-provider');
const Wallet = require('ethereumjs-wallet');
const { promisify } = require('util');
const Eth = require('ethjs-query');

const ShortThingFactory = artifacts.require('./ShortThingFactory.sol');
const ThingFactory = artifacts.require('./ThingFactory.sol');
const Thing = artifacts.require('./Thing.sol');
const ContractProbe = artifacts.require('./ContractProbe.sol');

contract("ContractProbe", (accounts) => {

    describe("FullLengthClone", () => {
        var master;
        var factory;
        var clone;
        var probe;

        before(async () => {
            master = await Thing.new();
            factory = await ThingFactory.new(master.address);
            clone = await factory.createThing("fred", 12).then(tx => Thing.at(tx.logs[0].args.newThingAddress))
            probe = await ContractProbe.new();
        })

        it('should work', async () => {
            const [isContract, forwardedTo] = await probe.probe(master.address);
            expect(isContract).toBe(true);
            expect(forwardedTo).toBe(master.address);
        })

        it('should work with a clone', async () => {
            const [isContract, forwardedTo] = await probe.probe(clone.address);
            expect(isContract).toBe(true);
            expect(forwardedTo).toBe(master.address);
        })

        it('should work with a regular address', async () => {
            const [isContract, forwardedTo] = await probe.probe('0xA4caDe6ecbed8f75F6fD50B8be92feb144400CC4');
            expect(isContract).toBe(false);
            expect(forwardedTo).toBe('0xA4caDe6ecbed8f75F6fD50B8be92feb144400CC4'.toLowerCase());
        })
    })

    describe("ShortCloneFactory", () => {
        var master;
        var factory;
        var clone;
        var probe;

        before(async () => {
            const cPrivateKey = '97538283497f5d8ec7626ab08cd840ce28909b8859bfb36b5143106192fed34f';
            var wallet = Wallet.fromPrivateKey(new Buffer(cPrivateKey, 'hex'));
            eth = new Eth(Thing.currentProvider);
            await eth.sendTransaction({
                from: accounts[0],
                to: wallet.getAddressString(),
                value: 2e18,
                data: '0x'
            })
            var provider = new WalletProvider(wallet, Thing.currentProvider);
            Thing.setProvider(provider);
            master = await Thing.new({ from: wallet.getAddressString(), nonce: 0 })
            factory = await ShortThingFactory.new(master.address);
            clone = await factory.createThing("fred", 12).then(tx => Thing.at(tx.logs[0].args.newThingAddress))
            probe = await ContractProbe.new();
        })

        it('should work', async () => {
            const [isContract, forwardedTo] = await probe.probe(master.address);
            expect(isContract).toBe(true);
            expect(forwardedTo).toBe(master.address);
        })

        it('should work with a clone', async () => {
            const [isContract, forwardedTo] = await probe.probe(clone.address);
            expect(isContract).toBe(true);
            expect(forwardedTo).not.toBe(clone.address);
            expect(forwardedTo).toBe(master.address);
        })

        it('should work with a regular address', async () => {
            const [isContract, forwardedTo] = await probe.probe('0xA4caDe6ecbed8f75F6fD50B8be92feb144400CC4');
            expect(isContract).toBe(false);
            expect(forwardedTo).toBe('0xA4caDe6ecbed8f75F6fD50B8be92feb144400CC4'.toLowerCase());
        })
    })
})
