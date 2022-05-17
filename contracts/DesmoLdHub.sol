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

    mapping (address => TDD) private disabledTDDs;

    // TDD index counter
    uint256 private tddStoragerCounter = 0;

    // Ammount of TDDs to be selected
    uint internal quant = 3;
    
    // TDD counter
    uint256 internal counter = 0; 


    constructor(){ 
    }

    

    // Modifier to check if address is already on the tddStorager
    modifier addressAlreadyInPlace() {
        require( !verifyTDDStorager(), "Sender already stored a value.");
        _;
    }
    
    // Modifier to check the msg.address == TDD owner
    modifier onlyTDDOwner() {
        require(msg.sender == tddStorager[msg.sender].owner, "Not the TDD owner");
        _;
    }   
    
    // modifier to check the sender address == TDD owner on dibleds ones
    modifier onlyDisabledTDDOwner() {
        require(msg.sender == disabledTDDs[msg.sender].owner, "Not the TDD owner");
        _;
    }

    // Modifier to ensure the retrival of a subset of TDDs > 0
    modifier notEmptyTDDStorager () {
        require(tddStoragerCounter > 0, "No TDD available. ");
        _;
    }


    function verifyTDDStorager ()
    internal
    view 
    returns (bool) {
        if (bytes(tddStorager[msg.sender].url).length > 0){
            return true;
        }else {
            return false;
        }
    }
    
    function verifyDisabled ()
    internal
    view 
    returns (bool) {
        if (bytes(disabledTDDs[msg.sender].url).length > 0){
            //console.log("TDD disabled is '%s' ", disabledTDDs[msg.sender].url);
            return true;
        }else {
            return false;
        }
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
        console.log("\n");
    }

    //Register the TDD on the data struct
    function registerTDD(TDD memory tdd)
    external
    addressAlreadyInPlace
    returns (bool) {
        //tddStorage.push(tddID);
        if (verifyDisabled()){
            delete disabledTDDs[msg.sender];
        }
        
        tddStorager[msg.sender] = tdd;
        addressRegisters.push(msg.sender);
        tddStoragerCounter+=1;

        return true;
    }
    
    
    function disableTDD(bool flag)
    external
    returns (uint){
        if (flag) {
            if(verifyTDDStorager()){
                disabledTDDs[msg.sender] = tddStorager[msg.sender];
                delete tddStorager[msg.sender];
                tddStoragerCounter -= 1;
                return 1;
            }else {
                revert("Not the TDD owner.");
            }

        } else {
            if(verifyDisabled()){
                tddStorager[msg.sender] = disabledTDDs[msg.sender];
                delete disabledTDDs[msg.sender];
                tddStoragerCounter += 1;
                return 1;
            }else{
                revert("No TDD owner or No TDD to enable.");
            }
        }
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

        if(quant > tddStoragerCounter) {
            quant = tddStoragerCounter;
        }

        //console.log("Amoount of TDDs to be selected:  %d", quant);
        //console.log("TDDs index to select:  %d", counter);
        
        delete selectedTDDs[key];

        for (uint256 i = 0; i <= quant - 1; i++){
            //uint256 index = randomNumber(i);
            if(counter == tddStoragerCounter){
                counter = 0;
            }
            
            selectedTDDs[key].push(tddStorager[addressRegisters[counter]].url);
            counter+=1;
        }

        //console.log("This is the key '%s' \n", key);
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