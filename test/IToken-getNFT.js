const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("getNFT", function () {
    let admin, user1;
    let token;
    const tokenId = 1;
    const uri = "ipfs://exampleUri";
    const didDocumentUri = "ipfs://exampleDidDocumentUri";
    const initialWeight = 100;
    const initialDecayRate = 1;

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        const IToken = await ethers.getContractFactory("IToken");
        token = await IToken.deploy("MyToken", "MTK");
        await token.initialize();        
    });

    it("Should retrieve NFT details successfully", async function () {
        await token.mintNFT(admin.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);
        const nft = await token.getNFT(tokenId);
        
        expect(nft.tokenId).to.equal(tokenId);
        expect(nft.uri).to.equal(uri);
        expect(nft.didDocumentUri).to.equal(didDocumentUri);
        expect(nft.decayRate).to.equal(initialDecayRate);
    });

    it("Should handle non-existent NFTs gracefully", async function () {
        const nonExistentTokenId = 200;
    
        try {
            await token.getNFT(nonExistentTokenId);
            expect.fail("Expected an error but none was received");
        } catch (error) {
            // Check that an error was thrown
            expect(error).to.be.an('error');
            expect(error.message).to.include("invalid length for result data");
        }
    });
    
});
