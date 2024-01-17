const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IToken Contract", function () {
    let IToken, token, admin, addr1;

    beforeEach(async function () {
        [admin, addr1] = await ethers.getSigners();
        IToken = await ethers.getContractFactory("IToken");
        token = await IToken.deploy("IDENTITY_TOKEN", "ITK");
    });

    describe("initialize", function () {
        it("Should initialize successfully", async function () {
            await token.initialize();

            expect(await token.hasRole(token.DEFAULT_ADMIN_ROLE(), admin.address)).to.be.true;
            expect(await token.hasRole(token.IDENTITY_ADMIN_ROLE(), admin.address)).to.be.true;
            expect(await token.hasRole(token.CLAIM_ISSUER_ROLE(), admin.address)).to.be.true;
            expect(await token.ownerOf(0)).to.equal(admin.address);
        });

        it("Should prevent re-initialization", async function () {
            await token.initialize();

            await expect(token.initialize()).to.be.reverted;
        });
    });
});
