import { expect } from "chai";
import { Console } from "console";
import { ethers } from "hardhat";


describe("DESMO-LD HUB - TDD Maintenece Transactions", function () {
  it("Should register new TDD", async function () {
    const DESMOHUB = await ethers.getContractFactory("DesmoLDHub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();
    
    const [addr1] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    const hubRegisterTDD = hub.connect(addr1).registerTDD(TDD);
    await expect(hubRegisterTDD).emit(hub, "TDDCreated").withArgs(addr1.address); 
  });

  it("Should fail to register new TDD", async function () {
    const DESMOHUB = await ethers.getContractFactory("DesmoLDHub");
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
    await expect(hubRegisterTDD).emit(hub, "TDDCreated").withArgs(addr1.address); 

    await expect(hub.connect(addr1).registerTDD(TDD2)).to.be.revertedWith('Sender already stored a value.');
  });

  it("Should disable TDD", async function () {
    const DESMOHUB = await ethers.getContractFactory("DesmoLDHub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    const [addr1, addr2] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    const hubRegisterTDD = await hub.connect(addr1).registerTDD(TDD);
    await expect(hubRegisterTDD).emit(hub, "TDDCreated").withArgs(addr1.address);

    const TDD2 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
      owner: addr2.address
    }
 
    const hubRegisterTDD2 = hub.connect(addr2).registerTDD(TDD2);  
    await expect(hubRegisterTDD2).emit(hub, "TDDCreated").withArgs(addr2.address);

    const hubDisableTDD = hub.connect(addr1).disableTDD(true);
    await expect(hubDisableTDD).emit(hub, "TDDDisabled").withArgs(addr1.address);
  });

  it("Should fail to disable TDD", async function () {
    const DESMOHUB = await ethers.getContractFactory("DesmoLDHub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    const [addr1, addr2] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    const hubRegisterTDD = await hub.connect(addr1).registerTDD(TDD);
    await expect(hubRegisterTDD).emit(hub, "TDDCreated").withArgs(addr1.address);

    await expect(hub.connect(addr2).disableTDD(true)).to.be.revertedWith('Not the TDD owner.');
  });

  it("Should enable TDD", async function () {
    const DESMOHUB = await ethers.getContractFactory("DesmoLDHub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    const [addr1, addr2] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    const hubRegisterTDD = await hub.connect(addr1).registerTDD(TDD);
    await expect(hubRegisterTDD).emit(hub, "TDDCreated").withArgs(addr1.address);

    const hubDisableTDD = hub.connect(addr1).disableTDD(true);
    await expect(hubDisableTDD).emit(hub, "TDDDisabled").withArgs(addr1.address);

    const hubEnableTDD = await hub.connect(addr1).enableTDD(true);
    await expect(hubEnableTDD).emit(hub, "TDDEnabled").withArgs(addr1.address);
  });
});

describe("DESMO-LD HUB - Select TDD Subset Transactions", function () {
  it("Should return a key to retrieve the TDD subset", async function () {
    const DESMOHUB = await ethers.getContractFactory("DesmoLDHub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    const [addr1, addr2, addr3] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    const hubRegisterTDD = hub.connect(addr1).registerTDD(TDD);
    await expect(hubRegisterTDD).emit(hub, "TDDCreated").withArgs(addr1.address);

    const TDD2 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
      owner: addr2.address
    }

    const hubRegisterTDD2 = hub.connect(addr2).registerTDD(TDD2);
    await expect(hubRegisterTDD2).emit(hub, "TDDCreated").withArgs(addr2.address);

    const TDD3 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
      owner: addr3.address
    }
 
    const hubRegisterTDD3 = hub.connect(addr3).registerTDD(TDD3);
    await expect(hubRegisterTDD3).emit(hub, "TDDCreated").withArgs(addr3.address);

    let idRequester = hub.connect(addr1).getNewRequestID();
    await expect(idRequester);
  });

  it("Should fail to retrieve TDD from an empty TDD Storager", async function () {
    const DESMOHUB = await ethers.getContractFactory("DesmoLDHub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();

    await expect(hub.getNewRequestID()).to.be.revertedWith('No TDD available. '); 
  });
  
  it("Should retrieve the TDD subset by key", async function () {
    const DESMOHUB = await ethers.getContractFactory("DesmoLDHub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();
    

    const [addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    const hubRegisterTDD = hub.connect(addr1).registerTDD(TDD);
    await expect(hubRegisterTDD).emit(hub, "TDDCreated").withArgs(addr1.address);

    const TDD2 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
      owner: addr2.address
    }

    const hubRegisterTDD2 = hub.connect(addr2).registerTDD(TDD2);
    await expect(hubRegisterTDD2).emit(hub, "TDDCreated").withArgs(addr2.address);

    const TDD3 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
      owner: addr3.address
    }
 
    const hubRegisterTDD3 = hub.connect(addr3).registerTDD(TDD3);
    await expect(hubRegisterTDD3).emit(hub, "TDDCreated").withArgs(addr3.address);

    const TDD4 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
      owner: addr4.address
    }
 
    const hubRegisterTDD4 = hub.connect(addr4).registerTDD(TDD4);
    await expect(hubRegisterTDD4).emit(hub, "TDDCreated").withArgs(addr4.address);

    const idRequester = await hub.connect(addr1).getNewRequestID.call(1390849295786071768276380950238675083608645509734);
    //console.log(idRequester)
    //expect(idRequester).eq(1390849295786071768276380950238675083608645509734);
    
    //let subsetTDDs = await hub.connect(addr1).viewSelected(1652811379);

    // let idRequester2 = hub.connect(addr1).getNewRequestID();
    // await expect(idRequester2);

    // //let subsetTDDs2 = await hub.connect(addr1).viewSelected("1390849295786071768276380950238675083608645509734");
    
    // let idRequester3 = hub.connect(addr2).getNewRequestID();
    // await expect(idRequester3);


    // //let subsetTDDs3 = await hub.connect(addr1).viewSelected("642829559307850963015472508762062935916233390536");

    // let idRequester4 = hub.connect(addr3).getNewRequestID();
    // await expect(idRequester4);
    
    //let subsetTDDs4 = await hub.connect(addr3).viewSelected("344073830386746567427978432078835137280280269756");
  });

  it("Should retrieve smaller TDD subset", async function () {
    const DESMOHUB = await ethers.getContractFactory("DesmoLDHub");
    const hub = await DESMOHUB.deploy();
    await hub.deployed();
    

    const [addr1, addr2, addr3] = await ethers.getSigners();

    const TDD = {
      url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
      owner: addr1.address
    }

    const hubRegisterTDD = hub.connect(addr1).registerTDD(TDD);
    await expect(hubRegisterTDD).emit(hub, "TDDCreated").withArgs(addr1.address);

    const TDD2 = {
      url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
      owner: addr2.address
    }

    const hubRegisterTDD2 = hub.connect(addr2).registerTDD(TDD2);
    await expect(hubRegisterTDD2).emit(hub, "TDDCreated").withArgs(addr2.address);

    const idRequester = hub.connect(addr1).getNewRequestID();
    await expect(idRequester);

    //let subsetTDDs = await hub.connect(addr1).viewSelected("1390849295786071768276380950238675083608645509734");
    // call funtion to return the tdd subset list 
  });
}); 
