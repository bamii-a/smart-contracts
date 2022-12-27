import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { networkConfig } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  //code
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  // deployer = account deploying the contract
  const { deployer } = await getNamedAccounts();

  const chainId: number = network.config.chainId!;

  // get PRICE FEED using chainId (different chains have different contract)
  // const ethUsdPriceFeedAddress: string =
  //   networkConfig[chainId].ethUsdPriceFeed!;
  let ethUsdPriceFeedAddress: string;

  // dynamically getting the chainId and contract address of eth/usd from chainlink source feed
  if (chainId === 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed!;
  }

  const args = [ethUsdPriceFeedAddress];

  // when using localhost network or hardhat network, we want to use a MOCK
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, // price feed address
    log: true,
    waitConfirmations: 1,
  });
  log(`FundMe deployed at ${fundMe.address}`);
  // console.log("fundMe", fundMe);
  // if (chainId !== 31337 && process.env.ETHERSCAN_KEY) {
  //   await verify(fundMe.address, args);
  // }
  log("/------------------------------------------/");
};

export default deploy;
deploy.tags = ["all", "fundme"];
