pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract desmo_ld_hub {
    
    // TDD struct
    struct TDD {
        string url;
    }
    
    // TDDs storager
    //string[] internal tddStorage;
    mapping(address =>TDD) private tddStorager;

    //register of all addresses registered; 
    address[] private addressRegisters;

    // TDD index counter
    uint256 private tddStoragerCounter = 0;

    // 
    mapping(address => uint256) private addressRef;
    
    // Ammount of TDDs to be selected
    uint internal quant = 3;
    
    //Maping to return the selected TDDs
    mapping (uint256 => string[]) private selectedTDDs;
    
    
    constructor() {
        console.log("Deploying the desmo HUB");
    }

    //TODO create modifiers to check the address
    modifier onlyOwner() {
        require(addressRegisters[addressRef[msg.sender]-1] == msg.sender);
        _;
    } 

    // //TODO create a modifier to check if address is already on the tddStorager
    // modifier addressAlreadyInPlace() {
    //     require(addressRef[msg.sender], "Sender already stored a value.");
    //     _;
    // }


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
    //addressAlreadyInPlace
    external
    returns (bool flag){
        //tddStorage.push(tddID);
        tddStorager[msg.sender] = tdd;
        addressRegisters.push(msg.sender);
        tddStoragerCounter+=1;
        addressRef[msg.sender] = tddStoragerCounter;

        console.log(tddStoragerCounter);
        
        return true;
    }
    
    function remove(uint256 index)
    internal {
        addressRegisters[index] = addressRegisters[tddStoragerCounter - 1];
        addressRegisters.pop();
        tddStoragerCounter-=1;
    }

    //Remove the TDD of the data struct 
    function unregisterTDD()
    // onlyOwner
    external {    
        //TODO We must verify the ownership of the TDD
        delete tddStorager[msg.sender];
        delete addressRef[msg.sender];
        remove(addressRef[msg.sender]);
        console.log(tddStoragerCounter);
        

        // find the index of the TDDid and then remove
        // for (uint256 i = 0; i <= tddStorage.length - 1; i++) {
        //     string memory s = tddStorage[i];
            
        //     if(keccak256(bytes(s)) == keccak256(bytes(tddID))){
        //         remove(i);
        //         console.log("TDD: '%s' removed and is '%s'", tddID, s);
        //     }
        // }
        
    }
    
    function randomNumber(uint256 n) 
    internal
    view
    returns (uint) {
        uint randomNumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, n))) %tddStoragerCounter;
        return randomNumber;
    }

    // Return the ID of the ramdoly selected TDDs subset
    // should be "payable" in the future
    function getNewRequestID() 
    external 
    returns (uint256) {    
        uint256 key = uint256(uint160(address(msg.sender)));

        for (uint256 i = 0; i <= quant; i++){
            uint256 index = randomNumber(i);
            selectedTDDs[key].push(tddStorager[addressRegisters[index]].url);
        }

        console.log("This is the key '%s'", key);
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