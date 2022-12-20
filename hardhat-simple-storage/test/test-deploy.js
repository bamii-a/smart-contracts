const { ethers } = require("hardhat");
const { expert, assert, expect } = require("chai");

describe("SimpleStorage", function () {
  let simpleStorageFactory, simpleStorage;

  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it("should start with a fav Number of 0", async function () {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = 0;
    //asert or expect
    assert.equal(currentValue.toString(), expectedValue);
    // OR expect(currentValue.toString()).to.equal(expectedValue);
  });
  it("should update when we call store", async () => {
    const expectedValue = 7;
    const transactionResponse = await simpleStorage.store(expectedValue);
    await transactionResponse.wait(1);

    const currentValue = await simpleStorage.retrieve();
    assert.equal(currentValue.toString(), expectedValue);
  });
  // npx hardhat test --grep "should update when we call store" (search for any key words. eg 'store')

  it("should add people into an array", async () => {
    let expectedName = "Jane";
    let expectedFavNum = 2;
    const transactionResponse = await simpleStorage.addPeople(
      expectedName,
      expectedFavNum
    );
    await transactionResponse.wait(1);

    const { favNumber, name } = await simpleStorage.people(0);

    assert.equal(name, expectedName);
    assert.equal(favNumber, expectedFavNum);
  });
});
