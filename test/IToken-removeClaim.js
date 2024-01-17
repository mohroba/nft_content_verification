describe("removeClaim", function () {
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
    await token.mintNFT(
      admin.address,
      tokenId,
      uri,
      didDocumentUri,
      initialWeight,
      initialDecayRate
    );
    await token
      .connect(claimIssuer)
      .addClaim(tokenId, claimType, scheme, issuer, signature, data, uri);
  });

  it("Should allow a claim issuer to remove a claim", async function () {
    const claimId = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256"],
        [issuer, claimType]
      )
    );
    await token.connect(claimIssuer).removeClaim(tokenId, claimId);

    await expect(token.claims(claimId)).to.be.reverted;
  });

  it("Should prevent non-claim issuers from removing a claim", async function () {
    const claimId = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256"],
        [issuer, claimType]
      )
    );

    await expect(
      token.connect(user1).removeClaim(tokenId, claimId)
    ).to.be.revertedWith("Caller is not a claim issuer");
  });

  it("Should prevent removing a claim from a non-existent NFT", async function () {
    const nonExistentTokenId = 2;
    const claimId = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256"],
        [issuer, claimType]
      )
    );

    await expect(
      token.connect(claimIssuer).removeClaim(nonExistentTokenId, claimId)
    ).to.be.revertedWith("NFT does not exist");
  });

  it("Should prevent removing a non-existent claim", async function () {
    const nonExistentClaimId = ethers.utils.formatBytes32String("nonexistent");

    await expect(
      token.connect(claimIssuer).removeClaim(tokenId, nonExistentClaimId)
    ).to.be.revertedWith("Claim does not exist");
  });
});
