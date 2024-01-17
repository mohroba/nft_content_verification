describe("updateDecayRate", function () {
    let admin, user1;
    const tokenId = 1;
    const newDecayRate = 2;
    const uri = "ipfs://exampleUri";
    const didDocumentUri = "ipfs://exampleDidDocumentUri";
    const initialWeight = 100;
    const initialDecayRate = 1;

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        await token.initialize();
        await token.mintNFT(user1.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);
    });

    it("Should allow an identity admin to update decay rate", async function () {
        await token.updateDecayRate(tokenId, newDecayRate);

        const nft = await token.getNFT(tokenId);
        expect(nft.decayRate).to.equal(newDecayRate);
    });

    it("Should prevent non-identity admins from updating decay rate", async function () {
        await expect(
            token.connect(user1).updateDecayRate(tokenId, newDecayRate)
        ).to.be.revertedWith("Caller is not an identity admin");
    });

    it("Should prevent updating decay rate for a non-existent NFT", async function () {
        const nonExistentTokenId = 2;
        await expect(
            token.updateDecayRate(nonExistentTokenId, newDecayRate)
        ).to.be.revertedWith("Token does not exist");
    });
});
