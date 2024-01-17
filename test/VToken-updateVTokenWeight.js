describe("Update VToken Weight", function () {
    let admin, verifier;
    const vtokenId = 1;
    const newWeight = 20;

    beforeEach(async function () {
        [admin, verifier] = await ethers.getSigners();
        await token.initialize();
        await token.grantRole(token.VERIFIER_ROLE(), verifier.address);
        // Assume minting a VToken for testing
        await token.connect(verifier).mintVToken(100, 200, "Initial details", 10, 0);
    });

    it("Should allow VERIFIER_ROLE to update VToken weight", async function () {
        await token.connect(verifier).updateVTokenWeight(vtokenId, newWeight);

        const verificationInfo = await token.getVerificationInfo(vtokenId);
        expect(verificationInfo.weight).to.equal(newWeight);
    });

    it("Should prevent non-VERIFIER_ROLE from updating VToken weight", async function () {
        await expect(
            token.connect(admin).updateVTokenWeight(vtokenId, newWeight)
        ).to.be.revertedWith("AccessControl: account " + admin.address.toLowerCase() + " is missing role " + token.VERIFIER_ROLE());
    });

    it("Should handle non-existent VTokens", async function () {
        const nonExistentVTokenId = 999;
        await expect(
            token.connect(verifier).updateVTokenWeight(nonExistentVTokenId, newWeight)
        ).to.be.revertedWith("VToken does not exist");
    });
});
