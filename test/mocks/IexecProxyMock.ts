import { ethers, waffle } from "hardhat";
import IexecProxyBuild from "@iexec/poco/build/contracts-waffle/IexecInterfaceToken.json";
import { MockContract } from "ethereum-waffle";

export default class IexecProxyMock {
    
    private constructor() {}

    public static async deploy(): Promise<MockContract> {
        const signers = await ethers.getSigners();
        const iexecProxy = await waffle.deployMockContract(
            signers[0],
            IexecProxyBuild.abi
        );
        let task = {
            status: 3,
            dealid: ethers.constants.HashZero,
            idx: 0,
            timeref: 0,
            contributionDeadline: 0,
            revealDeadline: 0,
            finalDeadline: 0,
            consensusValue: ethers.constants.HashZero,
            revealCounter: 0,
            winnerCounter: 0,
            contributors: [ethers.constants.AddressZero],
            resultDigest: ethers.constants.HashZero,
            results: ethers.constants.HashZero,
            resultsTimestamp: 0,
            resultsCallback:
                "0x2000000000000000000000000000000000000000000000000000000000000000000402020202001121445c",
        };
        await iexecProxy.mock.viewTask.returns(Object.values(task));
        const deal = {
            app: [ethers.constants.AddressZero, ethers.constants.AddressZero, 0],
            dataset: [ethers.constants.AddressZero, ethers.constants.AddressZero, 0],
            workerpool: [
                ethers.constants.AddressZero,
                ethers.constants.AddressZero,
                0,
            ],
            trust: 0,
            category: 0,
            tag: ethers.constants.HashZero,
            requester: ethers.constants.AddressZero,
            beneficiary: ethers.constants.AddressZero,
            callback: ethers.constants.AddressZero,
            params: ethers.constants.AddressZero,
            startTime: 0,
            botFirst: 0,
            botSize: 0,
            workerStake: 0,
            schedulerRewardRatio: 0,
        };

        await iexecProxy.mock.viewDeal.returns(Object.values(deal));
        return iexecProxy;
    }
}
    