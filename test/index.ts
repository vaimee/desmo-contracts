import { expect } from "chai";
import { Console } from "console";
import { ethers } from "hardhat";


describe("DESMO-LD HUB", function () {

  it("Should register new TDD", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();
    
    const [addr1] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    let hubRegisterTDD = await hub.connect(addr1).registerTDD(TDD);
    await hubRegisterTDD.wait();
    //await hubRegisterTDD.wait();
  });

  it("Should not register new TDD", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();
    
    const [addr1] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    const TDD2 = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    let hubRegisterTDD = await hub.connect(addr1).registerTDD(TDD);
    await hubRegisterTDD.wait();

    await expect(hub.connect(addr1).registerTDD(TDD2)).to.be.revertedWith('Sender already stored a value.');
  });

  it("Should disable TDD", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    const [addr1, addr2] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    const hubRegisterTDD = await hub.connect(addr1).registerTDD(TDD);
    await hubRegisterTDD.wait();

    const TDD2 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
      owner: addr2.address
    }
 
    const hubRegisterTDD2 = await hub.connect(addr2).registerTDD(TDD2);
    await hubRegisterTDD2.wait();

    const hubUnregisterTDD = await hub.connect(addr1).disableTDD(true);
    await hubUnregisterTDD.wait();
  });

  it("Should fail to disable TDD", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    const [addr1, addr2] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    const hubRegisterTDD = await hub.connect(addr1).registerTDD(TDD);
    await hubRegisterTDD.wait();

    await expect(hub.connect(addr2).disableTDD(true)).to.be.revertedWith('Not the TDD owner.');
  });

  it("Should enable TDD", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    const [addr1, addr2] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    let hubRegisterTDD = await hub.connect(addr1).registerTDD(TDD);
    await hubRegisterTDD.wait();

    const TDD2 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
      owner: addr2.address
    }
 
    const hubRegisterTDD2 = await hub.connect(addr2).registerTDD(TDD2);
    await hubRegisterTDD2.wait();

    // expect(await hub.connect(addr1).disableTDD(true)).to.equal(1);
    hubRegisterTDD = await hub.connect(addr1).disableTDD(true);
    await hubRegisterTDD.wait();

    hubRegisterTDD = await hub.connect(addr1).disableTDD(false);
    await hubRegisterTDD.wait();
  });

  it("Should return a key to retrieve the selected TDDs", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    const [addr1, addr2, addr3] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    const hubRegisterTDD = await hub.connect(addr1).registerTDD(TDD);
    await hubRegisterTDD.wait();

    const TDD2 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
      owner: addr2.address
    }

    const hubRegisterTDD2 = await hub.connect(addr2).registerTDD(TDD2);
    await hubRegisterTDD2.wait();

    const TDD3 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
      owner: addr3.address
    }
 
    const hubRegisterTDD3 = await hub.connect(addr3).registerTDD(TDD3);
    await hubRegisterTDD3.wait();

    let idRequester = await hub.connect(addr1).getNewRequestID();
    await idRequester.wait(); 
  });

  it("Should fail to retrieve TDD from an empty TDD Storager", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    await expect(hub.getNewRequestID()).to.be.revertedWith('No TDD available. '); 
  });
  
  it("Should retrieve the selected TDDs by key", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();
    

    const [addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    const hubRegisterTDD = await hub.connect(addr1).registerTDD(TDD);
    await hubRegisterTDD.wait();

    const TDD2 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
      owner: addr2.address
    }

    const hubRegisterTDD2 = await hub.connect(addr2).registerTDD(TDD2);
    await hubRegisterTDD2.wait();

    const TDD3 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
      owner: addr3.address
    }
 
    const hubRegisterTDD3 = await hub.connect(addr3).registerTDD(TDD3);
    await hubRegisterTDD3.wait();

    const TDD4 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
      owner: addr4.address
    }
 
    const hubRegisterTDD4 = await hub.connect(addr4).registerTDD(TDD4);
    await hubRegisterTDD4.wait();

    let idRequester = await hub.connect(addr1).getNewRequestID();
    await idRequester.wait(); 
    
    //let subsetTDDs = await hub.connect(addr1).viewSelected(1652811379);

    let idRequester2 = await hub.connect(addr1).getNewRequestID();
    await idRequester.wait(); 

    //let subsetTDDs2 = await hub.connect(addr1).viewSelected("1390849295786071768276380950238675083608645509734");
    
    let idRequester3 = await hub.connect(addr2).getNewRequestID();
    await idRequester.wait();


    //let subsetTDDs3 = await hub.connect(addr1).viewSelected("642829559307850963015472508762062935916233390536");

    let idRequester4 = await hub.connect(addr3).getNewRequestID();
    await idRequester.wait(); 
    
    //let subsetTDDs4 = await hub.connect(addr3).viewSelected("344073830386746567427978432078835137280280269756");


    // call funtion to return the tdd subset list 
  });

  it("Should retrieve smaller subset", async function () {
    const DESMOHUB = await ethers.getContractFactory("desmo_ld_hub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();
    

    const [addr1, addr2, addr3] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    const hubRegisterTDD = await hub.connect(addr1).registerTDD(TDD);
    await hubRegisterTDD.wait();

    const TDD2 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
      owner: addr2.address
    }

    const hubRegisterTDD2 = await hub.connect(addr2).registerTDD(TDD2);
    await hubRegisterTDD2.wait();

    let idRequester = await hub.connect(addr1).getNewRequestID();
    await idRequester.wait(); 

    //let subsetTDDs = await hub.connect(addr1).viewSelected("1390849295786071768276380950238675083608645509734");
    // call funtion to return the tdd subset list 
  });
}); 
