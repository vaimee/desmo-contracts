import { Provider } from "@ethersproject/abstract-provider";
import { expect } from "chai";
import { Console } from "console";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { DesmoLDHub } from "../typechain";


describe("DESMO-LD contract", function (){
  let hub: DesmoLDHub;

  beforeEach(async function () {
    const DESMOHUB = await ethers.getContractFactory("DesmoLDHub");
    hub = await DESMOHUB.deploy();
    await hub.deployed();
  });

  describe("DESMO-LD HUB - Units tests", function () {
    it("Should register new TDD", async function () {
      const [addr1] = await ethers.getSigners();

      const TDD = {
        url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
        owner: addr1.address,
        disabled: false
      }
  
      await expect(
        hub.connect(addr1).registerTDD(TDD)
      ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled); 
    });
    
    // Should fail to register new TDD?
    it("Should fail to register new TDD", async function () {
      const [addr1] = await ethers.getSigners();

      const TDD = {
        url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
        owner: addr1.address,
        disabled: false
      }
  
      const TDD2 = {
        url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
        owner: addr1.address,
        disabled: false
      }
  
      await expect(
        hub.connect(addr1).registerTDD(TDD)
      ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled); 
  
      await expect(
        hub.connect(addr1).registerTDD(TDD2)
      ).to.be.revertedWith('Disable the last one');
    });

    it("Should disable TDD", async function () {
      const [addr1, addr2] = await ethers.getSigners();

      const TDD = {
        url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
        owner: addr1.address,
        disabled: false
      }
  
      const TDD2 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
        owner: addr2.address,
        disabled: false
      }      
      
      await expect(
        hub.connect(addr1).registerTDD(TDD)
      ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled);

      await expect(
        hub.connect(addr2).registerTDD(TDD2)
      ).emit(hub, "TDDCreated").withArgs(addr2.address, TDD2.url, TDD.disabled);
  
      await expect(
        hub.connect(addr1).disableTDD()
      ).emit(hub, "TDDDisabled").withArgs(addr1.address, TDD.url);
    });
  
    it("Should fail to disable TDD", async function () {
      const [addr1, addr2] = await ethers.getSigners();

      const TDD = {
        url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
        owner: addr1.address,
        disabled: false
      }
  
      await expect(
        hub.connect(addr1).registerTDD(TDD)
      ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled);
  
      await expect(
        hub.connect(addr2).disableTDD()
      ).to.be.revertedWith('Not the TDD owner.');
    });
  
    it("Should enable TDD", async function () {
      const [addr1] = await ethers.getSigners();

      const TDD = {
        url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
        owner: addr1.address,
        disabled: false
      }
  
      await expect(
        hub.connect(addr1).registerTDD(TDD)
      ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled);
  
      await expect(
        hub.connect(addr1).disableTDD()
      ).emit(hub, "TDDDisabled").withArgs(addr1.address, TDD.url);
  
      await expect(
        hub.connect(addr1).enableTDD()
      ).emit(hub, "TDDEnabled").withArgs(addr1.address, TDD.url);
    });
  
    it("Should get TDD", async function () {
      const [addr1] = await ethers.getSigners();

      const TDD = {
        url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
        owner: addr1.address,
        disabled: false
      }

      await expect(
        hub.connect(addr1).registerTDD(TDD)
      ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled);
  
      await expect(
        hub.connect(addr1).getTDD()
      ).emit(hub, "TDDRetrieval").withArgs(TDD.owner, TDD.url, TDD.disabled);
  
    });

    it("Should fail get TDD when no TDD was created", async function () {
      const [addr1] = await ethers.getSigners();

      await expect(
        hub.connect(addr1).getTDD()
      ).to.be.revertedWith('No TDD available. ');
    });
    
    it("Should fail to get TDD when no TDD owner", async function () {
      const [addr1, addr2] = await ethers.getSigners();

      const TDD = {
        url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
        owner: addr1.address,
        disabled: false
      }

      await expect(
        hub.connect(addr1).registerTDD(TDD)
      ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled);
  
      await expect(
        hub.connect(addr2).getTDD()
      ).emit(hub, "TDDRetrieval").to.be.revertedWith('Not the TDD owner.');
  
    });
  });
  
  describe("DESMO-LD HUB - Transactions tests", function () {
    // it("Should re-register new TDD", async function () {
    //   const [addr1] = await ethers.getSigners();

    //   const TDD = {
    //     url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
    //     owner: addr1.address,
    //     disabled: false
    //   }

    //   const TDD2 = {
    //     url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:001",
    //     owner: addr1.address,
    //     disabled: false
    //   }
      
    //   await expect(
    //     hub.connect(addr1).registerTDD(TDD)
    //   ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url);
      
    //   await expect(
    //     hub.connect(addr1).registerTDD(TDD2)
    //   ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url);
      

    // });

    // it("Should  fail re-register new TDD", async function () {
    // const [addr1] = await ethers.getSigners();

    // const TDD = {
    //   url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
    //   owner: addr1.address,
    //   disabled: false
    // }

    // const TDD2 = {
    //   url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:001",
    //   owner: addr1.address,
    //   disabled: false
    // }
    
    // });

    it("Should return a key to retrieve the TDD subset", async function () {
      const [addr1, addr2, addr3] = await ethers.getSigners();

      const TDD = {
        url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
        owner: addr1.address,
        disabled: false
      }

      const TDD2 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
        owner: addr2.address,
        disabled: false
      }
  
      const TDD3 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
        owner: addr3.address,
        disabled: false
      }

      await expect(
        hub.connect(addr1).registerTDD(TDD)
      ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled);
      
      await expect(
        hub.connect(addr2).registerTDD(TDD2)
      ).emit(hub, "TDDCreated").withArgs(addr2.address, TDD2.url, TDD.disabled);
  
      await expect(
        hub.connect(addr3).registerTDD(TDD3)
      ).emit(hub, "TDDCreated").withArgs(addr3.address, TDD3.url, TDD.disabled);
  
      await expect(
        hub.connect(addr1).getNewRequestID()
      );
    });

    it("Should fail to retrieve TDD from an empty TDD Storager", async function () {
      await expect(
        hub.getNewRequestID()
      ).to.be.revertedWith('No TDD available. '); 
    });
    
    it("Should retrieve the TDD subset", async function () {
      const [addr1, addr2, addr3, addr4] = await ethers.getSigners();

      const TDD = {
        url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
        owner: addr1.address,
        disabled: false
      }
  
      const TDD2 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
        owner: addr2.address,
        disabled: false
      }
  
      const TDD3 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
        owner: addr3.address,
        disabled: false
      }
   
      const TDD4 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
        owner: addr4.address,
        disabled: false
      }

      await expect(
        hub.connect(addr1).registerTDD(TDD)
      ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled);

      await expect(
        hub.connect(addr2).registerTDD(TDD2)
      ).emit(hub, "TDDCreated").withArgs(addr2.address, TDD2.url, TDD.disabled);
  
      await expect(
        hub.connect(addr3).registerTDD(TDD3)
      ).emit(hub, "TDDCreated").withArgs(addr3.address, TDD3.url, TDD.disabled);
   
      await expect(
        hub.connect(addr4).registerTDD(TDD4)
      ).emit(hub, "TDDCreated").withArgs(addr4.address, TDD4.url, TDD.disabled);
  
      await expect(
        hub.connect(addr1).getNewRequestID.call(1390849295786071768276380950238675083608645509734)
      );
    });
  
    it("Should retrieve smaller TDD subset", async function () {
      const [addr1, addr2] = await ethers.getSigners();

      const TDD = {
        url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
        owner: addr1.address,
        disabled: false
      }

      const TDD2 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
        owner: addr2.address,
        disabled: false
      }

      await expect(
        hub.connect(addr1).registerTDD(TDD)
      ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled);

      await expect(
        hub.connect(addr2).registerTDD(TDD2)
      ).emit(hub, "TDDCreated").withArgs(addr2.address, TDD2.url, TDD.disabled);
  
      await expect(
        hub.connect(addr1).getNewRequestID()
      );
    });
  
    it("Should skip disabled TDD", async function () {
      const [addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

      const TDD = {
        url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
        owner: addr1.address,
        disabled: false
      }
  

  
      const TDD2 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
        owner: addr2.address,
        disabled: false
      }
  

  
      const TDD3 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
        owner: addr3.address,
        disabled: false
      }
  

  
      const TDD4 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
        owner: addr4.address,
        disabled: false
      }

      
      const TDD5 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005",
        owner: addr5.address,
        disabled: false
      }

      await expect(
        hub.connect(addr1).registerTDD(TDD)
      ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled);

      await expect(
        hub.connect(addr2).registerTDD(TDD2)
      ).emit(hub, "TDDCreated").withArgs(addr2.address, TDD2.url, TDD.disabled);

      await expect(
        hub.connect(addr3).registerTDD(TDD3)
      ).emit(hub, "TDDCreated").withArgs(addr3.address, TDD3.url, TDD.disabled);
  
      await expect(
        hub.connect(addr4).registerTDD(TDD4)
      ).emit(hub, "TDDCreated").withArgs(addr4.address, TDD4.url, TDD.disabled);
      
      await expect(
        hub.connect(addr5).registerTDD(TDD5)
      ).emit(hub, "TDDCreated").withArgs(addr5.address,TDD5.url, TDD.disabled);
  
      await expect(
        hub.connect(addr1).disableTDD()
      ).emit(hub, "TDDDisabled").withArgs(addr1.address, TDD.url);    
  
      await expect(
        hub.connect(addr2).getNewRequestID()
      );
  
      await expect(
        hub.connect(addr3).getNewRequestID()
      );
  
      // Uncomment this to check the results
      //let subsetTDDs = await hub.connect(addr2).viewSelected("642829559307850963015472508762062935916233390536");
    });
    
    it("Should select different TDDs for each client", async function () {
      const [addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

      const TDD = {
        url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
        owner: addr1.address,
        disabled: false
      }

      const TDD2 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
        owner: addr2.address,
        disabled: false
      }
        
      const TDD3 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
        owner: addr3.address,
        disabled: false
      }

      const TDD4 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
        owner: addr4.address,
        disabled: false
      }

      const TDD5 = {
        url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005",
        owner: addr5.address,
        disabled: false
      }
  
      await expect(
        hub.connect(addr1).registerTDD(TDD)
      ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled);
  
      await expect(
        hub.connect(addr2).registerTDD(TDD2)
      ).emit(hub, "TDDCreated").withArgs(addr2.address, TDD2.url, TDD.disabled);

      await expect(
        hub.connect(addr3).registerTDD(TDD3)
      ).emit(hub, "TDDCreated").withArgs(addr3.address, TDD3.url, TDD.disabled);

      await expect(
        hub.connect(addr4).registerTDD(TDD4)
      ).emit(hub, "TDDCreated").withArgs(addr4.address, TDD4.url, TDD.disabled);

      await expect(
        hub.connect(addr5).registerTDD(TDD5)
      ).emit(hub, "TDDCreated").withArgs(addr5.address,TDD5.url, TDD.disabled);
      
      await expect(
        hub.connect(addr1).disableTDD()
      ).emit(hub, "TDDDisabled").withArgs(addr1.address, TDD.url);    
  
      await expect(
        hub.connect(addr1).getNewRequestID()
      );
  
      await expect(
        hub.connect(addr2).getNewRequestID()
      );

      await expect(
        hub.connect(addr3).getNewRequestID()
      );

      await expect(
        hub.connect(addr4).getNewRequestID()
      );

      await expect(
        hub.connect(addr5).getNewRequestID()
      );

      // Uncomment this to check the results
      // let subsetTDDs = await hub.connect(addr1).viewSelected("1390849295786071768276380950238675083608645509734");
      // let subsetTDDs2 = await hub.connect(addr2).viewSelected("642829559307850963015472508762062935916233390536");
      // let subsetTDDs3 = await hub.connect(addr3).viewSelected("344073830386746567427978432078835137280280269756");
      // let subsetTDDs4 = await hub.connect(addr4).viewSelected("827616541489050293873067319834814086332722428166");
      // let subsetTDDs5 = await hub.connect(addr5).viewSelected("124600769394618761707529974069218112888608942693");
    });
  });
})



