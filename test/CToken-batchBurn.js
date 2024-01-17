describe("Batch Burning", function () {
    let admin, user1;
    const tokenIds = [1, 2, 3];
    const amounts = [100, 200, 300];

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        await token.initialize();
        await token.connect(admin).batchMint(admin.address, tokenIds, amounts, "0x123");
    });

    it("Should allow batch burning by token owner", async function () {
        await token.connect(admin).batchBurn(admin.address, tokenIds, amounts);

        for (let i = 0; i < tokenIds.length; i++) {
            expect(await token.balanceOf(admin.address, tokenIds[i])).to.equal(0);
        }
    });

    it("Should prevent batch burning by non-owner", async function () {
        await expect(
            token.connect(user1).batchBurn(admin.address, tokenIds, amounts)
        ).to.be.revertedWith("CToken: caller is not owner nor approved");
    });
});