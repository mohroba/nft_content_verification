describe("IToken Association", function () {
  let admin, user1;
  const ctokenId = 1;
  const itokenId = 100;

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
    await token.initialize();
    // Assume minting a CToken for testing (if needed in your implementation)
    await token.batchMint(admin.address, [ctokenId], [1], "0x");
  });

  it("Should allow setting and getting the IToken ID for a CToken by MINTER_ROLE", async function () {
    await token.connect(admin).setITokenForCToken(ctokenId, itokenId);

    expect(await token.getITokenForCToken(ctokenId)).to.equal(itokenId);
  });

  it("Should prevent non-MINTER_ROLE from setting the IToken ID", async function () {
    await expect(
      token.connect(user1).setITokenForCToken(ctokenId, itokenId)
    ).to.be.revertedWith(
      "AccessControl: account " +
        user1.address.toLowerCase() +
        " is missing role " +
        token.MINTER_ROLE()
    );
  });
  it("Should allow setting and getting the IToken ID for a CToken by MINTER_ROLE", async function () {
    await token.connect(admin).setITokenForCToken(ctokenId, itokenId);

    expect(await token.getITokenForCToken(ctokenId)).to.equal(itokenId);
  });

  it("Should prevent non-MINTER_ROLE from setting the IToken ID", async function () {
    await expect(
      token.connect(user1).setITokenForCToken(ctokenId, itokenId)
    ).to.be.revertedWith(
      "AccessControl: account " +
        user1.address.toLowerCase() +
        " is missing role " +
        token.MINTER_ROLE()
    );
  });
});
