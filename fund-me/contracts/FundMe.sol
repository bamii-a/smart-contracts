// get funds from users
// withdraw funds
// set a minimum funding value in usd

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "./PriceConverter.sol";

error NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    // adding constants to variable names saves gas
    uint256 public constant MINIMUM_USD = 5 * 1e18;

    // keep track of people (address) that fund the account
    address[] public funders;

    // mapping
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        // msg.sender (whoever deploys this contract)
        // immutable function can only be called one time in the constructor
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        // payable makes this function / address payable
        // set minimun fund amount in usd
        // 1. how do we send eth to this contract

        // msg.value access the value of what someone is sending
        // require(msg.value > 1e18) - requires the user to send at least 1eth

        // msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,

        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "Error message"
        ); //1e18 == 1 * 10 ** 18 == 10000000000000000000 (value on wei of 1eth)
        // reverting undo any action and send remaining gas back

        // msg.sender is whoever calls the fund function
        funders.push(msg.sender);
        // maps the sender to the value
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        // for loop
        // reset funders array and arrays to amount funded

        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex == funderIndex++
        ) {
            // returns the address of the index
            address funder = funders[funderIndex];
            // reset the balances of the mapping
            addressToAmountFunded[funder] = 0;
        }

        // reset array to make funders a blank array
        funders = new address[](0);

        // withdraw the funds
        // ways to send ether - transfer, send, call
        // CALL
        // call func returns two variables (success, dataReturned)
        (
            bool callSuccess, /* bytes memory dataReturned */

        ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "call failed");
    }

    modifier onlyOwner() {
        // _; - if this was above the code, it performs everything in the code before going down to the require func
        // require(msg.sender == i_owner, "sender is not owner");
        // another way of handling error (gas efficient)
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _; // represents doing the rest of the code
    }

    // what happens if someone sends this contract Eth without calling the fund function?

    // Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \
    //         yes  no
    //         /     \
    //    receive()?  fallback()
    //     /   \
    //   yes   no
    //  /        \
    //receive()  fallback()

    // if you're sending empty data, it will automatically hit the receive
    receive() external payable {
        fund();
    }

    // if you're sending NOT empty data, it will automatically hit the fallback
    fallback() external payable {
        fund();
    }
}

// Concepts we didn't cover yet (will cover in later sections)
// 1. Enum
// 2. Events
// 3. Try / Catch
// 4. Function Selector
// 5. abi.encode / decode
// 6. Hash with keccak256
// 7. Yul / Assembly

// TRANSFER
// msg.sender (type address)
// payable(msg.sender) (type payable address)
// payable(msg.sender).transfer(address(this).balance);

// SEND
// payable(msg.sender).send(address(this).balance) - if this were to fail,
// the contract will not revert the transaction, so we add a "bool"
// bool sendSuccess = payable(msg.sender).send(address(this).balance);
// safe guard to make sure the transaction reverts if it fails
// require(sendSuccess, "send failed");
