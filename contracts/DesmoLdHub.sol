pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract DesmoLDHub {
    
    // TDD struct
    struct TDD {
        string url;
        address owner;
        bool disabled;
        uint256 score;
    }

    // Ammount of TDDs to be selected
    uint internal tddSubsetAmmount = 4;

    // TDD counter
    uint256 internal tddCounter = 0; 

    //register of all addresses registered; 
    address[] private addressRegisters;

    // TDD index counter
    uint256 private tddStoragerLenght = 0;
        
    // TDDs storager
    mapping(address => TDD) private tddStorager;

    //Maping to return the selected TDDs
    mapping (uint256 => string[]) private selectedTDDs;
    
    event TDDCreated(address indexed key, string url, bool disabled, uint256 score);
    event TDDDisabled(address indexed key, string url);
    event TDDEnabled(address indexed key, string url);
    event TDDRetrieval (address indexed key, string url, bool disabled, uint256 score);
    event RequestID (uint256 indexed requestID);
    event TDDSubset (string[] indexed TDDSubset);

    constructor() { 
    }

    // Modifier to check if address its already on the tddStorager
    modifier addressAlreadyInPlace() {
        require( !verifyTDDStorager(), "Sender already stored a value.");
        _;
    }
    

    // Modifier to check the msg.address == TDD owner
    modifier onlyTDDOwner() {
        require(msg.sender == tddStorager[msg.sender].owner, "Not the TDD owner.");
        _;
    }   

    // Modifier to ensure the retrival of a subset of TDDs > 0
    modifier notEmptyTDDStorager () {
        require( tddStoragerLenght > 0, "No TDD available. ");
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
        if (tddStorager[msg.sender].disabled == true){
            return true;
        }else {
            return false;
        }
    }

    // Function to view the selected subset of TDDs
    function viewSelected(uint256 id)
    public  {
        string[] memory tddSubset = getTDDByRequestID(id);

        for (uint256 i = 0; i <= tddSubset.length - 1; i++) {
            string memory s = tddSubset[i];
            console.log("TDD at position '%d' is '%s' ", i, s); 
        }
        console.log("\n");
    }

    function getTDD()
    external
    notEmptyTDDStorager
    onlyTDDOwner 
    returns (TDD memory){
        emit TDDRetrieval(tddStorager[msg.sender].owner, tddStorager[msg.sender].url, tddStorager[msg.sender].disabled, tddStorager[msg.sender].score);
        return  tddStorager[msg.sender];
    }

    function registerTDD(TDD memory tdd)
    external{
        if (verifyTDDStorager()){
            if (verifyDisabled()){
                tddStorager[msg.sender] = tdd;
                emit TDDCreated(msg.sender, tdd.url, tdd.disabled, tdd.score);
            }else {
                revert("Disable the last one");
            }
        }else{
            tddStorager[msg.sender] = tdd;
            addressRegisters.push(msg.sender);
             tddStoragerLenght+=1;
            emit TDDCreated(msg.sender, tdd.url, tdd.disabled, tdd.score);
        }
    }
    
    function disableTDD()
    external{
        if(verifyTDDStorager()){
            tddStorager[msg.sender].disabled = true;
            emit TDDDisabled(msg.sender, tddStorager[msg.sender].url);
        }else {
            revert("Not the TDD owner.");
        }
    }

    function enableTDD()
    external{
        if(verifyDisabled()){
            tddStorager[msg.sender].disabled = false;
            emit TDDEnabled(msg.sender, tddStorager[msg.sender].url);
        }else{
            revert("No TDD owner or No TDD to enable.");
        }
    }
    
    // Return the ID of the selected TDDs subset
    function getNewRequestID() 
    external
    notEmptyTDDStorager
    returns (uint256) {    
        uint256 key = uint256(uint160(address(msg.sender)));
        // uint256 n = 10000000;
        // uint256 key = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, addressRegisters.length))) % n;

        if(tddSubsetAmmount >  tddStoragerLenght) {
            tddSubsetAmmount =  tddStoragerLenght;
        }

        delete selectedTDDs[key];
        for (uint256 i = 0; i <= tddSubsetAmmount - 1; i++) {
            if (tddCounter >= tddStoragerLenght) {
                tddCounter = 0;
            } 
            if (tddStorager[addressRegisters[tddCounter]].disabled == false) {
                selectedTDDs[key].push(tddStorager[addressRegisters[tddCounter]].url);
            }
            tddCounter += 1;
        }

        //console.log("This is the key '%s' \n", key);
        emit RequestID(key);
        return key;
    }

    // Returns a TDD subset
    function getTDDByRequestID(uint256 key) 
    public
    returns (string[] memory) {
        emit TDDSubset(selectedTDDs[key]);
        return selectedTDDs[key];
    }

    // function updateScores(uint256 key, uint[] memory scores)
    // internal {
    //     selectedTDDs[key]
    //     for (uint256 i = 0; i <= scores.length - 1; i++){
    //     }
    // }
}