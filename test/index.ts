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
  it("Should register new TDD", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    const TDD = {
      url:"urn:thing:description:directory:tdd1"
    }

    const hubRegisterTDD = await hub.registerTDD(TDD);
    await hubRegisterTDD.wait();
  });

  it("Should unregister TDD", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    const TDD = {
      url:"urn:thing:description:directory:tdd1"
    }
    const hubRegisterTDD = await hub.registerTDD(TDD);
    await hubRegisterTDD.wait();

    const hubUnregisterTDD = await hub.unregisterTDD();
    await hubUnregisterTDD.wait();
  });

  it("Should return a key for the selected TDDs", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();


    const TDD = {
      url:"urn:thing:description:directory:tdd1"
    }
    const hubRegisterTDD = await hub.registerTDD(TDD);
    await hubRegisterTDD.wait();

    let idRequester = await hub.getNewRequestID();
    await idRequester.wait(); 

  });

  it("Should return the selected TDDs", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();
    
    const TDD = {
      url:"urn:thing:description:directory:tdd1"
    }
    const hubRegisterTDD = await hub.registerTDD(TDD);
    await hubRegisterTDD.wait();

    let idRequester = await hub.getNewRequestID();
    await idRequester.wait(); 

    let subsetTDDs = await hub.viewSelected("1390849295786071768276380950238675083608645509734");
    // call funtion to return the tdd subset list 
  });

}); 
