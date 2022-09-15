import { ethers, waffle } from "hardhat";
import { DesmoHub, Desmo } from "../typechain";
import IexecProxyBuild from "@iexec/poco/build/contracts-waffle/IexecInterfaceToken.json";
import { expect } from "chai";

describe("Desmo", () => {
  let desmoHub: DesmoHub;
  let desmo: Desmo;
  let task: any; 

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    const iexecProxy = await waffle.deployMockContract(
      signers[0],
      IexecProxyBuild.abi
    );
    task = {
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

    const DesmoHub = await ethers.getContractFactory("DesmoHub");
    desmoHub = await DesmoHub.deploy();
    await desmoHub.deployed();

    const Desmo = await ethers.getContractFactory("Desmo");
    desmo = await Desmo.deploy(desmoHub.address, iexecProxy.address);
  });

  it("should process a simple query result", async () => {
    await desmoHub.registerTDD("https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001");
    const txtRequestID = await (await desmoHub.getNewRequestID()).wait();
    const requestIDEvent = txtRequestID.events?.find( event => event.event === "RequestID");
    expect(requestIDEvent).to.not.be.undefined;
    
    const requestID = requestIDEvent?.args?.requestID;

    const txt = await desmo.receiveResult(ethers.constants.HashZero, "0x00");
    await expect(txt)
      .emit(desmo, "QueryCompleted")
      .withArgs(ethers.constants.HashZero, [
        requestID,
        ethers.constants.HashZero,
        "0x001121445c",
      ]);

    const scores =await desmoHub.getScoresByRequestID(requestID);
    const {score} = await desmoHub.getTDDByIndex(0);
    expect(scores.length).to.equal(4);
    for (let i = 0; i < scores.length; i++) {
      expect(scores[i]).to.equal("0x02");
    }
    expect(score.toNumber()).to.equal(2);
  });
});
