describe("Content Rights Management", function () {
  let admin, user1;
  const tokenId = 1;
  const rights = "Exclusive rights for content";

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
    await token.initialize();
    // Assume minting a token for testing
    await token.batchMint(admin.address, [tokenId], [1], "0x");
  });

  it("Should allow setting and getting content rights by CONTENT_MANAGER_ROLE", async function () {
    await token.connect(admin).setContentRights(tokenId, rights);

    const retrievedRights = await token.getContentRights(tokenId);
    expect(retrievedRights).to.equal(rights);
  });

  it("Should prevent non-CONTENT_MANAGER_ROLE from setting content rights", async function () {
    await expect(
      token.connect(user1).setContentRights(tokenId, rights)
    ).to.be.revertedWith(
      "AccessControl: account " +
        user1.address.toLowerCase() +
        " is missing role " +
        token.CONTENT_MANAGER_ROLE()
    );
  });

  it("Should handle non-existent tokens for content rights", async function () {
    const nonExistentTokenId = 2;
    await expect(token.getContentRights(nonExistentTokenId)).to.be.revertedWith(
      "CToken: Get rights of nonexistent token"
    );
  });
});
