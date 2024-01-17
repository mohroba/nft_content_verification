describe("addKey", function () {
    let admin, user1;
    const tokenId = 1;
    const purpose = 1; // Example purpose
    const keyType = 1; // Example key type
    const key = ethers.utils.formatBytes32String("key"); // Example key
    const uri = "ipfs://exampleUri";
    const didDocumentUri = "ipfs://exampleDidDocumentUri";
    const initialWeight = 100;
    const initialDecayRate = 1;

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        await token.initialize();
        await token.mintNFT(admin.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);
    });

    it("Should allow an identity admin to add a key", async function () {
        await token.addKey(tokenId, purpose, keyType, key);

        const keyId = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["bytes32", "uint256", "uint256"], [key, purpose, keyType]));
        const addedKey = await token.keys(keyId);
        expect(addedKey.key).to.equal(key);
        expect(addedKey.purpose).to.equal(purpose);
        expect(addedKey.keyType).to.equal(keyType);
    });
    
    it("Should prevent non-identity admins from adding a key", async function () {
        await expect(
            token.connect(user1).addKey(tokenId, purpose, keyType, key)
        ).to.be.revertedWith("Caller is not an identity admin");
    });
    
    it("Should prevent adding a key to a non-existent NFT", async function () {
        const nonExistentTokenId = 2;
        await expect(
            token.addKey(nonExistentTokenId, purpose, keyType, key)
        ).to.be.revertedWith("NFT does not exist");
    });
});    
