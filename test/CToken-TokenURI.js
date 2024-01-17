describe("Token URI Management", function () {
    let admin, user1;
    const tokenId = 1;
    const newTokenURI = "ipfs://newTokenURI";
    const initialTokenURI = "ipfs://initialTokenURI";

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        await token.initialize();
        // Assume minting a token for testing
        await token.batchMint(admin.address, [tokenId], [1], "0x");
        await token.setTokenURI(tokenId, initialTokenURI);
    });

    it("Should allow DEFAULT_ADMIN_ROLE to set and retrieve token URI", async function () {
        await token.setTokenURI(tokenId, newTokenURI);

        expect(await token.uri(tokenId)).to.equal(newTokenURI);
    });

    it("Should prevent non-DEFAULT_ADMIN_ROLE from setting token URI", async function () {
        await expect(
            token.connect(user1).setTokenURI(tokenId, newTokenURI)
        ).to.be.revertedWith("AccessControl: account " + user1.address.toLowerCase() + " is missing role " + token.DEFAULT_ADMIN_ROLE());
    });

    it("Should handle non-existent tokens", async function () {
        const nonExistentTokenId = 2;
        await expect(token.uri(nonExistentTokenId)).to.be.revertedWith("CToken: URI query for nonexistent token");
    });
});


describe("Token URI Update", function () {
    let admin, user1;
    const tokenId = 1;
    const newTokenURI = "ipfs://newTokenURI";

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        await token.initialize();
        // Assume minting a token for testing
        await token.batchMint(admin.address, [tokenId], [1], "0x");
    });

    it("Should allow MINTER_ROLE to update token URI", async function () {
        await token.connect(admin).updateTokenURI(tokenId, newTokenURI);

        expect(await token.uri(tokenId)).to.equal(newTokenURI);
    });

    it("Should prevent non-MINTER_ROLE from updating token URI", async function () {
        await expect(
            token.connect(user1).updateTokenURI(tokenId, newTokenURI)
        ).to.be.revertedWith("AccessControl: account " + user1.address.toLowerCase() + " is missing role " + token.MINTER_ROLE());
    });

    it("Should handle non-existent tokens", async function () {
        const nonExistentTokenId = 2;
        await expect(token.connect(admin).updateTokenURI(nonExistentTokenId, newTokenURI)).to.be.revertedWith("CToken: URI update of nonexistent token");
    });
});
