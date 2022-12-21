interface networkConfigProps {
  [key: string]: {
    name: string;
    ethUsdPriceFeed: string;
  };
}

export const networkConfig: networkConfigProps = {
  // goerli USD data
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0xd4a33860578de61dbabdc8bfdb98fd742fa7028e",
  },
  // hardhat
};

export const DECIMALS = 8;
export const INITIAL_ANSWER = 200000000;
