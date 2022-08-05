import { Provider } from "@ethersproject/abstract-provider";
import { expect } from "chai";
import { Console } from "console";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { DesmoLDHub, DesmoLDContract } from "../typechain";

describe("DESMO Contracts tests", function() {
  describe("DESMO-LD HUB contract tests", function (){
    let hub: DesmoLDHub;
    
    beforeEach(async function () {
      const DESMOHUB = await ethers.getContractFactory("DesmoLDHub");
      hub = await DESMOHUB.deploy();
      await hub.deployed();
    });
    
    describe("DESMO-LD HUB - Units tests", async function () {
  
        it("Should register new TDD", async function () {
          const [addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    
          const TDD = {
            url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr1.address,
            disabled: false,
            score:0
          }
      
          await expect(
            hub.connect(addr1).registerTDD(TDD.url)
          ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score); 
        });
        
        it("Should fail to register new TDD", async function () {
          const [addr1] = await ethers.getSigners();
    
          const TDD = {
            url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr1.address,
            disabled: false,
            score:0
          }
      
          const TDD2 = {
            url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr1.address,
            disabled: false,
            score:0
          }
      
          await expect(
            hub.connect(addr1).registerTDD(TDD.url)
          ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score); 
      
          await expect(
            hub.connect(addr1).registerTDD(TDD2.url)
          ).to.be.revertedWith('Disable the last one');
        });
    
        it("Should disable TDD", async function () {
          const [addr1, addr2] = await ethers.getSigners();
    
          const TDD = {
            url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr1.address,
            disabled: false,
            score:0
          }
      
          const TDD2 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
            owner: addr2.address,
            disabled: false,
            score:0
          }      
          
          await expect(
            hub.connect(addr1).registerTDD(TDD.url)
          ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);
    
          await expect(
            hub.connect(addr2).registerTDD(TDD2.url)
          ).emit(hub, "TDDCreated").withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);
      
          await expect(
            hub.connect(addr1).disableTDD()
          ).emit(hub, "TDDDisabled").withArgs(addr1.address, TDD.url);
        });
      
        it("Should fail to disable TDD", async function () {
          const [addr1, addr2] = await ethers.getSigners();
    
          const TDD = {
            url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr1.address,
            disabled: false,
            score:0
          }
      
          await expect(
            hub.connect(addr1).registerTDD(TDD.url)
          ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);
      
          await expect(
            hub.connect(addr2).disableTDD()
          ).to.be.revertedWith('Not the TDD owner.');
        });
      
        it("Should enable TDD", async function () {
          const [addr1] = await ethers.getSigners();
    
          const TDD = {
            url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr1.address,
            disabled: false,
            score:0
          }
      
          await expect(
            hub.connect(addr1).registerTDD(TDD.url)
          ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);
      
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
            disabled: false,
            score:0
          }
    
          await expect(
            hub.connect(addr1).registerTDD(TDD.url)
          ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);
      
          await expect(
            hub.connect(addr1).getTDD()
          );
      
        });
    
        it("Should fail get TDD when no TDD was created", async function () {
          const [addr1] = await ethers.getSigners();
    
          await expect(
            hub.connect(addr1).getTDD()
          ).to.be.revertedWith('No TDD available.');
        });
        
        it("Should fail to get TDD when address is not TDD owner", async function () {
          const [addr1, addr2] = await ethers.getSigners();
    
          const TDD = {
            url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr1.address,
            disabled: false,
            score:0
          }
    
          await expect(
            hub.connect(addr1).registerTDD(TDD.url)
          ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);
      
          await expect(
            hub.connect(addr2).getTDD()
          ).emit(hub, "TDDRetrieval").to.be.revertedWith('Not the TDD owner.');
      
        });
    });
      
    describe("DESMO-LD HUB - Transactions tests", function () {

        it("Should return a key to retrieve the TDD subset", async function () {
          const [addr1, addr2, addr3] = await ethers.getSigners();
          
          const TDD = {
            url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr2.address,
            disabled: false,
            score:0
          }
    
          await expect(
            hub.connect(addr1).registerTDD(TDD.url)
          ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);
          
          await expect(
            hub.connect(addr1).getNewRequestID()
          );
        });
    
        it("Should fail to retrieve TDD from an empty TDD Storager", async function () {
          await expect(
            hub.getNewRequestID()
          ).to.be.revertedWith('No TDD available.'); 
        });

        it("Should retrieve 4 TDDs", async function () {
            const [addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    
            const TDD = {
              url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
              owner: addr1.address,
              disabled: false,
              score:0
            }
      
            const TDD2 = {
              url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
              owner: addr2.address,
              disabled: false,
              score:0
            }
              
            const TDD3 = {
              url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
              owner: addr3.address,
              disabled: false,
              score:0
            }
      
            const TDD4 = {
              url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
              owner: addr4.address,
              disabled: false,
              score:0
            }
      
            await expect(
              hub.connect(addr1).registerTDD(TDD.url)
            ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);
        
            await expect(
              hub.connect(addr2).registerTDD(TDD2.url)
            ).emit(hub, "TDDCreated").withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);
      
            await expect(
              hub.connect(addr3).registerTDD(TDD3.url)
            ).emit(hub, "TDDCreated").withArgs(addr3.address, TDD3.url, TDD.disabled, TDD.score);
      
            await expect(
              hub.connect(addr4).registerTDD(TDD4.url)
            ).emit(hub, "TDDCreated").withArgs(addr4.address, TDD4.url, TDD.disabled, TDD.score);
      
            const resquestId1 = await hub.connect(addr1).getNewRequestID()        
            const awaitRequestID1 = await resquestId1.wait()
            const awaitRequestID1EventName = awaitRequestID1.events?.find(event => {
              return event.event==="RequestID"
            })
                    
            const requestID = awaitRequestID1EventName?.args;
            
            if(requestID){
              const a = await hub.connect(addr1).getTDDByRequestID(requestID["requestID"])
              expect(a).to.have.members([
                "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001", 
                "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
                "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003", 
                "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004"]);
            }
        });
      
        it("Should retrieve TDDs according to the total storager length", async function () {
          const [addr1, addr2] = await ethers.getSigners();
    
          const TDD = {
            url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr1.address,
            disabled: false,
            score:0
          }
    
          const TDD2 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
            owner: addr2.address,
            disabled: false,
            score:0
          }
    
          await expect(
            hub.connect(addr1).registerTDD(TDD.url)
          ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);
    
          await expect(
            hub.connect(addr2).registerTDD(TDD2.url)
          ).emit(hub, "TDDCreated").withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);
      
          const resquestId1 = await hub.connect(addr1).getNewRequestID()        
          const awaitRequestID1 = await resquestId1.wait()
          const awaitRequestID1EventName = awaitRequestID1.events?.find(event => {
            return event.event==="RequestID"
          })
                  
          const requestID = awaitRequestID1EventName?.args;
          
          if(requestID){
            const a = await hub.connect(addr1).getTDDByRequestID(requestID["requestID"])
            expect(a).to.have.members([
              "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001", 
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002"]);
          }
        });
      
        it("Should skip disabled TDD", async function () {
          const [addr1, addr2, addr3, addr4, addr5, addr6] = await ethers.getSigners();
    
          const TDD = {
            url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr1.address,
            disabled: false,
            score:0
          }
  
          const TDD2 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
            owner: addr2.address,
            disabled: false,
            score:0
          }
  
          const TDD3 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
            owner: addr3.address,
            disabled: false,
            score:0
          }
  
          const TDD4 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
            owner: addr4.address,
            disabled: false,
            score:0
          }
           
          const TDD5 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005",
            owner: addr5.address,
            disabled: false,
            score:0
          }

          const TDD6 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:006",
            owner: addr6.address,
            disabled: false,
            score:0
          }

          await expect(
            hub.connect(addr1).registerTDD(TDD.url)
          ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);
    
          await expect(
            hub.connect(addr2).registerTDD(TDD2.url)
          ).emit(hub, "TDDCreated").withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);
    
          await expect(
            hub.connect(addr3).registerTDD(TDD3.url)
          ).emit(hub, "TDDCreated").withArgs(addr3.address, TDD3.url, TDD.disabled, TDD.score);
      
          await expect(
            hub.connect(addr4).registerTDD(TDD4.url)
          ).emit(hub, "TDDCreated").withArgs(addr4.address, TDD4.url, TDD.disabled, TDD.score);
          
          await expect(
            hub.connect(addr5).registerTDD(TDD5.url)
          ).emit(hub, "TDDCreated").withArgs(addr5.address,TDD5.url, TDD.disabled, TDD.score);
          
          await expect(
            hub.connect(addr6).registerTDD(TDD6.url)
          ).emit(hub, "TDDCreated").withArgs(addr6.address,TDD6.url, TDD.disabled, TDD.score);
      
          await expect(
            hub.connect(addr1).disableTDD()
          ).emit(hub, "TDDDisabled").withArgs(addr1.address, TDD.url);    
      
          const resquestId1 = await hub.connect(addr1).getNewRequestID()        
          const awaitRequestID1 = await resquestId1.wait()
          const awaitRequestID1EventName = awaitRequestID1.events?.find(event => {
            return event.event==="RequestID"
          })
                  
          const requestID = awaitRequestID1EventName?.args;
          
          if(requestID){
            const a = await hub.connect(addr1).getTDDByRequestID(requestID["requestID"])
            expect(a).to.have.members([ 
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003", 
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005"]);
          }
        });

        it("Should select different TDDs for each client", async function () {
          const [addr1, addr2, addr3, addr4, addr5, addr6] = await ethers.getSigners();
    
          const TDD = {
            url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr1.address,
            disabled: false,
            score:0
          }
    
          const TDD2 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
            owner: addr2.address,
            disabled: false,
            score:0
          }
            
          const TDD3 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
            owner: addr3.address,
            disabled: false,
            score:0
          }
    
          const TDD4 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
            owner: addr4.address,
            disabled: false,
            score:0
          }

          const TDD5 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005",
            owner: addr5.address,
            disabled: false,
            score:0
          }
          
          const TDD6 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:006",
            owner: addr6.address,
            disabled: false,
            score:0
          }

          await expect(
            hub.connect(addr1).registerTDD(TDD.url)
          ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);
      
          await expect(
            hub.connect(addr2).registerTDD(TDD2.url)
          ).emit(hub, "TDDCreated").withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);
    
          await expect(
            hub.connect(addr3).registerTDD(TDD3.url)
          ).emit(hub, "TDDCreated").withArgs(addr3.address, TDD3.url, TDD.disabled, TDD.score);
    
          await expect(
            hub.connect(addr4).registerTDD(TDD4.url)
          ).emit(hub, "TDDCreated").withArgs(addr4.address, TDD4.url, TDD.disabled, TDD.score);
        
          await expect(
            hub.connect(addr5).registerTDD(TDD5.url)
          ).emit(hub, "TDDCreated").withArgs(addr5.address, TDD5.url, TDD.disabled, TDD.score);
          
          await expect(
            hub.connect(addr6).registerTDD(TDD6.url)
          ).emit(hub, "TDDCreated").withArgs(addr6.address, TDD6.url, TDD.disabled, TDD.score);
    
          const resquestId1 = await hub.connect(addr1).getNewRequestID();        
          const awaitRequestID1 = await resquestId1.wait();
          
          const awaitRequestID1EventName = awaitRequestID1.events?.find(event => {
            return event.event==="RequestID"
          })
                   
          const requestID = awaitRequestID1EventName?.args;
          
          if(requestID) {
            const a = await hub.connect(addr1).getTDDByRequestID(requestID["requestID"]);
            expect(a).to.have.members([
              "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001", 
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003", 
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004"]);
          }

          const resquestId2 = await hub.connect(addr2).getNewRequestID();        
          const awaitRequestID2 = await resquestId2.wait();
          const awaitRequestID2EventName = awaitRequestID2.events?.find(event => {
            return event.event==="RequestID"
          })
                   
          const requestID2 = awaitRequestID2EventName?.args;
          
          if(requestID2){
            const b = await hub.connect(addr2).getTDDByRequestID(requestID2["requestID"])
            expect(b).to.have.members([
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005", 
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:006",
              "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001", 
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002"]);
          }
        });

        it("Should select different TDDs for each client after TDD2 disabled", async function () {
          const [addr1, addr2, addr3, addr4, addr5, addr6] = await ethers.getSigners();
    
          const TDD = {
            url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
            owner: addr1.address,
            disabled: false,
            score:0
          }
    
          const TDD2 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
            owner: addr2.address,
            disabled: false,
            score:0
          }
            
          const TDD3 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
            owner: addr3.address,
            disabled: false,
            score:0
          }
    
          const TDD4 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
            owner: addr4.address,
            disabled: false,
            score:0
          }

          const TDD5 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005",
            owner: addr5.address,
            disabled: false,
            score:0
          }
          
          const TDD6 = {
            url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:006",
            owner: addr6.address,
            disabled: false,
            score:0
          }

          await expect(
            hub.connect(addr1).registerTDD(TDD.url)
          ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);
      
          await expect(
            hub.connect(addr2).registerTDD(TDD2.url)
          ).emit(hub, "TDDCreated").withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);
    
          await expect(
            hub.connect(addr3).registerTDD(TDD3.url)
          ).emit(hub, "TDDCreated").withArgs(addr3.address, TDD3.url, TDD.disabled, TDD.score);
    
          await expect(
            hub.connect(addr4).registerTDD(TDD4.url)
          ).emit(hub, "TDDCreated").withArgs(addr4.address, TDD4.url, TDD.disabled, TDD.score);
        
          await expect(
            hub.connect(addr5).registerTDD(TDD5.url)
          ).emit(hub, "TDDCreated").withArgs(addr5.address, TDD5.url, TDD.disabled, TDD.score);
          
          await expect(
            hub.connect(addr6).registerTDD(TDD6.url)
          ).emit(hub, "TDDCreated").withArgs(addr6.address, TDD6.url, TDD.disabled, TDD.score);
          
          await expect(
            hub.connect(addr2).disableTDD()
          ).emit(hub, "TDDDisabled").withArgs(addr2.address, TDD2.url);    
      
          const resquestId1 = await hub.connect(addr1).getNewRequestID();        
          const awaitRequestID1 = await resquestId1.wait();
          
          const awaitRequestID1EventName = awaitRequestID1.events?.find(event => {
            return event.event==="RequestID"
          })
                   
          const requestID = awaitRequestID1EventName?.args;
          
          if(requestID) {
            const a = await hub.connect(addr1).getTDDByRequestID(requestID["requestID"]);
            expect(a).to.have.members([
              "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001", 
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004", 
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:005"]);
          }

          const resquestId2 = await hub.connect(addr2).getNewRequestID();        
          const awaitRequestID2 = await resquestId2.wait();
          const awaitRequestID2EventName = awaitRequestID2.events?.find(event => {
            return event.event==="RequestID"
          })
                   
          const requestID2 = awaitRequestID2EventName?.args;
          
          if(requestID2){
            const b = await hub.connect(addr2).getTDDByRequestID(requestID2["requestID"])
            expect(b).to.have.members([
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:006", 
              "https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001", 
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
              "https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004"]);
          }
        });

    });
  });
  
  // describe("DESMO-LD Contract tests", function () {
  //   let desmo: DesmoLDContract;
  //   let hub: DesmoLDHub;

  //   beforeEach(async function () {
  //     const DESMOHUB = await ethers.getContractFactory("DesmoLDHub");
  //     hub = await DESMOHUB.deploy();
  //     await hub.deployed();
 
  //     const DESMCONTRACT = await ethers.getContractFactory("DesmoLDContract");
  //     desmo = await DESMCONTRACT.deploy(hub.address);
  //     await desmo.deployed();
  //   });
    
  //   describe("DESMO-LD Contract transactions tests", function () {
  //     it("Should receive query result with 4 scores", async function () {
  //       const [addr1] = await ethers.getSigners();
  //       await desmo.connect(addr1).receiveResult("0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712", "0x2000000000000000000000000000000000000000000000000000000000000000000402020003112e90");
  //     });

  //     it("Should receive query result with 8 scores", async function () {
  //       const [addr1] = await ethers.getSigners();
  //       await desmo.connect(addr1).receiveResult("0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712", "0x200000000000000000000000000000000000000000000000000000000000000000008010101020102000200025110f013");
  //     });

  //     it("Should receive query result with 8 scores and string", async function () {
  //       const [addr1] = await ethers.getSigners();
  //         await desmo.connect(addr1).receiveResult("0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712", "0x20000000000000000000000000000000000000000000000000000000000000000000801020002010100021400700072006f007600610020007100750065007300740061002000e800200075006e006100200073007400720069006e00670061");  
  //     });

  //     it("Should update TDD scores", async function () {
  //       const [addr1, addr2, addr3, addr4] = await ethers.getSigners();
  
  //       const TDD = {
  //         url:"https://www.desmo.vaimee.it/2019/wot/tdd/v1/TDD:001",
  //         owner: addr1.address,
  //         disabled: false,
  //         score:0
  //       }
  
  //       const TDD2 = {
  //         url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:002",
  //         owner: addr2.address,
  //         disabled: false,
  //         score:0
  //       }
          
  //       const TDD3 = {
  //         url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:003",
  //         owner: addr3.address,
  //         disabled: false,
  //         score:0
  //       }
  
  //       const TDD4 = {
  //         url:"https://www.brenno.com.br/2019/wot/tdd/v1/TDD:004",
  //         owner: addr4.address,
  //         disabled: false,
  //         score:0
  //       }
  
  //       await expect(
  //         hub.connect(addr1).registerTDD(TDD.url)
  //       ).emit(hub, "TDDCreated").withArgs(addr1.address, TDD.url, TDD.disabled, TDD.score);
    
  //       await expect(
  //         hub.connect(addr2).registerTDD(TDD2.url)
  //       ).emit(hub, "TDDCreated").withArgs(addr2.address, TDD2.url, TDD.disabled, TDD.score);
  
  //       await expect(
  //         hub.connect(addr3).registerTDD(TDD3.url)
  //       ).emit(hub, "TDDCreated").withArgs(addr3.address, TDD3.url, TDD.disabled, TDD.score);
  
  //       await expect(
  //         hub.connect(addr4).registerTDD(TDD4.url)
  //       ).emit(hub, "TDDCreated").withArgs(addr4.address, TDD4.url, TDD.disabled, TDD.score);
  
  //       hub.connect(addr1).updateScores("0x0000000000000000000000000000000000000000000000000000000000000000", "0x0402020003");
  //     });
  //   });
  // });
});




