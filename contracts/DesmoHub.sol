pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/utils/EnumerableMap.sol";
import "hardhat/console.sol";


contract DesmoHub {
    using EnumerableMap for EnumerableMap.UintToAddressMap;
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
    EnumerableMap.UintToAddressMap private tddIndex;
    EnumerableMap.UintToAddressMap private enabledTddsIndex;
    mapping (address => uint256) private addressToEnabledTDDsIndex;

    // Scores can only be updated by the manager of TDDs
    address private scoreManager = address(0x0);

    mapping (string => TDD) private tddBucket;
    mapping (bytes32 => string[]) private selectedTDDs;
    mapping (bytes32 => bytes1[]) private scoreStorage;

    event TDDCreated (address indexed key, string url, bool disabled, uint256 score);
    event TDDDisabled (address indexed key, string url);
    event TDDEnabled (address indexed key, string url);
    event RequestID (bytes32 requestID);

    constructor() public{ 
    }

    /**
     * @dev Sets a score manager for this DESMO Hub. Only the score manager can update the scores of the TDDs.
     * Requirements:
     * - score manager can only set once
     */
    function setScoreManager(address scoreManagerAddress) external {
        // TODO: let the owner of the contract to always set the score manager
        require(scoreManager == address(0x0), "DesmoHub: Score manager can only be set once");
        scoreManager = scoreManagerAddress;
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

    // Restrict a method to be called only by the score manager
    modifier onlyScoreManager() {
        require(scoreManager == address(0x0) || msg.sender == scoreManager, "This method can be only called by the score manager.");
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
        return tddIndex.length();
    }

    /**
    * @dev How many enabled TDDs are registered in the system.
    */
    function getEnabledTDDsStorageLength()
    public
    view
    returns(uint256){
        return enabledTddsIndex.length();
    }

    /**
    * @dev Return the list of scores related to RequestID 
    */
    function getScoresByRequestID(bytes32 requestID) 
    public 
    view 
    returns (bytes1[] memory){
        return scoreStorage[requestID];
    }

    /**
    * @dev Every request has a unique set of TDDs. 
    *      This function returns the list of TDDs related to a request.
    */
    function getTDDByRequestID(bytes32 requestID) 
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
     * @dev Returns a TDD description at a given `index` of all the TDDs stored by the contract.
     * Use along with {getTDDStorageLength} to enumerate all TDDs registered in the system.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function getTDDByIndex(uint256 index)
    external
    notEmptyTDDStorage
    view
    returns (TDD memory){
        return tddStorage[tddIndex.get(index)];
    }

    /**
     * @dev Returns a TDD description at a given `index` of all the TDDs stored by the contract.
     * Use along with {getEnabledTDDsStorageLength} to enumerate all TDDs registered in the system.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function getEnabledTDDByIndex(uint256 index)
    external
    view
    returns (TDD memory){
        (, address tddAddress) = enabledTddsIndex.at(index);
        return tddStorage[tddAddress];
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
        
        enabledTddsIndex.set(enabledTddsIndex.length(), msg.sender);
        addressToEnabledTDDsIndex[msg.sender] = enabledTddsIndex.length() - 1;
        tddIndex.set(tddIndex.length(), msg.sender);
    }
    /**
    * @dev Disable the Thing Description Directory of the message sender.
    */
    function disableTDD()
    external{
        if(tddAlreadyInStorage()){
            tddStorage[msg.sender].disabled = true;
            delete tddBucket[tddStorage[msg.sender].url];
            enabledTddsIndex.remove(addressToEnabledTDDsIndex[msg.sender]);
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
            enabledTddsIndex.set(enabledTddsIndex.length(), msg.sender);
            addressToEnabledTDDsIndex[msg.sender] = enabledTddsIndex.length() - 1;
            emit TDDEnabled(msg.sender, tddStorage[msg.sender].url);
        } else {
            revert("No TDD owner or No TDD to enable.");
        }
    }

    /**
    * @dev Update the score of the TDD.
    */
    function setScore(address owner, uint8 score)
    public 
    onlyScoreManager {
        tddStorage[owner].score = uint256(score);
    }
}
