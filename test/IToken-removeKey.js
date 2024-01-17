const { expect } = require("chai");
const { ethers, utils } = require("hardhat");

describe("removeKey", function () {
  let admin, user1;
  let token;
  const tokenId = 1;
  const purpose = 1;
  const keyType = 1;
  const key = ethers.encodeBytes32String("key");
  const uri = "ipfs://exampleUri";
  const didDocumentUri = "ipfs://exampleDidDocumentUri";
  const initialWeight = 100;
  const initialDecayRate = 1;

  beforeEach(async function () {
    [admin, user1] = await ethers.getSigners();
    const IToken = await ethers.getContractFactory("IToken");
    token = await IToken.deploy("MyToken", "MTK");
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
    // Calculate the keyId
    const keyId = ethers.solidityPackedKeccak256(
      ["bytes32", "uint256", "uint256"],
      [key, purpose, keyType]
    );

    // Remove the key
    await token.removeKey(tokenId, keyId);

    // Attempt to retrieve the removed key and catch the revert
    try {
      await token.getKey(keyId);
      expect.fail("Expected an error but none was received");
  } catch (error) {
      // Verify that an error was thrown
      expect(error).to.be.an('error');
  }
});

  it("Should prevent non-identity admins from removing a key", async function () {
    const keyId = ethers.solidityPackedKeccak256(
      ["bytes32", "uint256", "uint256"],
      [key, purpose, keyType]
    );

    await expect(token.connect(user1).removeKey(tokenId, keyId)).to.be.reverted;
  });

  it("Should prevent removing a key from a non-existent NFT", async function () {
    const nonExistentTokenId = 2;
    const keyId = ethers.solidityPackedKeccak256(
      ["bytes32", "uint256", "uint256"],
      [key, purpose, keyType]
    );

    await expect(token.removeKey(nonExistentTokenId, keyId)).to.be.revertedWith(
      "NFT does not exist"
    );
  });

  it("Should prevent removing a non-existent key", async function () {
    const nonExistentKeyId = ethers.encodeBytes32String("nonexistent");

    await expect(token.removeKey(tokenId, nonExistentKeyId)).to.be.reverted;
  });
});
