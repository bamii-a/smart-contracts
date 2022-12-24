// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
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
    /* `fundMe` is a variable that is assigned to the `FundMe` contract that is deployed on the
    hardhat network. */
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

    it("add funder to array of funders", async () => {
      /* Calling the `fund` function in the `FundMe` contract and sending the `sendValue` amount of
      ether. */
      await fundMe.fund({ value: sendValue });
      /* `funders` is a getter function that returns an array of addresses. */
      const funders = await fundMe.funders(0);
      assert.equal(funders, deployer);
    });
  });

  describe("withdraw", () => {
    // before we run a test, we need some eth in the wallet
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue });
    });
    //
    it("can withdraw eth from a single founder", async () => {
      // Arrange
      /* Getting the balance of the fundMe contract. */
      /* `fundMe.provider` is the ethers provider that is connected to the hardhat network.
      `fundMe.provider.getBalance(fundMe.address)` is a promise that returns the balance of the
      fundMe
      contract. */
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );
      // Act
      /* Calling the `withdraw` function in the `FundMe` contract. */
      const txResponse = await fundMe.withdraw();
      /* `txResponse` is a transaction object that contains the transaction hash.
      `txResponse.wait(1)` is a promise that waits for the transaction to be mined.
      `txReceipt` is the transaction receipt that contains the transaction hash, the block number,
      the gas used, the logs, etc. */
      const txReceipt = await txResponse.wait(1);
      /* `fundMe.provider` is the ethers provider that is connected to the hardhat network.
      `fundMe.provider.getBalance(fundMe.address)` is a promise that returns the balance of the
      fundMe
      contract. */
      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      // calculate gas cost
      const { gasUsed, effectiveGasPrice } = txReceipt;
      /* `gasUsed` is the amount of gas used in the transaction. `effectiveGasPrice` is the gas price
      that was used in the transaction. `gasCost` is the amount of ether that was spent on the
      transaction. */
      const gasCost = gasUsed.mul(effectiveGasPrice);
      /* `fundMe.provider` is the ethers provider that is connected to the hardhat network.
      `fundMe.provider.getBalance(deployer)` is a promise that returns the balance of the deployer
      account. */
      const endingDeployerBal = await fundMe.provider.getBalance(deployer);

      // Assert
      /* Checking if the balance of the fundMe contract is 0. */
      assert.equal(endingFundMeBalance.toString(), "0");
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBal.add(gasCost).toString()
      );
    });
  });
});
