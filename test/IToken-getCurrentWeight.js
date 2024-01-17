describe("getCurrentWeight", function () {
    let admin, user1;
    const tokenId = 1;
    const uri = "ipfs://exampleUri";
    const didDocumentUri = "ipfs://exampleDidDocumentUri";
    const initialWeight = 100;
    const initialDecayRate = 10; // For example, 10 units of weight decay per day
    const oneDayInSeconds = 86400;

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        await token.initialize();
        await token.mintNFT(user1.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);
    });

    it("Should return the current weight of an NFT", async function () {
        // Simulate time passing
        await ethers.provider.send("evm_increaseTime", [oneDayInSeconds]);
        await ethers.provider.send("evm_mine");
        const currentWeight = await token.getCurrentWeight(tokenId);
        const expectedWeight = initialWeight - initialDecayRate; // Assuming one day has passed
        expect(currentWeight).to.equal(expectedWeight);
    });
    
    it("Should not allow the weight to go below zero", async function () {
        // Simulate enough time passing for the weight to decay to zero or below
        const timeToDecayToZero = (initialWeight / initialDecayRate) * oneDayInSeconds;
        await ethers.provider.send("evm_increaseTime", [timeToDecayToZero]);
        await ethers.provider.send("evm_mine");
    
        const currentWeight = await token.getCurrentWeight(tokenId);
        expect(currentWeight).to.equal(0);
    });
    
    it("Should return an error for non-existent NFTs", async function () {
        const nonExistentTokenId = 2;
        await expect(token.getCurrentWeight(nonExistentTokenId)).to.be.revertedWith("Token does not exist");
    });
});    
