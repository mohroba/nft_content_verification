describe("Mint VToken", function () {
    let admin, verifier;
    const ctokenId = 1;
    const itokenId = 100;
    const details = "Verification details";
    const weight = 10;
    const parentVTokenId = 0;

    beforeEach(async function () {
        [admin, verifier] = await ethers.getSigners();
        await token.initialize();
        await token.grantRole(token.VERIFIER_ROLE(), verifier.address);
    });

    it("Should allow VERIFIER_ROLE to mint a VToken", async function () {
        const vtokenId = await token.connect(verifier).mintVToken(ctokenId, itokenId, details, weight, parentVTokenId);

        expect(await token.balanceOf(verifier.address, vtokenId)).to.equal(1);
        const verificationInfo = await token.getVerificationInfo(vtokenId);
        expect(verificationInfo.ctokenId).to.equal(ctokenId);
        expect(verificationInfo.itokenId).to.equal(itokenId);
        expect(verificationInfo.verificationDetails).to.equal(details);
    });

    it("Should prevent non-VERIFIER_ROLE from minting a VToken", async function () {
        await expect(
            token.connect(admin).mintVToken(ctokenId, itokenId, details, weight, parentVTokenId)
        ).to.be.revertedWith("AccessControl: account " + admin.address.toLowerCase() + " is missing role " + token.VERIFIER_ROLE());
    });
});
