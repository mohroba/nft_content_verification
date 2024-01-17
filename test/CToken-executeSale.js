describe("Execute Sale", function () {
  let admin, buyer, seller;
  const tokenId = 1;
  const amount = 10;
  const price = ethers.utils.parseEther("1"); // 1 ETH
  const royaltyAmount = ethers.utils.parseUnits("0.1", "ether"); // 10% of price

  beforeEach(async function () {
    [admin, seller, buyer] = await ethers.getSigners();
    await token.initialize();
    await token.batchMint(seller.address, [tokenId], [amount], "0x");
    await token.updateRoyaltyInfo(tokenId, seller.address, 1000); // 10% royalty
  });
  it("Should execute sale and transfer royalties and funds correctly", async function () {
    const sellerInitialBalance = await ethers.provider.getBalance(
      seller.address
    );
    const buyerInitialBalance = await ethers.provider.getBalance(buyer.address);

    // Simulate buyer sending ETH for the purchase
    await expect(() =>
      token
        .connect(buyer)
        .executeSale(seller.address, tokenId, amount, price, { value: price })
    ).to.changeEtherBalances([buyer, seller], [-price, price - royaltyAmount]); // Check royalty transfer
    const royaltyRecipientBalance = await ethers.provider.getBalance(
      seller.address
    );
    expect(royaltyRecipientBalance).to.equal(
      sellerInitialBalance.add(price).sub(royaltyAmount)
    );

    // Validate token transfer
    expect(await token.balanceOf(buyer.address, tokenId)).to.equal(amount);
    expect(await token.balanceOf(seller.address, tokenId)).to.equal(0);
  });

  it("Should revert if incorrect price is sent", async function () {
    const incorrectPrice = ethers.utils.parseEther("0.5"); // Half the required price

    await expect(
      token
        .connect(buyer)
        .executeSale(seller.address, tokenId, amount, incorrectPrice, {
          value: incorrectPrice,
        })
    ).to.be.revertedWith("CToken: Incorrect price sent");
  });

  it("Should revert if seller does not have enough tokens", async function () {
    const excessiveAmount = 20; // More than the seller owns

    await expect(
      token
        .connect(buyer)
        .executeSale(seller.address, tokenId, excessiveAmount, price, {
          value: price,
        })
    ).to.be.revertedWith("CToken: Insufficient token balance");
  });
});
