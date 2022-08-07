pragma solidity ^0.8.3;
pragma experimental ABIEncoderV2;
import "./DesmoLdHub.sol";
import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
// import "@iexec/solidity/contracts/ERC1154/IERC1154.sol";
// import "@iexec/doracle/contracts/IexecDoracle.sol";

contract DesmoLDContract {
    mapping (bytes32 => bytes) private oracleValue;
    mapping (bytes => bytes) private scoreStorager;

    DesmoLDHub public desmoHub;

    event QueryResult(bytes32 indexed id, bytes _calldata);
    
    constructor (address desmoHubAddress){
        desmoHub = DesmoLDHub(desmoHubAddress);
    }  

    function getRaw(bytes32 _oracleId) 
    public 
    view 
    returns(bytes memory bytesValue) {
        return oracleValue[_oracleId];
    }
    
    function viewScores(bytes memory requestID)
    public
    view
    returns(bytes memory){
        return scoreStorager[requestID];
    }
    
    function receiveResult(bytes32 id, bytes memory _calldata) 
    public {
        processQueryResult(_calldata);
        oracleValue[id] = _calldata;
        emit QueryResult(id, _calldata);
    }

    function processQueryResult(bytes memory _payload)
    internal{
        uint256 requestIDLenght;
        uint256 scoreAmount; 
        bytes memory requestID;
        bytes memory scores;
        
        requestIDLenght = uint8(bytes1(_payload[0]));
        scoreAmount = uint8(bytes1(_payload[requestIDLenght+1]));

        for (uint256 i = 1; i <= requestIDLenght; i++){
            requestID = abi.encodePacked(requestID, _payload[i]);
        }
        for (uint256 j = requestIDLenght+2; j <= requestIDLenght+1+scoreAmount; j++){
            scores = abi.encodePacked(scores, _payload[j]);
        } 
        scoreStorager[requestID] = scores;
        desmoHub.updateScores(requestID, scores);
    }
}