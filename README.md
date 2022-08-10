![DESMO-LD](https://raw.githubusercontent.com/vaimee/desmo/c763cec12f6c9060a9f1a3335ff4cff60ece3df2/imgs/desmo-logo.png)
# DESMO-LD Contracts

**Overview** 

> Desmo is a Smart contract that implements the IExec `IexecDoracle`. Its purpose is to serve as the main API entrypoint for DESMO-LD client Smart Contracts. Additionally, Desmo will implement the logic to randomly select a set of valid Thing Description Directories registered in the DESMOHub. The APIs will serve on-chain clients with endpoints that can search for a device inside the DESMO-LD network of Thing Description Directories, get sensor data and invoke operations on remote sensors.

## Getting started
The best way of using Desmo-LD is to use our handcrafted [SDK](https://github.com/vaimee/desmo-sdk), there you can have access to all the methods and features of our Distrubuted  IoT oracles without a sweat. However, if you want to dive deep into the innerworking of our system you can start from here, and learn how to interact directly with our smart contracts.
### Deployement

Currently, a single instance of Desmo and DesmoHub is deployed on the viviani network. In the table you can find the contract addresses. 
| Contract  | Address  | 
|---|---|
| DesmoHub  | [0xe3eb8F758994e7fdf904010B33D9340728906bE5](https://blockscout-viviani.iex.ec/address/0xe3eb8F758994e7fdf904010B33D9340728906bE5/transactions)  |
| Desmo | [0x579afd382E18c9BB5fDDD26f99Dd5aE093Ca5ff9](https://blockscout-viviani.iex.ec/address/0x579afd382E18c9BB5fDDD26f99Dd5aE093Ca5ff9/transactions)  |