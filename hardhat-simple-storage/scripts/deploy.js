// imports
const { ethers } = require("hardhat");

// main function
async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("deploying contract...");

  const simpleStorage = await simpleStorageFactory.deploy();
  await simpleStorage.deployed();
  // console.log(`simpleStorageFactory ${JSON.stringify(simpleStorageFactory)}`);

  // interacting with your contract
  const currentValue = await simpleStorage.retrieve();
  console.log(`cV: ${currentValue}`);

  // update transaction
  const txResponse = await simpleStorage.store(8);
  // waiting for block confirmation
  await txResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`uV: ${updatedValue}`);
}

// call function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(`error: ${error}`);
    process.exit(1);
  });
