pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract desmo_ld_hub {
    
    // TDDs storager
    string[] internal tddStorage;
    
    // Ammount of TDDs to be selected
    uint internal quant = 3;
    
    //Maaping to return the selected TDDs
    mapping (uint256 => string[]) private selectedTDDs;
    
    constructor() {
        console.log("Deploying the desmo HUB");
    }

    function viewStorage()
    public
    returns (string[] memory) {
        for (uint256 i = 0; i <= tddStorage.length - 1; i++) {
            string memory s = tddStorage[i];
            console.log("TDD at position '%d' is '%s' ", i, s);
        }
    }

    function viewSelected()
    public
    view {

    }

    // Register the TDD on the data struct
    function registerTDD(string memory tddID) 
    external 
    returns (bool flag){
        tddStorage.push(tddID);
        return true;
    }
    
    function remove(uint256 index)
    internal {
        tddStorage[index] = tddStorage[tddStorage.length - 1];
        tddStorage.pop();
    }

    //Remove the TDD of the data struct 
    function unregisterTDD(string memory tddID) 
    external {    
        // We must verify the ownership of the TDD
        // find the index of the TDDid and then remove
        for (uint256 i = 0; i <= tddStorage.length - 1; i++) {
            string memory s = tddStorage[i];
            
            if(keccak256(bytes(s)) == keccak256(bytes(tddID))){
                remove(i);
                console.log("TDD: '%s' removed and is '%s'", tddID, s);
            }
        }
    }
    
    function randomNumber(uint256 n) 
    internal 
    returns (uint) {
        uint randomnumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, n))) % tddStorage.length;
        return randomnumber;
    }

    // Return the ID of the ramdoly selected TDDs subset
    // should be "payable" in the future
    function getNewRequestID() 
    external 
    returns (uint256) {    
        uint256 key = uint256(uint160(address(msg.sender)));

        for (uint256 i = 0; i <= quant; i++){
            uint256 index = randomNumber(i);
            selectedTDDs[key].push(tddStorage[index]);
        }

        console.log("This is the key '%s'", key);
        return key;
    }

    // Returns the list of the TDDs subset
    function getTDDByRequestID(uint256 key) 
    external
    view
    returns (string[] memory) {
        return selectedTDDs[key];
    }
}