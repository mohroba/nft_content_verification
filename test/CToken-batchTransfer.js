const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Batch Transfer", function () {
  let admin, user1, user2;
  const tokenIds = [1, 2, 3];
  const amounts = [10, 20, 30];
  let token;

  beforeEach(async function () {
    [admin, user1, user2] = await ethers.getSigners();
    CToken = await ethers.getContractFactory("CToken");
    token = await CToken.deploy("CTOKEN_URI");
    await token.initialize();
    await token.batchMint(admin.address, tokenIds, amounts, ethers.getBytes("0x"));
  });

  it("Should allow batch transfer of tokens", async function () {
    await token
      .connect(admin)
      .batchTransfer(
        [user1.address, user1.address, user2.address],
        tokenIds,
        amounts
      );

    for (let i = 0; i < tokenIds.length; i++) {
      expect(await token.balanceOf(user1.address, tokenIds[i])).to.equal(
        i < 2 ? amounts[i] : 0
      );
      expect(await token.balanceOf(user2.address, tokenIds[i])).to.equal(
        i === 2 ? amounts[i] : 0
      );
    }
  });

  it("Should handle incorrect array lengths", async function () {
    await expect(
      token.connect(admin).batchTransfer([user1.address], tokenIds, amounts)
    ).to.be.reverted;
  });
  it("Should prevent unauthorized transfer", async function () {
    await expect(
      token
        .connect(user1)
        .batchTransfer(
          [user2.address, user2.address, user2.address],
          tokenIds,
          amounts
        )
    ).to.be.reverted;
  });
});
