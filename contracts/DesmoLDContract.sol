// // SPDX-License-Identifier: Apache-2.0

// /******************************************************************************
//  * Copyright 2021 IEXEC BLOCKCHAIN TECH                                       *
//  *                                                                            *
//  * Licensed under the Apache License, Version 2.0 (the "License");            *
//  * you may not use this file except in compliance with the License.           *
//  * You may obtain a copy of the License at                                    *
//  *                                                                            *
//  *     http://www.apache.org/licenses/LICENSE-2.0                             *
//  *                                                                            *
//  * Unless required by applicable law or agreed to in writing, software        *
//  * distributed under the License is distributed on an "AS IS" BASIS,          *
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   *
//  * See the License for the specific language governing permissions and        *
//  * limitations under the License.                                             *
//  ******************************************************************************/

//pragma solidity ^0.8.3;
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "./DesmoLdHub.sol";
import "hardhat/console.sol";

contract DesmoLDContract {

    mapping (bytes32 => bytes) oracleValue;
    
    event QueryResult(bytes32 indexed id, bytes _calldata);
    
    constructor () public {
    }    

    function receiveResult(bytes32 id, bytes memory _calldata) public {
        decodeQueryResult(_calldata);
        oracleValue[id] = _calldata;
        emit QueryResult(id, _calldata);
    }

    function getRaw(bytes32 _oracleId) public view returns(bytes memory bytesValue) {
        return oracleValue[_oracleId];
    }

    function decodeQueryResult(bytes memory _payload)
    internal
    returns (int) {
        //bytes memory scores =
         bytes4 sig =
            _payload[0] | (bytes4(_payload[1]) >> 8);
        console.logBytes4(sig);
        return 0;
    }
}