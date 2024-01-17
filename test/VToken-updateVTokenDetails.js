describe("Update VToken Details", function () {
    let admin, verifier;
    const vtokenId = 1;
    const newDetails = "Updated verification details";

    beforeEach(async function () {
        [admin, verifier] = await ethers.getSigners();
        await token.initialize();
        await token.grantRole(token.VERIFIER_ROLE(), verifier.address);
        // Assume minting a VToken for testing
        await token.connect(verifier).mintVToken(100, 200, "Initial details", 10, 0);
    });

    it("Should allow VERIFIER_ROLE to update verification details of a VToken", async function () {
        await token.connect(verifier).updateVTokenDetails(vtokenId, newDetails);

        const verificationInfo = await token.getVerificationInfo(vtokenId);
        expect(verificationInfo.verificationDetails).to.equal(newDetails);
    });

    it("Should prevent non-VERIFIER_ROLE from updating verification details", async function () {
        await expect(
            token.connect(admin).updateVTokenDetails(vtokenId, newDetails)
        ).to.be.revertedWith("AccessControl: account " + admin.address.toLowerCase() + " is missing role " + token.VERIFIER_ROLE());
    });

    it("Should handle non-existent VTokens", async function () {
        const nonExistentVTokenId = 999;
        await expect(
            token.connect(verifier).updateVTokenDetails(nonExistentVTokenId, newDetails)
        ).to.be.revertedWith("VToken does not exist");
    });
});
