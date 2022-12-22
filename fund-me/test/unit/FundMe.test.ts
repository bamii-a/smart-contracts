// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { assert, expect } from "chai";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

//

describe("fundMe", async () => {
  // 1. deploy funcMe contract
  let fundMe: Contract | FundMe;
  let deployer: string;
  let mockV3Aggregator: Contract | MockV3Aggregator;
  const sendValue = ethers.utils.parseEther("1").toString(); // "10000000000000000"
  //   const sendValue = "10000000000000000000";

  beforeEach(async () => {
    /* Getting the accounts that are in the hardhat config network */
    // const accounts: Promise<SignerWithAddress[]> = ethers.getSigners();
    // tells which accounts is connected to fundme.(hardhat.config)
    deployer = (await getNamedAccounts()).deployer;
    // const { deployer }: { [name: string]: string } = await getNamedAccounts();
    // deploy FundMe using hardhat-deploy()
    await deployments.fixture(["all"]);
    // getContract gets the most recently deployed FundMe contract
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  // group test based of of different function
  describe("constructor", async () => {
    /* Checking if the aggregator address from chainlink is set correctly. */
    it("sets the aggregator addresses", async () => {
      const repsonse = await fundMe.priceFeed();
      assert.equal(repsonse, mockV3Aggregator.address);
    });
  });

  describe("fund", async () => {
    it("fails if you do not send enough ETH", async () => {
      /* Checking if the `fundMe.fund()` function is reverted with the error message "You need to spend
      more ETH". */
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH"
      );
    });

    it("updates the amounts funded data structure", async () => {
      /* Calling the `fund` function in the `FundMe` contract and sending the `sendValue` amount of
      ether. */
      await fundMe.fund({ value: sendValue });
      /* Calling the `addressToAmountFunded` function and extractring the sent eth value in the `FundMe` contract. */
      const responseEthValue = await fundMe.addressToAmountFunded(deployer);
      assert.equal(responseEthValue.toString(), sendValue.toString());
    });
  });

  //   describe("first", () => {
  //     it("", async () => {});
  //   });
});
