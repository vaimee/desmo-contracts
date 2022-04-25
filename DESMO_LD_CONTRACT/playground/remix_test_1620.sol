pragma solidity ^0.6.0;

import "@iexec/poco/contracts/IexecInterfaceToken.sol";
import "@iexec/poco/contracts/libs/IexecLibOrders_v5.sol";

pragma experimental ABIEncoderV2;

contract DESMOLDCONTRACT {
    address internal constant IEXECPROXY = 0x3eca1B216A7DF1C7689aEb259fFB83ADFB894E7f;

    // struct AppOrder{
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
    
    //struct RequestOrder {
	// 	address app;
	// 	uint256 appmaxprice;
	// 	address dataset;
	// 	uint256 datasetmaxprice;
	// 	address workerpool;
	// 	uint256 workerpoolmaxprice;
	// 	address requester;
	// 	uint256 volume;
	// 	bytes32 tag;
	// 	uint256 category;
	// 	uint256 trust;
	// 	address beneficiary;
	// 	address callback;
	// 	string  params;
	// 	bytes32 salt;
	// 	bytes   sign;
	// }
    IexecInterfaceToken iexecproxy;
    

    constructor () public {
        iexecproxy = IexecInterfaceToken(payable(IEXECPROXY));
    }    

    function placeOrder () public {
        IexecLibOrders_v5.AppOrder memory order;


        order.app=0x381A122500121AbaF4BDA43b8f1adc1f81c40a50;
        order.appprice=0;
        order.volume=1;
        order.tag = 0x0000000000000000000000000000000000000000000000000000000000000000;
        order.datasetrestrict = 0x0000000000000000000000000000000000000000;
        order.workerpoolrestrict = 0x0000000000000000000000000000000000000000;
        order.requesterrestrict = 0x0000000000000000000000000000000000000000; 
        //order.salt = keccak256("SALT SOMETHING");
        order.salt =  0x4e7ee9f0d9da685512522829bd28e761bae2884210c0370bb18ad75f5add297d;
        order.sign = abi.encodePacked(msg.sig);
        //order.sign = abi.encodePacked(0x1641a6ff56a87bbb299e7acd46ecd9e6a7d0fe23956c01be2efdff2a81daa65d4ddf62108a20ab48e308e05bc884bca96bebc46db015b6d34f597f14420ee3e41c);
        
        iexecproxy.broadcastAppOrder(order);
    }

    function placeRequest () public {
        IexecLibOrders_v5.RequestOrder memory order;
        
        // Deployed application address [address]
        order.app = 0x381A122500121AbaF4BDA43b8f1adc1f81c40a50;
        // Application price that the user what to pay []
        order.appmaxprice = 0;
        // Application dataset []
	    order.dataset = 0x0000000000000000000000000000000000000000;
        order.datasetmaxprice = 0;
        order.workerpool = 0x0000000000000000000000000000000000000000;
        order.workerpoolmaxprice = 0;
        order.requester = 0x90f35F12027E4103e690dc9279E086Ef5b5431A5;
        order.volume = 0x0000000000000000000000000000000000000000000000000000000000000000;
        order.tag = 0x0000000000000000000000000000000000000000000000000000000000000000;
        order.category = 0;
        order.trust = 1;
        order.beneficiary = 0x90f35F12027E4103e690dc9279E086Ef5b5431A5;
        order.callback = 0x5e79D4ddc6a6F5D80816ABA102767a15E6685b3e;
        order.params = "{}";

        order.salt = 0x4e7ee9f0d9da685512522829bd28e761bae2894210c0370bb18ad75f5add297d;
        order.sign = abi.encodePacked(msg.sender);
        
        iexecproxy.broadcastRequestOrder(order);
    }

}