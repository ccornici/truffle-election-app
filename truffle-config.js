// See <http://truffleframework.com/docs/advanced/configuration>
// for more about customizing your Truffle configuration!

module.exports = {
  compilers: {
    solc: {
      version: '^0.8.0'
    }
  },

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    }
  },

  mocha: {
    slow: 1000,
  }
};
