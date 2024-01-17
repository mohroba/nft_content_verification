describe("removeKey", function () {
  let admin, user1;
  const tokenId = 1;
  const purpose = 1;
  const keyType = 1;
  const key = ethers.utils.formatBytes32String("key");
  const uri = "ipfs://exampleUri";
  const didDocumentUri = "ipfs://exampleDidDocumentUri";
  const initialWeight = 100;
  const initialDecayRate = 1;

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
    await token.initialize();
    await token.mintNFT(
      admin.address,
      tokenId,
      uri,
      didDocumentUri,
      initialWeight,
      initialDecayRate
    );
    await token.addKey(tokenId, purpose, keyType, key);
  });
  it("Should allow an identity admin to remove a key", async function () {
    const keyId = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "uint256", "uint256"],
        [key, purpose, keyType]
      )
    );
    await token.removeKey(tokenId, keyId);

    await expect(token.keys(keyId)).to.be.reverted;
  });

  it("Should prevent non-identity admins from removing a key", async function () {
    const keyId = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "uint256", "uint256"],
        [key, purpose, keyType]
      )
    );

    await expect(
      token.connect(user1).removeKey(tokenId, keyId)
    ).to.be.revertedWith("Caller is not an identity admin");
  });

  it("Should prevent removing a key from a non-existent NFT", async function () {
    const nonExistentTokenId = 2;
    const keyId = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "uint256", "uint256"],
        [key, purpose, keyType]
      )
    );

    await expect(token.removeKey(nonExistentTokenId, keyId)).to.be.revertedWith(
      "NFT does not exist"
    );
  });

  it("Should prevent removing a non-existent key", async function () {
    const nonExistentKeyId = ethers.utils.formatBytes32String("nonexistent");

    await expect(token.removeKey(tokenId, nonExistentKeyId)).to.be.revertedWith(
      "Key does not exist"
    );
  });
});
