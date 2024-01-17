describe("Get All VTokens For CToken", function () {
    let admin, verifier;
    const ctokenId = 1;
    const vtokenId1 = 2;
    const vtokenId2 = 3;

    beforeEach(async function () {
        [admin, verifier] = await ethers.getSigners();
        await token.initialize();
        await token.grantRole(token.VERIFIER_ROLE(), verifier.address);
        // Assume minting VTokens for testing
        await token.connect(verifier).mintVToken(ctokenId, 200, "VToken 1 details", 10, 0);
        await token.connect(verifier).mintVToken(ctokenId, 300, "VToken 2 details", 20, 0);
    });

    it("Should return all VTokens associated with a specific CToken", async function () {
        const vtokenIds = await token.getAllVTokensForCToken(ctokenId);

        expect(vtokenIds).to.deep.equal([vtokenId1, vtokenId2]);
    });

    it("Should handle CToken IDs with no associated VTokens", async function () {
        const nonExistentCTokenId = 999;
        const vtokenIds = await token.getAllVTokensForCToken(nonExistentCTokenId);

        expect(vtokenIds).to.deep.equal([]);
    });
});
    