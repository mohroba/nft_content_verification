const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Batch Minting", function () {
  let admin, user1;
  let token;
  const tokenIds = [1, 2, 3];
  const amounts = [100, 200, 300];
  const data = ethers.getBytes("0x");

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
    CToken = await ethers.getContractFactory("CToken");
    token = await CToken.deploy("CTOKEN_URI");
    await token.initialize();
  });
  it("Should allow batch minting by MINTER_ROLE", async function () {
    await token
      .connect(admin)
      .batchMint(admin.address, tokenIds, amounts, data);

    for (let i = 0; i < tokenIds.length; i++) {
      expect(await token.balanceOf(admin.address, tokenIds[i])).to.equal(
        amounts[i]
      );
    }
  });

  it("Should prevent batch minting by non-MINTER_ROLE", async function () {
    await expect(
      token.connect(user1).batchMint(user1.address, tokenIds, amounts, data)
    ).to.be.reverted;
  });
});
