pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract desmo_ld_hub {
    // What is the parameters required by the hub?
    string[] private tddStorage;
    mapping (string => string[]) private selectedTDDs;

    constructor() {
        console.log("Deploying the desmo HUB");
    }

    // Register the TDD on the data struct
    function registerTDD(string memory tddID) 
    external {
        tddStorage.push(tddID);
        console.log("TDD: '%s' stored", tddID);
    }
    
    function remove(uint256 index)
    internal {
        tddStorage[index] = tddStorage[tddStorage.length - 1];
        tddStorage.pop();
    }

    // Remove the TDD of the data struct 
    function unregisterTDD(string memory tddID) 
    external {    
        // We must verify the ownership of the TDD
        // find the index of the TDDid and then remove
        for (uint256 i = 0; i < tddStorage.length - 1; i++) {
            if(keccak256(bytes(tddStorage[i])) == keccak256(bytes(tddID))){
                remove(i);
                console.log("TDD: '%s' removed", tddID);
            }else{
                console.log("TDD: '%s' not found", tddID);
            }
        }
    }
    
    // TODO Return the ID of the ramdoly selected TDDs subset
    // should be "payable" in the future
    // should have an adaptative subset size accornding tho the ammont payed
    function getNewRequestID() 
    external 
    returns (uint) {    
        // create algorithm to scam the array of tdds randomly
        // get the  key (how?)
    }

    //  Returns the list of the TDDs subset
    function getTDDByRequestID(string memory key) 
    external
    view
    returns (string[] memory) {
        return selectedTDDs[key];
    }
}