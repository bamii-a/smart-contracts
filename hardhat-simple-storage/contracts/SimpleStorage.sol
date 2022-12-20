// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract SimpleStorage {
    // public opens up visibility and allow anyone to call the favNumber function

    // type // visibility // name
    // uint256 public favNumber;
    uint256 favNumber;

    mapping(string => uint256) public nameToFavNumber;

    struct People {
        uint256 favNumber;
        string name;
    }

    // assinging People to an array
    // People is the struct /Type
    // people is the array
    People[] public people;

    function store(uint256 newNumber) public virtual {
        favNumber = newNumber;
    }

    function retrieve() public view returns (uint256) {
        return favNumber;
    }

    function addPeople(string memory _name, uint256 _favNumber) public {
        people.push(People(_favNumber, _name));
        nameToFavNumber[_name] = _favNumber;
    }
}
// 0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8

// ********
// pragma solidity ^0.8.9;

// // Uncomment this line to use console.log
// // import "hardhat/console.sol";

// contract Lock {
//     uint public unlockTime;
//     address payable public owner;

//     event Withdrawal(uint amount, uint when);

//     constructor(uint _unlockTime) payable {
//         require(
//             block.timestamp < _unlockTime,
//             "Unlock time should be in the future"
//         );

//         unlockTime = _unlockTime;
//         owner = payable(msg.sender);
//     }

//     function withdraw() public {
//         // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
//         // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

//         require(block.timestamp >= unlockTime, "You can't withdraw yet");
//         require(msg.sender == owner, "You aren't the owner");

//         emit Withdrawal(address(this).balance, block.timestamp);

//         owner.transfer(address(this).balance);
//     }
// }
