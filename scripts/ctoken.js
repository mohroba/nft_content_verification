const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy CToken
  const CToken = await ethers.getContractFactory("CToken");
  const ctoken = await upgrades.deployProxy(CToken, ["Tokwn URI"], { initializer: 'initialize' });
  await ctoken.deployed();

  console.log("CToken deployed to:", ctoken.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
