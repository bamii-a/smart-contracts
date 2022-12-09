// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// libraries can't send eth nor declare state vriable
library PriceConverter {

        //. nothing is beein modified so we use "view" 
    function getPrice () internal view returns (uint256){
        // we need ABI and Address to get the data
        // go to chain link data feeds to get the contract address
        // Address - 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
 
        // priceFeed is a variable of type AggregatorV3Interface
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        (/* uint80 roundId*/, int price, /* uint startedAt*/, /* uint timeStamp*/, /*uint80 answeredInRound*/) = priceFeed.latestRoundData();

        // Eth in USD
        // uint256(price * 1e10) converts the type from int to uint256 (type casting)
        return uint256(price * 1e10); // 1**10
    }

    function getVersion() internal view returns(uint256) {
        // priceFeed is a variable of type AggregatorV3Interface
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        return priceFeed.version();
    }

    function getConversionRate (uint256 ethAmount) internal view returns(uint256) {
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}