const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token URI Management", function () {
    let admin, user1;
    const tokenId = 1;
    const newTokenURI = "ipfs://newTokenURI";
    const initialTokenURI = "ipfs://initialTokenURI";
    let token;

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        CToken = await ethers.getContractFactory("CToken");
        token = await CToken.deploy("CTOKEN_URI");
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
        ).to.be.reverted;
    });

    it("Should handle non-existent NFTs gracefully", async function () {
        const nonExistentTokenId = 200;
    
        try {
            await token.uri(nonExistentTokenId);
            expect.fail("Expected an error but none was received");
        } catch (error) {
            // Check that an error was thrown
            expect(error).to.be.an('error');
            // Optionally, you can check for a specific part of the error message if needed
            expect(error.message).to.include("invalid length for result data");
        }
    });

});


describe("Token URI Update", function () {
    let admin, user1;
    const tokenId = 1;
    const newTokenURI = "ipfs://newTokenURI";
    let token;

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        CToken = await ethers.getContractFactory("CToken");
        token = await CToken.deploy("CTOKEN_URI");
        await token.initialize();
        // Assume minting a token for testing
        await token.batchMint(admin.address, [tokenId], [1], ethers.getBytes("0x"));
        
    });

    it("Should allow MINTER_ROLE to update token URI", async function () {
        await token.connect(admin).updateTokenURI(tokenId, newTokenURI);

        expect(await token.uri(tokenId)).to.equal(newTokenURI);
    });

    it("Should prevent non-MINTER_ROLE from updating token URI", async function () {
        await expect(
            token.connect(user1).updateTokenURI(tokenId, newTokenURI)
        ).to.be.reverted;
    });

    it("Should handle non-existent NFTs gracefully", async function () {
        const nonExistentTokenId = 200;
    
        try {
            await token.updateTokenURI(nonExistentTokenId, newTokenURI);
            expect.fail("Expected an error but none was received");
        } catch (error) {
            // Check that an error was thrown
            expect(error).to.be.an('error');
        }
    });
    
});
