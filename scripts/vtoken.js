// scripts/deployVToken.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  // Deploy VToken contract
  const VToken = await ethers.getContractFactory("VToken");
  console.log("Deploying VToken...");
  const vToken = await upgrades.deployProxy(VToken, ["Your VToken URI"], {
    initializer: "initialize",
  });
  await vToken.deployed();
  console.log("VToken deployed to:", vToken.address);
}

// Execute the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
