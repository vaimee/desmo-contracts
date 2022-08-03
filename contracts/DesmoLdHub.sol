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
    uint256 internal tddSelectionSize = 4;
    uint256 internal tddCounter = 0; 
    address[] private registeredAddresses;
    uint256 private tddStoragerLength = 0;
        
    // TDDs storager
    mapping (address => TDD) private tddStorager;
    mapping (string => TDD) private tddBucket;
    mapping (bytes => string[]) private selectedTDDs;
    mapping (bytes => bytes) private scoreStorager;

    event TDDCreated (address indexed key, string url, bool disabled, uint256 score);
    event TDDDisabled (address indexed key, string url);
    event TDDEnabled (address indexed key, string url);
    event TDDRetrieval (address indexed key, string url, bool disabled, uint256 score);
    event RequestID (bytes requestID);
    event TDDSubset (bytes indexed key, string[] TDDSubset);

    constructor() { 
    }

    // Modifier to check if the address is already used in the tddStorager
    modifier addressAlreadyInPlace() {
        require(!tddAlreadyInStorager(), "Sender already stored a value.");
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

    function tddAlreadyInStorager ()
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
    function viewSelected(bytes memory id)
    public  {
        string[] memory tddSubset = getTDDByRequestID(id);

        for (uint256 i = 0; i <= tddSubset.length - 1; i++) {
            string memory tdd = tddSubset[i];
            console.log("TDD at position '%d' is '%s'.", i, tdd); 
            console.log("The Score of the TDD at position '%d' is '%d'.", i, tddStorager[tddBucket[tdd].owner].score); 
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
        if (tddAlreadyInStorager()){
            if (tddStorager[msg.sender].disabled == true){
                tddStorager[msg.sender] = tdd;
                tddBucket[tdd.url] = tdd;
                emit TDDCreated(msg.sender, tdd.url, tdd.disabled, tdd.score);
            } else {
                revert("Disable the last one");
            }
        }else{
            tddStorager[msg.sender] = tdd;
            tddStoragerLength += 1;
            registeredAddresses.push(msg.sender);
            tddBucket[tdd.url] = tdd;
            emit TDDCreated(msg.sender, tdd.url, tdd.disabled, tdd.score);
        }
    }

    function registerTDDExplicitParam(string memory url)
    external{
        TDD memory tdd = TDD(url, msg.sender, false, 0);
        if (tddAlreadyInStorager()){
            if (tddStorager[msg.sender].disabled == true){
                tddStorager[msg.sender] = tdd;
                tddBucket[tdd.url] = tdd;
                emit TDDCreated(msg.sender, tdd.url, tdd.disabled, tdd.score);
            } else {
                revert("Disable the last one");
            }
        }else{
            tddStorager[msg.sender] = tdd;
            tddStoragerLength += 1;
            registeredAddresses.push(msg.sender);
            tddBucket[tdd.url] = tdd;
            emit TDDCreated(msg.sender, tdd.url, tdd.disabled, tdd.score);
        }
    }
    
    function disableTDD()
    external{
        if(tddAlreadyInStorager()){
            tddStorager[msg.sender].disabled = true;
            delete tddBucket[tddStorager[msg.sender].url];
            emit TDDDisabled(msg.sender, tddStorager[msg.sender].url);
        } else {
            revert("Not the TDD owner.");
        }
    }

    function enableTDD()
    external{
        if (tddStorager[msg.sender].disabled == true){
            tddStorager[msg.sender].disabled = false;
            tddBucket[tddStorager[msg.sender].url] = tddStorager[msg.sender];
            emit TDDEnabled(msg.sender, tddStorager[msg.sender].url);
        } else {
            revert("No TDD owner or No TDD to enable.");
        }
    }
    
    // Return the ID of the selected TDD subset
    function getNewRequestID() 
    external
    notEmptyTDDStorager
    returns (bytes memory) {    
        bytes memory key = abi.encodePacked(keccak256(abi.encodePacked(uint160(address(msg.sender)))));

        if(tddSelectionSize >  tddStoragerLength) {
            tddSelectionSize =  tddStoragerLength;
        }

        delete selectedTDDs[key];

        for (uint256 i = 0; i <= tddSelectionSize - 1; i++) {
            if (tddCounter >= tddStoragerLength) {
                tddCounter = 0;
            } 
            if (tddStorager[registeredAddresses[tddCounter]].disabled == false) {
                selectedTDDs[key].push(tddStorager[registeredAddresses[tddCounter]].url);
            }
            tddCounter += 1;
        }

        //console.logBytes(key);
        emit RequestID(key);
        return key;
    }

    // Returns a TDD subset
    function getTDDByRequestID(bytes memory requestID) 
    public
    returns (string[] memory) {
        emit TDDSubset(requestID, selectedTDDs[requestID]);
        return selectedTDDs[requestID];
    }
    
    function getTDDByRequestIDWithView(bytes memory requestID) 
    public
    view
    returns (string[] memory) {
        return selectedTDDs[requestID];
    }

    function updateScores(bytes memory requestID, bytes memory scores)
    public {
        string[] memory tdds = selectedTDDs[requestID];
        scoreStorager[requestID] = scores;

        for (uint256 i = 0; i <= tdds.length - 1; i++){
            TDD storage tdd = tddStorager[tddBucket[tdds[i]].owner];
            tdd.score = tdd.score + uint8(bytes1(scores[i]));
        }
    }

    function getTDDStoragerLenght()
    public
    view
    returns(uint256){
        return tddStoragerLength;
    }

    function getScoresByRequestID(bytes memory requestID) 
    public 
    view 
    returns (bytes memory){
        return scoreStorager[requestID];
    }
}
