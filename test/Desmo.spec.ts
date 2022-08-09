import { ethers, waffle } from "hardhat";
import { DesmoHub, Desmo } from "../typechain";
import IexecProxyBuild from "@iexec/poco/build/contracts-waffle/IexecInterfaceToken.json";
import { expect } from "chai";

describe("Desmo", () => {
  let desmoHub: DesmoHub;
  let desmo: Desmo;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    const iexecProxy = await waffle.deployMockContract(
      signers[0],
      IexecProxyBuild.abi
    );
    const task = {
      status: 3,
      dealid:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      idx: 0,
      timeref: 0,
      contributionDeadline: 0,
      revealDeadline: 0,
      finalDeadline: 0,
      consensusValue:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      revealCounter: 0,
      winnerCounter: 0,
      contributors: ["0x65133424DAa7b019E04E11a52DeBEc6e872c7596"],
      resultDigest:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      results:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      resultsTimestamp: 0,
      resultsCallback:
        "0x20000000000000000000000000000000000000000000000000000000000000000b0402020202001121445c",
    };
    await iexecProxy.mock.viewTask.returns(Object.values(task));
    const deal = {
      app: [
        "0x65133424DAa7b019E04E11a52DeBEc6e872c7596",
        "0x65133424DAa7b019E04E11a52DeBEc6e872c7596",
        0,
      ],
      dataset: [
        "0x65133424DAa7b019E04E11a52DeBEc6e872c7596",
        "0x65133424DAa7b019E04E11a52DeBEc6e872c7596",
        0,
      ],
      workerpool: [
        "0x65133424DAa7b019E04E11a52DeBEc6e872c7596",
        "0x65133424DAa7b019E04E11a52DeBEc6e872c7596",
        0,
      ],
      trust: 0,
      category: 0,
      tag: "0x0000000000000000000000000000000000000000000000000000000000000000",
      requester: "0x65133424DAa7b019E04E11a52DeBEc6e872c7596",
      beneficiary: "0x65133424DAa7b019E04E11a52DeBEc6e872c7596",
      callback: "0x65133424DAa7b019E04E11a52DeBEc6e872c7596",
      params: "0x65133424DAa7b019E04E11a52DeBEc6e872c7596",
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
    const txt = await desmo.receiveResult(
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x00"
    );
    await expect(txt)
      .emit(desmo, "QueryCompleted")
      .withArgs(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        [
          "0x000000000000000000000000000000000000000000000000000000000000000b",
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "0x001121445c",
        ]
      );
  });
});
