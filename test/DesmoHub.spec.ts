import { expect } from "chai";
import { ethers } from "hardhat";
import { DesmoHub } from "../typechain";

describe("DESMOHub tests", function () {
    let hub: DesmoHub;

    beforeEach(async function () {
      const DESMOHUB = await ethers.getContractFactory("DesmoHub");
      hub = await DESMOHUB.deploy();
      await hub.deployed();
    });

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

      it("Should correctly return the length of enabled TDDs", async function () {
        const addresses = await ethers.getSigners();
        const fakeTDDURLs = [
          "https://test.it/1",
          "https://test.it/2",
          "https://test.it/3",
          "https://test.it/4",
          "https://test.it/5",
          "https://test.it/6",
        ];

        for (let i = 0; i < fakeTDDURLs.length; i++) {
          await hub.connect(addresses[i]).registerTDD(fakeTDDURLs[i])
        }
        
        const length = await hub.getEnabledTDDsStorageLength();
        expect(length.toNumber()).to.equal(6);
      });

      it("Should enumerate enabled TDDs", async function () {
        const addresses = await ethers.getSigners();
        const fakeTDDURLs = [
          "https://test.it/1",
          "https://test.it/2",
          "https://test.it/3",
          "https://test.it/4",
          "https://test.it/5",
          "https://test.it/6",
        ];

        for (let i = 0; i < fakeTDDURLs.length; i++) {
          await hub.connect(addresses[i]).registerTDD(fakeTDDURLs[i])
        }
        
        const enabled = [];
        for (let i = 0; i < fakeTDDURLs.length; i++) {
          enabled.push(await hub.getEnabledTDDByIndex(i));
        }
        expect(enabled.map(tdd => tdd.url)).to.deep.equal(fakeTDDURLs);
      });

      it("Should correctly return the length of enabled TDDs with disabled TDDs", async function () {
        const addresses = await ethers.getSigners();
        const fakeTDDURLs = [
          "https://test.it/1",
          "https://test.it/2",
          "https://test.it/3",
          "https://test.it/4",
          "https://test.it/5",
          "https://test.it/6",
        ];

        for (let i = 0; i < fakeTDDURLs.length; i++) {
          await hub.connect(addresses[i]).registerTDD(fakeTDDURLs[i])
        }

        await hub.connect(addresses[0]).disableTDD();
        await hub.connect(addresses[2]).disableTDD();
        
        const length = await hub.getEnabledTDDsStorageLength();
        expect(length.toNumber()).to.equal(4);
      });

      it("Should enumerate enabled TDDs when there are disabled TDDs", async function () {
        const addresses = await ethers.getSigners();
        const fakeTDDURLs = [
          "https://test.it/1",
          "https://test.it/2",
          "https://test.it/3",
          "https://test.it/4",
          "https://test.it/5",
          "https://test.it/6",
        ];

        for (let i = 0; i < fakeTDDURLs.length; i++) {
          await hub.connect(addresses[i]).registerTDD(fakeTDDURLs[i])
        }
        
        await hub.connect(addresses[0]).disableTDD();
        await hub.connect(addresses[2]).disableTDD();

        const enabled = [];
        for (let i = 0; i < fakeTDDURLs.length - 2; i++) {
          enabled.push(await hub.getEnabledTDDByIndex(i));
        }
        expect(enabled.map(tdd => tdd.url)).to.have.members(fakeTDDURLs.filter((_, i) => i !== 0 && i !== 2));
      });
});
