// solidity version
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract SimpleStorage {

    // public opens up visibility and allow anyone to call the favNumber function

    // type // visibility // name
    // uint256 public favNumber;
    uint256 favNumber;
    
    mapping (string => uint256) public nameToFavNumber;

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

    function retrieve() public view returns (uint256){
        return favNumber;
    }

    function addPeople (string memory _name, uint256 _favNumber) public {
        people.push(People(_favNumber, _name));
        nameToFavNumber[_name] = _favNumber;
    }

     
}
// 0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8