const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Content Rights Management", function () {
  let admin, user1;
  const tokenId = 1;
  const rights = "Exclusive rights for content";
  let token;

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
    CToken = await ethers.getContractFactory("CToken");
    token = await CToken.deploy("CTOKEN_URI");
    await token.initialize();
    // Assume minting a token for testing
    await token.batchMint(admin.address, [tokenId], [1],ethers.getBytes("0x"));
  });

  it("Should allow setting and getting content rights by CONTENT_MANAGER_ROLE", async function () {
    await token.connect(admin).setContentRights(tokenId, rights);

    const retrievedRights = await token.getContentRights(tokenId);
    expect(retrievedRights).to.equal(rights);
  });

  it("Should prevent non-CONTENT_MANAGER_ROLE from setting content rights", async function () {
    await expect(
      token.connect(user1).setContentRights(tokenId, rights)
    ).to.be.reverted;
  });

  // it("Should handle non-existent tokens for content rights", async function () {
  //   const nonExistentTokenId = 2000;
  //   await expect(token.getContentRights(nonExistentTokenId)).to.be.reverted;
  // });
});
