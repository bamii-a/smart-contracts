// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "./SimpleStorage.sol";


contract StorageFactory {

    // simpleStorageArray is a public variable
    // SimpleStorage[] is assigned array from SimpleStorage
    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorageContract ()public {
        // "simpleStorage" is a class created from SimpleStorage
        // "SimpleStorage" acts a memory for simpleStorage
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }

    function storageFactoryStore (uint256 _simpleStorageIndex, uint256 _simpleStorageNumber) public {
        // before interacting with a contract, you need the address and ABI
        // address
        // ABI - application binanry interface

        SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];
        simpleStorage.store(_simpleStorageNumber);
    }

    function storageFactoryGet (uint256 _simpleStorageIndex)public view returns (uint256){
        SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];
        return simpleStorage.retrieve();
    }
}