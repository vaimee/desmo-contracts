import * as dotenv from "dotenv";
import deployed from "./deployed.json";
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
      const desmoLDContract = await hre.ethers.getContractFactory("DesmoHub");
      const desmoHub = await desmoLDContract.attach(taskArgs.desmoHubAddress);
      const url = `https://desmold-zion-${i + 1}.vaimee.it`;
      const tx = await desmoHub.connect(account).registerTDD(url, {
        from: account.address,
        gasLimit: 1000000,
      });
      await tx.wait();
      console.log("Registered", url);
    }
  }
).addParam("desmoHubAddress", "the address of the desmo-ld hub", deployed.desmoHub);

task(
  "listTDDs",
  "list all the TDDs in desmo-ld",
  async (taskArgs: { desmoHubAddress: string }, hre) => {
    const desmoLDHubContract = await hre.ethers.getContractFactory(
      "DesmoHub"
    );
    const desmoHub = await desmoLDHubContract.attach(taskArgs.desmoHubAddress);
    const tdds = await desmoHub.getTDDStorageLength();

    console.log("Number of TDDs:", tdds);
  }
).addParam("desmoHubAddress", "the address of the desmo-ld hub", deployed.desmoHub);

task(
  "generateRequestId",
  "generate a request id",
  async (taskArgs: { desmoAddress: string }, hre) => {
    const desmoLDHubContract = await hre.ethers.getContractFactory("Desmo");
    const desmoHub = await desmoLDHubContract.attach(taskArgs.desmoAddress);

    const tx = await desmoHub.generateNewRequestID()
    const txData = await tx.wait();

    const event = txData.events?.find((event) => {
      return event.event === "RequestCreated";
    });

    const id = event?.args;
    console.log("Your request id:", id);
  }
).addParam("desmoAddress", "the address of the desmo-ld", deployed.desmo);

task(
  "receiveResult",
  "receive a result",
  async (taskArgs: { desmoContractAddress: string; taskId: string }, hre) => {
    const desmoLDContract = await hre.ethers.getContractFactory("Desmo");
    const desmoContract = await desmoLDContract.attach(
      taskArgs.desmoContractAddress
    );

    const tx = await desmoContract.receiveResult(
      taskArgs.taskId,
      "0x2000000000000000000000000000000000000000000000000000000000000000050402020202001115"
    );

    const txData = await tx.wait();
    
    const event = txData.events?.find((event) => {
      return event.event === "QueryCompleted";
    });

    const result = event?.args;
    console.log(result);
  }
)
  .addParam("desmoContractAddress", "the address of the desmo-ld contract", deployed.desmo)
  .addParam("taskId", "the id of the task");

task(
  "listQueries",
  "lists Query completed Events for this contract",
  async (taskArgs: { desmoAddress: string; }, hre) => {
    const desmoLDContract = await hre.ethers.getContractFactory("Desmo");
    const desmoContract = await desmoLDContract.attach(
      taskArgs.desmoAddress
    );
    
    
    const events = await desmoContract.queryFilter(desmoContract.filters.QueryCompleted())
    const failedQueries = await desmoContract.queryFilter(desmoContract.filters.QueryFailed())
    
    console.log(events.map((event) => ({id: event.args.id, result: event.args.result, scores: event.args.result.scores})))
    console.log(failedQueries.map((event) => ({id: event.args.id })))
  }
)
  .addParam("desmoAddress", "the address of the desmo-ld contract", deployed.desmo)

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.6.12",
  networks: {
    bellecourWhiteListed: {
      url: "https://bellecour.iex.ec",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bellecour: {
      url: "https://bellecour.iex.ec",
      accounts: {
        mnemonic: process.env.DEPLOY_TDD_WALLET_MNEMONIC ?? "test test test test test test test test test test test junk",
        count: 10
      }
    }
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
