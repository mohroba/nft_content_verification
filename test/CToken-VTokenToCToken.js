describe("VToken Association", function () {
  let admin, user1;
  const ctokenId = 1;
  const vtokenId1 = 101;
  const vtokenId2 = 102;

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
    await token.initialize();
    // Assume minting a CToken for testing (if needed in your implementation)
    await token.batchMint(admin.address, [ctokenId], [1], "0x");
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
    ).to.be.revertedWith(
      "AccessControl: account " +
        user1.address.toLowerCase() +
        " is missing role " +
        token.MINTER_ROLE()
    );
  });
});
