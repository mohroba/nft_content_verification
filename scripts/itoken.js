// scripts/deployIToken.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  // Deploy IToken contract
  const IToken = await ethers.getContractFactory("IToken");
  console.log("Deploying IToken...");
  const iToken = await upgrades.deployProxy(IToken, ["IToken", "ITK"], {
    initializer: "initialize",
  });
  await iToken.deployed();
  console.log("IToken deployed to:", iToken.address);

  // You can perform additional tasks here, such as interacting with the deployed contract

  // Example: Mint a new NFT
  const tokenId = 1;
  const uri = "https://your-nft-metadata-uri.com";
  const didDocumentUri = "https://your-did-document-uri.com";
  const initialWeight = 100;
  const initialDecayRate = 5;
  await iToken.mintNFT(
    ethers.constants.AddressZero, // Mint to the zero address for initialization purposes
    tokenId,
    uri,
    didDocumentUri,
    initialWeight,
    initialDecayRate
  );

  console.log("NFT minted:", tokenId);

  // Additional interactions can be added as needed

  console.log("Deployment and initialization complete!");
}

// Execute the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
