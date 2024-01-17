describe("addClaim", function () {
    let admin, user1, claimIssuer;
    const tokenId = 1;
    const claimType = 1;
    const scheme = 1;
    const issuer = "0xIssuer";
    const signature = ethers.utils.formatBytes32String("signature");
    const data = ethers.utils.formatBytes32String("data");
    const uri = "ipfs://exampleUri";
    const didDocumentUri = "ipfs://exampleDidDocumentUri";
    const initialWeight = 100;
    const initialDecayRate = 1;

    beforeEach(async function () {
        [admin, user1, claimIssuer] = await ethers.getSigners();
        await token.initialize();
        await token.mintNFT(admin.address, tokenId, uri, didDocumentUri, initialWeight, initialDecayRate);
    });

    it("Should allow a claim issuer to add a claim", async function () {
        await token.connect(claimIssuer).addClaim(tokenId, claimType, scheme, issuer, signature, data, uri);

        const claimId = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [issuer, claimType]));
        const addedClaim = await token.claims(claimId);

        expect(addedClaim.issuer).to.equal(issuer);
        expect(addedClaim.signature).to.equal(signature);
        expect(addedClaim.data).to.equal(data);
        expect(addedClaim.uri).to.equal(uri);
    });

    it("Should prevent non-claim issuers from adding a claim", async function () {
        await expect(
            token.connect(user1).addClaim(tokenId, claimType, scheme, issuer, signature, data, uri)
        ).to.be.revertedWith("Caller is not a claim issuer");
    });

    it("Should prevent adding a claim to a non-existent NFT", async function () {
        const nonExistentTokenId = 2;
        await expect(
            token.connect(claimIssuer).addClaim(nonExistentTokenId, claimType, scheme, issuer, signature, data, uri)
        ).to.be.revertedWith("NFT does not exist");
    });
});
