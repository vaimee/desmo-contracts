import { expect } from "chai";
import { ethers } from "hardhat";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("DESMO-LD HUB", function () {
  it("Should store new DiD", async function () {
    const DESMOHUB = await ethers.getContractFactory("DESMOLDHUB.sol");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    

  });
}); 
