const { expect } = require("chai");
const { ethers,utils } = require("hardhat");


describe("addKey", function () {
    let admin, user1;
    const tokenId = 1;
    const purpose = 1; // Example purpose
    const keyType = 1; // Example key type
    const key = ethers.encodeBytes32String("key"); // Example key
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
        await token.grantRole(token.IDENTITY_ADMIN_ROLE(), admin);
    });

    it("Should allow an identity admin to add a key", async function () {
        await token.addKey(tokenId, purpose, keyType, key);
    
        // Using ethers.utils.keccak256 for hash computation
        // and ethers.utils.defaultAbiCoder for ABI encoding
        // Compute the keyId using ethers
        const keyId = ethers.solidityPackedKeccak256(
            ["bytes32", "uint256", "uint256"], 
            [key, purpose, keyType]
        );

        const addedKey = await token.getKey(keyId);
    
        // Comparing values using chai's expect
        expect(addedKey.key).to.equal(key);
        expect(addedKey.purpose).to.equal(purpose);
        expect(addedKey.keyType).to.equal(keyType);
    });
    
    
    it("Should prevent non-identity admins from adding a key", async function () {
        await expect(
            token.connect(user1).addKey(tokenId, purpose, keyType, key)
        ).to.be.reverted;
    });
    
    it("Should prevent adding a key to a non-existent NFT", async function () {
        const nonExistentTokenId = 2;
        await expect(
            token.addKey(nonExistentTokenId, purpose, keyType, key)
        ).to.be.reverted;
    });
});    
