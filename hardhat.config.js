require("hardhat-preprocessor");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-docgen");

// Import OpenZeppelin plugin
require("hardhat-contract-sizer");
require("@openzeppelin/hardhat-upgrades");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.22", // You can use a different version if needed
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      blockGasLimit: 30_000_000,
      throwOnCallFailures: false,
    },
    verificationNetwork: {
      url: "",
    },
    ganache: {
      url: "http://localhost:7545", // Ganache's default RPC server URL
      chainId: 1337, // Chain ID of your Ganache network
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      accounts: [
        "7c3fc63514cb86af990525ff264cc6135dc2081b7796af9adaadba6920abb3b2",
      ],
    },
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
  },
  etherscan: {
    apiKey: "",
  },
  docgen: {},
};
