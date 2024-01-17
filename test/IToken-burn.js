describe("burnNFT", function () {
    let admin, user1, user2;
    const tokenId = 1;
    const uri = "ipfs://exampleUri";
    const didDocumentUri = "ipfs://exampleDidDocumentUri";
    const initialWeight = 100;
    const initialDecayRate = 1;

    beforeEach(async function () {
        [admin, user1, user2] = await ethers.getSigners();
        await token.initialize();
        await token.mintNFT(user1.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);
    });

    it("Should allow the owner to burn their NFT", async function () {
        await token.connect(user1).burnNFT(tokenId);
        
        await expect(token.ownerOf(tokenId)).to.be.reverted;
    });

    it("Should allow an approved account to burn the NFT", async function () {
        await token.connect(user1).approve(user2.address, tokenId);
        await token.connect(user2).burnNFT(tokenId);
        
        await expect(token.ownerOf(tokenId)).to.be.reverted;
    });

    it("Should prevent non-owners and non-approved accounts from burning the NFT", async function () {
        await expect(token.connect(user2).burnNFT(tokenId)).to.be.revertedWith("Caller is not owner nor approved");
    });

    it("Should prevent burning a non-existent NFT", async function () {
        const nonExistentTokenId = 2;
        await expect(token.burnNFT(nonExistentTokenId)).to.be.revertedWith("Token does not exist");
    });
});
