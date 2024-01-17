const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("mintNFT", function () {
    let admin, user1;
    const tokenId = 1;
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
    });

    it("Should mint an NFT successfully by an identity admin", async function () {
        await token.mintNFT(user1.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);

        expect(await token.ownerOf(tokenId)).to.equal(user1.address);
        const nft = await token.getNFT(tokenId);
        expect(nft.uri).to.equal(uri);
        expect(nft.didDocumentUri).to.equal(didDocumentUri);
        expect(nft.weight).to.equal(initialWeight);
        expect(nft.decayRate).to.equal(initialDecayRate);
    });

    it("Should prevent non-identity admins from minting an NFT", async function () {
        await expect(
            token.connect(user1).mintNFT(user1.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate)
        ).to.be.reverted;
    });

    it("Should prevent minting an NFT with an existing tokenId", async function () {
        await token.mintNFT(user1.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);

        await expect(
            token.mintNFT(user1.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate)
        ).to.be.reverted;
    });
});
