pragma solidity ^0.8.3;
pragma experimental ABIEncoderV2;
import "./DesmoLDHub.sol";
import "hardhat/console.sol";

contract DesmoLDContract {
    mapping (bytes32 => bytes) private oracleValue;
    mapping (bytes => bytes) private scoreStorager;


    address internal constant desmoHubAddress = 0x21C021c9209A234b9dd2758ea34259B69D7d0a77;
    DesmoLDHub public desmoHub;

    event QueryResult(bytes32 indexed id, bytes _calldata);
    
    constructor () public {
        desmoHub = DesmoLDHub(desmoHubAddress);
    }    

    function receiveResult(bytes32 id, bytes memory _calldata) public {
        processQueryResult(_calldata);
        oracleValue[id] = _calldata;
        emit QueryResult(id, _calldata);
    }

    function getRaw(bytes32 _oracleId) public view returns(bytes memory bytesValue) {
        return oracleValue[_oracleId];
    }

    function processQueryResult(bytes memory _payload)
    internal{
        uint256 tddSubsetRequestIDLenght;
        uint256 scoreAmount; 
        bytes memory requestID;
        bytes memory scores;
        
        tddSubsetRequestIDLenght = uint8(bytes1(_payload[0]));
        scoreAmount = uint8(bytes1(_payload[tddSubsetRequestIDLenght+1]));

        for (uint256 i = 1; i <= tddSubsetRequestIDLenght; i++){
            requestID = abi.encodePacked(requestID, _payload[i]);
        }
        for (uint256 j = tddSubsetRequestIDLenght+2; j <= tddSubsetRequestIDLenght+1+scoreAmount; j++){
            scores = abi.encodePacked(scores, _payload[j]);
        } 
        scoreStorager[requestID] = scores;

        desmoHub.updateScores(requestID, scores);
    }

    function viewScores(bytes memory requestID)
    public
    view
    returns(bytes memory){
        return scoreStorager[requestID];
    }
}