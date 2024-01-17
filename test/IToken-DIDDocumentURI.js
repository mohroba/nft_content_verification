describe("setDIDDocumentURI", function () {
    let admin, user1;
    const tokenId = 1;
    const newDidDocumentUri = "ipfs://newDidDocumentUri";
    const uri = "ipfs://exampleUri";
    const didDocumentUri = "ipfs://exampleDidDocumentUri";
    const initialWeight = 100;
    const initialDecayRate = 1;

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        await token.initialize();
        await token.mintNFT(admin.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);
    });
    
    it("Should allow an identity admin to set DID Document URI", async function () {
        await token.setDIDDocumentURI(tokenId, newDidDocumentUri);
    
        expect(await token.getDIDDocumentURI(tokenId)).to.equal(newDidDocumentUri);
    });
    
    it("Should prevent non-identity admins from setting DID Document URI", async function () {
        await expect(
            token.connect(user1).setDIDDocumentURI(tokenId, newDidDocumentUri)
        ).to.be.revertedWith("Caller is not an identity admin");
    });
    
    it("Should prevent setting DID Document URI for a non-existent NFT", async function () {
        const nonExistentTokenId = 2;
        await expect(
            token.setDIDDocumentURI(nonExistentTokenId, newDidDocumentUri)
        ).to.be.revertedWith("Token does not exist");
    });
});

describe("getDIDDocumentURI", function () {
    let admin;
    const tokenId = 1;
    const uri = "ipfs://exampleUri";
    const didDocumentUri = "ipfs://exampleDidDocumentUri";
    const initialWeight = 100;
    const initialDecayRate = 1;

    beforeEach(async function () {
        [admin] = await ethers.getSigners();
        await token.initialize();
        await token.mintNFT(admin.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);
    });

    it("Should return the DID Document URI of an NFT", async function () {
        expect(await token.getDIDDocumentURI(tokenId)).to.equal(didDocumentUri);
    });

    it("Should return an error for non-existent NFTs", async function () {
        const nonExistentTokenId = 2;
        await expect(token.getDIDDocumentURI(nonExistentTokenId)).to.be.revertedWith("Token does not exist");
    });
});