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
| DesmoHub  | [0x432FDDa8657CdfdfC9d8dd5618B877Fd0E6A290A](https://blockscout-viviani.iex.ec/address/0x432FDDa8657CdfdfC9d8dd5618B877Fd0E6A290A/transactions)  |
| Desmo | [0x396083C31E5EA5e653227eFB12c4fe9e3AC6e319](https://blockscout-viviani.iex.ec/address/0x396083C31E5EA5e653227eFB12c4fe9e3AC6e319/transactions)  |