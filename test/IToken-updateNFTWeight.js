describe("updateNFTWeight", function () {
  let admin, user1;
  const tokenId = 1;
  const newWeight = 200;
  const uri = "ipfs://exampleUri";
  const didDocumentUri = "ipfs://exampleDidDocumentUri";
  const initialWeight = 100;
  const initialDecayRate = 1;

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
    await token.initialize();
    await token.mintNFT(
      user1.address,
      tokenId,
      uri,
      didDocumentUri,
      initialWeight,
      initialDecayRate
    );
  });

  it("Should allow an identity admin to update NFT weight", async function () {
    await token.updateNFTWeight(tokenId, newWeight);

    const nft = await token.getNFT(tokenId);
    expect(nft.weight).to.equal(newWeight);
  });

  it("Should prevent non-identity admins from updating NFT weight", async function () {
    await expect(
      token.connect(user1).updateNFTWeight(tokenId, newWeight)
    ).to.be.revertedWith("Caller is not an identity admin");
  });

  it("Should prevent updating weight for a non-existent NFT", async function () {
    const nonExistentTokenId = 2;
    await expect(
      token.updateNFTWeight(nonExistentTokenId, newWeight)
    ).to.be.revertedWith("Token does not exist");
  });
});
