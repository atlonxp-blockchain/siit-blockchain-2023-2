const hre = require("hardhat");

async function main() {
  const Chai = await hre.ethers.getContractFactory("chai");
  const chai = await Chai.deploy(); //instance of contract

  await chai.deployed();

  console.log("Address of contract:", `${chai.address}`);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//0x6C465FA03541538f9e933B67d0BB17C9a0E1A6b1 api