// get funds from users
// withdraw funds
// set a minimum funding value in usd

// SPDX-License-Identifier: MIT
//pragma
pragma solidity ^0.8.16;

// imports
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";
import "hardhat/console.sol";

// error
error FundMe__NotOwner();

// interfaces

// libraries

//contract
/**
 * @title A contract for funding
 * @author Bami
 * @notice demo sample funding contract
 * @dev
 */

//** every contract has a storage ** //
// variables inside a function do not take up storage
// they only exist in the duration of the function

contract FundMe {
    // ORDER LAYOUT
    // Type Declarations
    // State Variables
    // Events
    // Modifiers
    // Functions

    // ORDER OF FUNCTIONS
    // constructor
    // receive function (if exists)
    // fallback function (if exists)
    // external
    // public
    // internal
    // private

    // Type Declarations
    using PriceConverter for uint256;

    // State Variables
    // mapping address to amount
    // appending an "s_" to a var means it's stored in storage
    mapping(address => uint256) private s_addressToAmountFunded;

    // adding constants to variable names saves gas
    // constant vars are not in storage, (CAPS lock is normal convention)
    uint256 public constant MINIMUM_USD = 1 * 1e18;

    // keep track of people (address) that fund the account
    address[] private s_funders;

    // appending an "i_" to a var means it is immutable (does not change)
    address private immutable i_owner;
    AggregatorV3Interface private s_priceFeed;

    modifier onlyOwner() {
        // _; - if this was above the code, it performs everything in the code before going down to the require func
        // require(msg.sender == i_owner, "sender is not owner");
        // another way of handling error (gas efficient)
        if (msg.sender != i_owner) revert FundMe__NotOwner();

        _; // represents doing the rest of the code
    }

    constructor(address priceFeedAddress) {
        // msg.sender (whoever deploys this contract)
        // immutable function can only be called one time in the constructor
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
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

    /**
     * @notice THIS FUNC FUNDS THIS CONTRACT
     * @dev ---
     */

    function fund() public payable {
        // payable makes this function / address payable
        // set minimun fund amount in usd
        // 1. how do we send eth to this contract

        // msg.value access the value of what someone is sending
        // require(msg.value > 1e18) - requires the user to send at least 1eth

        // msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
        // console.log("msg.value", msg.value);

        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "You need to spend more ETH"
        ); //1e18 == 1 * 10 ** 18 == 10000000000000000000 (value on wei of 1eth)
        // reverting undo any action and send remaining gas back

        // msg.sender is whoever calls the fund function
        s_funders.push(msg.sender);
        // maps the sender to the value
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        // for loop
        // reset s_funders array and arrays to amount funded
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            // returns the address of the index
            address funder = s_funders[funderIndex];
            // reset the balances of the mapping
            s_addressToAmountFunded[funder] = 0;
        }

        // reset array to make s_funders a blank array
        s_funders = new address[](0);

        // withdraw the funds
        // ways to send ether - transfer, send, call
        // CALL
        // call func returns two variables (success, dataReturned)
        (
            bool callSuccess, /* bytes memory dataReturned */

        ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "call failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        // READ FROM MEMORY INSTEAD OF STORAGE TO OPTIMIZE GAS
        // save storage var in memory var to read and write with cheaper gas fees
        address[] memory funders = s_funders;
        for (
            uint256 fundersIndex = 0;
            fundersIndex < funders.length;
            fundersIndex++
        ) {
            address funder = funders[fundersIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    // SOLIDITY CHAINLINK STYLE GUIDE
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunders(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
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
