import { ethers, waffle } from "hardhat";
import { DesmoHub, Desmo } from "../typechain";
import { expect } from "chai";
import IexecProxyMock from "./mocks/IexecProxyMock";
import { fail } from "assert";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MockContract } from "ethereum-waffle";

describe("Desmo", () => {
  let desmoHub: DesmoHub;
  let desmo: Desmo; 
  let addresses: SignerWithAddress[];
  const fakeTDDURLs = [
    "https://test.it/1",
    "https://test.it/2",
    "https://test.it/3",
    "https://test.it/4",
    "https://test.it/5",
    "https://test.it/6",
  ];

  beforeEach(async () => {
    addresses = await ethers.getSigners();

    const iexecProxy = await IexecProxyMock.deploy();
    desmoHub =  await deployDesmoHub();
    desmo = await deployDesmo(desmoHub, iexecProxy);
    
    await registerTDDs(addresses, fakeTDDURLs, desmoHub);
  });

  it("should process a simple query result", async () => {
   
    const txtRequestID = await (await desmo.generateNewRequestID()).wait();
    const requestIDEvent = txtRequestID.events?.find( event => event.event === "RequestCreated");
    expect(requestIDEvent).to.not.be.undefined;
    
    const requestID = requestIDEvent?.args?.requestID;

    const txt = await desmo.receiveResult(ethers.constants.HashZero, "0x00");
    await expect(txt)
      .emit(desmo, "QueryCompleted")
      .withNamedArgs({
        id: requestID,
        result: {
          requestID: requestID,
          taskID: ethers.constants.HashZero,
          scores: ["0x02", "0x02", "0x02", "0x02"],
          result: "0x001121445c",
        }
      });
    const result = await desmo.getQueryResultByRequestID(requestID);
    const scores = result.scores;

    expect(scores.length).to.equal(4);
    for (let i = 0; i < scores.length; i++) {
      expect(scores[i]).to.equal("0x02");
    }

    const { score } = await desmoHub.getTDDByIndex(0);
    expect(score.toNumber()).to.equal(2);
  });

  it("should generate a new request ID", async () => {
    await expect(desmo.generateNewRequestID())
      .emit(desmo, "RequestCreated").withNamedArgs({
        requestID: ethers.constants.HashZero,
        request: {
          id: ethers.constants.HashZero,
          selectedTDDsURLs: fakeTDDURLs.slice(0, 4),
          selectedAddresses: addresses.slice(0, 4).map((address) => address.address),
        }
      });
  });

  it("should select different TDDs for each client", async () => {
    await expect(desmo.generateNewRequestID())
      .emit(desmo, "RequestCreated").withNamedArgs({
        requestID: ethers.constants.HashZero,
        request: {
          id: ethers.constants.HashZero,
          selectedTDDsURLs: fakeTDDURLs.slice(0,4),
          selectedAddresses: addresses.slice(0, 4).map((address) => address.address),
        }
      })
    await expect(desmo.generateNewRequestID())
      .emit(desmo, "RequestCreated").withNamedArgs({
        requestID: `0x${"0".repeat(63)}1`,
        request: {
          id: `0x${"0".repeat(63)}1`,
          selectedTDDsURLs: [fakeTDDURLs[4], fakeTDDURLs[5], fakeTDDURLs[0], fakeTDDURLs[1]],
          selectedAddresses: [addresses[4].address, addresses[5].address, addresses[0].address, addresses[1].address]
        }
      })
  });
  
  it("should revert for empty hub", async () => {
    const iexecProxy = await IexecProxyMock.deploy();
    desmoHub = await deployDesmoHub();
    desmo = await deployDesmo(desmoHub, iexecProxy);

    await expect(desmo.generateNewRequestID()).to.be.revertedWith("No TDDs available");

  });

  it("should revert for all disabled tdds", async () => {
    const addresses = await ethers.getSigners();
    for (let i = 0; i < fakeTDDURLs.length; i++) {
      await desmoHub.connect(addresses[i]).disableTDD();
    }

    await expect(desmo.generateNewRequestID()).to.be.revertedWith("No TDDs available");

  });

  it("should select less tdds than the requested selection size", async () => {
    const iexecProxy = await IexecProxyMock.deploy();
    desmoHub = await deployDesmoHub();
    desmo = await deployDesmo(desmoHub, iexecProxy);

    await registerTDDs(addresses, fakeTDDURLs.slice(0,2), desmoHub);

    await expect(desmo.generateNewRequestID())
      .emit(desmo, "RequestCreated").withNamedArgs({
        requestID: ethers.constants.HashZero,
        request: {
          id: ethers.constants.HashZero,
          selectedTDDsURLs: fakeTDDURLs.slice(0, 2),
          selectedAddresses: addresses.slice(0, 2).map((address) => address.address),
        }
      });
  });

  it("should skip disabled TDD", async () => {
    for (let i = 0; i < 2; i++) {
      await desmoHub.connect(addresses[i]).disableTDD();
    }
    
    await expect(desmo.generateNewRequestID())
      .emit(desmo, "RequestCreated").withNamedArgs({
        requestID: ethers.constants.HashZero,
        request: {
          id: ethers.constants.HashZero,
          // Note: after manipulating the TDDs (disable or enable), the order of the TDDs is not guaranteed
          // the correct way to test this would be with the member chai matcher 
          // but it is not possible to combine it with the namedArgs matcher
          selectedTDDsURLs: [fakeTDDURLs[5], fakeTDDURLs[4], fakeTDDURLs[2], fakeTDDURLs[3]],
          selectedAddresses: [addresses[5].address, addresses[4].address, addresses[2].address, addresses[3].address]
        }
      })
  });

  it("should correctly select different TDDs for each client after disabling", async () => {
    await expect(desmo.generateNewRequestID())
      .emit(desmo, "RequestCreated").withNamedArgs({
        requestID: ethers.constants.HashZero,
        request: {
          id: ethers.constants.HashZero,
          selectedTDDsURLs: fakeTDDURLs.slice(0, 4),
          selectedAddresses: addresses.slice(0, 4).map((address) => address.address),
        }
      })
    
    for (let i = 0; i < 2; i++) {
      await desmoHub.connect(addresses[i]).disableTDD();
    }

    await expect(desmo.generateNewRequestID())
      .emit(desmo, "RequestCreated").withNamedArgs({
        requestID: `0x${"0".repeat(63)}1`,
        request: {
          id: `0x${"0".repeat(63)}1`,
          // Note: after manipulating the TDDs (disable or enable), the order of the TDDs is not guaranteed
          // the correct way to test this would be with the member chai matcher 
          // but it is not possible to combine it with the namedArgs matcher
          selectedTDDsURLs: [fakeTDDURLs[5], fakeTDDURLs[4], fakeTDDURLs[2], fakeTDDURLs[3]],
          selectedAddresses: [addresses[5].address, addresses[4].address, addresses[2].address, addresses[3].address]
        }
      })
  });

  it("should correctly select different TDDs for each client after disabling many tdds", async () => {
    await expect(desmo.generateNewRequestID())
      .emit(desmo, "RequestCreated").withNamedArgs({
        requestID: ethers.constants.HashZero,
        request: {
          id: ethers.constants.HashZero,
          selectedTDDsURLs: fakeTDDURLs.slice(0, 4),
          selectedAddresses: addresses.slice(0, 4).map((address) => address.address),
        }
      })
  
    // disable the last 3 TDDs
    for (let i = 3; i < fakeTDDURLs.length; i++) {
      await desmoHub.connect(addresses[i]).disableTDD();
    }

    await expect(desmo.generateNewRequestID())
      .emit(desmo, "RequestCreated").withNamedArgs({
        requestID: `0x${"0".repeat(63)}1`,
        request: {
          id: `0x${"0".repeat(63)}1`,
          // Note: after manipulating the TDDs (disable or enable), the order of the TDDs is not guaranteed
          // the correct way to test this would be with the member chai matcher 
          // but it is not possible to combine it with the namedArgs matcher
          selectedTDDsURLs: [fakeTDDURLs[1], fakeTDDURLs[2], fakeTDDURLs[0]],
          selectedAddresses: [addresses[1].address, addresses[2].address, addresses[0].address]
        }
      })
  });

  async function deployDesmoHub() {
    const DesmoHub = await ethers.getContractFactory("DesmoHub");
    const desmoHub = await DesmoHub.deploy();
    await desmoHub.deployed();
    return desmoHub;
  }
  
  async function deployDesmo(desmoHub: DesmoHub, iexecProxy: MockContract) {
    const Desmo = await ethers.getContractFactory("Desmo");
    const desmo = await Desmo.deploy(desmoHub.address, iexecProxy.address);
    await desmo.deployed();
    return desmo;
  }

  async function registerTDDs(addresses: SignerWithAddress[], tdds: string[], desmoHub: DesmoHub) {
    for (let i = 0; i < tdds.length; i++) {
      await desmoHub.connect(addresses[i]).registerTDD(tdds[i]);
    }
  }
});
