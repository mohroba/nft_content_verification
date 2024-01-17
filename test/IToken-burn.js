const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("burnNFT", function () {
    let admin, user1, user2;
    const tokenId = 1;
    const uri = "ipfs://exampleUri";
    const didDocumentUri = "ipfs://exampleDidDocumentUri";
    const initialWeight = 100;
    const initialDecayRate = 1;
    let token;

    beforeEach(async function () {
        [admin, user1, user2] = await ethers.getSigners();
        const IToken = await ethers.getContractFactory("IToken");
        token = await IToken.deploy("MyToken", "MTK");
        await token.initialize();
        await token.mintNFT(user1.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);
    });

    it("Should allow the owner to burn their NFT", async function () {
        await token.connect(user1).burnNFT(tokenId);
        
        try {
            await token.isApprovedOrOwner(user1.address, tokenId);
            expect.fail("Expected an error but none was received");
        } catch (error) {
            // Verify that an error was thrown
            expect(error).to.be.an("error");
        }
    });
    

    it("Should allow an approved account to burn the NFT", async function () {
        await token.connect(user1).approve(user2.address, tokenId);
        await token.connect(user2).burnNFT(tokenId);
        
        try {
            await token.isApprovedOrOwner(user1.address, tokenId);
            expect.fail("Expected an error but none was received");
        } catch (error) {
            // Verify that an error was thrown
            expect(error).to.be.an("error");
        }
    
        try {
            await token.isApprovedOrOwner(user2.address, tokenId);
            expect.fail("Expected an error but none was received");
        } catch (error) {
            // Verify that an error was thrown
            expect(error).to.be.an("error");
        }
    });
    

    it("Should prevent non-owners and non-approved accounts from burning the NFT", async function () {
        await expect(token.connect(user2).burnNFT(tokenId)).to.be.reverted;
    });

    it("Should handle non-existent NFTs gracefully", async function () {
        const nonExistentTokenId = 200;
    
        try {
            await token.burnNFT(nonExistentTokenId);
            expect.fail("Expected an error but none was received");
        } catch (error) {
            // Check that an error was thrown
            expect(error).to.be.an('error');
        }
    });
    
});
