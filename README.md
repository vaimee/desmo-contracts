<img src="https://github.com/vaimee/desmo/blob/main/imgs/desmo-logo.png" width="40%" alt='DESMO'/>

# Contracts

![](https://img.shields.io/badge/Ethereum-3C3C3D?style=flat-square&logo=Ethereum&logoColor=618bf3)
![](https://img.shields.io/badge/Solidity-^0.6.0-e6e6e6?style=flat-square&logo=solidity&logoColor=black?labelColor=e6e6e6)
<a href="https://github.com/vaimee/desmo-contracts/issues" target="_blank"><img src="https://img.shields.io/github/issues/vaimee/desmo-contracts.svg?style=flat-square" alt="Issues" /></a>
<a href="https://github.com/vaimee/desmo-contracts/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/vaimee/desmo-contracts.svg?style=flat-square" alt="License" /></a>
<a href="https://discord.gg/B7WZswnH" target="_blank"><img src="https://img.shields.io/badge/Discord-7289DA?style=flat-square&logo=discord&logoColor=white&label=desmo" alt="Discord chat" /></a>
<a href="https://www.linkedin.com/company/vaimee/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&color=blue" alt="LinkedIn" /></a>

**Overview** 

> Desmo is a Smart contract that implements the IExec `IexecDoracle`. Its purpose is to serve as the main API entrypoint for DESMO-LD client Smart Contracts. Additionally, Desmo will implement the logic to randomly select a set of valid Thing Description Directories registered in the DESMOHub. The APIs will serve on-chain clients with endpoints that can search for a device inside the DESMO-LD network of Thing Description Directories, get sensor data and invoke operations on remote sensors.

## Getting started
The best way of using Desmo-LD is to use our handcrafted [SDK](https://github.com/vaimee/desmo-sdk), there you can have access to all the methods and features of our Distrubuted  IoT oracles without a sweat. However, if you want to dive deep into the innerworking of our system you can start from here, and learn how to interact directly with our smart contracts.
### Deployement

Currently, a single instance of Desmo and DesmoHub is deployed on the viviani network. In the table you can find the contract addresses. 
| Contract  | Address  | 
|---|---|
| DesmoHub  | [0xaA18bA61A16720BEdb33A2408A719458cC5F4Cc9](https://blockscout-bellecour.iex.ec/address/0xaA18bA61A16720BEdb33A2408A719458cC5F4Cc9/transactions)  |
| Desmo | [0x00858c146AE0dFda735b134950E58d1312bD3a30](https://blockscout-bellecour.iex.ec/address/0x00858c146AE0dFda735b134950E58d1312bD3a30/transactions)  |
