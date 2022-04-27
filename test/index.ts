import { expect } from "chai";
import { ethers } from "hardhat";

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
    
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

describe("DESMO-LD HUB", function () {
  it("Should register new DiD", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    const hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd1");
    await hubRegisterTDD.wait();
  });

  it("Should unregister TDD", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    let hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd1");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd2");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd3");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd4");
    await hubRegisterTDD.wait();
    
    const hubUnregisterTDD = await hub.unregisterTDD("urn:thing:description:directory:tdd3");
    await hubUnregisterTDD.wait();

    let hubStorage = await hub.viewStorage();
    await hubStorage.wait();
  });

  it("Should return a key for the selected TDDs", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    let hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd1");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd2");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd3");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd4");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd5");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd6");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd7");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd8");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd9");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd10");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd11");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd12");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd13");
    hubRegisterTDD = await hub.registerTDD("urn:thing:description:directory:tdd14");
    await hubRegisterTDD.wait();

    let hubStorage = await hub.viewStorage();
    await hubStorage.wait();

    let idRequester = await hub.getNewRequestID();
    await idRequester.wait(); 

  });

  

}); 
