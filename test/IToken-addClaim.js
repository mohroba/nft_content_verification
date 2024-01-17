const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("addClaim", function () {
    let admin, user1, claimIssuer;
    const tokenId = 1;
    const claimType = 1;
    const scheme = 1;
    const issuer = "0x6c9b11D3B121eAf4cbA694E8eE4Faf1D07D85356";
    const signature = ethers.encodeBytes32String("signature");
    const data = ethers.encodeBytes32String("data");
    const uri = "ipfs://exampleUri";
    const didDocumentUri = "ipfs://exampleDidDocumentUri";
    const initialWeight = 100;
    const initialDecayRate = 1;
    let token;

    beforeEach(async function () {
        [admin, user1, claimIssuer] = await ethers.getSigners();
        const IToken = await ethers.getContractFactory("IToken");
        token = await IToken.deploy("MyToken", "MTK");
        await token.initialize();
        await token.mintNFT(admin.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);
        await token.grantRole(token.CLAIM_ISSUER_ROLE(), claimIssuer);
    });

    it("Should allow a claim issuer to add a claim", async function () {
        await token.connect(claimIssuer).addClaim(tokenId, claimType, scheme, issuer, signature, data, uri);

        const claimId = ethers.solidityPackedKeccak256(
            ["address", "uint256"],
            [issuer, claimType]
          );
        const addedClaim = await token.getClaim(claimId);
        expect(addedClaim.issuer).to.equal(issuer);
        expect(addedClaim.signature).to.equal(signature);
        expect(addedClaim.data).to.equal(data);
        expect(addedClaim.uri).to.equal(uri);
    });

    it("Should prevent non-claim issuers from adding a claim", async function () {
        await expect(
            token.connect(user1).addClaim(tokenId, claimType, scheme, issuer, signature, data, uri)
        ).to.be.reverted;
    });

    it("Should prevent adding a claim to a non-existent NFT", async function () {
        const nonExistentTokenId = 2;
        await expect(
            token.connect(claimIssuer).addClaim(nonExistentTokenId, claimType, scheme, issuer, signature, data, uri)
        ).to.be.reverted;
    });
});
