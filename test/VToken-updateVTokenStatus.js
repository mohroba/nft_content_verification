describe("Update VToken Status", function () {
    let admin, verifier;
    const vtokenId = 1;
    const newStatus = token.VerificationStatus.Verified; // Assuming VerificationStatus is an enum

    beforeEach(async function () {
        [admin, verifier] = await ethers.getSigners();
        await token.initialize();
        await token.grantRole(token.VERIFIER_ROLE(), verifier.address);
        // Assume minting a VToken for testing
        await token.connect(verifier).mintVToken(100, 200, "Initial details", 10, 0);
    });

    it("Should allow VERIFIER_ROLE to update VToken status", async function () {
        await token.connect(verifier).updateVTokenStatus(vtokenId, newStatus);

        expect(await token.vtokenStatuses(vtokenId)).to.equal(newStatus);
    });

    it("Should prevent non-VERIFIER_ROLE from updating VToken status", async function () {
        await expect(
            token.connect(admin).updateVTokenStatus(vtokenId, newStatus)
        ).to.be.revertedWith("AccessControl: account " + admin.address.toLowerCase() + " is missing role " + token.VERIFIER_ROLE());
    });

    it("Should handle non-existent VTokens", async function () {
        const nonExistentVTokenId = 999;
        await expect(
            token.connect(verifier).updateVTokenStatus(nonExistentVTokenId, newStatus)
        ).to.be.revertedWith("VToken does not exist");
    });
});
