// // // SPDX-License-Identifier: Apache-2.0

// // /******************************************************************************
// //  * Copyright 2021 IEXEC BLOCKCHAIN TECH                                       *
// //  *                                                                            *
// //  * Licensed under the Apache License, Version 2.0 (the "License");            *
// //  * you may not use this file except in compliance with the License.           *
// //  * You may obtain a copy of the License at                                    *
// //  *                                                                            *
// //  *     http://www.apache.org/licenses/LICENSE-2.0                             *
// //  *                                                                            *
// //  * Unless required by applicable law or agreed to in writing, software        *
// //  * distributed under the License is distributed on an "AS IS" BASIS,          *
// //  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   *
// //  * See the License for the specific language governing permissions and        *
// //  * limitations under the License.                                             *
// //  ******************************************************************************/

// //pragma solidity ^0.8.3;
// pragma solidity ^0.6.0;
// pragma experimental ABIEncoderV2;

// import "@iexec/poco/contracts/IexecInterfaceToken.sol";

// contract DESMOLDCONTRACT {
//     address internal constant IEXECPROXY = 0x3eca1B216A7DF1C7689aEb259fFB83ADFB894E7f;
    
//     IexecInterfaceToken iexecproxy;

//     struct AppOrder {
//         address app;
//         uint256 appprice;
//         uint256 volume;
//         bytes32 tag;
//         address datasetrestrict;
//         address workerpoolrestrict;
//         address requesterrestrict;
//         bytes32 salt;
//         bytes   sign;
//     }
    

//     mapping (bytes32 => bytes) oracleValue;
    
//     constructor () public {
//         iexecproxy = IexecInterfaceToken(payable(IEXECPROXY));
//     }    

//     function receiveResult(bytes32 id, bytes memory _calldata) public {
//         oracleValue[id] = _calldata;
//     }

//     function getRaw(bytes32 _oracleId) public view returns(bytes memory bytesValue) {
//         return oracleValue[_oracleId];
//     }

//     function placeOrder (AppOrder calldata order) public {
//         return iexecproxy.broadcastAppOrder(order);
//     }
// }