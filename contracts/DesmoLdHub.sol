pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract desmo_ld_hub {
    
    // TDD struct
    struct TDD {
        string url;
        address owner;
    }
    
    // TDDs storager
    //string[] internal tddStorage;
    mapping(address => TDD) private tddStorager;

    //Maping to return the selected TDDs
    mapping (uint256 => string[]) private selectedTDDs;
    
    //register of all addresses registered; 
    address[] private addressRegisters;

    // TDD index counter
    uint256 private tddStoragerCounter = 0;

    // Ammount of TDDs to be selected
    uint internal quant = 3;
    
    constructor(){ 
    }

    
    function verify ()
    internal
    view 
    returns (bool) {
        if (bytes(tddStorager[msg.sender].url).length > 0){
            return true;
        }else {
            return false;
        }
    }

    // Modifier to check if address is already on the tddStorager
    modifier addressAlreadyInPlace() {
        require( !verify(), "Sender already stored a value.");
        _;
    }
    
    // Modifier to check the msg.address == TDD owner
    modifier onlyTDDOwner() {
        require(msg.sender == tddStorager[msg.sender].owner, "Not the TDD owner");
        _;
    }   
    
    // Modifier to ensure the retrival of a subset of TDDs > 0
    modifier notEmptyTDDStorager () {
        require(tddStoragerCounter > 0, "No TDD available. ");
        _;
    }

    // Function to view the selected subset of TDDs
    function viewSelected(uint256 id)
    public 
    view {
        string[] memory tddSubset = getTDDByRequestID(id);

        for (uint256 i = 0; i <= tddSubset.length - 1; i++) {
            string memory s = tddSubset[i];
            console.log("TDD at position '%d' is '%s' ", i, s);
        }
    }

    //Register the TDD on the data struct
    function registerTDD(TDD memory tdd)
    external
    addressAlreadyInPlace
    returns (uint256 index) {
        //tddStorage.push(tddID);
        tddStorager[msg.sender] = tdd;
        addressRegisters.push(msg.sender);
        tddStoragerCounter+=1;

        //console.log("TDD Index: %d", tddStoragerCounter-1);
        //console.log("TDD Storager counter: %d", tddStoragerCounter);
        
        return tddStoragerCounter-1;
    }
    
    // Function to remove the address from the addressRegisters
    function remove(uint256 index)
    internal {
        addressRegisters[index] = addressRegisters[tddStoragerCounter - 1];
        addressRegisters.pop();
        tddStoragerCounter-=1;
    }

    //Remove the TDD of the data struct 
    function unregisterTDD(uint256 index)
    external
    onlyTDDOwner {    
        delete tddStorager[msg.sender];
        remove(index);
        //console.log("TDDs counter: '%d' ", tddStoragerCounter);   
    }
    
    // Funtion to generate ramdon number inside the interval 0 - tddStoragerCounter
    function randomNumber(uint256 n) 
    internal
    view
    returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, n))) % tddStoragerCounter;
    }

    // Return the ID of the ramdoly selected TDDs subset
    // can "payable" in the future
    // can charge for more TDDs
    // can charge for unique TDDs
    function getNewRequestID() 
    external
    notEmptyTDDStorager
    returns (uint256) {    
        uint256 key = uint256(uint160(address(msg.sender)));

        if(quant > tddStoragerCounter){
            quant = tddStoragerCounter;
        }
        console.log(quant);
        
        for (uint256 i = 0; i <= quant - 1; i++){
            uint256 index = randomNumber(i);
            selectedTDDs[key].push(tddStorager[addressRegisters[index]].url);
        }

        //console.log("This is the key '%s'", key);
        return key;
    }

    // Returns the list of the TDDs subset
    function getTDDByRequestID(uint256 key) 
    public
    view
    returns (string[] memory) {
        return selectedTDDs[key];
    }
}