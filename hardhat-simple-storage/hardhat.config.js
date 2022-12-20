require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
// insert blockNumber task
require("./task/block-number");
require("hardhat-gas-reporter");
require("solidity-coverage");

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
    localhost: {
      url: "http://127.0.0.1:8545/", // localhost
      // accounts - hardhat places in already on local
      chainId: 31337,
    },
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    // get usd gas value from coinmarketcap api
    currency: "USD",
    // coinmarketcap,
  },
};
