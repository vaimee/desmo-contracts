pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract DesmoLDHub {
    
    /**
     * Internal structure for storing Thing Description Directories.
     */
    struct TDD {
        // The address of the TDD
        string url;
        // The address of the owner of the TDD
        address owner;
        // TDDs can be disabled but not deleted
        bool disabled;
        // Quality score about the TDD, calculated by the protocol
        uint256 score;
    }

    // Size of the TDD lists to be selected
    uint256 internal tddSelectionSize = 4;
    uint256 internal tddCounter = 0; 
    address[] private registeredAddresses;
    uint256 private tddStorageLength = 0;

    // Request ID counter
    uint256 internal requestIdCounter = 0;
        
    // TDDs Storage
    mapping (address => TDD) private tddStorage;
    mapping (string => TDD) private tddBucket;
    mapping (bytes => string[]) private selectedTDDs;
    mapping (bytes => bytes) private scoreStorage;

    event TDDCreated (address indexed key, string url, bool disabled, uint256 score);
    event TDDDisabled (address indexed key, string url);
    event TDDEnabled (address indexed key, string url);
    event RequestID (bytes requestID);

    constructor() { 
    }

    // Modifier to check if the address is already used in the tddStorage
    modifier addressAlreadyInPlace() {
        require(!tddAlreadyInStorage(), "Sender already stored a value.");
        _;
    }
    

    // Modifier to check that msg.address == TDD owner
    modifier onlyTDDOwner() {
        require(msg.sender == tddStorage[msg.sender].owner, "Not the TDD owner.");
        _;
    }   

    // Modifier to ensure the retrieval of a subset of TDDs > 0
    modifier notEmptyTDDStorage () {
        require(tddStorageLength > 0, "No TDD available.");
        _;
    }

    /**
     * @dev Verify if you have already a TDD registered in the system.
     */
    function tddAlreadyInStorage ()
    internal
    view 
    returns (bool) {
        if (bytes(tddStorage[msg.sender].url).length > 0){
            return true;
        }else {
            return false;
        }
    }
    
    /**
    * @dev How many TDDs are registered in the system.
    */
    function getTDDStorageLength()
    public
    view
    returns(uint256){
        return tddStorageLength;
    }

    /**
    * @dev Return the list of scores related to RequestID 
    */
    function getScoresByRequestID(bytes memory requestID) 
    public 
    view 
    returns (bytes memory){
        return scoreStorage[requestID];
    }

    /**
    * @dev Every request has a unique set of TDDs. 
    *      This function returns the list of TDDs related to a request.
    */
    function getTDDByRequestID(bytes memory requestID) 
    public
    view
    returns (string[] memory) {
        return selectedTDDs[requestID];
    }

    /**
    * @dev Returns the TDD owned by the message sender.
    */
    function getTDD()
    external
    notEmptyTDDStorage
    onlyTDDOwner
    view
    returns (TDD memory){
        return tddStorage[msg.sender];
    }

    /**
    * @dev Register a new Thing Description Directory in the system for the message sender.
    *      If the TDD is already registered and enabled, the transaction is rejected. 
    *      You can register a new TDD if the previous one is disabled.
    * @param url The address of the TDD.
    */
    function registerTDD(string memory url)
    external{
        TDD memory tdd = TDD(url, msg.sender, false, 0);
        if (tddAlreadyInStorage()){
            if (tddStorage[msg.sender].disabled == true){
                tddStorage[msg.sender] = tdd;
                tddBucket[tdd.url] = tdd;
                emit TDDCreated(msg.sender, tdd.url, tdd.disabled, tdd.score);
            } else {
                revert("Disable the last one");
            }
        }else{
            tddStorage[msg.sender] = tdd;
            tddStorageLength += 1;
            registeredAddresses.push(msg.sender);
            tddBucket[tdd.url] = tdd;
            emit TDDCreated(msg.sender, tdd.url, tdd.disabled, tdd.score);
        }
    }
    /**
    * @dev Disable the Thing Description Directory of the message sender.
    */
    function disableTDD()
    external{
        if(tddAlreadyInStorage()){
            tddStorage[msg.sender].disabled = true;
            delete tddBucket[tddStorage[msg.sender].url];
            emit TDDDisabled(msg.sender, tddStorage[msg.sender].url);
        } else {
            revert("Not the TDD owner.");
        }
    }
    
    /**
    * @dev Enable the Thing Description Directory of the message sender.
    */
    function enableTDD()
    external{
        if (tddStorage[msg.sender].disabled == true){
            tddStorage[msg.sender].disabled = false;
            tddBucket[tddStorage[msg.sender].url] = tddStorage[msg.sender];
            emit TDDEnabled(msg.sender, tddStorage[msg.sender].url);
        } else {
            revert("No TDD owner or No TDD to enable.");
        }
    }
    
    /**
    * @dev Generate a new Request selecting a subset of TDDs. The ID can be later used to retrieve the list of selected TDDs.
           The generated request ID is emitted as an event.
    */
    function getNewRequestID() 
    external
    notEmptyTDDStorage
    returns (bytes memory) {    
        bytes memory key = abi.encodePacked(requestIdCounter);
        uint256 currentSelectionSize = tddSelectionSize;

        if(currentSelectionSize > tddStorageLength) {
            currentSelectionSize = tddStorageLength;
        }

        for (uint256 i = 0; i <= currentSelectionSize - 1; i++) {
            if (tddCounter >= tddStorageLength) {
                tddCounter = 0;
            } 
            if (tddStorage[registeredAddresses[tddCounter]].disabled == false) {
                selectedTDDs[key].push(tddStorage[registeredAddresses[tddCounter]].url);
            }
            
            tddCounter += 1;
        }
        requestIdCounter += 1;
        emit RequestID(key);
        return key;
    }

    function updateScores(bytes memory requestID, bytes memory scores)
    public {
        string[] memory tdds = selectedTDDs[requestID];
        scoreStorage[requestID] = scores;

        for (uint256 i = 0; i <= tdds.length - 1; i++){
            TDD storage tdd = tddStorage[tddBucket[tdds[i]].owner];
            tdd.score = tdd.score + uint8(bytes1(scores[i]));
        }
    }

}
