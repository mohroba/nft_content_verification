const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Royalty Management", function () {
  let admin, user1;
  const tokenId = 1;
  const newRoyaltyRecipient = "0x6c9b11D3B121eAf4cbA694E8eE4Faf1D07D85356";
  const newRoyaltyAmount = 500; // In basis points (5%)
  let token;

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
    CToken = await ethers.getContractFactory("CToken");
    token = await CToken.deploy("CTOKEN_URI");
    await token.initialize();

    // Assume minting a token for testing
    await token.batchMint(admin.address, [tokenId], [1], ethers.getBytes("0x"));
  });
  it("Should allow updating royalty info by ROYALTY_MANAGER_ROLE", async function () {
    await token
      .connect(admin)
      .updateRoyaltyInfo(tokenId, newRoyaltyRecipient, newRoyaltyAmount);

    const [recipient, amount] = await token.royaltyInfo(tokenId, 10000); // Check for 100% sales
    expect(recipient).to.equal(newRoyaltyRecipient);
    expect(amount).to.equal(500); // 5% of 10000
  });

  it("Should prevent non-ROYALTY_MANAGER_ROLE from updating royalty info", async function () {
    await expect(
      token
        .connect(user1)
        .updateRoyaltyInfo(tokenId, newRoyaltyRecipient, newRoyaltyAmount)
    ).to.be.reverted;
  });
});
