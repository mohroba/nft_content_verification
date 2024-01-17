const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Update VToken Status", function () {
    let token;
    let admin, verifier,non_verifier;
    const vtokenId = 1;
    const newStatus = 1; // Assuming VerificationStatus is a number

    beforeEach(async function () {
        [admin, verifier,non_verifier] = await ethers.getSigners();
        VToken = await ethers.getContractFactory("VToken");
        token = await VToken.deploy("VTOKEN_URI");
        await token.initialize();
        await token.grantRole(token.VERIFIER_ROLE(), verifier.address);
        // Assume minting a VToken for testing
        await token.connect(verifier).mintVToken(100, 200, "Initial details", 10, 0);
    });


    it("Should prevent non-VERIFIER_ROLE from updating VToken status", async function () {
        await expect(
            token.connect(non_verifier).updateVTokenStatus(vtokenId, newStatus)
        ).to.be.reverted;
    });

    it("Should handle non-existent VTokens", async function () {
        const nonExistentVTokenId = 999;
        await expect(
            token.connect(verifier).updateVTokenStatus(nonExistentVTokenId, newStatus)
        ).to.be.reverted;
    });
});
