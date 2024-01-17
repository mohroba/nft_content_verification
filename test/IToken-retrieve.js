describe("getNFT", function () {
    let admin, user1;
    const tokenId = 1;
    const uri = "ipfs://exampleUri";
    const didDocumentUri = "ipfs://exampleDidDocumentUri";
    const initialWeight = 100;
    const initialDecayRate = 1;

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        await token.initialize();
        await token.mintNFT(user1.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);
    });

    it("Should retrieve NFT details successfully", async function () {
        const nft = await token.getNFT(tokenId);
        
        expect(nft.tokenId).to.equal(tokenId);
        expect(nft.uri).to.equal(uri);
        expect(nft.didDocumentUri).to.equal(didDocumentUri);
        expect(nft.weight).to.be.a('number');
        expect(nft.lastUpdated).to.be.a('number');
        expect(nft.decayRate).to.equal(initialDecayRate);
    });

    it("Should handle non-existent NFTs gracefully", async function () {
        const nonExistentTokenId = 2;
        await expect(token.getNFT(nonExistentTokenId)).to.be.revertedWith("Token does not exist");
    });
});
