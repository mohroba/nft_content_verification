require("hardhat-preprocessor");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-docgen");
// Import OpenZeppelin plugin
require("hardhat-contract-sizer");
require("@openzeppelin/hardhat-upgrades");
require("dotenv/config");

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
      url: "https://api.etherscan.io/api",
    },
    ganache: {
      url: "http://localhost:7545", // Ganache's default RPC server URL
      chainId: 1337, // Chain ID of your Ganache network
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      accounts: [
        process.env.MUMBAI_ACCOUNT_PRIVATE_KEY, // Account Private Key
      ],
    },
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  docgen: {},
};
