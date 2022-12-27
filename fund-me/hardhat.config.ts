import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "hardhat-deploy";
import "solidity-coverage";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-ethers";

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  // solidity: {
  //   compilers: [{ version: "0.8.8" }, { version: "0.8.0" }],
  // },
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      // blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545/", // localhost
      // accounts - hardhat places in already on local
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: "",
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    // get usd gas value from coinmarketcap api
    currency: "USD",
    // coinmarketcap,
    token: "ETH",
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
  mocha: {
    timeout: 10000000000000,
  },
};

export default config;
