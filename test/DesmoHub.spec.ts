import { expect } from "chai";
import { ethers } from "hardhat";
import { DesmoHub } from "../typechain";

describe("DESMO Contracts tests", function () {
  describe("DESMO-LD HUB contract tests", function () {
    let hub: DesmoHub;

    beforeEach(async function () {
      const DESMOHUB = await ethers.getContractFactory("DesmoHub");
      hub = await DESMOHUB.deploy();
      await hub.deployed();
    });

    describe("DESMO-LD HUB - Units tests", async function () {
      it("Should register new TDD", async function () {
        const [addr1] = await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);
      });

      it("Should fail to register new TDD", async function () {
        const [addr1] = await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        const TDD2 = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);

        await expect(
          hub.connect(addr1).registerTDD(TDD2.url)
        ).to.be.revertedWith("Disable the last one");
      });

      it("Should disable TDD", async function () {
        const [addr1, addr2] = await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        const TDD2 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
          owner: addr2.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr2).registerTDD(TDD2.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr1).disableTDD())
          .emit(hub, "TDDDisabled")
          .withArgs(addr1.address, TDD.url);
      });

      it("Should fail to disable TDD", async function () {
        const [addr1, addr2] = await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr2).disableTDD()).to.be.revertedWith(
          "Not the TDD owner."
        );
      });

      it("Should enable TDD", async function () {
        const [addr1] = await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr1).disableTDD())
          .emit(hub, "TDDDisabled")
          .withArgs(addr1.address, TDD.url);

        await expect(hub.connect(addr1).enableTDD())
          .emit(hub, "TDDEnabled")
          .withArgs(addr1.address, TDD.url);
      });

      it("Should get TDD", async function () {
        const [addr1] = await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr1).getTDD());
      });

      it("Should fail get TDD when no TDD was created", async function () {
        const [addr1] = await ethers.getSigners();

        await expect(hub.connect(addr1).getTDD()).to.be.revertedWith(
          "No TDD available."
        );
      });

      it("Should fail to get TDD when address is not TDD owner", async function () {
        const [addr1, addr2] = await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr2).getTDD())
          .emit(hub, "TDDRetrieval")
          .to.be.revertedWith("Not the TDD owner.");
      });
    });

    describe("DESMO-LD HUB - Transactions tests", function () {
      it("Should return a key to retrieve the TDD subset", async function () {
        const [addr1, addr2] = await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr2.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr1).getNewRequestID());
      });

      it("Should fail to retrieve TDD from an empty TDD Storage", async function () {
        await expect(hub.getNewRequestID()).to.be.revertedWith(
          "No TDD available."
        );
      });

      it("Should retrieve 4 TDDs", async function () {
        const [addr1, addr2, addr3, addr4] = await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        const TDD2 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
          owner: addr2.address,
          disabled: false,
          score: 0,
        };

        const TDD3 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
          owner: addr3.address,
          disabled: false,
          score: 0,
        };

        const TDD4 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
          owner: addr4.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr2).registerTDD(TDD2.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr3).registerTDD(TDD3.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr3.address, TDD3.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr4).registerTDD(TDD4.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr4.address, TDD4.url, TDD.disabled, TDD.score);

        const resquestId1 = await hub.connect(addr1).getNewRequestID();
        const awaitRequestID1 = await resquestId1.wait();
        const awaitRequestID1EventName = awaitRequestID1.events?.find(
          (event) => {
            return event.event === "RequestID";
          }
        );

        const requestID = awaitRequestID1EventName?.args;

        if (requestID) {
          const a = await hub
            .connect(addr1)
            .getTDDByRequestID(requestID.requestID);
          expect(a).to.have.members([
            "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
          ]);
        }
      });

      it("Should retrieve TDDs according to the total storager length", async function () {
        const [addr1, addr2] = await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        const TDD2 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
          owner: addr2.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr2).registerTDD(TDD2.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);

        const resquestId1 = await hub.connect(addr1).getNewRequestID();
        const awaitRequestID1 = await resquestId1.wait();
        const awaitRequestID1EventName = awaitRequestID1.events?.find(
          (event) => {
            return event.event === "RequestID";
          }
        );

        const requestID = awaitRequestID1EventName?.args;

        if (requestID) {
          const a = await hub
            .connect(addr1)
            .getTDDByRequestID(requestID.requestID);
          expect(a).to.have.members([
            "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
          ]);
        }
      });

      it("Should skip disabled TDD", async function () {
        const [addr1, addr2, addr3, addr4, addr5, addr6] =
          await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        const TDD2 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
          owner: addr2.address,
          disabled: false,
          score: 0,
        };

        const TDD3 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
          owner: addr3.address,
          disabled: false,
          score: 0,
        };

        const TDD4 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
          owner: addr4.address,
          disabled: false,
          score: 0,
        };

        const TDD5 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005",
          owner: addr5.address,
          disabled: false,
          score: 0,
        };

        const TDD6 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:006",
          owner: addr6.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr2).registerTDD(TDD2.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr3).registerTDD(TDD3.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr3.address, TDD3.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr4).registerTDD(TDD4.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr4.address, TDD4.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr5).registerTDD(TDD5.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr5.address, TDD5.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr6).registerTDD(TDD6.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr6.address, TDD6.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr1).disableTDD())
          .emit(hub, "TDDDisabled")
          .withArgs(addr1.address, TDD.url);

        const resquestId1 = await hub.connect(addr1).getNewRequestID();
        const awaitRequestID1 = await resquestId1.wait();
        const awaitRequestID1EventName = awaitRequestID1.events?.find(
          (event) => {
            return event.event === "RequestID";
          }
        );

        const requestID = awaitRequestID1EventName?.args;

        if (requestID) {
          const a = await hub
            .connect(addr1)
            .getTDDByRequestID(requestID.requestID);
          expect(a).to.have.members([
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005",
          ]);
        }
      });

      it("Should fail if there are too few TDDs", async function () {
        const [addr1, addr2, addr3, addr4] = await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        const TDD2 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
          owner: addr2.address,
          disabled: false,
          score: 0,
        };

        const TDD3 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
          owner: addr3.address,
          disabled: false,
          score: 0,
        };

        const TDD4 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
          owner: addr4.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr2).registerTDD(TDD2.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr3).registerTDD(TDD3.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr3.address, TDD3.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr4).registerTDD(TDD4.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr4.address, TDD4.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr1).disableTDD())
          .emit(hub, "TDDDisabled")
          .withArgs(addr1.address, TDD.url);
        await expect(hub.connect(addr2).disableTDD())
          .emit(hub, "TDDDisabled")
          .withArgs(addr2.address, TDD2.url);
        await expect(hub.connect(addr3).disableTDD())
          .emit(hub, "TDDDisabled")
          .withArgs(addr3.address, TDD3.url);
        await expect(hub.connect(addr4).disableTDD())
          .emit(hub, "TDDDisabled")
          .withArgs(addr4.address, TDD4.url);

        const tx = hub.connect(addr1).getNewRequestID();
        await expect(tx).revertedWith("Too few TDD registered");
      });

      it("Should select different TDDs for each client", async function () {
        const [addr1, addr2, addr3, addr4, addr5, addr6] =
          await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        const TDD2 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
          owner: addr2.address,
          disabled: false,
          score: 0,
        };

        const TDD3 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
          owner: addr3.address,
          disabled: false,
          score: 0,
        };

        const TDD4 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
          owner: addr4.address,
          disabled: false,
          score: 0,
        };

        const TDD5 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005",
          owner: addr5.address,
          disabled: false,
          score: 0,
        };

        const TDD6 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:006",
          owner: addr6.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr2).registerTDD(TDD2.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr3).registerTDD(TDD3.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr3.address, TDD3.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr4).registerTDD(TDD4.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr4.address, TDD4.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr5).registerTDD(TDD5.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr5.address, TDD5.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr6).registerTDD(TDD6.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr6.address, TDD6.url, TDD.disabled, TDD.score);

        const resquestId1 = await hub.connect(addr1).getNewRequestID();
        const awaitRequestID1 = await resquestId1.wait();

        const awaitRequestID1EventName = awaitRequestID1.events?.find(
          (event) => {
            return event.event === "RequestID";
          }
        );

        const requestID = awaitRequestID1EventName?.args;

        if (requestID) {
          const a = await hub
            .connect(addr1)
            .getTDDByRequestID(requestID.requestID);
          expect(a).to.have.members([
            "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
          ]);
        }

        const resquestId2 = await hub.connect(addr2).getNewRequestID();
        const awaitRequestID2 = await resquestId2.wait();
        const awaitRequestID2EventName = awaitRequestID2.events?.find(
          (event) => {
            return event.event === "RequestID";
          }
        );

        const requestID2 = awaitRequestID2EventName?.args;

        if (requestID2) {
          const b = await hub
            .connect(addr2)
            .getTDDByRequestID(requestID2.requestID);
          expect(b).to.have.members([
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:006",
            "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
          ]);
        }
      });

      it("Should select different TDDs for each client after TDD2 disabled", async function () {
        const [addr1, addr2, addr3, addr4, addr5, addr6] =
          await ethers.getSigners();

        const TDD = {
          url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
          owner: addr1.address,
          disabled: false,
          score: 0,
        };

        const TDD2 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
          owner: addr2.address,
          disabled: false,
          score: 0,
        };

        const TDD3 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
          owner: addr3.address,
          disabled: false,
          score: 0,
        };

        const TDD4 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
          owner: addr4.address,
          disabled: false,
          score: 0,
        };

        const TDD5 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005",
          owner: addr5.address,
          disabled: false,
          score: 0,
        };

        const TDD6 = {
          url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:006",
          owner: addr6.address,
          disabled: false,
          score: 0,
        };

        await expect(hub.connect(addr1).registerTDD(TDD.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr2).registerTDD(TDD2.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr3).registerTDD(TDD3.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr3.address, TDD3.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr4).registerTDD(TDD4.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr4.address, TDD4.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr5).registerTDD(TDD5.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr5.address, TDD5.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr6).registerTDD(TDD6.url))
          .emit(hub, "TDDCreated")
          .withArgs(addr6.address, TDD6.url, TDD.disabled, TDD.score);

        await expect(hub.connect(addr2).disableTDD())
          .emit(hub, "TDDDisabled")
          .withArgs(addr2.address, TDD2.url);

        const resquestId1 = await hub.connect(addr1).getNewRequestID();
        const awaitRequestID1 = await resquestId1.wait();

        const awaitRequestID1EventName = awaitRequestID1.events?.find(
          (event) => {
            return event.event === "RequestID";
          }
        );

        const requestID = awaitRequestID1EventName?.args;

        if (requestID) {
          const a = await hub
            .connect(addr1)
            .getTDDByRequestID(requestID.requestID);
          expect(a).to.have.members([
            "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005",
          ]);
        }

        const resquestId2 = await hub.connect(addr2).getNewRequestID();
        const awaitRequestID2 = await resquestId2.wait();
        const awaitRequestID2EventName = awaitRequestID2.events?.find(
          (event) => {
            return event.event === "RequestID";
          }
        );

        const requestID2 = awaitRequestID2EventName?.args;

        if (requestID2) {
          const b = await hub
            .connect(addr2)
            .getTDDByRequestID(requestID2.requestID);
          expect(b).to.have.members([
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:006",
            "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
            "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
          ]);
        }
      });

      it("Should enumerate TDDs", async function () {
        const [addr1, addr2, addr3, addr4] = await ethers.getSigners();
        const TDDs= [
          {
            url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr1.address,
            disabled: false,
            score: 0,
          },
          {
            url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
            owner: addr2.address,
            disabled: false,
            score: 0,
          },
          {
            url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
            owner: addr3.address,
            disabled: false,
            score: 0,
          },
          {
            url: "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
            owner: addr4.address,
            disabled: false,
            score: 0,
          }
        ]

        await expect(hub.connect(addr1).registerTDD(TDDs[0].url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDDs[0].url, TDDs[0].disabled, TDDs[0].score);

        await expect(hub.connect(addr2).registerTDD(TDDs[1].url))
          .emit(hub, "TDDCreated")
          .withArgs(addr2.address, TDDs[1].url, TDDs[1].disabled, TDDs[1].score);

        await expect(hub.connect(addr3).registerTDD(TDDs[2].url))
          .emit(hub, "TDDCreated")
          .withArgs(addr3.address, TDDs[2].url, TDDs[2].disabled, TDDs[2].score);

        await expect(hub.connect(addr4).registerTDD(TDDs[3].url))
          .emit(hub, "TDDCreated")
          .withArgs(addr4.address, TDDs[3].url, TDDs[3].disabled, TDDs[3].score);

        const length = await hub.connect(addr1).getTDDStorageLength();
        expect(length.toNumber()).to.equal(4);

        for (let i = 0; i < length.toNumber(); i++) {
          const {url, owner, score, disabled} = await hub.connect(addr1).getTDDByIndex(i)
          await expect({url, owner, score : score.toNumber(), disabled}).to.deep.equal(TDDs[i]);
        }
      });

      it("Should fail for index grater then tddStorageLength", async function () {
        const [addr1, addr2, addr3, addr4] = await ethers.getSigners();
        const TDDs= [
          {
            url: "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr1.address,
            disabled: false,
            score: 0,
          }
        ]

        await expect(hub.connect(addr1).registerTDD(TDDs[0].url))
          .emit(hub, "TDDCreated")
          .withArgs(addr1.address, TDDs[0].url, TDDs[0].disabled, TDDs[0].score);
        await expect(hub.connect(addr1).getTDDByIndex(1)).to.be.reverted
      });

      it("Should return 0 tddStorageLength", async function () {
        const [addr1] = await ethers.getSigners();

        const length = await hub.connect(addr1).getTDDStorageLength();
        expect(length.toNumber()).to.equal(0);
      });
    });
  });
});
