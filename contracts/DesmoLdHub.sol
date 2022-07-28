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

    // Size of the TDD lists to be selected
    uint256 internal tddSubsetSize = 4;

    // TDD counter
    uint256 internal tddCounter = 0; 

    // List of all registered addresses
    address[] private registeredAddresses;

    // TDD index counter
    uint256 private tddStoragerLength = 0;
        
    // TDDs storager
    mapping (address => TDD) private tddStorager;

    // Mapping to return the selected TDDs
    mapping (uint256 => string[]) private selectedTDDs;
    
    event TDDCreated (address indexed key, string url, bool disabled, uint256 score);
    event TDDDisabled (address indexed key, string url);
    event TDDEnabled (address indexed key, string url);
    event TDDRetrieval (address indexed key, string url, bool disabled, uint256 score);
    event RequestID (uint256 requestID);
    event TDDSubset (uint256 indexed key, string[] TDDSubset);

    constructor() { 
    }

    // Modifier to check if the address is already used in the tddStorager
    modifier addressAlreadyInPlace() {
        require(!verifyTDDStorager(), "Sender already stored a value.");
        _;
    }
    

    // Modifier to check that msg.address == TDD owner
    modifier onlyTDDOwner() {
        require(msg.sender == tddStorager[msg.sender].owner, "Not the TDD owner.");
        _;
    }   

    // Modifier to ensure the retrieval of a subset of TDDs > 0
    modifier notEmptyTDDStorager () {
        require(tddStoragerLength > 0, "No TDD available.");
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

    // Function to view the selected subset of TDDs
    function viewSelected(uint256 id)
    public  {
        string[] memory tddSubset = getTDDByRequestID(id);

        for (uint256 i = 0; i <= tddSubset.length - 1; i++) {
            string memory s = tddSubset[i];
            console.log("TDD at position '%d' is '%s'.", i, s); 
        }
        console.log("\n");
    }

    function getTDD()
    external
    notEmptyTDDStorager
    onlyTDDOwner 
    returns (TDD memory){
        emit TDDRetrieval(tddStorager[msg.sender].owner, tddStorager[msg.sender].url, tddStorager[msg.sender].disabled, tddStorager[msg.sender].score);
        return tddStorager[msg.sender];
    }

    function registerTDD(TDD memory tdd)
    external{
        if (verifyTDDStorager()){
            if (tddStorager[msg.sender].disabled == true){
                tddStorager[msg.sender] = tdd;
                emit TDDCreated(msg.sender, tdd.url, tdd.disabled, tdd.score);
            }else {
                revert("Disable the last one");
            }
        }else{
            tddStorager[msg.sender] = tdd;
            tddStoragerLength += 1;
            registeredAddresses.push(msg.sender);
            emit TDDCreated(msg.sender, tdd.url, tdd.disabled, tdd.score);
        }
    }
    
    function disableTDD()
    external{
        if(verifyTDDStorager()){
            tddStorager[msg.sender].disabled = true;
            emit TDDDisabled(msg.sender, tddStorager[msg.sender].url);
        } else {
            revert("Not the TDD owner.");
        }
    }

    function enableTDD()
    external{
        if (tddStorager[msg.sender].disabled == true){
            tddStorager[msg.sender].disabled = false;
            emit TDDEnabled(msg.sender, tddStorager[msg.sender].url);
        } else {
            revert("No TDD owner or No TDD to enable.");
        }
    }
    
    // Return the ID of the selected TDD subset
    function getNewRequestID() 
    external
    notEmptyTDDStorager
    returns (uint256) {    
        uint256 key = uint256(uint160(address(msg.sender)));
        // uint256 n = 10000000;
        // uint256 key = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, registeredAddresses.length))) % n;

        if(tddSubsetSize >  tddStoragerLength) {
            tddSubsetSize =  tddStoragerLength;
        }

        delete selectedTDDs[key];
        for (uint256 i = 0; i <= tddSubsetSize - 1; i++) {
            if (tddCounter >= tddStoragerLength) {
                tddCounter = 0;
            } 
            if (tddStorager[registeredAddresses[tddCounter]].disabled == false) {
                selectedTDDs[key].push(tddStorager[registeredAddresses[tddCounter]].url);
            }
            tddCounter += 1;
        }

        // console.log("This is the key '%s'.", key);
        emit RequestID(key);
        return key;
    }

    // Returns a TDD subset
    function getTDDByRequestID(uint256 key) 
    public
    returns (string[] memory) {
        emit TDDSubset(key, selectedTDDs[key]);
        return selectedTDDs[key];
    }

    // function updateScores(uint256 key, uint[] memory scores)
    // internal {
    //     selectedTDDs[key]
    //     for (uint256 i = 0; i <= scores.length - 1; i++){
    //     }
    // }
}
