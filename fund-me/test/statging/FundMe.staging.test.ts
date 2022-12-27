import { BigNumber, Contract } from "ethers";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { assert, expect } from "chai";
import { FundMe, MockV3Aggregator } from "../../typechain-types";

const chainId = network.config.chainId;

chainId === 31337
  ? describe.skip
  : describe("FundMe", async () => {
      let fundMe: Contract | FundMe;
      let deployer: string;
      const sendValue = ethers.utils.parseEther("0.2").toString(); // "10000000000000000"

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });

      it("allows people to fund and withdraw", async () => {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();
        const endingBal = await fundMe.provider.getBalance(fundMe.address);
        assert.equal(endingBal.toString(), "0");
      });
    });
