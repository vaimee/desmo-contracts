import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task(
  "registerTDDs",
  "register the example desmo-ld TDDs",
  async (taskArgs: { desmoHubAddress: string }, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (let i = 0; i < 4; i++) {
      const account = accounts[i];
      const desmoLDContract = await hre.ethers.getContractFactory("DesmoLDHub");
      const desmoHub = await desmoLDContract.attach(taskArgs.desmoHubAddress);
      const url = `https://desmold-zion-${i + 1}.vaimee.it`;
      await desmoHub.registerTDD(url, {
        from: account.address,
      });
      console.log("Registered", url);
    }
  }
).addParam("desmoHubAddress", "the address of the desmo-ld hub");

task(
  "listTDDs",
  "list all the TDDs in desmo-ld",
  async (taskArgs: { desmoHubAddress: string }, hre) => {
    const desmoLDHubContract = await hre.ethers.getContractFactory(
      "DesmoLDHub"
    );
    const desmoHub = await desmoLDHubContract.attach(taskArgs.desmoHubAddress);
    const tdds = await desmoHub.getTDDStorageLength();

    console.log("Number of TDDs:", tdds);
  }
).addParam("desmoHubAddress", "the address of the desmo-ld hub");

task(
  "generateRequestId",
  "generate a request id",
  async (taskArgs: { desmoHubAddress: string }, hre) => {
    const desmoLDHubContract = await hre.ethers.getContractFactory(
      "DesmoLDHub"
    );
    const desmoHub = await desmoLDHubContract.attach(taskArgs.desmoHubAddress);

    const tx = await desmoHub.getNewRequestID();
    const txData = await tx.wait();

    const event = txData.events?.find((event) => {
      return event.event === "RequestID";
    });

    const id = event?.args;
    console.log("Your request id:", id);
  }
).addParam("desmoHubAddress", "the address of the desmo-ld hub");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.6.12",
  networks: {
    viviani: {
      url: "https://viviani.iex.ec",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
