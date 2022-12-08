// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;
import "./SimpleStorage.sol";

// ExtraStporage inherits all functionalities of SimpleStorage
contract ExtraStorage is SimpleStorage {
    // override
    // virtual overide

    function store(uint256 _favoriteNumber) public override {
        // favNumber comes from the store func in SimpleStorage
        favNumber = _favoriteNumber + 5;
    }

}


