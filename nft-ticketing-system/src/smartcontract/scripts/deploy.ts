import { ethers } from "hardhat";

async function main() {
  const eticket = await ethers.deployContract("EventTicketing");

  await eticket.waitForDeployment();

  console.log(`E-Ticket deployed to ${await eticket.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
