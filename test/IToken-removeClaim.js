const { expect } = require("chai");
const { ethers, utils } = require("hardhat");

describe("removeClaim", function () {
  let admin, user1, claimIssuer;
  let token;
  const tokenId = 1;
  const claimType = 1;
  const scheme = 1;
  const issuer = "0x6c9b11D3B121eAf4cbA694E8eE4Faf1D07D85356";
  const signature = ethers.encodeBytes32String("signature");
  const data = ethers.encodeBytes32String("data");
  const uri = "ipfs://exampleUri";
  const didDocumentUri = "ipfs://exampleDidDocumentUri";
  const initialWeight = 100;
  const initialDecayRate = 1;
  beforeEach(async function () {
    [admin, user1, claimIssuer] = await ethers.getSigners();
    const IToken = await ethers.getContractFactory("IToken");
    token = await IToken.deploy("MyToken", "MTK");
    await token.initialize();
    await token.mintNFT(
      admin.address,
      tokenId,
      uri,
      didDocumentUri,
      initialWeight,
      initialDecayRate
    );
    await token.grantRole(token.CLAIM_ISSUER_ROLE(), claimIssuer);
    await token
      .connect(claimIssuer)
      .addClaim(tokenId, claimType, scheme, issuer, signature, data, uri);
  });

  it("Should allow a claim issuer to remove a claim", async function () {
    const claimId = ethers.solidityPackedKeccak256(
      ["address", "uint256"],
      [issuer, claimType]
    );
    await token.connect(claimIssuer).removeClaim(tokenId, claimId);

    try {
      await token.connect(claimIssuer).getClaim(claimId);
      expect.fail("Expected an error but none was received");
    } catch (error) {
      expect(error.message).to.include("invalid length for result data");
    }
  });

  it("Should prevent non-claim issuers from removing a claim", async function () {
    const claimId = ethers.solidityPackedKeccak256(
      ["address", "uint256"],
      [issuer, claimType]
    );

    await expect(token.connect(user1).removeClaim(tokenId, claimId)).to.be
      .reverted;
  });

  it("Should prevent removing a claim from a non-existent NFT", async function () {
    const nonExistentTokenId = 2;
    const claimId = ethers.solidityPackedKeccak256(
      ["address", "uint256"],
      [issuer, claimType]
    );

    await expect(
      token.connect(claimIssuer).removeClaim(nonExistentTokenId, claimId)
    ).to.be.reverted;
  });

  it("Should prevent removing a non-existent claim", async function () {
    const nonExistentClaimId = ethers.encodeBytes32String("nonexistent");

    await expect(
      token.connect(claimIssuer).removeClaim(tokenId, nonExistentClaimId)
    ).to.be.reverted;
  });
});
