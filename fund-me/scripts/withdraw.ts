import { ethers, getNamedAccounts } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("funding...");
  const txResponse = await fundMe.withdraw();
  await txResponse.wait(1);
  console.log("withdrawn");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(`error: ${error}`);
    process.exit(1);
  });
