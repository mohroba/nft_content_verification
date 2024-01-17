describe("Update Parent VToken", function () {
    let admin, verifier;
    const vtokenId = 1;
    const newParentVTokenId = 2;

    beforeEach(async function () {
        [admin, verifier] = await ethers.getSigners();
        await token.initialize();
        await token.grantRole(token.VERIFIER_ROLE(), verifier.address);
        // Assume minting VTokens for testing
        await token.connect(verifier).mintVToken(100, 200, "Initial details", 10, 0);
        await token.connect(verifier).mintVToken(100, 200, "Another details", 15, 0);
    });

    it("Should allow VERIFIER_ROLE to update parent VToken ID", async function () {
        await token.connect(verifier).updateParentVToken(vtokenId, newParentVTokenId);

        const verificationInfo = await token.getVerificationInfo(vtokenId);
        expect(verificationInfo.parentVTokenId).to.equal(newParentVTokenId);
    });

    it("Should prevent non-VERIFIER_ROLE from updating parent VToken ID", async function () {
        await expect(
            token.connect(admin).updateParentVToken(vtokenId, newParentVTokenId)
        ).to.be.revertedWith("AccessControl: account " + admin.address.toLowerCase() + " is missing role " + token.VERIFIER_ROLE());
    });

    it("Should handle non-existent VTokens", async function () {
        const nonExistentVTokenId = 999;
        await expect(
            token.connect(verifier).updateParentVToken(nonExistentVTokenId, newParentVTokenId)
        ).to.be.revertedWith("VToken does not exist");
    });
});
