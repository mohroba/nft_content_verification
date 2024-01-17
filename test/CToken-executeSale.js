const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Execute Sale", function () {
  let admin, buyer, seller;
  const tokenId = 1;
  const amount = 10;
  const price = ethers.parseEther("1"); // 1 ETH
  const royaltyAmount = ethers.parseEther("0.1", "ether"); // 10% of price
  let token;
  let uri

  beforeEach(async function () {
    [admin, seller, buyer] = await ethers.getSigners();
    CToken = await ethers.getContractFactory("CToken");
    token = await CToken.deploy("CTOKEN_URI");
    await token.initialize();
    await token.batchMint(
      seller.address,
      [tokenId],
      [amount],
      ethers.getBytes("0x")
    );
    await token.updateRoyaltyInfo(tokenId, seller.address, 1000); // 10% royalty
  });
  
 
  it("Should revert if incorrect price is sent", async function () {
    const incorrectPrice = ethers.parseEther("0.5"); // Half the required price

    await expect(
      token
        .connect(buyer)
        .executeSale(seller.address, tokenId, amount, incorrectPrice, {
          value: incorrectPrice,
        })
    ).to.be.reverted;
  });

  it("Should revert if seller does not have enough tokens", async function () {
    const excessiveAmount = 20; // More than the seller owns

    await expect(
      token
        .connect(buyer)
        .executeSale(seller.address, tokenId, excessiveAmount, price, {
          value: price,
        })
    ).to.be.reverted;
  });
});
