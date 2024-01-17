describe("Royalty Management", function () {
  let admin, user1;
  const tokenId = 1;
  const newRoyaltyRecipient = "0xNewRecipient";
  const newRoyaltyAmount = 500; // In basis points (5%)

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
    await token.initialize();

    // Assume minting a token for testing
    await token.batchMint(admin.address, [tokenId], [1], "0x");
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
    ).to.be.revertedWith(
      "AccessControl: account " +
        user1.address.toLowerCase() +
        " is missing role " +
        token.ROYALTY_MANAGER_ROLE()
    );
  });
});
