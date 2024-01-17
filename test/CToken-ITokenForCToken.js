const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IToken Association", function () {
  let admin, user1;
  const ctokenId = 1;
  const itokenId = 100;
  let token;

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
    CToken = await ethers.getContractFactory("CToken");
    token = await CToken.deploy("CTOKEN_URI");
    await token.initialize();
    // Assume minting a CToken for testing (if needed in your implementation)
    await token.batchMint(admin.address, [ctokenId], [1], ethers.getBytes("0x"));
  });

  it("Should allow setting and getting the IToken ID for a CToken by MINTER_ROLE", async function () {
    await token.connect(admin).setITokenForCToken(ctokenId, itokenId);

    expect(await token.getITokenForCToken(ctokenId)).to.equal(itokenId);
  });

  it("Should prevent non-MINTER_ROLE from setting the IToken ID", async function () {
    await expect(
      token.connect(user1).setITokenForCToken(ctokenId, itokenId)
    ).to.be.reverted;
  });
  it("Should allow setting and getting the IToken ID for a CToken by MINTER_ROLE", async function () {
    await token.connect(admin).setITokenForCToken(ctokenId, itokenId);

    expect(await token.getITokenForCToken(ctokenId)).to.equal(itokenId);
  });

  it("Should prevent non-MINTER_ROLE from setting the IToken ID", async function () {
    await expect(
      token.connect(user1).setITokenForCToken(ctokenId, itokenId)
    ).to.be.reverted;
  });
});
