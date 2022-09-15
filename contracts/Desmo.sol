pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@iexec/doracle/contracts/IexecDoracle.sol";
import "@iexec/solidity/contracts/ERC1154/IERC1154.sol";
import "@iexec/solidity/contracts/ERC2362/IERC2362.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./DesmoHub.sol";

contract Desmo is Ownable, IexecDoracle, IOracleConsumer {
    // -- State --

    struct QueryResult {
        bytes32 requestID;
        bytes32 taskID;
        bytes result;
    }

    mapping(bytes32 => bytes32) private requestIDtoTaskID;
    mapping(bytes32 => QueryResult) private values;
    mapping(bytes => bytes) private scores;

    DesmoHub private desmoHub;

    // -- Events --

    event QueryCompleted(bytes32 indexed id, QueryResult result);

    // -- Functions --

    /**
     * @dev Desmo Contract Constructor
     */
    constructor(address desmoHubAddress, address iexecproxy)
        public
        IexecDoracle(iexecproxy)
    {
        desmoHub = DesmoHub(desmoHubAddress);
    }

    /**
     * @dev Retrieve the query result using the generated iExec TaskID
     */
    function getQueryResult(bytes32 taskID)
        public
        view
        returns (QueryResult memory result)
    {
        return values[taskID];
    }

    /**
     * @dev Retrieve the query result using the request ID generated using
     * DesmoHub.getNewRequestID();
     */
    function getQueryResultByRequestID(bytes32 requestID)
        public
        view
        returns (QueryResult memory result)
    {
        return values[requestIDtoTaskID[requestID]];
    }

    /**
     * @dev Update the iExec variables
     */
    function updateEnv(
        address authorizedApp,
        address authorizedDataset,
        address authorizedWorkerpool,
        bytes32 requiredtag,
        uint256 requiredtrust
    ) public onlyOwner {
        _iexecDoracleUpdateSettings(
            authorizedApp,
            authorizedDataset,
            authorizedWorkerpool,
            requiredtag,
            requiredtrust
        );
    }

    /**
     * @dev Retrieve the final computation result for you query.
     * The function emits the QueryCompleted event.
     */
    function receiveResult(bytes32 taskID, bytes memory data)
        external
        override
    {
        bytes memory results = _iexecDoracleGetVerifiedResult(taskID);
        values[taskID] = _processQueryResult(taskID, results);
        
        emit QueryCompleted(taskID, values[taskID]);
    }
        
    function _processQueryResult(bytes32 taskID, bytes memory payload)
        internal
        returns (QueryResult memory result)
    {
        uint8 requestIDLength;
        uint8 scoreAmount;
        bytes32 requestID;

        
        requestIDLength = uint8(bytes1(payload[0]));
        
        if( requestIDLength != 32 ) {
            revert("Invalid request ID length; expected 32 bytes");
        }

        requestID = _bytesToBytes32(payload,1);

        scoreAmount = uint8(bytes1(payload[requestIDLength + 1]));
        bytes1[] memory resultScores = new bytes1[](scoreAmount);
        
        for(uint8 i = 0; i < scoreAmount; i++) {
            bytes1 score = bytes1(payload[requestIDLength + 2 + i]);
            resultScores[i] = score;
        }

        bytes memory queryResult = new bytes(payload.length - requestIDLength - 2 - scoreAmount);
        //TODO: move this function to recevieResult
        desmoHub.updateScores(requestID, resultScores);
        for(uint8 i = 0; i < queryResult.length; i++) {
            queryResult[i] = payload[requestIDLength + 2 + scoreAmount + i];
        }

        return QueryResult(requestID, taskID, queryResult);
    }

    function _bytesToBytes32(bytes memory b, uint256 offset)
        internal
        pure
        returns (bytes32)
    {
        bytes32 out;

        for (uint256 i = 0; i < 32; i++) {
            out |= bytes32(b[offset + i] & 0xFF) >> (i * 8);
        }

        return out;
    }
}
