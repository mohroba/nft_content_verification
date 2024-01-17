
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VToken Association", function () {
  let admin, user1;
  const ctokenId = 1;
  const vtokenId1 = 101;
  const vtokenId2 = 102;
  let token;

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
    CToken = await ethers.getContractFactory("CToken");
    token = await CToken.deploy("CTOKEN_URI");
    await token.initialize();
    // Assume minting a CToken for testing (if needed in your implementation)
    await token.batchMint(admin.address, [ctokenId], [1], ethers.getBytes("0x"));
  });

  it("Should allow attaching and retrieving VToken IDs to a CToken by MINTER_ROLE", async function () {
    await token.connect(admin).attachVTokenToCToken(ctokenId, vtokenId1);
    await token.connect(admin).attachVTokenToCToken(ctokenId, vtokenId2);

    const vtokenIds = await token.getVTokensForCToken(ctokenId);
    expect(vtokenIds).to.deep.equal([vtokenId1, vtokenId2]);
  });

  it("Should prevent non-MINTER_ROLE from attaching VToken IDs", async function () {
    await expect(
      token.connect(user1).attachVTokenToCToken(ctokenId, vtokenId1)
    ).to.be.reverted;
  });
});
