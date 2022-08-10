// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const DesmoLDHub = await ethers.getContractFactory("DesmoHub");
  const DesmoLDHContract = await ethers.getContractFactory("Desmo");
  const desmoHub = await DesmoLDHub.deploy();
  await desmoHub.deployed();

  console.log("DesmoHub address:", desmoHub.address);
  console.log("DesmoHub deployed");

  const desmoLDContract = await DesmoLDHContract.deploy(
    desmoHub.address,
    // Select Iexec proxy automatically
    ethers.constants.AddressZero
  );
  await desmoLDContract.deployed();

  console.log("Desmo address:", desmoLDContract.address);
  console.log("Desmo deployed");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
