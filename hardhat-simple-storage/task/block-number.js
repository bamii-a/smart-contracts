const { task } = require("hardhat/config");

task("block-number", "print current block numnber").setAction(
  async (taskArgs, hre) => {
    // hre (hardhat runtime env)
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`current block number; ${blockNumber}`);
  }
);

module.exports = {};
