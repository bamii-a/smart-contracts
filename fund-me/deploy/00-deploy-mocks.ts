import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
// import { networkConfig } from "../helper-hardhat-config";
import { DECIMALS, INITIAL_ANSWER } from "../helper-hardhat-config";

const deployMock: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;

  /* Destructuring the `deployments` object. */
  const { deploy, log } = deployments;

  /* Getting the deployer account from the hardhat.config.ts file. */
  const { deployer } = await getNamedAccounts();

  /* Getting the chainId from hre. */
  const chainId: number = network.config.chainId!;

  // do not deploy to a test net
  // default network.namer = Hardhat
  //   if (developmentChains.includes(network.name)) {
  if (chainId === 31337) {
    log("local network detected, deploying mocks");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("Mocks deployed");
    log("/------------------------------/");
  }
};

export default deployMock;
deployMock.tags = ["all", "mocks"];
