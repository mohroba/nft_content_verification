const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("setDIDDocumentURI", function () {
    let admin, user1;
    const tokenId = 1;
    const newDidDocumentUri = "ipfs://newDidDocumentUri";
    const uri = "ipfs://exampleUri";
    const didDocumentUri = "ipfs://exampleDidDocumentUri";
    const initialWeight = 100;
    const initialDecayRate = 1;
    let token;

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        const IToken = await ethers.getContractFactory("IToken");
        token = await IToken.deploy("MyToken", "MTK");
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
        ).to.be.reverted;
    });
    
    it("Should prevent setting DID Document URI for a non-existent NFT", async function () {
        const nonExistentTokenId = 2;
        await expect(
            token.setDIDDocumentURI(nonExistentTokenId, newDidDocumentUri)
        ).to.be.reverted;
    });
});

describe("getDIDDocumentURI", function () {
    let admin;
    const tokenId = 1;
    const uri = "ipfs://exampleUri";
    const didDocumentUri = "ipfs://exampleDidDocumentUri";
    const initialWeight = 100;
    const initialDecayRate = 1;
    let token;

    beforeEach(async function () {
        [admin] = await ethers.getSigners();
        const IToken = await ethers.getContractFactory("IToken");
        token = await IToken.deploy("MyToken", "MTK");
        await token.initialize();
        await token.mintNFT(admin.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);
    });

    it("Should return the DID Document URI of an NFT", async function () {
        expect(await token.getDIDDocumentURI(tokenId)).to.equal(didDocumentUri);
    });

    it("Should handle non-existent NFTs gracefully", async function () {
        const nonExistentTokenId = 200;
    
        try {
            await token.getDIDDocumentURI(nonExistentTokenId);
            expect.fail("Expected an error but none was received");
        } catch (error) {
            // Check that an error was thrown
            expect(error).to.be.an('error');
            // Optionally, you can check for a specific part of the error message if needed
            expect(error.message).to.include("invalid length for result data");
        }
    });
    

});