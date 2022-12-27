import { ethers, getNamedAccounts } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("funding contract ...");
  const txResponse = await fundMe.fund({
    value: ethers.utils.parseEther("0.5"),
  });

  await txResponse.wait(1);
  console.log("funded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(`error: ${error}`);
    process.exit(1);
  });
