describe("Batch Minting", function () {
  let admin, user1;
  const tokenIds = [1, 2, 3];
  const amounts = [100, 200, 300];
  const data = "0x123";

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
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
    ).to.be.revertedWith(
      "AccessControl: account " +
        user1.address.toLowerCase() +
        " is missing role " +
        token.MINTER_ROLE()
    );
  });
});
