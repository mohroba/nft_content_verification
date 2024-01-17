describe("Content Curation", function () {
    let admin, user1;
    const tokenId = 1;
    const curationNote = "Reviewed and approved";

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        await token.initialize();
        // Assume minting a token for testing
        await token.batchMint(admin.address, [tokenId], [1], "0x");
    });

    it("Should allow CONTENT_MANAGER_ROLE to curate content", async function () {
        await token.connect(admin).curateContent(tokenId, curationNote);

        expect(await token.getCurationNoteForToken(tokenId)).to.equal(curationNote);
    });

    it("Should prevent non-CONTENT_MANAGER_ROLE from curating content", async function () {
        await expect(
            token.connect(user1).curateContent(tokenId, curationNote)
        ).to.be.revertedWith("AccessControl: account " + user1.address.toLowerCase() + " is missing role " + token.CONTENT_MANAGER_ROLE());
    });

    it("Should handle non-existent tokens in curation", async function () {
        const nonExistentTokenId = 2;
        await expect(token.connect(admin).curateContent(nonExistentTokenId, curationNote)).to.be.revertedWith("CToken: Curate nonexistent token");
    });
});
