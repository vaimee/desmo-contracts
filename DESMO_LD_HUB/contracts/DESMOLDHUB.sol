pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract desmo_ld_hub {
    // What is the parameters required by the hub?
    string[] tddStorager;

    constructor(string memory _greeting) {
        console.log("Deploying the desmo HUB");
    }

    function registerTDD(string tddID) {
        // Register the TDD on the data struct
        tddStorager.push(tddID);
    }

    function unregisterTDD() {
        // Remove the TDD of the data struct 

    }

    function getNewRequestID(){
        // Return the ID of the ramdoly selected TDDs subset
    }

    function getTDDByRequestID() {
        //  Returns the list of the TDDs subset

    }
}